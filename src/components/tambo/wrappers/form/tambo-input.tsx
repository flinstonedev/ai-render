"use client";

import { useId } from "react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputSchema } from "@/lib/tambo/schemas/form-schemas";

type InputProps = z.infer<typeof InputSchema>;

export function TamboInput({ placeholder, type, label }: InputProps) {
  const id = useId();

  return (
    <div className="grid w-full max-w-sm gap-1.5">
      {label && <Label htmlFor={id}>{label}</Label>}
      <Input id={id} type={type} placeholder={placeholder} />
    </div>
  );
}
