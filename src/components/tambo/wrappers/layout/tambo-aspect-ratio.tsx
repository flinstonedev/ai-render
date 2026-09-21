"use client";

import { z } from "zod";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { AspectRatioSchema } from "@/lib/tambo/schemas/layout-schemas";

type AspectRatioProps = z.infer<typeof AspectRatioSchema>;

export function TamboAspectRatio({ ratio, content }: AspectRatioProps) {
  return (
    <AspectRatio ratio={ratio}>
      <div className="flex h-full w-full items-center justify-center rounded-md bg-muted">
        {content && <p>{content}</p>}
      </div>
    </AspectRatio>
  );
}
