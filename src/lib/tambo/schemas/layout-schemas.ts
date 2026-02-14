import { z } from "zod";

export const AccordionSchema = z
  .object({
    items: z
      .array(
        z.object({
          trigger: z
            .string()
            .describe(
              "The clickable header text that toggles the accordion item open or closed"
            ),
          content: z
            .string()
            .describe(
              "The collapsible body content revealed when the accordion item is expanded"
            ),
        })
      )
      .describe("Array of accordion items, each with a trigger header and collapsible content"),
  })
  .describe(
    "An accordion component that displays a list of collapsible sections. Each section has a trigger that can be clicked to reveal or hide its content. Useful for FAQs, grouped settings, or any content that benefits from progressive disclosure."
  );

export const AspectRatioSchema = z
  .object({
    ratio: z
      .number()
      .describe(
        "The desired width-to-height ratio expressed as a decimal number (e.g., 16/9 = 1.778, 4/3 = 1.333, 1/1 = 1)"
      ),
    content: z
      .string()
      .optional()
      .describe(
        "Optional content to render inside the aspect ratio container, such as text or a description of the media"
      ),
  })
  .describe(
    "A container that maintains a specific width-to-height aspect ratio for its content. Commonly used for images, videos, or embedded media to prevent layout shifts during loading."
  );

export const CardSchema = z
  .object({
    title: z
      .string()
      .describe("The card title displayed prominently at the top"),
    description: z
      .string()
      .optional()
      .describe("Subtitle text displayed below the title for additional context"),
    content: z
      .union([z.string(), z.array(z.string())])
      .describe(
        "Main card body content - can be a single string or an array of paragraphs for multi-section content"
      ),
    footer: z
      .string()
      .optional()
      .describe(
        "Footer text displayed at the bottom of the card, often used for actions or metadata"
      ),
  })
  .describe(
    "A card component for displaying grouped content with an optional title, description, and footer. Great for showing summaries, details, or grouped information."
  );

export const CarouselSchema = z
  .object({
    items: z
      .array(z.string())
      .describe(
        "Array of content strings for each slide in the carousel. Each string represents one carousel slide."
      ),
    orientation: z
      .enum(["horizontal", "vertical"])
      .optional()
      .describe(
        "The scroll direction of the carousel. 'horizontal' scrolls left/right (default), 'vertical' scrolls up/down."
      ),
  })
  .describe(
    "A carousel component that displays a set of slides users can navigate through. Supports horizontal and vertical orientations. Ideal for image galleries, testimonials, or any sequential content."
  );

export const CollapsibleSchema = z
  .object({
    trigger: z
      .string()
      .describe(
        "The clickable text or label that toggles the collapsible section open or closed"
      ),
    content: z
      .string()
      .describe(
        "The content that is shown or hidden when the collapsible is toggled"
      ),
  })
  .describe(
    "A collapsible component that can be toggled open and closed. Simpler than an accordion - contains a single trigger and content section. Useful for hiding optional or supplementary information."
  );

export const ResizableSchema = z
  .object({
    panels: z
      .array(
        z.object({
          content: z
            .string()
            .describe("The content displayed inside this resizable panel"),
          defaultSize: z
            .number()
            .describe(
              "The default size of this panel as a percentage of the total container (e.g., 50 for 50%)"
            ),
        })
      )
      .describe(
        "Array of resizable panels. Each panel has content and a default size as a percentage. Panel sizes should add up to 100."
      ),
  })
  .describe(
    "A resizable panel layout that allows users to drag dividers between panels to resize them. Useful for split views, code editors, or any layout requiring user-adjustable regions."
  );

export const ScrollAreaSchema = z
  .object({
    content: z
      .string()
      .describe("The scrollable content displayed inside the scroll area"),
    className: z
      .string()
      .optional()
      .describe(
        "Optional CSS class name(s) to apply to the scroll area container for custom styling"
      ),
    height: z
      .string()
      .optional()
      .describe(
        "Optional fixed height for the scroll area (e.g., '200px', '50vh'). Content exceeding this height becomes scrollable."
      ),
  })
  .describe(
    "A scroll area component that provides custom-styled scrollbars for overflowing content. Useful when you need a fixed-height container with scrollable content and consistent cross-browser scrollbar styling."
  );

export const SeparatorSchema = z
  .object({
    orientation: z
      .enum(["horizontal", "vertical"])
      .optional()
      .describe(
        "The direction of the separator line. 'horizontal' creates a horizontal rule (default), 'vertical' creates a vertical divider."
      ),
    decorative: z
      .boolean()
      .optional()
      .describe(
        "When true, the separator is purely visual and hidden from screen readers. When false (default), it is semantically meaningful as a content divider."
      ),
  })
  .describe(
    "A visual separator line used to divide content sections. Can be horizontal or vertical. Use between groups of related content to improve visual hierarchy."
  );

export const TabsSchema = z
  .object({
    tabs: z
      .array(
        z.object({
          label: z
            .string()
            .describe("The visible text shown on the tab button"),
          value: z
            .string()
            .describe(
              "The unique identifier value for this tab, used to track which tab is active"
            ),
          content: z
            .string()
            .describe(
              "The content displayed in the tab panel when this tab is selected"
            ),
        })
      )
      .describe("Array of tab definitions, each with a label, unique value, and panel content"),
    defaultValue: z
      .string()
      .optional()
      .describe(
        "The value of the tab that should be selected by default when the component first renders"
      ),
  })
  .describe(
    "A tabbed interface component that allows users to switch between different views or sections of content. Each tab has a label and associated content panel. Ideal for organizing related content into switchable sections."
  );
