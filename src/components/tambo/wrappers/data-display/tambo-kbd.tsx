"use client";

import { z } from "zod";
import { KbdSchema } from "@/lib/tambo/schemas/data-display-schemas";

type KbdProps = z.infer<typeof KbdSchema>;

export function TamboKbd({ keys }: KbdProps) {
  return (
    <span className="inline-flex items-center gap-1">
      {keys.map((key, index) => (
        <kbd
          key={index}
          className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground"
        >
          {key}
        </kbd>
      ))}
    </span>
  );
}
