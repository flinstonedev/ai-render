"use client";

import { QueryEditor, VariableEditor } from "@graphiql/react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export function QueryEditorPanel() {
  return (
    <ResizablePanelGroup orientation="vertical">
      <ResizablePanel defaultSize={70} minSize={30}>
        <div className="h-full">
          <QueryEditor />
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={30} minSize={15}>
        <div className="h-full">
          <div className="px-3 py-1.5 text-xs font-medium text-muted-foreground border-b">
            Variables
          </div>
          <VariableEditor />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
