"use client";

import { useState } from "react";
import { useTamboThreadInput } from "@tambo-ai/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

export function ChatInput() {
  const { value, setValue, submit, isPending } = useTamboThreadInput();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!value.trim() || isPending) return;
    setError(null);
    try {
      await submit();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t p-3">
      {error && (
        <p className="mb-2 text-xs text-destructive">{error}</p>
      )}
      <div className="flex items-end gap-2">
        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask AI to render results..."
          className="min-h-[40px] max-h-[120px] resize-none text-sm"
          rows={1}
          disabled={isPending}
        />
        <Button
          size="sm"
          onClick={handleSubmit}
          disabled={!value.trim() || isPending}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
