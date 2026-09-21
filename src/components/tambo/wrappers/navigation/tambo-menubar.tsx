"use client";

import { z } from "zod";
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarShortcut,
} from "@/components/ui/menubar";
import { MenubarSchema } from "@/lib/tambo/schemas/navigation-schemas";

type MenubarProps = z.infer<typeof MenubarSchema>;

export function TamboMenubar({ menus }: MenubarProps) {
  return (
    <Menubar>
      {menus.map((menu, i) => (
        <MenubarMenu key={i}>
          <MenubarTrigger>{menu.trigger}</MenubarTrigger>
          <MenubarContent>
            {menu.items.map((item, j) => (
              <MenubarItem key={j}>
                {item.label}
                {item.shortcut && (
                  <MenubarShortcut>{item.shortcut}</MenubarShortcut>
                )}
              </MenubarItem>
            ))}
          </MenubarContent>
        </MenubarMenu>
      ))}
    </Menubar>
  );
}
