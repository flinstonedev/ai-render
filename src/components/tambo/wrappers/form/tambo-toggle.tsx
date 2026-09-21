"use client";

import { z } from "zod";
import { Toggle } from "@/components/ui/toggle";
import { ToggleSchema } from "@/lib/tambo/schemas/form-schemas";

type ToggleProps = z.infer<typeof ToggleSchema>;

export function TamboToggle({ label, pressed }: ToggleProps) {
  return <Toggle defaultPressed={pressed}>{label}</Toggle>;
}
