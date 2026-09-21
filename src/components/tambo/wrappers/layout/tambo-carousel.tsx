"use client";

import { z } from "zod";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { CarouselSchema } from "@/lib/tambo/schemas/layout-schemas";

type CarouselProps = z.infer<typeof CarouselSchema>;

export function TamboCarousel({ items, orientation }: CarouselProps) {
  return (
    <Carousel orientation={orientation}>
      <CarouselContent>
        {items.map((item, index) => (
          <CarouselItem key={index}>
            <div className="p-4">
              <p>{item}</p>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
