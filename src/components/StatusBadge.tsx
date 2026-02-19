"use client";

import { Badge } from "@/components/ui/badge";
import type { ExperimentStatus } from "@/types";

const statusConfig: Record<
  ExperimentStatus,
  { label: string; className: string }
> = {
  planned: {
    label: "Planned",
    className:
      "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300",
  },
  running: {
    label: "Running",
    className:
      "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900 dark:text-emerald-300",
  },
  completed: {
    label: "Completed",
    className:
      "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900 dark:text-blue-300",
  },
  paused: {
    label: "Paused",
    className:
      "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900 dark:text-amber-300",
  },
  stopped: {
    label: "Stopped",
    className:
      "bg-red-100 text-red-700 border-red-200 dark:bg-red-900 dark:text-red-300",
  },
};

export function StatusBadge({ status }: { status: ExperimentStatus }) {
  const config = statusConfig[status] || statusConfig.planned;
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}
