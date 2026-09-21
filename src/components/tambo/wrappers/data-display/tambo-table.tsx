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
import { TableSchema } from "@/lib/tambo/schemas/data-display-schemas";

type TableProps = z.infer<typeof TableSchema>;

export function TamboTable({ headers, rows, caption }: TableProps) {
  const safeHeaders = Array.isArray(headers) ? headers : [];
  const safeRows = Array.isArray(rows) ? rows : [];

  if (safeHeaders.length === 0) {
    return <p className="text-sm text-muted-foreground">No data to display</p>;
  }

  return (
    <Table>
      {caption && <TableCaption>{caption}</TableCaption>}
      <TableHeader>
        <TableRow>
          {safeHeaders.map((header, index) => (
            <TableHead key={index}>{String(header)}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {safeRows.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            {(Array.isArray(row) ? row : []).map((cell, cellIndex) => (
              <TableCell key={cellIndex}>{String(cell ?? "")}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
