"use client";

import { z } from "zod";
import { Button } from "@/components/ui/button";
import { ButtonSchema } from "@/lib/tambo/schemas/form-schemas";

type ButtonProps = z.infer<typeof ButtonSchema>;

export function TamboButton({ label, variant, size }: ButtonProps) {
  return (
    <Button variant={variant} size={size}>
      {label}
    </Button>
  );
}
