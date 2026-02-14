"use client";

import { z } from "zod";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from "@/components/ui/context-menu";
import { ContextMenuSchema } from "@/lib/tambo/schemas/overlay-schemas";

type ContextMenuProps = z.infer<typeof ContextMenuSchema>;

export function TamboContextMenu({ trigger, items }: ContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">
        {trigger}
      </ContextMenuTrigger>
      <ContextMenuContent>
        {items.map((item, i) => (
          <ContextMenuItem key={i}>{item.label}</ContextMenuItem>
        ))}
      </ContextMenuContent>
    </ContextMenu>
  );
}
