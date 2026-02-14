"use client";

import React from "react";
import { useTambo } from "@tambo-ai/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./chat-message";
import { ChatInput } from "./chat-input";
import { useTamboAvailable } from "./tambo-provider-wrapper";

function TamboChatContent() {
  const { messages, currentThreadId, isStreaming } = useTambo();

  return (
    <div className="flex h-full flex-col">
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-1 py-2">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-2 px-4 py-12 text-center text-sm text-muted-foreground">
              <p className="font-medium">No messages yet</p>
              <p>
                Connect to a GraphQL endpoint, run a query, then ask AI to
                render the results as a component.
              </p>
            </div>
          )}
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              threadId={currentThreadId}
            />
          ))}
          {isStreaming && (
            <div className="px-3 py-2 text-xs text-muted-foreground">
              AI is thinking...
            </div>
          )}
        </div>
      </ScrollArea>
      <ChatInput />
    </div>
  );
}

class ChatErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: string | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error: error.message };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center text-sm text-muted-foreground">
          <p className="font-medium">AI Chat Error</p>
          <p>{this.state.error}</p>
          <button
            className="mt-2 rounded bg-primary px-3 py-1 text-xs text-primary-foreground"
            onClick={() => this.setState({ error: null })}
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export function ChatPanel() {
  const tamboAvailable = useTamboAvailable();

  if (!tamboAvailable) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center text-sm text-muted-foreground">
        <p className="font-medium">AI Chat not configured</p>
        <p>
          Set <code className="rounded bg-muted px-1 py-0.5 text-xs">NEXT_PUBLIC_TAMBO_API_KEY</code> in your{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">.env.local</code> file to enable AI chat.
        </p>
      </div>
    );
  }

  return (
    <ChatErrorBoundary>
      <TamboChatContent />
    </ChatErrorBoundary>
  );
}
