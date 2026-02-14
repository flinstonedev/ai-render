"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGraphQLBridge } from "./graphql-context";

export function EndpointInput() {
  const { endpoint, setEndpoint, isConnected, setIsConnected } =
    useGraphQLBridge();

  const handleConnect = () => {
    try {
      const url = new URL(endpoint);
      if (url.protocol === "http:" || url.protocol === "https:") {
        setIsConnected(!isConnected);
      }
    } catch {
      // Invalid URL, don't connect
    }
  };

  const TEST_URL = "https://countries.trevorblades.com/graphql";

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab" && !endpoint) {
      e.preventDefault();
      setEndpoint(TEST_URL);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Input
        type="url"
        placeholder={TEST_URL}
        value={endpoint}
        onChange={(e) => setEndpoint(e.target.value)}
        onKeyDown={handleKeyDown}
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
    </div>
  );
}
