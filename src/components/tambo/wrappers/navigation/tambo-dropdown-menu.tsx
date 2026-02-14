"use client";

import { z } from "zod";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DropdownMenuSchema } from "@/lib/tambo/schemas/navigation-schemas";

type DropdownMenuProps = z.infer<typeof DropdownMenuSchema>;

export function TamboDropdownMenu({ trigger, items }: DropdownMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{trigger}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {items.map((item, i) => (
          <DropdownMenuItem key={i}>
            {item.label}
            {item.shortcut && (
              <DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
