"use client";

import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { TextareaSchema } from "@/lib/tambo/schemas/form-schemas";

type TextareaProps = z.infer<typeof TextareaSchema>;

export function TamboTextarea({ placeholder, rows }: TextareaProps) {
  return <Textarea placeholder={placeholder} rows={rows} />;
}
