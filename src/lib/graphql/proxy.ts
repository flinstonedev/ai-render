import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import { request as httpRequest } from "node:http";
import { request as httpsRequest } from "node:https";
import { GraphQLProxyError, isPublicAddress, parseEndpoint, checkEndpointAllowlist } from "./url-validation";

export const MAX_REQUEST_BYTES = 256 * 1024;
export const MAX_RESPONSE_BYTES = 2 * 1024 * 1024;
export const REQUEST_TIMEOUT_MS = 15_000;

/** Includes DNS and incoming bodies, which socket timeouts do not cover. */
export function withAbort<T>(promise: Promise<T>, signal: AbortSignal): Promise<T> {
  if (signal.aborted) {
    void promise.catch(() => {});
    return Promise.reject(signal.reason);
  }
  return new Promise((resolve, reject) => {
    const abort = () => reject(signal.reason);
    signal.addEventListener("abort", abort, { once: true });
    promise.then(resolve, reject).finally(() => signal.removeEventListener("abort", abort));
  });
}

export async function readRequestJson(request: Request, signal: AbortSignal): Promise<unknown> {
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") {
    throw new GraphQLProxyError("Send an application/json request.", 415);
  }
  if (Number(request.headers.get("content-length")) > MAX_REQUEST_BYTES) {
    throw new GraphQLProxyError("Request exceeds the 256 KiB limit.", 413);
  }
  const reader = request.body?.getReader();
  if (!reader) throw new GraphQLProxyError("Send a JSON request body.");
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  try {
    while (true) {
      const { value, done } = await withAbort(reader.read(), signal);
      if (done) break;
      bytes += value.byteLength;
      if (bytes > MAX_REQUEST_BYTES) throw new GraphQLProxyError("Request exceeds the 256 KiB limit.", 413);
      chunks.push(value);
    }
    try { return JSON.parse(Buffer.concat(chunks).toString("utf8")); }
    catch { throw new GraphQLProxyError("Send a valid JSON request body."); }
  } finally {
    void reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}

export async function requestPublicGraphQL(endpoint: unknown, body: string, signal: AbortSignal) {
  const url = parseEndpoint(endpoint);
  checkEndpointAllowlist(url);
  if (Buffer.byteLength(body) > MAX_REQUEST_BYTES) throw new GraphQLProxyError("Request exceeds the 256 KiB limit.", 413);
  const hostname = url.hostname.replace(/^\[|\]$/g, "");
  const family = isIP(hostname);
  let addresses: { address: string; family: number }[];
  try {
    addresses = family ? [{ address: hostname, family }]
      : await withAbort(lookup(hostname, { all: true, verbatim: true }), signal);
  } catch (error) {
    if (signal.aborted) throw error;
    throw new GraphQLProxyError("The endpoint hostname could not be resolved.", 502);
  }
  signal.throwIfAborted();
  if (addresses.length === 0 || addresses.some(({ address, family }) => !isPublicAddress(address) || isIP(address) !== family)) {
    throw new GraphQLProxyError("The endpoint must resolve only to public network addresses.", 403);
  }

  // Dial a validated literal IP. No second DNS lookup, pooling, environment
  // proxy, or redirect can rebind the destination after this validation.
  const address = addresses[0];
  return new Promise<{ status: number; data: Record<string, unknown> }>((resolve, reject) => {
    const request = (url.protocol === "https:" ? httpsRequest : httpRequest)({
      protocol: url.protocol, hostname: address.address, family: address.family,
      port: url.port || undefined, path: url.pathname + url.search,
      method: "POST", agent: false, signal, maxHeaderSize: 16 * 1024,
      // Keep TLS certificate verification and HTTP virtual hosting bound to the original host.
      servername: family ? undefined : hostname, rejectUnauthorized: true,
      headers: {
        Host: url.host, "Content-Type": "application/json",
        Accept: "application/graphql-response+json, application/json",
        "Accept-Encoding": "identity", "Content-Length": Buffer.byteLength(body),
      },
    }, (response) => {
      const fail = (message: string) => {
        reject(new GraphQLProxyError(message, 502));
        response.destroy();
      };
      const status = response.statusCode ?? 502;
      if (status >= 300 && status < 400) { fail("Endpoint redirects are disabled. Use the final endpoint URL."); return; }
      if (status < 200 || status > 599) { fail("The endpoint returned an unsupported response."); return; }
      const contentType = response.headers["content-type"]?.split(";")[0].trim().toLowerCase();
      if (contentType !== "application/json" && contentType !== "application/graphql-response+json") {
        fail("The endpoint did not return GraphQL JSON."); return;
      }
      // Refuse compressed bodies instead of risking decompression bombs.
      if (response.headers["content-encoding"] && response.headers["content-encoding"] !== "identity") {
        fail("The endpoint must return an uncompressed JSON response."); return;
      }
      if (Number(response.headers["content-length"]) > MAX_RESPONSE_BYTES) { fail("Endpoint response exceeds the 2 MiB limit."); return; }
      const chunks: Buffer[] = [];
      let bytes = 0;
      response.on("data", (chunk: Buffer) => {
        bytes += chunk.length;
        if (bytes > MAX_RESPONSE_BYTES) { fail("Endpoint response exceeds the 2 MiB limit."); return; }
        chunks.push(chunk);
      });
      response.on("error", () => reject(new GraphQLProxyError("The endpoint response was interrupted.", 502)));
      response.on("end", () => {
        try {
          const data: unknown = JSON.parse(Buffer.concat(chunks).toString("utf8"));
          if (typeof data !== "object" || data === null || Array.isArray(data) || !("data" in data || "errors" in data)) throw new Error("Not GraphQL JSON");
          resolve({ status, data: data as Record<string, unknown> });
        } catch { reject(new GraphQLProxyError("The endpoint returned invalid GraphQL JSON.", 502)); }
      });
    });
    request.on("error", () => reject(signal.aborted ? signal.reason : new GraphQLProxyError("Could not connect securely to the endpoint.", 502)));
    request.end(body);
  });
}
