"use client";

import { z } from "zod";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ScrollAreaSchema } from "@/lib/tambo/schemas/layout-schemas";

type ScrollAreaProps = z.infer<typeof ScrollAreaSchema>;

export function TamboScrollArea({ content, className, height }: ScrollAreaProps) {
  return (
    <ScrollArea className={className} style={height ? { height } : undefined}>
      <div className="p-4">
        <p>{content}</p>
      </div>
    </ScrollArea>
  );
}
