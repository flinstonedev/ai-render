"use client";

import { z } from "zod";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import { HoverCardSchema } from "@/lib/tambo/schemas/overlay-schemas";

type HoverCardProps = z.infer<typeof HoverCardSchema>;

export function TamboHoverCard({ trigger, content }: HoverCardProps) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <button type="button" className="cursor-pointer underline">
          {trigger}
        </button>
      </HoverCardTrigger>
      <HoverCardContent>
        <p className="text-sm">{content}</p>
      </HoverCardContent>
    </HoverCard>
  );
}
