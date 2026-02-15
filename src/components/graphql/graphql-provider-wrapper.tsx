"use client";

import { GraphiQLProvider } from "@graphiql/react";
import { createGraphiQLFetcher } from "@graphiql/toolkit";
import { useEffect, useMemo } from "react";
import { useGraphQLBridge } from "./graphql-context";
import { GraphQLEditorSync } from "./graphql-editor-sync";
import { executeQuery } from "@/lib/graphql/client";

function SchemaSummaryLoader() {
  const { endpoint, isConnected, setSchemaSummary } = useGraphQLBridge();

  useEffect(() => {
    if (!isConnected || !endpoint) {
      setSchemaSummary(null);
      return;
    }

    let cancelled = false;

    async function loadSchemaSummary() {
      const result = await executeQuery(
        endpoint,
        `{
          __schema {
            queryType { name fields { name args { name type { name kind ofType { name kind ofType { name kind } } } } type { name kind ofType { name kind ofType { name kind } } } } }
            mutationType { name fields { name args { name type { name kind ofType { name kind ofType { name kind } } } } type { name kind ofType { name kind ofType { name kind } } } } }
          }
        }`
      );

      if (cancelled) return;

      type IntrospectionType = { name: string | null; kind: string; ofType?: { name: string | null; kind: string; ofType?: { name: string | null; kind: string } | null } | null };
      type FieldWithArgs = {
        name: string;
        args?: Array<{ name: string; type: IntrospectionType }>;
        type: IntrospectionType;
      };
      const schema = result.data?.__schema as {
        queryType?: { fields: FieldWithArgs[] };
        mutationType?: { fields: FieldWithArgs[] } | null;
      };

      if (!schema) return;

      const lines: string[] = [];
      function formatFieldWithArgs(f: FieldWithArgs): string {
        const argsStr = f.args?.length
          ? `(${f.args.map((a) => `${a.name}: ${formatType(a.type)}`).join(", ")})`
          : "";
        return `  ${f.name}${argsStr}: ${formatType(f.type)}`;
      }

      if (schema.queryType) {
        lines.push("Queries:");
        for (const f of schema.queryType.fields) {
          lines.push(formatFieldWithArgs(f));
        }
      }
      if (schema.mutationType) {
        lines.push("Mutations:");
        for (const f of schema.mutationType.fields) {
          lines.push(formatFieldWithArgs(f));
        }
      }

      if (lines.length > 0) {
        setSchemaSummary(lines.join("\n"));
      }
    }

    loadSchemaSummary();

    return () => {
      cancelled = true;
    };
  }, [endpoint, isConnected, setSchemaSummary]);

  return null;
}

function formatType(type: {
  name: string | null;
  kind: string;
  ofType?: { name: string | null; kind: string; ofType?: { name: string | null; kind: string } | null } | null;
}): string {
  if (type.name) return type.name;
  if (type.kind === "NON_NULL" && type.ofType) {
    return `${formatType(type.ofType)}!`;
  }
  if (type.kind === "LIST" && type.ofType) {
    return `[${formatType(type.ofType)}]`;
  }
  return type.kind;
}

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

  if (!endpoint || !isConnected) {
    return <>{children}</>;
  }

  return (
    <GraphiQLProvider fetcher={fetcher}>
      <GraphQLEditorSync />
      <SchemaSummaryLoader />
      {children}
    </GraphiQLProvider>
  );
}
