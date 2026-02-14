"use client";

import { useId } from "react";
import { z } from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CheckboxSchema } from "@/lib/tambo/schemas/form-schemas";

type CheckboxProps = z.infer<typeof CheckboxSchema>;

export function TamboCheckbox({ label, checked, description }: CheckboxProps) {
  const id = useId();

  return (
    <div className="flex items-start space-x-2">
      <Checkbox id={id} defaultChecked={checked} />
      <div className="grid gap-1.5 leading-none">
        <Label htmlFor={id}>{label}</Label>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
}
