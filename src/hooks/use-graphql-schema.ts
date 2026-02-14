"use client";

import { useState, useEffect, useCallback } from "react";
import type { GraphQLSchema } from "graphql";
import { buildClientSchema } from "graphql";
import { introspectSchema } from "@/lib/graphql/client";

export function useGraphQLSchema(endpoint: string, isConnected: boolean) {
  const [schema, setSchema] = useState<GraphQLSchema | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSchema = useCallback(async () => {
    if (!endpoint || !isConnected) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await introspectSchema(endpoint);

      if (result.errors) {
        setError(result.errors[0]?.message ?? "Failed to introspect schema");
        setSchema(null);
        return;
      }

      if (result.data) {
        const clientSchema = buildClientSchema(
          result.data as unknown as Parameters<typeof buildClientSchema>[0]
        );
        setSchema(clientSchema);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch schema";
      setError(message);
      setSchema(null);
    } finally {
      setIsLoading(false);
    }
  }, [endpoint, isConnected]);

  useEffect(() => {
    if (isConnected) {
      fetchSchema();
    } else {
      setSchema(null);
      setError(null);
    }
  }, [isConnected, fetchSchema]);

  return { schema, isLoading, error, refetch: fetchSchema };
}
