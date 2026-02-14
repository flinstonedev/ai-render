"use client";

import { z } from "zod";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import { DataTableSchema } from "@/lib/tambo/schemas/data-display-schemas";

type DataTableProps = z.infer<typeof DataTableSchema>;

function extractCells(
  row: string[] | Record<string, unknown>,
  columns: string[]
): string[] {
  if (Array.isArray(row)) return row.map((c) => String(c ?? ""));
  if (row && typeof row === "object") {
    const keys = Object.keys(row);
    // AI sends objects with numeric keys like {"0":"AD","1":"Andorra",...}
    const hasNumericKeys = keys.length > 0 && keys.every((k) => /^\d+$/.test(k));
    if (hasNumericKeys) {
      return columns.map((_, idx) => String(row[String(idx)] ?? ""));
    }
    // AI sends objects with column headers as keys
    return columns.map((col) => {
      const key = keys.find(
        (k) => k.toLowerCase() === col.toLowerCase()
      );
      return key ? String(row[key] ?? "") : "";
    });
  }
  return columns.map(() => "");
}

export function TamboDataTable({
  columns,
  rows,
  caption,
}: DataTableProps & { rows?: unknown[] }) {
  const safeColumns = Array.isArray(columns) ? columns : [];
  const safeRows = Array.isArray(rows) ? rows : [];

  if (safeColumns.length === 0) {
    return <p className="text-sm text-muted-foreground">No data to display</p>;
  }

  return (
    <Table>
      {caption && <TableCaption>{caption}</TableCaption>}
      <TableHeader>
        <TableRow>
          {safeColumns.map((header, idx) => (
            <TableHead key={idx}>{String(header)}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {safeRows.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            {extractCells(
              row as string[] | Record<string, unknown>,
              safeColumns
            ).map((cell, cellIndex) => (
              <TableCell key={cellIndex}>{cell}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
