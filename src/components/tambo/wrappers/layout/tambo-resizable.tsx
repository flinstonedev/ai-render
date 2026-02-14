"use client";

import { Fragment } from "react";
import { z } from "zod";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { ResizableSchema } from "@/lib/tambo/schemas/layout-schemas";

type ResizableProps = z.infer<typeof ResizableSchema>;

export function TamboResizable({ panels }: ResizableProps) {
  return (
    <ResizablePanelGroup orientation="horizontal">
      {panels.map((panel, index) => (
        <Fragment key={index}>
          {index > 0 && <ResizableHandle />}
          <ResizablePanel defaultSize={panel.defaultSize}>
            <div className="flex h-full items-center justify-center p-4">
              <p>{panel.content}</p>
            </div>
          </ResizablePanel>
        </Fragment>
      ))}
    </ResizablePanelGroup>
  );
}
