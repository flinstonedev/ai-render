"use client";

import { ResponseEditor } from "@graphiql/react";

export function ResultsPanel() {
  return (
    <div className="h-full [&_.result-window]:h-full">
      <ResponseEditor />
    </div>
  );
}
