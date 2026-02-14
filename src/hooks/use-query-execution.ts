"use client";

import { useState, useCallback } from "react";
import type { QueryResult } from "@/types/graphql";
import { executeQuery } from "@/lib/graphql/client";

export function useQueryExecution(endpoint: string) {
  const [results, setResults] = useState<QueryResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (query: string, variables?: Record<string, unknown>) => {
      if (!endpoint || !query) return;

      setIsExecuting(true);
      setError(null);

      try {
        const result = await executeQuery(endpoint, query, variables);
        setResults(result);
        return result;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to execute query";
        setError(message);
        setResults({ errors: [{ message }] });
      } finally {
        setIsExecuting(false);
      }
    },
    [endpoint]
  );

  return { execute, results, isExecuting, error };
}
