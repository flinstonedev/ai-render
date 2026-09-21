import { z } from "zod";

export const AlertSchema = z
  .object({
    title: z.string().describe("The alert heading text that summarizes the alert message"),
    description: z
      .string()
      .optional()
      .describe(
        "Optional detailed description text displayed below the alert title providing more context or instructions"
      ),
    variant: z
      .enum(["default", "destructive"])
      .optional()
      .describe(
        "The visual style variant. 'default' shows a standard informational alert, 'destructive' shows a red/error-styled alert for warnings or errors."
      ),
  })
  .describe(
    "An alert component for displaying important messages, warnings, or notifications to the user. Supports informational and destructive variants. Use for success messages, error notifications, or important announcements."
  );

export const ProgressSchema = z
  .object({
    value: z
      .number()
      .describe(
        "The current progress value indicating how much has been completed"
      ),
    max: z
      .number()
      .optional()
      .describe(
        "The maximum progress value representing 100% completion (default is 100)"
      ),
  })
  .describe(
    "A progress bar component that visually indicates the completion status of a task or process. Displays a filled bar proportional to the value relative to max. Use for file uploads, loading states, or multi-step processes."
  );

export const TooltipSchema = z
  .object({
    content: z
      .string()
      .describe(
        "The tooltip text displayed in the floating popup when the trigger element is hovered"
      ),
    trigger: z
      .string()
      .describe(
        "The text or element that the user hovers over to reveal the tooltip"
      ),
  })
  .describe(
    "A tooltip component that displays additional information in a floating popup when the user hovers over a trigger element. Use for providing extra context, explanations, or hints without cluttering the UI."
  );

export const SpinnerSchema = z
  .object({
    size: z
      .enum(["sm", "md", "lg"])
      .optional()
      .describe(
        "The size of the spinner. 'sm' is small (16px), 'md' is medium/default (24px), 'lg' is large (32px)."
      ),
  })
  .describe(
    "A loading spinner component that displays an animated circular indicator. Use to indicate that content is loading, a process is running, or an action is being performed."
  );

export const SonnerSchema = z
  .object({
    title: z
      .string()
      .describe("The main title text of the toast notification"),
    description: z
      .string()
      .optional()
      .describe(
        "Optional description text displayed below the toast title for additional detail"
      ),
  })
  .describe(
    "A toast notification component powered by Sonner. Displays brief, non-intrusive messages that appear temporarily. Use for success confirmations, error alerts, or informational messages that auto-dismiss."
  );
