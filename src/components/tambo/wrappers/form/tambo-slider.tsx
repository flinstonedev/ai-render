"use client";

import { z } from "zod";
import { Slider } from "@/components/ui/slider";
import { SliderSchema } from "@/lib/tambo/schemas/form-schemas";

type SliderProps = z.infer<typeof SliderSchema>;

export function TamboSlider({ min, max, step, defaultValue }: SliderProps) {
  return (
    <Slider
      min={min}
      max={max}
      step={step}
      defaultValue={defaultValue ?? [min ?? 0]}
    />
  );
}
