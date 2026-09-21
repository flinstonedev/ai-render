"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import type { GraphQLSchema } from "graphql";
import type { QueryResult } from "@/types/graphql";

export interface EditorSyncCallbacks {
  syncQueryToEditor: (query: string, variables?: string) => void;
  syncResultsToEditor: (results: string) => void;
}

interface GraphQLBridgeContextValue {
  endpoint: string;
  setEndpoint: (url: string) => void;
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;
  schema: GraphQLSchema | null;
  setSchema: (schema: GraphQLSchema | null) => void;
  query: string;
  setQuery: (query: string) => void;
  variables: string;
  setVariables: (variables: string) => void;
  results: QueryResult | null;
  setResults: (results: QueryResult | null) => void;
  isExecuting: boolean;
  setIsExecuting: (executing: boolean) => void;
  schemaSummary: string | null;
  setSchemaSummary: (summary: string | null) => void;
  registerEditorSync: (callbacks: EditorSyncCallbacks) => void;
  getEditorSync: () => EditorSyncCallbacks | null;
}

const GraphQLBridgeContext = createContext<GraphQLBridgeContextValue | null>(
  null
);

export function GraphQLBridgeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [endpoint, setEndpoint] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [schema, setSchema] = useState<GraphQLSchema | null>(null);
  const [query, setQuery] = useState("");
  const [variables, setVariables] = useState("{}");
  const [results, setResults] = useState<QueryResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [schemaSummary, setSchemaSummary] = useState<string | null>(null);
  const editorSyncRef = useRef<EditorSyncCallbacks | null>(null);

  const registerEditorSync = useCallback(
    (callbacks: EditorSyncCallbacks) => {
      editorSyncRef.current = callbacks;
    },
    []
  );

  const getEditorSync = useCallback(() => editorSyncRef.current, []);

  return (
    <GraphQLBridgeContext.Provider
      value={{
        endpoint,
        setEndpoint,
        isConnected,
        setIsConnected,
        schema,
        setSchema,
        query,
        setQuery,
        variables,
        setVariables,
        results,
        setResults,
        isExecuting,
        setIsExecuting,
        schemaSummary,
        setSchemaSummary,
        registerEditorSync,
        getEditorSync,
      }}
    >
      {children}
    </GraphQLBridgeContext.Provider>
  );
}

export function useGraphQLBridge() {
  const ctx = useContext(GraphQLBridgeContext);
  if (!ctx) {
    throw new Error(
      "useGraphQLBridge must be used within GraphQLBridgeProvider"
    );
  }
  return ctx;
}
