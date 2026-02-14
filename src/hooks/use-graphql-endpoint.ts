"use client";

import { useState, useCallback } from "react";

export function useGraphQLEndpoint() {
  const [endpoint, setEndpoint] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  const isValid = useCallback(() => {
    try {
      const url = new URL(endpoint);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  }, [endpoint]);

  const connect = useCallback(() => {
    if (isValid()) setIsConnected(true);
  }, [isValid]);

  const disconnect = useCallback(() => {
    setIsConnected(false);
  }, []);

  return {
    endpoint,
    setEndpoint,
    isValid: isValid(),
    isConnected,
    connect,
    disconnect,
  };
}
