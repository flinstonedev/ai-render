import { z } from "zod";

export const BreadcrumbSchema = z
  .object({
    items: z
      .array(
        z.object({
          label: z
            .string()
            .describe("The visible text for this breadcrumb link or item"),
          href: z
            .string()
            .optional()
            .describe(
              "The URL this breadcrumb links to. If omitted, the item is rendered as plain text (typically the current/last page)."
            ),
        })
      )
      .describe(
        "Array of breadcrumb items representing the navigation path from root to current page, in order from left to right"
      ),
  })
  .describe(
    "A breadcrumb navigation component that shows the user's current location within a site hierarchy. Displays a trail of links from the root to the current page. Use for multi-level navigation and helping users understand their location."
  );

export const MenubarSchema = z
  .object({
    menus: z
      .array(
        z.object({
          trigger: z
            .string()
            .describe(
              "The text label for this top-level menu bar item that opens the dropdown"
            ),
          items: z
            .array(
              z.object({
                label: z
                  .string()
                  .describe("The text label for this menu item"),
                shortcut: z
                  .string()
                  .optional()
                  .describe(
                    "Optional keyboard shortcut hint displayed next to the menu item (e.g., '⌘T', 'Ctrl+N')"
                  ),
              })
            )
            .describe("Array of menu items shown in the dropdown when this menu is opened"),
        })
      )
      .describe(
        "Array of top-level menu definitions, each with a trigger label and a list of dropdown items"
      ),
  })
  .describe(
    "A horizontal menu bar component with dropdown menus, similar to desktop application menus. Each menu has a trigger label and dropdown items with optional keyboard shortcuts. Use for application-level navigation or toolbars."
  );

export const NavigationMenuSchema = z
  .object({
    items: z
      .array(
        z.object({
          trigger: z
            .string()
            .describe(
              "The clickable text label that opens the navigation menu dropdown or content panel"
            ),
          content: z
            .string()
            .describe(
              "The content displayed when this navigation item is activated, typically links or descriptions"
            ),
        })
      )
      .describe("Array of navigation menu items, each with a trigger and expandable content"),
  })
  .describe(
    "A navigation menu component for site-wide navigation with expandable content panels. Each item has a trigger that reveals detailed navigation content. Use for top-level website navigation with grouped links and descriptions."
  );

export const PaginationSchema = z
  .object({
    currentPage: z
      .number()
      .describe(
        "The currently active page number (1-indexed). This page will be visually highlighted in the pagination controls."
      ),
    totalPages: z
      .number()
      .describe(
        "The total number of pages available. Determines how many page buttons to show and whether next/previous buttons are enabled."
      ),
  })
  .describe(
    "A pagination component for navigating between pages of content. Displays page numbers and previous/next navigation buttons. Use for paginated lists, search results, or any content split across multiple pages."
  );

export const DropdownMenuSchema = z
  .object({
    trigger: z
      .string()
      .describe(
        "The text or label of the button that opens the dropdown menu when clicked"
      ),
    items: z
      .array(
        z.object({
          label: z
            .string()
            .describe("The text label for this dropdown menu item"),
          shortcut: z
            .string()
            .optional()
            .describe(
              "Optional keyboard shortcut hint displayed alongside the menu item (e.g., '⌘K', 'Ctrl+S')"
            ),
        })
      )
      .describe("Array of items displayed in the dropdown menu when opened"),
  })
  .describe(
    "A dropdown menu component that displays a list of actions or options when a trigger button is clicked. Each item can have an optional keyboard shortcut hint. Use for action menus, context-sensitive options, or user account menus."
  );
