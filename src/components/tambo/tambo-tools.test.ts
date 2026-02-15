import { describe, it, expect, vi, beforeEach } from "vitest";
import { createTamboTools, type ToolBridgeCallbacks } from "./tambo-tools";

vi.mock("@/lib/graphql/client", () => ({
  executeQuery: vi.fn(),
}));

import { executeQuery } from "@/lib/graphql/client";
const mockExecuteQuery = vi.mocked(executeQuery);

function makeCallbacks(): ToolBridgeCallbacks {
  return {
    getEndpoint: () => "http://example.com/graphql",
    getIsConnected: () => true,
    syncQueryToEditor: vi.fn(),
    syncResultsToEditor: vi.fn(),
  };
}

describe("tambo-tools", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("get_schema_info - root level with args", () => {
    it("includes args in field output", async () => {
      mockExecuteQuery.mockResolvedValue({
        data: {
          __schema: {
            queryType: {
              name: "Query",
              fields: [
                {
                  name: "countries",
                  args: [
                    { name: "filter", type: { name: "CountryFilterInput", kind: "INPUT_OBJECT", ofType: null } },
                  ],
                  type: { name: null, kind: "NON_NULL", ofType: { name: null, kind: "LIST", ofType: { name: "Country", kind: "OBJECT" } } },
                },
                {
                  name: "continents",
                  args: [],
                  type: { name: null, kind: "NON_NULL", ofType: { name: null, kind: "LIST", ofType: { name: "Continent", kind: "OBJECT" } } },
                },
              ],
            },
            mutationType: null,
            subscriptionType: null,
          },
        },
      });

      const tools = createTamboTools(makeCallbacks());
      const schemaInfoTool = tools.find((t) => t.name === "get_schema_info")!;
      const result = await schemaInfoTool.tool({});

      expect(result.types).toBeDefined();
      expect(result.types).toContain("Query.countries(filter: CountryFilterInput): [Country]!");
      expect(result.types).toContain("Query.continents: [Continent]!");
    });
  });

  describe("get_schema_info - per-type with args", () => {
    it("includes args in type field output", async () => {
      mockExecuteQuery.mockResolvedValue({
        data: {
          __type: {
            name: "Query",
            kind: "OBJECT",
            fields: [
              {
                name: "continent",
                args: [
                  { name: "code", type: { name: null, kind: "NON_NULL", ofType: { name: "ID", kind: "SCALAR", ofType: null } } },
                ],
                type: { name: "Continent", kind: "OBJECT", ofType: null },
              },
              {
                name: "languages",
                args: [],
                type: { name: null, kind: "NON_NULL", ofType: { name: null, kind: "LIST", ofType: { name: "Language", kind: "OBJECT" } } },
              },
            ],
          },
        },
      });

      const tools = createTamboTools(makeCallbacks());
      const schemaInfoTool = tools.find((t) => t.name === "get_schema_info")!;
      const result = await schemaInfoTool.tool({ typeName: "Query" });

      expect(result.typeDetails).toBeDefined();
      const fields = result.typeDetails!.fields;
      expect(fields).toContainEqual({ name: "continent(code: ID!)", type: "Continent" });
      expect(fields).toContainEqual({ name: "languages", type: "[Language]!" });
    });
  });

  describe("get_schema_info - no endpoint", () => {
    it("returns error when no endpoint", async () => {
      const callbacks = makeCallbacks();
      callbacks.getEndpoint = () => "";
      const tools = createTamboTools(callbacks);
      const schemaInfoTool = tools.find((t) => t.name === "get_schema_info")!;
      const result = await schemaInfoTool.tool({});
      expect(result.types).toContain("No endpoint connected");
    });
  });

  describe("execute_graphql_query", () => {
    it("executes query and syncs to editor", async () => {
      mockExecuteQuery.mockResolvedValue({ data: { test: true } });

      const callbacks = makeCallbacks();
      const tools = createTamboTools(callbacks);
      const execTool = tools.find((t) => t.name === "execute_graphql_query")!;
      const result = await execTool.tool({ query: "{ test }" });

      expect(result).toEqual({ data: { test: true } });
      expect(callbacks.syncQueryToEditor).toHaveBeenCalledWith("{ test }", undefined);
      expect(callbacks.syncResultsToEditor).toHaveBeenCalled();
    });

    it("returns error for invalid variables JSON", async () => {
      const tools = createTamboTools(makeCallbacks());
      const execTool = tools.find((t) => t.name === "execute_graphql_query")!;
      const result = await execTool.tool({ query: "{ test }", variables: "not json" });
      expect(result.errors).toBeDefined();
      expect(result.errors![0].message).toBe("Invalid JSON in variables");
    });

    it("description includes filter-first and pagination guidance", () => {
      const tools = createTamboTools(makeCallbacks());
      const execTool = tools.find((t) => t.name === "execute_graphql_query")!;
      expect(execTool.description).toContain("MUST use filter");
      expect(execTool.description).toContain("never fetch all records");
      expect(execTool.description).toContain("PAGINATION");
      expect(execTool.description).toContain("3-5 columns");
    });
  });
});
