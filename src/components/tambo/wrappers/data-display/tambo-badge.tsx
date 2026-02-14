"use client";

import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { BadgeSchema } from "@/lib/tambo/schemas/data-display-schemas";

type BadgeProps = z.infer<typeof BadgeSchema>;

export function TamboBadge({ text, variant }: BadgeProps) {
  return <Badge variant={variant}>{text}</Badge>;
}
