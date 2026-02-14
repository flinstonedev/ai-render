import type { GraphQLSchema } from "graphql";

export interface EndpointConfig {
  url: string;
  headers?: Record<string, string>;
}

export interface QueryResult {
  data?: Record<string, unknown>;
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: Array<string | number>;
  }>;
}

export interface GraphQLBridgeState {
  endpoint: EndpointConfig | null;
  schema: GraphQLSchema | null;
  query: string;
  variables: string;
  results: QueryResult | null;
  isConnected: boolean;
  isExecuting: boolean;
}
