"use client";

import { z } from "zod";
import { TypographySchema } from "@/lib/tambo/schemas/data-display-schemas";

type TypographyProps = z.infer<typeof TypographySchema>;

export function TamboTypography({ text, variant = "p" }: TypographyProps) {
  switch (variant) {
    case "h1":
      return (
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          {text}
        </h1>
      );
    case "h2":
      return (
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          {text}
        </h2>
      );
    case "h3":
      return (
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          {text}
        </h3>
      );
    case "h4":
      return (
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          {text}
        </h4>
      );
    case "lead":
      return <p className="text-xl text-muted-foreground">{text}</p>;
    case "large":
      return <p className="text-lg font-semibold">{text}</p>;
    case "small":
      return <small className="text-sm font-medium leading-none">{text}</small>;
    case "muted":
      return <p className="text-sm text-muted-foreground">{text}</p>;
    case "p":
    default:
      return <p className="leading-7">{text}</p>;
  }
}
