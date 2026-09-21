"use client";

import { z } from "zod";
import { Separator } from "@/components/ui/separator";
import { SeparatorSchema } from "@/lib/tambo/schemas/layout-schemas";

type SeparatorProps = z.infer<typeof SeparatorSchema>;

export function TamboSeparator({ orientation, decorative }: SeparatorProps) {
  return <Separator orientation={orientation} decorative={decorative} />;
}
