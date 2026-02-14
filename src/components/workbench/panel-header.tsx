"use client";

interface PanelHeaderProps {
  title: string;
  children?: React.ReactNode;
}

export function PanelHeader({ title, children }: PanelHeaderProps) {
  return (
    <div className="flex h-10 items-center justify-between border-b bg-muted/50 px-3">
      <span className="text-sm font-medium">{title}</span>
      {children && <div className="flex items-center gap-1">{children}</div>}
    </div>
  );
}
