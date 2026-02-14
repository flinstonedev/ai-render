"use client";

import { z } from "zod";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { TooltipSchema } from "@/lib/tambo/schemas/feedback-schemas";

type TooltipProps = z.infer<typeof TooltipSchema>;

export function TamboTooltip({ content, trigger }: TooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span>{trigger}</span>
        </TooltipTrigger>
        <TooltipContent>{content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
