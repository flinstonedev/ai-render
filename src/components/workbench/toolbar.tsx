"use client";

import { EndpointInput } from "@/components/graphql/endpoint-input";
import { useGraphQLBridge } from "@/components/graphql/graphql-context";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Sun, Moon, Play } from "lucide-react";
import { useGraphiQLActions } from "@graphiql/react";

function RunButton() {
  const { run } = useGraphiQLActions();

  return (
    <Button size="sm" onClick={() => run()}>
      <Play className="mr-1 h-3 w-3" />
      Run
    </Button>
  );
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

export function Toolbar() {
  const { isConnected } = useGraphQLBridge();

  return (
    <div className="flex h-14 items-center gap-3 border-b bg-background px-4">
      <div className="flex-1">
        <EndpointInput />
      </div>
      {isConnected && <RunButton />}
      <ThemeToggle />
    </div>
  );
}
