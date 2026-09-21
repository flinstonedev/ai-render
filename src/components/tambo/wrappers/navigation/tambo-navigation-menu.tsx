"use client";

import { z } from "zod";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import { NavigationMenuSchema } from "@/lib/tambo/schemas/navigation-schemas";

type NavigationMenuProps = z.infer<typeof NavigationMenuSchema>;

export function TamboNavigationMenu({ items }: NavigationMenuProps) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {items.map((item, i) => (
          <NavigationMenuItem key={i}>
            <NavigationMenuTrigger>{item.trigger}</NavigationMenuTrigger>
            <NavigationMenuContent>
              <p className="p-4 text-sm">{item.content}</p>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
