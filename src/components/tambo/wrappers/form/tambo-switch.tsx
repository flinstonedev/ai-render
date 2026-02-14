"use client";

import { useId } from "react";
import { z } from "zod";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { SwitchSchema } from "@/lib/tambo/schemas/form-schemas";

type SwitchProps = z.infer<typeof SwitchSchema>;

export function TamboSwitch({ label, checked }: SwitchProps) {
  const id = useId();

  return (
    <div className="flex items-center space-x-2">
      <Switch id={id} defaultChecked={checked} />
      <Label htmlFor={id}>{label}</Label>
    </div>
  );
}
