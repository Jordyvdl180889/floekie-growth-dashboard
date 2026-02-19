"use client";

import { FUNNEL_LAYER_LABELS } from "@/types";

const layerStyles: Record<number, string> = {
  1: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  2: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  3: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
};

export function FunnelLayerBadge({ layer }: { layer: number | null }) {
  if (!layer) return null;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${layerStyles[layer] || "bg-gray-100 text-gray-700"}`}
    >
      L{layer}: {FUNNEL_LAYER_LABELS[layer] || `Laag ${layer}`}
    </span>
  );
}
