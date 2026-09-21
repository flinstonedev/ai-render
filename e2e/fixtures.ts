import { test as base, expect } from "@playwright/test";
import { buildSchema, graphql, type ExecutionResult } from "graphql";

export const endpoint = "https://graphql.e2e.invalid/graphql";
export const query = "query Showcase($currency: String!) { countries(currency: $currency) { code name currency } }";
export const variables = { currency: "TST" };

const countries = [
  { code: "AS", name: "Aster Isles", currency: "TST" },
  { code: "BR", name: "Birch Republic", currency: "TST" },
  { code: "CL", name: "Clover Coast", currency: "OTHER" },
];
const schema = buildSchema(`
  type Country { code: ID!, name: String!, currency: String! }
  type Query { countries(currency: String!): [Country!]! }
`);

type TamboRequest = {
  message: {
    content: Array<{ type: string; text?: string }>;
    additionalContext?: Record<string, string>;
  };
  availableComponents: Array<{ name: string }>;
};

type FixtureNetwork = {
  graphQLQueries: Array<{ query: string; variables?: Record<string, unknown> }>;
  tamboRequests: TamboRequest[];
  failQueries: boolean;
};

/** Tambo's real SDK consumes these AG-UI/SSE events and mounts its registered UI. */
function tableStream(request: TamboRequest) {
  const resultsContext = request.message.additionalContext?.queryResults;
  let result: ExecutionResult = {};
  if (resultsContext?.startsWith("Latest query results:\n")) {
    result = JSON.parse(resultsContext.slice("Latest query results:\n".length));
  }
  // Derive the response from the app's actual outgoing context. Missing/stale
  // bridge data cannot be hidden by blindly returning the expected table.
  const rows = Array.isArray(result.data?.countries)
    ? result.data.countries.map((country: (typeof countries)[number]) => [
        country.code,
        country.name,
        country.currency,
      ])
    : [];
  const messageId = "message-synthetic";
  const componentId = "table-synthetic";
  const run = { threadId: "thread-synthetic", runId: "run-synthetic" };
  const events = [
    { type: "RUN_STARTED", ...run },
    { type: "TEXT_MESSAGE_START", messageId, role: "assistant" },
    {
      type: "TEXT_MESSAGE_CONTENT",
      messageId,
      delta: "Here are the results from your query.",
    },
    { type: "TEXT_MESSAGE_END", messageId },
    {
      type: "CUSTOM",
      name: "tambo.component.start",
      value: { messageId, componentId, componentName: "DataTable" },
    },
    {
      type: "CUSTOM",
      name: "tambo.component.props_delta",
      value: {
        componentId,
        operations: [
          { op: "add", path: "/columns", value: ["Code", "Name", "Currency"] },
          { op: "add", path: "/rows", value: rows },
          { op: "add", path: "/caption", value: "Synthetic query results" },
        ],
      },
    },
    { type: "CUSTOM", name: "tambo.component.end", value: { componentId } },
    { type: "RUN_FINISHED", ...run },
  ];
  return events.map((event) => `data: ${JSON.stringify(event)}\n\n`).join("");
}

export const test = base.extend<{ network: FixtureNetwork }>({
  network: async ({ page, context, baseURL }, provide) => {
    const network: FixtureNetwork = {
      graphQLQueries: [],
      tamboRequests: [],
      failQueries: false,
    };
    const unexpectedRequests: string[] = [];
    const pageErrors: string[] = [];
    const failedAssets: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));
    page.on("response", (response) => {
      if (response.status() >= 400 && !response.url().includes("/api/")) {
        failedAssets.push(`${response.status()} ${response.url()}`);
      }
    });

    await context.route("**/*", async (route) => {
      const request = route.request();
      const url = new URL(request.url());
      if (url.origin === baseURL && url.pathname === "/api/graphql/execute") {
        expect(request.method()).toBe("POST");
        expect(request.headers()["x-graphql-endpoint"]).toBe(endpoint);
        const body = request.postDataJSON();
        const isIntrospection = /__schema|__type\b/.test(body.query);
        if (!isIntrospection) network.graphQLQueries.push(body);
        if (network.failQueries && !isIntrospection) {
          await route.fulfill({
            json: { errors: [{ message: "Synthetic upstream query failure" }] },
          });
          return;
        }
        const result = await graphql({
          schema,
          source: body.query,
          variableValues: body.variables,
          operationName: body.operationName,
          rootValue: {
            countries: ({ currency }: { currency: string }) =>
              countries.filter((country) => country.currency === currency),
          },
        });
        await route.fulfill({ json: result });
        return;
      }
      if (url.origin === "https://tambo.e2e.invalid") {
        if (request.method() === "POST" && url.pathname === "/v1/threads/runs") {
          const body = request.postDataJSON() as TamboRequest;
          network.tamboRequests.push(body);
          await route.fulfill({
            contentType: "text/event-stream",
            body: tableStream(body),
          });
          return;
        }
        unexpectedRequests.push(`${request.method()} ${url.href}`);
        await route.abort("blockedbyclient");
        return;
      }
      if (url.origin === baseURL && !url.pathname.startsWith("/api/")) {
        await route.continue();
        return;
      }
      unexpectedRequests.push(`${request.method()} ${url.href}`);
      await route.abort("blockedbyclient");
    });

    await provide(network);
    expect(unexpectedRequests, "Only app assets and synthetic APIs may be used").toEqual([]);
    expect(failedAssets, "App assets, including editor workers, must load").toEqual([]);
    expect(pageErrors, "The browser must not throw runtime errors").toEqual([]);
  },
});

export { expect };
