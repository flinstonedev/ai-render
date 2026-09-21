import { z } from "zod";

export const ChartSchema = z
  .object({
    type: z
      .enum(["bar", "line", "pie", "area", "radar"])
      .describe(
        "The type of chart to render. 'bar' for bar/column charts, 'line' for line charts, 'pie' for pie/donut charts, 'area' for filled area charts, 'radar' for radar/spider charts."
      ),
    data: z
      .array(
        z.object({
          label: z.string().describe("The category label or x-axis value for this data point (e.g., 'January', 'Product A')"),
          values: z.array(z.number()).describe("Numeric values for this data point, one per dataKey in the same order as the dataKeys array"),
        })
      )
      .describe(
        "Array of data point objects. Each object has a label (for x-axis) and an array of numeric values corresponding to each dataKey."
      ),
    title: z
      .string()
      .optional()
      .describe(
        "Optional title text displayed above the chart for context and labeling"
      ),
    description: z
      .string()
      .optional()
      .describe(
        "Optional description text displayed below the title to provide additional context about the data"
      ),
    xAxisKey: z
      .string()
      .optional()
      .describe(
        "The key in each data object used for the x-axis labels or categories (e.g., 'month', 'date', 'category')"
      ),
    dataKeys: z
      .array(
        z.object({
          key: z
            .string()
            .describe(
              "The key in each data object that maps to a data series value (e.g., 'revenue', 'users', 'sales')"
            ),
          color: z
            .string()
            .optional()
            .describe(
              "Optional CSS color for this data series (e.g., '#8884d8', 'hsl(var(--chart-1))', 'blue'). If not provided, a default color from the chart theme is used."
            ),
        })
      )
      .describe(
        "Array of data key configurations defining which fields in the data objects to plot as chart series. Each key maps to a visual series in the chart."
      ),
  })
  .describe(
    "A chart component powered by Recharts for visualizing data. Supports bar, line, pie, area, and radar chart types. Configure data series with dataKeys and map categories with xAxisKey. Use for dashboards, analytics, reports, or any data visualization needs."
  );
