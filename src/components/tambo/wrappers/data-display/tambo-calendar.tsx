"use client";

import { useState } from "react";
import { z } from "zod";
import type { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { CalendarSchema } from "@/lib/tambo/schemas/data-display-schemas";

type CalendarProps = z.infer<typeof CalendarSchema>;

export function TamboCalendar({ mode }: CalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const resolvedMode = mode ?? "single";

  if (resolvedMode === "multiple") {
    return <CalendarMultiple />;
  }

  if (resolvedMode === "range") {
    return <CalendarRange />;
  }

  return (
    <Calendar
      mode="single"
      selected={selectedDate}
      onSelect={setSelectedDate}
    />
  );
}

function CalendarMultiple() {
  const [selectedDates, setSelectedDates] = useState<Date[] | undefined>(
    undefined
  );

  return (
    <Calendar
      mode="multiple"
      selected={selectedDates}
      onSelect={setSelectedDates}
    />
  );
}

function CalendarRange() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    undefined
  );

  return (
    <Calendar mode="range" selected={dateRange} onSelect={setDateRange} />
  );
}
