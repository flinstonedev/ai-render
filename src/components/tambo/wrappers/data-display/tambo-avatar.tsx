"use client";

import { z } from "zod";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { AvatarSchema } from "@/lib/tambo/schemas/data-display-schemas";

type AvatarProps = z.infer<typeof AvatarSchema>;

export function TamboAvatar({ src, alt, fallback }: AvatarProps) {
  return (
    <Avatar>
      {src && <AvatarImage src={src} alt={alt} />}
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  );
}
