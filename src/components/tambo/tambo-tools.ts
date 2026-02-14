import { z } from "zod";
import { executeQuery } from "@/lib/graphql/client";

export function createTamboTools(getEndpoint: () => string) {
  const executeGraphQLQueryTool = {
    name: "execute_graphql_query",
    description:
      "Execute a GraphQL query against the connected endpoint. Use this to fetch data that can then be rendered using UI components. Returns the query results as JSON.",
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
      const endpoint = getEndpoint();
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
      return executeQuery(endpoint, params.query, parsedVars);
    },
  };

  const getSchemaInfoTool = {
    name: "get_schema_info",
    description:
      "Introspect the connected GraphQL schema to discover available types, queries, mutations, and their fields. Use this before building queries to understand the API structure.",
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
      const endpoint = getEndpoint();
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
          fields?: Array<{ name: string; type: { name: string | null; kind: string; ofType?: unknown } }>;
        } | null;
        if (!typeData) {
          return { types: [`Type '${params.typeName}' not found`] };
        }
        return {
          typeDetails: {
            name: typeData.name,
            fields: (typeData.fields ?? []).map((f) => ({
              name: f.name,
              type: formatGraphQLType(f.type),
            })),
          },
        };
      }

      const result = await executeQuery(
        endpoint,
        `{
          __schema {
            queryType { name fields { name type { name kind ofType { name kind } } } }
            mutationType { name fields { name type { name kind ofType { name kind } } } }
            subscriptionType { name fields { name type { name kind ofType { name kind } } } }
          }
        }`
      );
      const schema = result.data?.__schema as {
        queryType?: { name: string; fields: Array<{ name: string; type: { name: string | null; kind: string; ofType?: { name: string | null; kind: string } | null } }> };
        mutationType?: { name: string; fields: Array<{ name: string; type: { name: string | null; kind: string; ofType?: { name: string | null; kind: string } | null } }> } | null;
        subscriptionType?: { name: string; fields: Array<{ name: string; type: { name: string | null; kind: string; ofType?: { name: string | null; kind: string } | null } }> } | null;
      };
      if (!schema) {
        return { types: ["Failed to introspect schema"] };
      }

      const types: string[] = [];
      if (schema.queryType) {
        types.push(
          ...schema.queryType.fields.map(
            (f) => `Query.${f.name}: ${formatGraphQLType(f.type)}`
          )
        );
      }
      if (schema.mutationType) {
        types.push(
          ...schema.mutationType.fields.map(
            (f) => `Mutation.${f.name}: ${formatGraphQLType(f.type)}`
          )
        );
      }
      if (schema.subscriptionType) {
        types.push(
          ...schema.subscriptionType.fields.map(
            (f) => `Subscription.${f.name}: ${formatGraphQLType(f.type)}`
          )
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
