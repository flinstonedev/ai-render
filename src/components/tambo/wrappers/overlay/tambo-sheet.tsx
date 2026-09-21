"use client";

import { z } from "zod";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { SheetSchema } from "@/lib/tambo/schemas/overlay-schemas";

type SheetProps = z.infer<typeof SheetSchema>;

export function TamboSheet({
  title,
  description,
  content,
  side = "right",
}: SheetProps) {
  return (
    <Sheet defaultOpen>
      <SheetContent side={side}>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          {description && (
            <SheetDescription>{description}</SheetDescription>
          )}
        </SheetHeader>
        <div className="p-4">
          <p className="text-sm">{content}</p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
