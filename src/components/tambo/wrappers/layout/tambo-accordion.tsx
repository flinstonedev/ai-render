"use client";

import { z } from "zod";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { AccordionSchema } from "@/lib/tambo/schemas/layout-schemas";

type AccordionProps = z.infer<typeof AccordionSchema>;

export function TamboAccordion({ items }: AccordionProps) {
  return (
    <Accordion type="single" collapsible>
      {items.map((item, index) => (
        <AccordionItem key={index} value={`item-${index}`}>
          <AccordionTrigger>{item.trigger}</AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
