"use client";

import { z } from "zod";
import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonSchema } from "@/lib/tambo/schemas/data-display-schemas";

type SkeletonProps = z.infer<typeof SkeletonSchema>;

export function TamboSkeleton({ width, height, className }: SkeletonProps) {
  return (
    <Skeleton
      className={className}
      style={{
        width: width ?? "100%",
        height: height ?? "20px",
      }}
    />
  );
}
