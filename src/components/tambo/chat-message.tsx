"use client";

import type { TamboThreadMessage } from "@tambo-ai/react";
import { ComponentRenderer } from "@tambo-ai/react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: TamboThreadMessage;
  threadId: string;
}

export function ChatMessage({ message, threadId }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex flex-col gap-2 px-3 py-2",
        isUser ? "items-end" : "items-start"
      )}
    >
      <span className="text-xs font-medium text-muted-foreground">
        {isUser ? "You" : "AI"}
      </span>
      {(message.content ?? []).map((block, idx) => {
        if (block.type === "text" && "text" in block) {
          return (
            <div
              key={idx}
              className={cn(
                "max-w-[90%] rounded-lg px-3 py-2 text-sm",
                isUser
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground"
              )}
            >
              {block.text}
            </div>
          );
        }
        if (block.type === "component") {
          return (
            <div key={idx} className="w-full max-w-[90%]">
              <ComponentRenderer
                content={block}
                threadId={threadId}
                messageId={message.id}
              />
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}
