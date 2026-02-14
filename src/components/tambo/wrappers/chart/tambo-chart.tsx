"use client";

import { z } from "zod";
import { ChartSchema } from "@/lib/tambo/schemas/chart-schemas";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

type ChartProps = z.infer<typeof ChartSchema>;

export function TamboChart({
  type,
  data,
  title,
  description,
  dataKeys,
}: ChartProps) {
  const config: ChartConfig = {};
  dataKeys.forEach((dk, i) => {
    config[dk.key] = {
      label: dk.key,
      color: dk.color || `hsl(var(--chart-${i + 1}))`,
    };
  });

  // Transform structured data into the flat format Recharts expects
  const rechartsData = data.map((point) => {
    const entry: Record<string, string | number> = { label: point.label };
    dataKeys.forEach((dk, i) => {
      entry[dk.key] = point.values[i] ?? 0;
    });
    return entry;
  });

  const renderChart = () => {
    switch (type) {
      case "bar":
        return (
          <BarChart data={rechartsData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="label" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            {dataKeys.map((dk) => (
              <Bar
                key={dk.key}
                dataKey={dk.key}
                fill={`var(--color-${dk.key})`}
                radius={4}
              />
            ))}
          </BarChart>
        );
      case "line":
        return (
          <LineChart data={rechartsData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="label" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            {dataKeys.map((dk) => (
              <Line
                key={dk.key}
                type="monotone"
                dataKey={dk.key}
                stroke={`var(--color-${dk.key})`}
                strokeWidth={2}
              />
            ))}
          </LineChart>
        );
      case "area":
        return (
          <AreaChart data={rechartsData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="label" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            {dataKeys.map((dk) => (
              <Area
                key={dk.key}
                type="monotone"
                dataKey={dk.key}
                fill={`var(--color-${dk.key})`}
                stroke={`var(--color-${dk.key})`}
                fillOpacity={0.3}
              />
            ))}
          </AreaChart>
        );
      case "pie":
        return (
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            {dataKeys.map((dk) => (
              <Pie
                key={dk.key}
                data={rechartsData}
                dataKey={dk.key}
                nameKey="label"
                fill={`var(--color-${dk.key})`}
              />
            ))}
          </PieChart>
        );
      case "radar":
        return (
          <RadarChart data={rechartsData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="label" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            {dataKeys.map((dk) => (
              <Radar
                key={dk.key}
                dataKey={dk.key}
                fill={`var(--color-${dk.key})`}
                fillOpacity={0.5}
                stroke={`var(--color-${dk.key})`}
              />
            ))}
          </RadarChart>
        );
    }
  };

  return (
    <div>
      {title && <h3 className="text-lg font-semibold">{title}</h3>}
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      <ChartContainer config={config}>{renderChart()}</ChartContainer>
    </div>
  );
}
