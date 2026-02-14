"use client";

import { GraphiQLProvider } from "@graphiql/react";
import { createGraphiQLFetcher } from "@graphiql/toolkit";
import { useMemo } from "react";
import { useGraphQLBridge } from "./graphql-context";

export function GraphQLProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { endpoint, isConnected } = useGraphQLBridge();

  const fetcher = useMemo(() => {
    if (!endpoint) return createGraphiQLFetcher({ url: "" });
    return createGraphiQLFetcher({
      url: "/api/graphql/execute",
      headers: { "x-graphql-endpoint": endpoint },
    });
  }, [endpoint]);

  if (!isConnected) {
    return <>{children}</>;
  }

  return <GraphiQLProvider fetcher={fetcher}>{children}</GraphiQLProvider>;
}
