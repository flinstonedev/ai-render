import { z } from "zod";
import { executeQuery } from "@/lib/graphql/client";

export interface ToolBridgeCallbacks {
  getEndpoint: () => string;
  getIsConnected: () => boolean;
  syncQueryToEditor: (query: string, variables?: string) => void;
  syncResultsToEditor: (results: string) => void;
}

export function createTamboTools(callbacks: ToolBridgeCallbacks) {
  const executeGraphQLQueryTool = {
    name: "execute_graphql_query",
    description:
      "Execute a GraphQL query against the connected endpoint. The query and results will be synced to the editor panels automatically. " +
      "BEFORE writing any query: check the schema summary for available arguments on the target field. " +
      "You MUST use filter/code/id arguments to narrow results server-side — never fetch all records when a filter argument exists. " +
      "For example, use countries(filter: { currency: { eq: \"EUR\" } }) instead of fetching all countries and filtering client-side. " +
      "PAGINATION: When the result count is unknown, always use pagination arguments (first/limit/offset) if the schema supports them — " +
      "default to ~50 records per request. If no pagination args exist, use filters to narrow results and select minimal fields. " +
      "After receiving results, choose the best component to render: " +
      "use DataTable for arrays/lists of records (limit to 3-5 columns for readability), Chart for numeric comparisons or trends, " +
      "Card for single items or summaries, and Tabs when showing multiple views.",
    inputSchema: z.object({
      query: z
        .string()
        .describe("The GraphQL query string to execute"),
      variables: z
        .string()
        .optional()
        .describe("Optional variables for the GraphQL query as a JSON string"),
    }),
    outputSchema: z.object({
      data: z.unknown().optional().describe("The query result data"),
      errors: z
        .array(z.object({ message: z.string() }))
        .optional()
        .describe("Any errors from the query execution"),
    }),
    tool: async (params: { query: string; variables?: string }) => {
      const endpoint = callbacks.getEndpoint();
      if (!endpoint) {
        return { errors: [{ message: "No GraphQL endpoint connected" }] };
      }

      let parsedVars: Record<string, unknown> | undefined;
      if (params.variables) {
        try {
          parsedVars = JSON.parse(params.variables);
        } catch {
          return { errors: [{ message: "Invalid JSON in variables" }] };
        }
      }

      callbacks.syncQueryToEditor(params.query, params.variables);

      const result = await executeQuery(endpoint, params.query, parsedVars);

      callbacks.syncResultsToEditor(JSON.stringify(result, null, 2));

      return result;
    },
  };

  const getSchemaInfoTool = {
    name: "get_schema_info",
    description:
      "Introspect the connected GraphQL schema to discover available types, queries, mutations, and their fields. " +
      "Use this before building queries to understand the API structure. " +
      "Note: A schema summary is already available in context when connected — use this tool only when you need details about a specific type.",
    inputSchema: z.object({
      typeName: z
        .string()
        .optional()
        .describe(
          "Optional specific type name to get details for. If omitted, returns the root Query/Mutation type fields."
        ),
    }),
    outputSchema: z.object({
      types: z
        .array(z.string())
        .optional()
        .describe("List of available type names"),
      typeDetails: z
        .object({
          name: z.string(),
          fields: z.array(
            z.object({ name: z.string(), type: z.string() })
          ),
        })
        .optional()
        .describe("Details of a specific type"),
    }),
    tool: async (params: { typeName?: string }) => {
      const endpoint = callbacks.getEndpoint();
      if (!endpoint) {
        return { types: ["No endpoint connected"] };
      }

      if (params.typeName) {
        const result = await executeQuery(
          endpoint,
          `query IntrospectType($name: String!) {
            __type(name: $name) {
              name
              kind
              fields {
                name
                args {
                  name
                  type {
                    name
                    kind
                    ofType { name kind ofType { name kind ofType { name kind } } }
                  }
                }
                type {
                  name
                  kind
                  ofType { name kind ofType { name kind ofType { name kind } } }
                }
              }
            }
          }`,
          { name: params.typeName }
        );
        const typeData = result.data?.__type as {
          name: string;
          fields?: Array<{
            name: string;
            args?: Array<{ name: string; type: { name: string | null; kind: string; ofType?: unknown } }>;
            type: { name: string | null; kind: string; ofType?: unknown };
          }>;
        } | null;
        if (!typeData) {
          return { types: [`Type '${params.typeName}' not found`] };
        }
        return {
          typeDetails: {
            name: typeData.name,
            fields: (typeData.fields ?? []).map((f) => {
              const argsStr = f.args?.length
                ? `(${f.args.map((a) => `${a.name}: ${formatGraphQLType(a.type)}`).join(", ")})`
                : "";
              return {
                name: `${f.name}${argsStr}`,
                type: formatGraphQLType(f.type),
              };
            }),
          },
        };
      }

      const result = await executeQuery(
        endpoint,
        `{
          __schema {
            queryType { name fields { name args { name type { name kind ofType { name kind ofType { name kind } } } } type { name kind ofType { name kind ofType { name kind } } } } }
            mutationType { name fields { name args { name type { name kind ofType { name kind ofType { name kind } } } } type { name kind ofType { name kind ofType { name kind } } } } }
            subscriptionType { name fields { name args { name type { name kind ofType { name kind ofType { name kind } } } } type { name kind ofType { name kind ofType { name kind } } } } }
          }
        }`
      );
      type SchemaFieldType = { name: string | null; kind: string; ofType?: { name: string | null; kind: string; ofType?: { name: string | null; kind: string } | null } | null };
      type SchemaField = { name: string; args?: Array<{ name: string; type: SchemaFieldType }>; type: SchemaFieldType };
      const schema = result.data?.__schema as {
        queryType?: { name: string; fields: SchemaField[] };
        mutationType?: { name: string; fields: SchemaField[] } | null;
        subscriptionType?: { name: string; fields: SchemaField[] } | null;
      };
      if (!schema) {
        return { types: ["Failed to introspect schema"] };
      }

      function formatFieldWithArgs(prefix: string, f: SchemaField): string {
        const argsStr = f.args?.length
          ? `(${f.args.map((a) => `${a.name}: ${formatGraphQLType(a.type)}`).join(", ")})`
          : "";
        return `${prefix}.${f.name}${argsStr}: ${formatGraphQLType(f.type)}`;
      }

      const types: string[] = [];
      if (schema.queryType) {
        types.push(
          ...schema.queryType.fields.map((f) => formatFieldWithArgs("Query", f))
        );
      }
      if (schema.mutationType) {
        types.push(
          ...schema.mutationType.fields.map((f) => formatFieldWithArgs("Mutation", f))
        );
      }
      if (schema.subscriptionType) {
        types.push(
          ...schema.subscriptionType.fields.map((f) => formatFieldWithArgs("Subscription", f))
        );
      }
      return { types };
    },
  };

  return [executeGraphQLQueryTool, getSchemaInfoTool];
}

function formatGraphQLType(type: { name: string | null; kind: string; ofType?: unknown }): string {
  if (type.name) return type.name;
  if (type.kind === "NON_NULL" && type.ofType) {
    return `${formatGraphQLType(type.ofType as { name: string | null; kind: string; ofType?: unknown })}!`;
  }
  if (type.kind === "LIST" && type.ofType) {
    return `[${formatGraphQLType(type.ofType as { name: string | null; kind: string; ofType?: unknown })}]`;
  }
  return type.kind;
}
