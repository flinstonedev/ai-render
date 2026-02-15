import type { QueryResult } from "@/types/graphql";

function safeReturn(value: string | null | undefined): string | null {
  if (!value) return null;
  return value.trim().length > 0 ? value : null;
}

export function createContextHelpers(getState: () => {
  endpoint: string;
  query: string;
  variables: string;
  results: QueryResult | null;
  isConnected: boolean;
  schemaSummary: string | null;
}) {
  return {
    graphqlEndpoint: () => {
      const state = getState();
      if (!state.isConnected || !state.endpoint) return null;
      return safeReturn(`Connected to: ${state.endpoint}`);
    },
    currentQuery: () => {
      const state = getState();
      if (!state.query) return null;
      return safeReturn(`Current GraphQL query:\n${state.query}`);
    },
    currentVariables: () => {
      const state = getState();
      if (!state.variables || state.variables === "{}") return null;
      return safeReturn(`Current query variables:\n${state.variables}`);
    },
    queryResults: () => {
      const state = getState();
      if (!state.results) return null;
      const json = JSON.stringify(state.results, null, 2);
      if (json.length > 4000) {
        return safeReturn(`Latest query results (truncated):\n${json.slice(0, 4000)}\n... (truncated)`);
      }
      return safeReturn(`Latest query results:\n${json}`);
    },
    schemaSummary: () => {
      const state = getState();
      if (!state.isConnected || !state.schemaSummary) return null;
      return safeReturn(`Available GraphQL schema:\n${state.schemaSummary}`);
    },
    queryStrategy: () => {
      const state = getState();
      if (!state.isConnected) return null;
      return safeReturn([
        "QUERY STRATEGY (follow strictly):",
        "1. ALWAYS check the schema summary above before writing a query — look at available arguments for each field",
        "2. When a field accepts filter, code, limit, first, or offset arguments, you MUST use them to narrow results server-side",
        "3. NEVER fetch all records and filter client-side when the schema provides a filter argument",
        "4. For queries like 'countries that use EUR': use countries(filter: { currency: { eq: \"EUR\" } }) — do NOT fetch all countries",
        "5. For queries about a specific item: use the code/id argument (e.g., continent(code: \"EU\"), country(code: \"US\"))",
        "6. PAGINATION: When the result count is unknown or potentially large, ALWAYS use pagination arguments if the schema supports them:",
        "   - Use first/limit (e.g., first: 50) to cap results per request",
        "   - Use offset/after/skip for subsequent pages",
        "   - If the schema has NO pagination arguments, narrow results with filter arguments instead and select minimal fields",
        "   - Default to fetching at most ~50 records per query — ask the user before fetching more",
        "7. Select only the fields needed for the visualization — avoid SELECT * style queries",
        "8. Use get_schema_info tool to inspect filter input types when you need to understand available filter operators",
      ].join("\n"));
    },
    componentSelectionGuide: () => {
      const state = getState();
      if (!state.isConnected) return null;
      return safeReturn([
        "Component selection guide:",
        "- DataTable: Use for arrays/lists of records with multiple fields (limit to 3-5 columns for readability)",
        "- Chart: Use for numeric comparisons, distributions, or trends (e.g., counts by category, values over time)",
        "- Card: Use for single items, summaries, or key-value details",
        "- Tabs: Use when showing multiple related views or groupings of the same data",
        "- Badge: Use for status indicators or category labels",
        "- Alert: Use for important messages, warnings, or error states",
        "- DataTable works best under 100 rows — use query arguments to narrow results first",
        "- Prefer Chart for aggregate summaries over tables of raw records for large datasets",
        "Always auto-select the most appropriate component based on the data shape — do not ask the user which component to use.",
      ].join("\n"));
    },
  };
}
