"use client";

import { z } from "zod";
import { SpinnerSchema } from "@/lib/tambo/schemas/feedback-schemas";

type SpinnerProps = z.infer<typeof SpinnerSchema>;

const sizeMap = {
  sm: 16,
  md: 24,
  lg: 32,
} as const;

export function TamboSpinner({ size = "md" }: SpinnerProps) {
  const px = sizeMap[size];

  return (
    <div
      style={{ width: px, height: px }}
      className="animate-spin rounded-full border-2 border-current border-t-transparent"
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
