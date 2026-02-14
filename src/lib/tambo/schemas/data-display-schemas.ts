import { z } from "zod";

export const AvatarSchema = z
  .object({
    src: z
      .string()
      .optional()
      .describe(
        "The URL of the avatar image. If not provided or the image fails to load, the fallback text is displayed instead."
      ),
    alt: z
      .string()
      .describe(
        "Accessible alt text describing the avatar image for screen readers"
      ),
    fallback: z
      .string()
      .describe(
        "Fallback text displayed when no image is provided or the image fails to load, typically initials (e.g., 'JD' for John Doe)"
      ),
  })
  .describe(
    "An avatar component that displays a user's profile image with a text fallback. Commonly used in user profiles, comment sections, and navigation bars to represent users visually."
  );

export const BadgeSchema = z
  .object({
    text: z
      .string()
      .describe("The text content displayed inside the badge"),
    variant: z
      .enum(["default", "secondary", "destructive", "outline"])
      .optional()
      .describe(
        "The visual style variant of the badge. 'default' uses the primary color, 'secondary' uses a muted style, 'destructive' indicates errors or warnings in red, 'outline' shows a bordered style."
      ),
  })
  .describe(
    "A small badge component for displaying status labels, tags, or counts. Useful for indicating status, categories, notification counts, or labeling items."
  );

export const CalendarSchema = z
  .object({
    mode: z
      .enum(["single", "range", "multiple"])
      .optional()
      .describe(
        "The date selection mode. 'single' allows selecting one date, 'range' allows selecting a start and end date, 'multiple' allows selecting multiple individual dates."
      ),
  })
  .describe(
    "A calendar component for displaying and selecting dates. Supports single date selection, date range selection, and multiple date selection modes. Useful for date pickers, scheduling interfaces, and booking systems."
  );

export const DataTableSchema = z
  .object({
    columns: z
      .array(z.string())
      .describe(
        "Array of column header strings displayed in the table header row. Example: ['Name', 'Code', 'Emoji']"
      ),
    rows: z
      .array(z.array(z.string()))
      .describe(
        "2D array of string cell values. Each inner array is one row, with values positionally aligned to the columns array. Example: if columns are ['Name', 'Age'], rows should be [['Alice', '30'], ['Bob', '25']]."
      ),
    caption: z
      .string()
      .optional()
      .describe(
        "Optional caption text displayed below the table to describe its contents for accessibility and context"
      ),
  })
  .describe(
    "A data table component with dynamic columns and rows. Each row's values must be in the same order as the columns. Ideal for displaying structured datasets and tabular information from GraphQL queries. Prefer this over Table for larger datasets."
  );

export const TableSchema = z
  .object({
    headers: z
      .array(z.string())
      .describe(
        "Array of column header strings displayed in the table header row"
      ),
    rows: z
      .array(z.array(z.string()))
      .describe(
        "A 2D array of strings representing table rows and cells. Each inner array is one row, with each string being a cell value."
      ),
    caption: z
      .string()
      .optional()
      .describe(
        "Optional caption text displayed below the table to describe its contents"
      ),
  })
  .describe(
    "A simple table component for displaying data in rows and columns. Uses string arrays for headers and cell values. Best for static, straightforward tabular data presentation."
  );

export const TypographySchema = z
  .object({
    text: z.string().describe("The text content to render"),
    variant: z
      .enum(["h1", "h2", "h3", "h4", "p", "lead", "large", "small", "muted"])
      .optional()
      .describe(
        "The typographic style variant. 'h1'-'h4' are heading levels, 'p' is a standard paragraph, 'lead' is a larger introductory paragraph, 'large' is emphasized text, 'small' is smaller text, 'muted' is de-emphasized gray text."
      ),
  })
  .describe(
    "A typography component for rendering styled text with semantic HTML elements. Supports headings, paragraphs, and various text styles for consistent typographic hierarchy."
  );

export const SkeletonSchema = z
  .object({
    width: z
      .string()
      .optional()
      .describe(
        "The width of the skeleton placeholder (e.g., '100px', '50%', '100%'). Defaults to full width if not specified."
      ),
    height: z
      .string()
      .optional()
      .describe(
        "The height of the skeleton placeholder (e.g., '20px', '2rem'). Defines how tall the loading placeholder appears."
      ),
    className: z
      .string()
      .optional()
      .describe(
        "Optional CSS class name(s) for additional styling such as border-radius for circular skeletons"
      ),
  })
  .describe(
    "A skeleton loading placeholder component that displays an animated pulsing shape. Used to indicate content is loading and to prevent layout shifts. Commonly used as a placeholder for text, images, or cards."
  );

export const KbdSchema = z
  .object({
    keys: z
      .array(z.string())
      .describe(
        "Array of keyboard key labels to display (e.g., ['Ctrl', 'C'] or ['⌘', 'K']). Each key is rendered as a separate keyboard key element."
      ),
  })
  .describe(
    "A keyboard key indicator component that visually represents keyboard shortcuts or key combinations. Renders each key in a styled inline element resembling a physical keyboard key."
  );
