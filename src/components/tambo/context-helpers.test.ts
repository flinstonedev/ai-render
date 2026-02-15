import { describe, it, expect } from "vitest";
import { createContextHelpers } from "./context-helpers";
import type { QueryResult } from "@/types/graphql";

function makeState(overrides: Partial<{
  endpoint: string;
  query: string;
  variables: string;
  results: QueryResult | null;
  isConnected: boolean;
  schemaSummary: string | null;
}> = {}) {
  return {
    endpoint: "",
    query: "",
    variables: "",
    results: null,
    isConnected: false,
    schemaSummary: null,
    ...overrides,
  };
}

describe("context-helpers", () => {
  describe("graphqlEndpoint", () => {
    it("returns null when not connected", () => {
      const helpers = createContextHelpers(() => makeState({ isConnected: false, endpoint: "http://example.com" }));
      expect(helpers.graphqlEndpoint()).toBeNull();
    });

    it("returns null when endpoint is empty string", () => {
      const helpers = createContextHelpers(() => makeState({ isConnected: true, endpoint: "" }));
      expect(helpers.graphqlEndpoint()).toBeNull();
    });

    it("returns endpoint string when connected with valid endpoint", () => {
      const helpers = createContextHelpers(() => makeState({ isConnected: true, endpoint: "http://example.com/graphql" }));
      expect(helpers.graphqlEndpoint()).toBe("Connected to: http://example.com/graphql");
    });
  });

  describe("currentQuery", () => {
    it("returns null when query is empty", () => {
      const helpers = createContextHelpers(() => makeState({ query: "" }));
      expect(helpers.currentQuery()).toBeNull();
    });

    it("returns query when present", () => {
      const helpers = createContextHelpers(() => makeState({ query: "{ countries { name } }" }));
      expect(helpers.currentQuery()).toBe("Current GraphQL query:\n{ countries { name } }");
    });
  });

  describe("currentVariables", () => {
    it("returns null when variables is empty", () => {
      const helpers = createContextHelpers(() => makeState({ variables: "" }));
      expect(helpers.currentVariables()).toBeNull();
    });

    it("returns null when variables is empty object", () => {
      const helpers = createContextHelpers(() => makeState({ variables: "{}" }));
      expect(helpers.currentVariables()).toBeNull();
    });

    it("returns variables when present", () => {
      const helpers = createContextHelpers(() => makeState({ variables: '{"code":"US"}' }));
      expect(helpers.currentVariables()).toBe('Current query variables:\n{"code":"US"}');
    });
  });

  describe("queryResults", () => {
    it("returns null when no results", () => {
      const helpers = createContextHelpers(() => makeState({ results: null }));
      expect(helpers.queryResults()).toBeNull();
    });

    it("returns formatted results", () => {
      const helpers = createContextHelpers(() => makeState({ results: { data: { hello: "world" } } }));
      const result = helpers.queryResults();
      expect(result).toContain("Latest query results:");
      expect(result).toContain('"hello": "world"');
    });

    it("truncates large results", () => {
      const bigData: Record<string, string> = {};
      for (let i = 0; i < 500; i++) {
        bigData[`key${i}`] = "a".repeat(20);
      }
      const helpers = createContextHelpers(() => makeState({ results: { data: bigData } }));
      const result = helpers.queryResults();
      expect(result).toContain("(truncated)");
    });
  });

  describe("schemaSummary", () => {
    it("returns null when not connected", () => {
      const helpers = createContextHelpers(() => makeState({ isConnected: false, schemaSummary: "Queries:\n  foo: String" }));
      expect(helpers.schemaSummary()).toBeNull();
    });

    it("returns null when no schema", () => {
      const helpers = createContextHelpers(() => makeState({ isConnected: true, schemaSummary: null }));
      expect(helpers.schemaSummary()).toBeNull();
    });

    it("returns schema when connected with summary", () => {
      const helpers = createContextHelpers(() => makeState({ isConnected: true, schemaSummary: "Queries:\n  countries: [Country]!" }));
      expect(helpers.schemaSummary()).toBe("Available GraphQL schema:\nQueries:\n  countries: [Country]!");
    });
  });

  describe("queryStrategy", () => {
    it("returns null when not connected", () => {
      const helpers = createContextHelpers(() => makeState({ isConnected: false }));
      expect(helpers.queryStrategy()).toBeNull();
    });

    it("returns strategy with filter-first and pagination guidance when connected", () => {
      const helpers = createContextHelpers(() => makeState({ isConnected: true }));
      const strategy = helpers.queryStrategy();
      expect(strategy).toContain("QUERY STRATEGY");
      expect(strategy).toContain("MUST use them to narrow results server-side");
      expect(strategy).toContain("NEVER fetch all records");
      expect(strategy).toContain("filter");
      expect(strategy).toContain("PAGINATION");
      expect(strategy).toContain("first/limit");
    });
  });

  describe("componentSelectionGuide", () => {
    it("returns null when not connected", () => {
      const helpers = createContextHelpers(() => makeState({ isConnected: false }));
      expect(helpers.componentSelectionGuide()).toBeNull();
    });

    it("returns guide when connected", () => {
      const helpers = createContextHelpers(() => makeState({ isConnected: true }));
      const guide = helpers.componentSelectionGuide();
      expect(guide).toContain("Component selection guide:");
      expect(guide).toContain("DataTable");
      expect(guide).toContain("Chart");
    });
  });

  describe("null-safety: no whitespace-only strings", () => {
    it("graphqlEndpoint never returns whitespace-only string", () => {
      // Even if endpoint were somehow whitespace, safeReturn catches it
      const helpers = createContextHelpers(() => makeState({ isConnected: true, endpoint: "   " }));
      const result = helpers.graphqlEndpoint();
      if (result !== null) {
        expect(result.trim().length).toBeGreaterThan(0);
      }
    });

    it("all helpers return null or non-whitespace strings", () => {
      const helpers = createContextHelpers(() => makeState({
        isConnected: true,
        endpoint: "http://example.com",
        query: "{ test }",
        variables: '{"a":1}',
        results: { data: { test: true } },
        schemaSummary: "Queries:\n  test: Boolean",
      }));

      const values = [
        helpers.graphqlEndpoint(),
        helpers.currentQuery(),
        helpers.currentVariables(),
        helpers.queryResults(),
        helpers.schemaSummary(),
        helpers.queryStrategy(),
        helpers.componentSelectionGuide(),
      ];

      for (const val of values) {
        if (val !== null) {
          expect(val.trim().length).toBeGreaterThan(0);
        }
      }
    });
  });
});
