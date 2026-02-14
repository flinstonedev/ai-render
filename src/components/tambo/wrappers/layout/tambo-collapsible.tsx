"use client";

import { z } from "zod";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { CollapsibleSchema } from "@/lib/tambo/schemas/layout-schemas";

type CollapsibleProps = z.infer<typeof CollapsibleSchema>;

export function TamboCollapsible({ trigger, content }: CollapsibleProps) {
  return (
    <Collapsible>
      <CollapsibleTrigger asChild>
        <Button variant="ghost">{trigger}</Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <p className="px-4 py-2">{content}</p>
      </CollapsibleContent>
    </Collapsible>
  );
}
