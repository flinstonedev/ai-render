"use client";

import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { DialogSchema } from "@/lib/tambo/schemas/overlay-schemas";

type DialogProps = z.infer<typeof DialogSchema>;

export function TamboDialog({ title, description, content }: DialogProps) {
  return (
    <Dialog defaultOpen>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && (
            <DialogDescription>{description}</DialogDescription>
          )}
        </DialogHeader>
        <p className="text-sm">{content}</p>
      </DialogContent>
    </Dialog>
  );
}
