"use client";

import { explorerPlugin } from "@graphiql/plugin-explorer";
import { useMemo } from "react";
import "@graphiql/plugin-explorer/style.css";

export function SchemaExplorer() {
  const plugin = useMemo(() => explorerPlugin(), []);
  const ExplorerContent = plugin.content;

  return (
    <div className="h-full overflow-auto graphiql-explorer-container">
      <ExplorerContent />
    </div>
  );
}
