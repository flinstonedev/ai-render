"use client";

import { useId } from "react";
import { z } from "zod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { RadioGroupSchema } from "@/lib/tambo/schemas/form-schemas";

type RadioGroupProps = z.infer<typeof RadioGroupSchema>;

export function TamboRadioGroup({ options, defaultValue }: RadioGroupProps) {
  const groupId = useId();

  return (
    <RadioGroup defaultValue={defaultValue}>
      {options.map((option) => {
        const itemId = `${groupId}-${option.value}`;
        return (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem value={option.value} id={itemId} />
            <Label htmlFor={itemId}>{option.label}</Label>
          </div>
        );
      })}
    </RadioGroup>
  );
}
