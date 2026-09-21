"use client";

import { z } from "zod";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertSchema } from "@/lib/tambo/schemas/feedback-schemas";

type AlertProps = z.infer<typeof AlertSchema>;

export function TamboAlert({ title, description, variant }: AlertProps) {
  return (
    <Alert variant={variant}>
      <AlertTitle>{title}</AlertTitle>
      {description && <AlertDescription>{description}</AlertDescription>}
    </Alert>
  );
}
