import type { QueryResult } from "@/types/graphql";

export async function executeQuery(
  endpoint: string,
  query: string,
  variables?: Record<string, unknown>
): Promise<QueryResult> {
  const response = await fetch("/api/graphql/execute", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-graphql-endpoint": endpoint,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch {
      return { errors: [{ message: `HTTP ${response.status}: ${text.slice(0, 200)}` }] };
    }
  }

  return response.json();
}

export async function introspectSchema(
  endpoint: string
): Promise<QueryResult> {
  const response = await fetch("/api/graphql/introspect", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ endpoint }),
  });

  if (!response.ok) {
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch {
      return { errors: [{ message: `HTTP ${response.status}: ${text.slice(0, 200)}` }] };
    }
  }

  return response.json();
}
