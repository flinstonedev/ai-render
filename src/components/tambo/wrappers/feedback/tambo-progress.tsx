"use client";

import { z } from "zod";
import { Progress } from "@/components/ui/progress";
import { ProgressSchema } from "@/lib/tambo/schemas/feedback-schemas";

type ProgressProps = z.infer<typeof ProgressSchema>;

export function TamboProgress({ value, max = 100 }: ProgressProps) {
  const normalizedValue = (value / max) * 100;

  return <Progress value={normalizedValue} />;
}
