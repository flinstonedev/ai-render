"use client";

import dynamic from "next/dynamic";

const WorkbenchLayout = dynamic(
  () =>
    import("@/components/workbench/workbench-layout").then(
      (mod) => mod.WorkbenchLayout
    ),
  { ssr: false }
);

export default function Home() {
  return <WorkbenchLayout />;
}
