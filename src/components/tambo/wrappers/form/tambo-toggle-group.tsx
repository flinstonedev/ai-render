"use client";

import { z } from "zod";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ToggleGroupSchema } from "@/lib/tambo/schemas/form-schemas";

type ToggleGroupProps = z.infer<typeof ToggleGroupSchema>;

export function TamboToggleGroup({ items, type }: ToggleGroupProps) {
  return (
    <ToggleGroup type={type ?? "single"}>
      {items.map((item) => (
        <ToggleGroupItem key={item.value} value={item.value}>
          {item.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
