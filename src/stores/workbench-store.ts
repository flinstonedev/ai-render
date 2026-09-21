"use client";

import React, { createContext, useContext, useState } from "react";

interface WorkbenchContextValue {
  endpoint: string;
  setEndpoint: (url: string) => void;
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;
  isExecuting: boolean;
  setIsExecuting: (executing: boolean) => void;
}

const WorkbenchContext = createContext<WorkbenchContextValue | null>(null);

export function WorkbenchProvider({ children }: { children: React.ReactNode }) {
  const [endpoint, setEndpoint] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);

  return React.createElement(
    WorkbenchContext.Provider,
    {
      value: {
        endpoint,
        setEndpoint,
        isConnected,
        setIsConnected,
        isExecuting,
        setIsExecuting,
      },
    },
    children
  );
}

export function useWorkbench() {
  const ctx = useContext(WorkbenchContext);
  if (!ctx) {
    throw new Error("useWorkbench must be used within WorkbenchProvider");
  }
  return ctx;
}
