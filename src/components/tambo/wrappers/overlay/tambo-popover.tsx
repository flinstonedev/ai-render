"use client";

import { z } from "zod";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { PopoverSchema } from "@/lib/tambo/schemas/overlay-schemas";

type PopoverProps = z.infer<typeof PopoverSchema>;

export function TamboPopover({ trigger, content }: PopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">{trigger}</Button>
      </PopoverTrigger>
      <PopoverContent>
        <p className="text-sm">{content}</p>
      </PopoverContent>
    </Popover>
  );
}
