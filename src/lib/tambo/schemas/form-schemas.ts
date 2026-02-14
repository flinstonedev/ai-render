import { z } from "zod";

export const ButtonSchema = z
  .object({
    label: z
      .string()
      .describe("The text label displayed on the button"),
    variant: z
      .enum(["default", "destructive", "outline", "secondary", "ghost", "link"])
      .optional()
      .describe(
        "The visual style variant of the button. 'default' is the primary filled style, 'destructive' is red for dangerous actions, 'outline' has a border with no fill, 'secondary' is a muted alternative, 'ghost' has no background until hovered, 'link' looks like a hyperlink."
      ),
    size: z
      .enum(["default", "sm", "lg", "icon"])
      .optional()
      .describe(
        "The size of the button. 'default' is standard size, 'sm' is compact, 'lg' is larger, 'icon' is a square button sized for an icon."
      ),
  })
  .describe(
    "A button component for triggering actions. Supports multiple visual variants and sizes. Use for form submissions, confirmations, navigation actions, or any interactive trigger."
  );

export const CheckboxSchema = z
  .object({
    label: z
      .string()
      .describe("The text label displayed next to the checkbox"),
    checked: z
      .boolean()
      .optional()
      .describe(
        "Whether the checkbox is initially checked (true) or unchecked (false)"
      ),
    description: z
      .string()
      .optional()
      .describe(
        "Optional helper text displayed below the checkbox label to provide additional context or instructions"
      ),
  })
  .describe(
    "A checkbox input component for toggling a boolean option on or off. Includes a label and optional description text. Use for enabling/disabling settings, accepting terms, or multi-select lists."
  );

export const InputSchema = z
  .object({
    placeholder: z
      .string()
      .optional()
      .describe(
        "Placeholder text displayed inside the input when it is empty, providing a hint about expected input"
      ),
    type: z
      .string()
      .optional()
      .describe(
        "The HTML input type attribute (e.g., 'text', 'email', 'password', 'number', 'url', 'tel', 'search')"
      ),
    label: z
      .string()
      .optional()
      .describe(
        "Optional label text displayed above the input field to describe its purpose"
      ),
  })
  .describe(
    "A text input field component for collecting user text input. Supports various HTML input types. Use for forms, search bars, login fields, and any single-line text entry."
  );

export const InputOTPSchema = z
  .object({
    length: z
      .number()
      .describe(
        "The number of OTP digit slots to render (e.g., 4 for a 4-digit code, 6 for a 6-digit code)"
      ),
  })
  .describe(
    "A one-time password input component that renders individual digit slots for entering verification codes. Commonly used for two-factor authentication, email verification, and phone number confirmation flows."
  );

export const LabelSchema = z
  .object({
    text: z.string().describe("The label text content to display"),
    htmlFor: z
      .string()
      .optional()
      .describe(
        "The ID of the form element this label is associated with, enabling click-to-focus behavior and accessibility"
      ),
  })
  .describe(
    "A form label component that provides accessible text labels for form inputs. Associates with inputs via the htmlFor attribute for improved usability and accessibility."
  );

export const RadioGroupSchema = z
  .object({
    options: z
      .array(
        z.object({
          label: z
            .string()
            .describe("The visible text label for this radio option"),
          value: z
            .string()
            .describe(
              "The unique value submitted when this radio option is selected"
            ),
        })
      )
      .describe(
        "Array of radio button options. Only one option can be selected at a time."
      ),
    defaultValue: z
      .string()
      .optional()
      .describe(
        "The value of the radio option that should be selected by default when the component first renders"
      ),
  })
  .describe(
    "A radio button group component for selecting exactly one option from a list of mutually exclusive choices. Use for settings, preferences, or any single-choice selection."
  );

export const SelectSchema = z
  .object({
    options: z
      .array(
        z.object({
          label: z
            .string()
            .describe("The visible text displayed for this option in the dropdown"),
          value: z
            .string()
            .describe(
              "The underlying value submitted when this option is selected"
            ),
        })
      )
      .describe("Array of selectable options in the dropdown list"),
    placeholder: z
      .string()
      .optional()
      .describe(
        "Placeholder text shown when no option is selected, guiding the user to make a selection"
      ),
  })
  .describe(
    "A dropdown select component for choosing a single option from a list. Displays a dropdown menu with options when clicked. Use for forms where users need to pick from predefined choices."
  );

export const SliderSchema = z
  .object({
    min: z
      .number()
      .optional()
      .describe("The minimum value of the slider range (default is 0)"),
    max: z
      .number()
      .optional()
      .describe("The maximum value of the slider range (default is 100)"),
    step: z
      .number()
      .optional()
      .describe(
        "The step increment between allowed values on the slider (e.g., 1 for integers, 0.1 for decimals)"
      ),
    defaultValue: z
      .array(z.number())
      .optional()
      .describe(
        "The initial value(s) of the slider as an array of numbers. A single-element array creates a single thumb, multiple elements create a range slider."
      ),
  })
  .describe(
    "A slider input component for selecting a numeric value or range within a defined minimum and maximum. Supports single-thumb and range selection. Use for volume controls, price ranges, or any numeric range input."
  );

export const SwitchSchema = z
  .object({
    label: z
      .string()
      .describe("The text label displayed next to the switch toggle"),
    checked: z
      .boolean()
      .optional()
      .describe(
        "Whether the switch is initially toggled on (true) or off (false)"
      ),
  })
  .describe(
    "A toggle switch component for binary on/off settings. Visually distinct from a checkbox - renders as a sliding toggle. Use for enabling/disabling features, settings, or preferences."
  );

export const TextareaSchema = z
  .object({
    placeholder: z
      .string()
      .optional()
      .describe(
        "Placeholder text displayed inside the textarea when it is empty"
      ),
    rows: z
      .number()
      .optional()
      .describe(
        "The number of visible text rows (height) of the textarea. Controls the initial visible height."
      ),
  })
  .describe(
    "A multi-line text input component for longer text content. Use for comments, descriptions, messages, or any input requiring multiple lines of text."
  );

export const ToggleSchema = z
  .object({
    label: z
      .string()
      .describe("The text or icon label displayed on the toggle button"),
    pressed: z
      .boolean()
      .optional()
      .describe(
        "Whether the toggle is initially in the pressed/active state (true) or unpressed (false)"
      ),
  })
  .describe(
    "A toggle button component that can be switched between pressed and unpressed states. Unlike a checkbox, it looks like a button that stays pressed. Use for toolbar actions like bold, italic, or view mode toggles."
  );

export const ToggleGroupSchema = z
  .object({
    items: z
      .array(
        z.object({
          label: z
            .string()
            .describe("The visible text or icon label for this toggle item"),
          value: z
            .string()
            .describe(
              "The unique value associated with this toggle item"
            ),
        })
      )
      .describe("Array of toggle items that form the group"),
    type: z
      .enum(["single", "multiple"])
      .optional()
      .describe(
        "The selection mode. 'single' allows only one item to be active at a time (like radio buttons), 'multiple' allows several items to be active simultaneously (like checkboxes)."
      ),
  })
  .describe(
    "A group of toggle buttons where one or more can be active at a time. Use for toolbar groups, view mode selectors, or filter toggles where options are visually presented as a button group."
  );
