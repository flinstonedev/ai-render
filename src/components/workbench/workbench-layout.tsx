"use client";

// Must be imported before any @graphiql/react or monaco-editor imports
import "@/lib/setup-monaco-workers";
import "graphiql/graphiql.css";
import "@graphiql/react/style.css";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { GraphQLBridgeProvider } from "@/components/graphql/graphql-context";
import { GraphQLProviderWrapper } from "@/components/graphql/graphql-provider-wrapper";
import { TamboProviderWrapper } from "@/components/tambo/tambo-provider-wrapper";
import { SchemaExplorer } from "@/components/graphql/schema-explorer";
import { QueryEditorPanel } from "@/components/graphql/query-editor-panel";
import { ResultsPanel } from "@/components/graphql/results-panel";
import { ChatPanel } from "@/components/tambo/chat-panel";
import { Toolbar } from "./toolbar";
import { PanelHeader } from "./panel-header";
import { useGraphQLBridge } from "@/components/graphql/graphql-context";

function WorkbenchPanels() {
  const { isConnected } = useGraphQLBridge();

  return (
    <div className="graphiql-container flex h-screen flex-col">
      <Toolbar />
      <ResizablePanelGroup orientation="horizontal" className="flex-1">
        <ResizablePanel defaultSize={25} minSize={15}>
          <div className="flex h-full flex-col">
            <PanelHeader title="Schema Explorer" />
            <div className="flex-1 overflow-hidden">
              {isConnected ? (
                <SchemaExplorer />
              ) : (
                <div className="flex h-full items-center justify-center p-4 text-center text-sm text-muted-foreground">
                  Connect to a GraphQL endpoint to explore the schema
                </div>
              )}
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={45} minSize={25}>
          <div className="flex h-full flex-col">
            <PanelHeader title="Query Editor" />
            <div className="flex-1 overflow-hidden">
              {isConnected ? (
                <ResizablePanelGroup orientation="vertical">
                  <ResizablePanel defaultSize={60} minSize={20}>
                    <QueryEditorPanel />
                  </ResizablePanel>
                  <ResizableHandle withHandle />
                  <ResizablePanel defaultSize={40} minSize={15}>
                    <PanelHeader title="Results" />
                    <div className="h-[calc(100%-2.5rem)] overflow-hidden">
                      <ResultsPanel />
                    </div>
                  </ResizablePanel>
                </ResizablePanelGroup>
              ) : (
                <div className="flex h-full items-center justify-center p-4 text-center text-sm text-muted-foreground">
                  Connect to a GraphQL endpoint to start writing queries
                </div>
              )}
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={30} minSize={20}>
          <div className="flex h-full flex-col">
            <PanelHeader title="AI Chat" />
            <div className="flex-1 overflow-hidden">
              <ChatPanel />
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

export function WorkbenchLayout() {
  return (
    <GraphQLBridgeProvider>
      <GraphQLProviderWrapper>
        <TamboProviderWrapper>
          <WorkbenchPanels />
        </TamboProviderWrapper>
      </GraphQLProviderWrapper>
    </GraphQLBridgeProvider>
  );
}
