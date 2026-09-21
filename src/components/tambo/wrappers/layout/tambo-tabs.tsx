"use client";

import { z } from "zod";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { TabsSchema } from "@/lib/tambo/schemas/layout-schemas";

type TabsProps = z.infer<typeof TabsSchema>;

export function TamboTabs({ tabs, defaultValue }: TabsProps) {
  return (
    <Tabs defaultValue={defaultValue ?? tabs[0]?.value}>
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          <p>{tab.content}</p>
        </TabsContent>
      ))}
    </Tabs>
  );
}
