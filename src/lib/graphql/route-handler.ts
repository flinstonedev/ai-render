import { getIntrospectionQuery, getOperationAST, parse } from "graphql";
import { z } from "zod";
import { GraphQLProxyError } from "./url-validation";
import { readRequestJson, REQUEST_TIMEOUT_MS, requestPublicGraphQL } from "./proxy";

const executeSchema = z.object({
  query: z.string().min(1).max(64 * 1024),
  variables: z.record(z.string(), z.unknown()).optional(),
  operationName: z.string().max(256).optional(),
}).strict();
const introspectSchema = z.object({ endpoint: z.string().min(1).max(2048) }).strict();
let activeRequests = 0;
const MAX_CONCURRENT_REQUESTS = 8;

export async function handleGraphQLRequest(request: Request, mode: "execute" | "introspect"): Promise<Response> {
  const headers = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };
  const errorResponse = (message: string, status: number) => Response.json({ errors: [{ message }] }, { status, headers });
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return errorResponse("Cross-origin requests are not allowed.", 403);
  if (activeRequests >= MAX_CONCURRENT_REQUESTS) return errorResponse("Server is busy. Try again shortly.", 429);
  activeRequests++;
  const timeout = AbortSignal.timeout(REQUEST_TIMEOUT_MS);
  const signal = AbortSignal.any([timeout, request.signal]);
  try {
    const raw = await readRequestJson(request, signal);
    let endpoint: unknown;
    let payload: { query: string; variables?: Record<string, unknown>; operationName?: string };
    if (mode === "introspect") {
      endpoint = introspectSchema.parse(raw).endpoint;
      payload = { query: getIntrospectionQuery() };
    } else {
      endpoint = request.headers.get("x-graphql-endpoint");
      payload = executeSchema.parse(raw);
      let operation;
      try { operation = getOperationAST(parse(payload.query, { maxTokens: 10_000 }), payload.operationName); }
      catch { throw new GraphQLProxyError("Enter a valid GraphQL query."); }
      if (!operation || operation.operation !== "query") {
        throw new GraphQLProxyError("This workbench supports read-only queries. Mutations and subscriptions are disabled.");
      }
    }
    const result = await requestPublicGraphQL(endpoint, JSON.stringify(payload), signal);
    return Response.json(result.data, { status: result.status, headers });
  } catch (error) {
    if (timeout.aborted) return errorResponse("Request timed out after 15 seconds. Try a smaller query.", 504);
    if (request.signal.aborted) return errorResponse("Request cancelled.", 408);
    if (error instanceof GraphQLProxyError) return errorResponse(error.message, error.status);
    if (error instanceof z.ZodError) return errorResponse("Check the endpoint, query, variables, and operation name in your request.", 400);
    return errorResponse("The GraphQL request could not be completed.", 502);
  } finally { activeRequests--; }
}
