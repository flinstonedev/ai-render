import type { QueryResult } from "@/types/graphql";

export function createContextHelpers(getState: () => {
  endpoint: string;
  query: string;
  variables: string;
  results: QueryResult | null;
  isConnected: boolean;
}) {
  return {
    graphqlEndpoint: () => {
      const state = getState();
      if (!state.isConnected) return null;
      return `Connected to: ${state.endpoint}`;
    },
    currentQuery: () => {
      const state = getState();
      if (!state.query) return null;
      return `Current GraphQL query:\n${state.query}`;
    },
    currentVariables: () => {
      const state = getState();
      if (!state.variables || state.variables === "{}") return null;
      return `Current query variables:\n${state.variables}`;
    },
    queryResults: () => {
      const state = getState();
      if (!state.results) return null;
      return `Latest query results:\n${JSON.stringify(state.results, null, 2)}`;
    },
  };
}
