"use client";

import { Badge } from "@/components/ui/badge";

const stageConfig: Record<string, { emoji: string; className: string }> = {
  Acquisition: {
    emoji: "🎯",
    className:
      "bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-900 dark:text-violet-300",
  },
  Activation: {
    emoji: "⚡",
    className:
      "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900 dark:text-amber-300",
  },
  Retention: {
    emoji: "🔄",
    className:
      "bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-900 dark:text-cyan-300",
  },
  Revenue: {
    emoji: "💰",
    className:
      "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900 dark:text-emerald-300",
  },
  Referral: {
    emoji: "📣",
    className:
      "bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900 dark:text-pink-300",
  },
};

export function AARRRBadge({ stage }: { stage: string }) {
  const config = stageConfig[stage] || stageConfig.Acquisition;
  return (
    <Badge variant="outline" className={config.className}>
      {config.emoji} {stage}
    </Badge>
  );
}
