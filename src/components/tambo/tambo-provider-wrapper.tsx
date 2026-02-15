"use client";

import React, { createContext, useContext, useEffect } from "react";
import { TamboProvider } from "@tambo-ai/react";
import { tamboComponents } from "./tambo-component-registry";
import { useGraphQLBridge } from "@/components/graphql/graphql-context";
import { createTamboTools } from "./tambo-tools";
import { createContextHelpers } from "./context-helpers";
import type { QueryResult } from "@/types/graphql";

interface BridgeSnapshot {
  endpoint: string;
  isConnected: boolean;
  query: string;
  variables: string;
  results: QueryResult | null;
  schemaSummary: string | null;
  setQuery: (q: string) => void;
  setVariables: (v: string) => void;
  setResults: (r: QueryResult | null) => void;
  getEditorSync: ReturnType<typeof useGraphQLBridge>["getEditorSync"];
}

const bridgeRef: { current: BridgeSnapshot | null } = { current: null };

const stableTools = createTamboTools({
  getEndpoint: () => bridgeRef.current?.endpoint ?? "",
  getIsConnected: () => bridgeRef.current?.isConnected ?? false,
  syncQueryToEditor: (query: string, variables?: string) => {
    if (!bridgeRef.current) return;
    bridgeRef.current.setQuery(query);
    if (variables) {
      bridgeRef.current.setVariables(variables);
    }
    bridgeRef.current.getEditorSync()?.syncQueryToEditor(query, variables);
  },
  syncResultsToEditor: (results: string) => {
    if (!bridgeRef.current) return;
    try {
      bridgeRef.current.setResults(JSON.parse(results));
    } catch {
      bridgeRef.current.setResults({ data: { raw: results } });
    }
    bridgeRef.current.getEditorSync()?.syncResultsToEditor(results);
  },
});

const stableContextHelpers = createContextHelpers(() => ({
  endpoint: bridgeRef.current?.endpoint ?? "",
  query: bridgeRef.current?.query ?? "",
  variables: bridgeRef.current?.variables ?? "{}",
  results: bridgeRef.current?.results ?? null,
  isConnected: bridgeRef.current?.isConnected ?? false,
  schemaSummary: bridgeRef.current?.schemaSummary ?? null,
}));

const TamboAvailableContext = createContext(false);

export function useTamboAvailable() {
  return useContext(TamboAvailableContext);
}

function BridgeSync() {
  const bridge = useGraphQLBridge();

  useEffect(() => {
    bridgeRef.current = {
      endpoint: bridge.endpoint,
      isConnected: bridge.isConnected,
      query: bridge.query,
      variables: bridge.variables,
      results: bridge.results,
      schemaSummary: bridge.schemaSummary,
      setQuery: bridge.setQuery,
      setVariables: bridge.setVariables,
      setResults: bridge.setResults,
      getEditorSync: bridge.getEditorSync,
    };
  });

  return null;
}

export function TamboProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const apiKey = process.env.NEXT_PUBLIC_TAMBO_API_KEY;
  if (!apiKey) {
    return (
      <TamboAvailableContext.Provider value={false}>
        {children}
      </TamboAvailableContext.Provider>
    );
  }

  return (
    <TamboAvailableContext.Provider value={true}>
      <BridgeSync />
      <TamboProvider
        apiKey={apiKey}
        userKey="default-user"
        tamboUrl={process.env.NEXT_PUBLIC_TAMBO_URL}
        components={tamboComponents}
        tools={stableTools}
        contextHelpers={stableContextHelpers}
      >
        {children}
      </TamboProvider>
    </TamboAvailableContext.Provider>
  );
}
