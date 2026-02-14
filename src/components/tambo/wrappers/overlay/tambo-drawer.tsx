"use client";

import { z } from "zod";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { DrawerSchema } from "@/lib/tambo/schemas/overlay-schemas";

type DrawerProps = z.infer<typeof DrawerSchema>;

export function TamboDrawer({ title, description, content }: DrawerProps) {
  return (
    <Drawer open>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          {description && (
            <DrawerDescription>{description}</DrawerDescription>
          )}
        </DrawerHeader>
        <div className="p-4">
          <p className="text-sm">{content}</p>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
