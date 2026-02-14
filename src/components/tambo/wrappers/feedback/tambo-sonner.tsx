"use client";

import { useEffect } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { SonnerSchema } from "@/lib/tambo/schemas/feedback-schemas";

type SonnerProps = z.infer<typeof SonnerSchema>;

export function TamboSonner({ title, description }: SonnerProps) {
  useEffect(() => {
    toast(title, { description });
  }, [title, description]);

  return null;
}
