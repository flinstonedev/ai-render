import { z } from "zod";

export const AlertDialogSchema = z
  .object({
    title: z
      .string()
      .describe(
        "The heading text of the alert dialog, clearly stating the action or decision required"
      ),
    description: z
      .string()
      .describe(
        "Detailed description text explaining the consequences or providing context for the user's decision"
      ),
    confirmLabel: z
      .string()
      .optional()
      .describe(
        "The text label for the confirm/action button (e.g., 'Delete', 'Continue', 'Yes'). Defaults to 'Continue' if not specified."
      ),
    cancelLabel: z
      .string()
      .optional()
      .describe(
        "The text label for the cancel button (e.g., 'Cancel', 'No', 'Go Back'). Defaults to 'Cancel' if not specified."
      ),
  })
  .describe(
    "An alert dialog component that interrupts the user with an important message requiring confirmation. Displays a modal with a title, description, and confirm/cancel buttons. Use for destructive actions, irreversible operations, or critical confirmations."
  );

export const CommandSchema = z
  .object({
    placeholder: z
      .string()
      .optional()
      .describe(
        "Placeholder text in the command palette search input (e.g., 'Type a command or search...')"
      ),
    groups: z
      .array(
        z.object({
          heading: z
            .string()
            .describe(
              "The section heading text displayed above this group of command items"
            ),
          items: z
            .array(
              z.object({
                label: z
                  .string()
                  .describe("The text label for this command item"),
                shortcut: z
                  .string()
                  .optional()
                  .describe(
                    "Optional keyboard shortcut hint displayed next to the command (e.g., '⌘K')"
                  ),
              })
            )
            .describe("Array of command items within this group"),
        })
      )
      .describe(
        "Array of command groups, each with a heading and list of command items. Groups visually separate related commands."
      ),
  })
  .describe(
    "A command palette component (cmdk) with a search input and grouped command items. Provides a keyboard-driven interface for searching and executing commands. Use for command palettes, spotlight search, or quick action menus."
  );

export const ContextMenuSchema = z
  .object({
    trigger: z
      .string()
      .describe(
        "The text or content that the user right-clicks on to open the context menu"
      ),
    items: z
      .array(
        z.object({
          label: z
            .string()
            .describe("The text label for this context menu item"),
        })
      )
      .describe("Array of menu items shown in the right-click context menu"),
  })
  .describe(
    "A context menu component that appears when the user right-clicks on the trigger element. Displays a list of contextual actions. Use for providing right-click menus with actions relevant to the clicked element."
  );

export const DialogSchema = z
  .object({
    title: z
      .string()
      .describe("The heading text displayed at the top of the dialog"),
    description: z
      .string()
      .optional()
      .describe(
        "Optional description text below the dialog title providing additional context"
      ),
    content: z
      .string()
      .describe(
        "The main body content of the dialog, which can include forms, text, or other information"
      ),
  })
  .describe(
    "A dialog (modal) component that overlays the page to present content requiring user attention or interaction. Includes a title, optional description, and content area. Use for forms, detailed information, or workflows that need focused user attention."
  );

export const DrawerSchema = z
  .object({
    title: z
      .string()
      .describe("The heading text displayed at the top of the drawer"),
    description: z
      .string()
      .optional()
      .describe(
        "Optional description text below the drawer title providing additional context"
      ),
    content: z
      .string()
      .describe(
        "The main body content of the drawer panel"
      ),
  })
  .describe(
    "A drawer component that slides in from the edge of the screen (typically bottom on mobile). Provides a panel for additional content or actions without navigating away. Use for mobile-friendly forms, filters, or supplementary content."
  );

export const HoverCardSchema = z
  .object({
    trigger: z
      .string()
      .describe(
        "The text or element that the user hovers over to reveal the hover card"
      ),
    content: z
      .string()
      .describe(
        "The content displayed inside the floating hover card popup"
      ),
  })
  .describe(
    "A hover card component that displays a floating card with rich content when the user hovers over a trigger element. More content-rich than a tooltip. Use for user profile previews, link previews, or detailed information popups."
  );

export const PopoverSchema = z
  .object({
    trigger: z
      .string()
      .describe(
        "The text or label of the element that opens the popover when clicked"
      ),
    content: z
      .string()
      .describe(
        "The content displayed inside the floating popover panel"
      ),
  })
  .describe(
    "A popover component that displays floating content anchored to a trigger element when clicked. Unlike tooltips (hover-triggered), popovers are click-triggered and can contain interactive content. Use for settings panels, color pickers, or additional form fields."
  );

export const SheetSchema = z
  .object({
    title: z
      .string()
      .describe("The heading text displayed at the top of the sheet panel"),
    description: z
      .string()
      .optional()
      .describe(
        "Optional description text below the sheet title providing additional context"
      ),
    content: z
      .string()
      .describe("The main body content displayed inside the sheet panel"),
    side: z
      .enum(["top", "right", "bottom", "left"])
      .optional()
      .describe(
        "The edge of the screen from which the sheet slides in. 'right' is the default. Use 'left' for navigation panels, 'bottom' for mobile actions, 'top' for announcements."
      ),
  })
  .describe(
    "A sheet component that slides in from an edge of the screen as an overlay panel. Similar to a dialog but slides from a specific side. Use for navigation menus, settings panels, shopping carts, or supplementary content."
  );
