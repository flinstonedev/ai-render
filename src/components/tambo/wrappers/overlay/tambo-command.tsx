"use client";

import { z } from "zod";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
} from "@/components/ui/command";
import { CommandSchema } from "@/lib/tambo/schemas/overlay-schemas";

type CommandProps = z.infer<typeof CommandSchema>;

export function TamboCommand({ placeholder, groups }: CommandProps) {
  return (
    <Command>
      <CommandInput placeholder={placeholder ?? "Type a command or search..."} />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {groups.map((group, i) => (
          <CommandGroup key={i} heading={group.heading}>
            {group.items.map((item, j) => (
              <CommandItem key={j}>
                <span>{item.label}</span>
                {item.shortcut && (
                  <CommandShortcut>{item.shortcut}</CommandShortcut>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </Command>
  );
}
