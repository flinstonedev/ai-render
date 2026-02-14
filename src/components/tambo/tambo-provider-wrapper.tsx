"use client";

import React, { createContext, useContext } from "react";
import { TamboProvider } from "@tambo-ai/react";
import { tamboComponents } from "./tambo-component-registry";
import { useGraphQLBridge } from "@/components/graphql/graphql-context";
import { createTamboTools } from "./tambo-tools";
import { createContextHelpers } from "./context-helpers";

const TamboAvailableContext = createContext(false);

export function useTamboAvailable() {
  return useContext(TamboAvailableContext);
}

export function TamboProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const bridge = useGraphQLBridge();

  const tools = createTamboTools(() => bridge.endpoint);
  const contextHelpers = createContextHelpers(() => ({
    endpoint: bridge.endpoint,
    query: bridge.query,
    variables: bridge.variables,
    results: bridge.results,
    isConnected: bridge.isConnected,
  }));

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
      <TamboProvider
        apiKey={apiKey}
        userKey="default-user"
        tamboUrl={process.env.NEXT_PUBLIC_TAMBO_URL}
        components={tamboComponents}
        tools={tools}
        contextHelpers={contextHelpers}
      >
        {children}
      </TamboProvider>
    </TamboAvailableContext.Provider>
  );
}
