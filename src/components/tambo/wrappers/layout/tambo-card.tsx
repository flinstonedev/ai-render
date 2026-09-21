"use client";

import { z } from "zod";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { CardSchema } from "@/lib/tambo/schemas/layout-schemas";

type CardProps = z.infer<typeof CardSchema>;

export function TamboCard({ title, description, content, footer }: CardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {Array.isArray(content)
          ? content.map((p, i) => <p key={i}>{p}</p>)
          : <p>{content}</p>}
      </CardContent>
      {footer && (
        <CardFooter>
          <p>{footer}</p>
        </CardFooter>
      )}
    </Card>
  );
}
