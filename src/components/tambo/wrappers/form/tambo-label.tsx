"use client";

import { z } from "zod";
import { Label } from "@/components/ui/label";
import { LabelSchema } from "@/lib/tambo/schemas/form-schemas";

type LabelProps = z.infer<typeof LabelSchema>;

export function TamboLabel({ text, htmlFor }: LabelProps) {
  return <Label htmlFor={htmlFor}>{text}</Label>;
}
