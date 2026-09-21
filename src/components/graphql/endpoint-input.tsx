"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGraphQLBridge } from "./graphql-context";

export function EndpointInput() {
  const [error, setError] = useState<string | null>(null);
  const { endpoint, setEndpoint, isConnected, setIsConnected, setQuery, setVariables, setResults, setSchemaSummary } =
    useGraphQLBridge();

  const handleConnect = () => {
    setError(null);
    try {
      const url = new URL(endpoint);
      if (url.protocol === "http:" || url.protocol === "https:") {
        setQuery(""); setVariables("{}"); setResults(null); setSchemaSummary(null);
        setIsConnected(!isConnected);
      } else {
        setError("Use an HTTP or HTTPS GraphQL endpoint.");
      }
    } catch {
      setError("Enter a valid GraphQL endpoint URL.");
    }
  };

  const TEST_URL = "https://countries.trevorblades.com/graphql";

  return (
    <div className="flex items-center gap-2">
      <Input
        type="url"
        placeholder={TEST_URL}
        value={endpoint}
        onChange={(e) => setEndpoint(e.target.value)}
        aria-label="GraphQL endpoint"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? "endpoint-error" : undefined}
        disabled={isConnected}
        className="flex-1"
      />
      <Button
        onClick={handleConnect}
        variant={isConnected ? "destructive" : "default"}
        size="sm"
      >
        {isConnected ? "Disconnect" : "Connect"}
      </Button>
      {error && <p id="endpoint-error" role="alert" className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
