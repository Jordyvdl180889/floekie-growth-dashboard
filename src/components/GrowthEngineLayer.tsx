"use client";

import Link from "next/link";
import { StatusBadge } from "./StatusBadge";
import { FUNNEL_LAYER_LABELS, OFFER_TYPE_LABELS, CHANNEL_LABELS, AUDIENCE_TYPE_LABELS } from "@/types";
import type { ExperimentStatus } from "@/types";

interface ExperimentSummary {
  id: number;
  name: string;
  description: string | null;
  status: string;
  riseTotal: number;
  offerType: string | null;
  channels: string[];
  audienceType: string | null;
  sprint: number | null;
}

interface GrowthEngineLayerProps {
  layer: number;
  slug: string;
  experiments: ExperimentSummary[];
}

const layerGradients: Record<number, string> = {
  1: "from-blue-500 to-indigo-600",
  2: "from-amber-500 to-orange-600",
  3: "from-emerald-500 to-teal-600",
};

export function GrowthEngineLayer({
  layer,
  slug,
  experiments,
}: GrowthEngineLayerProps) {
  const gradient = layerGradients[layer] || "from-gray-500 to-gray-600";

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span
          className={`inline-flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br ${gradient} text-white text-sm font-bold`}
        >
          L{layer}
        </span>
        <div>
          <h2 className="text-lg font-semibold">
            {FUNNEL_LAYER_LABELS[layer]}
          </h2>
          <p className="text-xs text-muted-foreground">
            {experiments.length} experimenten
          </p>
        </div>
      </div>

      <div className="grid gap-3">
        {experiments.map((exp) => (
          <Link
            key={exp.id}
            href={`/${slug}/experiments/${exp.id}`}
            className="group block"
          >
            <div className="rounded-xl border bg-card p-4 transition-all hover:shadow-md hover:-translate-y-0.5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-medium text-sm group-hover:text-primary transition-colors">
                      {exp.name}
                    </h3>
                    <StatusBadge status={exp.status as ExperimentStatus} />
                  </div>
                  {exp.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                      {exp.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-1.5">
                    {exp.channels.map((ch) => (
                      <span key={ch} className="inline-flex items-center rounded-full bg-violet-100 dark:bg-violet-900/30 px-2 py-0.5 text-[10px] font-medium text-violet-700 dark:text-violet-300">
                        {CHANNEL_LABELS[ch] || ch}
                      </span>
                    ))}
                    {exp.offerType && (
                      <span className="inline-flex items-center rounded-full bg-teal-100 dark:bg-teal-900/30 px-2 py-0.5 text-[10px] font-medium text-teal-700 dark:text-teal-300">
                        {OFFER_TYPE_LABELS[exp.offerType] || exp.offerType}
                      </span>
                    )}
                    {exp.audienceType && (
                      <span className="inline-flex items-center rounded-full bg-orange-100 dark:bg-orange-900/30 px-2 py-0.5 text-[10px] font-medium text-orange-700 dark:text-orange-300">
                        {AUDIENCE_TYPE_LABELS[exp.audienceType] || exp.audienceType}
                      </span>
                    )}
                    {exp.sprint && (
                      <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-[10px] font-medium text-gray-600 dark:text-gray-400">
                        Sprint {exp.sprint}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-lg font-bold text-primary">
                    {Number.isInteger(exp.riseTotal) ? exp.riseTotal : exp.riseTotal.toFixed(1)}
                  </div>
                  <div className="text-[10px] text-muted-foreground uppercase">
                    RISE
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {experiments.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-6 border rounded-xl bg-muted/30">
          Geen experimenten in deze laag
        </p>
      )}
    </div>
  );
}
