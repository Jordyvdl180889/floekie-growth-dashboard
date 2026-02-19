"use client";

import { useEffect, useState } from "react";
import { FUNNEL_LAYER_LABELS } from "@/types";
import type { FunnelLayerProjection } from "@/lib/projection-utils";

interface LayerSummary {
  layer: number;
  total: number;
  running: number;
  completed: number;
}

interface GrowthEngineFunnelProps {
  layers: LayerSummary[];
  slug: string;
}

const layerConfig: Record<
  number,
  { gradient: string; bgGradient: string; description: string; audience: string }
> = {
  1: {
    gradient: "from-blue-500 to-indigo-600",
    bgGradient: "from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30",
    description: "Breed bereik genereren met waardevolle content",
    audience: "Cold audiences",
  },
  2: {
    gradient: "from-amber-500 to-orange-600",
    bgGradient: "from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30",
    description: "Engagement en verdieping met warm publiek",
    audience: "Warm retargeting",
  },
  3: {
    gradient: "from-emerald-500 to-teal-600",
    bgGradient: "from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30",
    description: "Kwalificeren en converteren naar meetings",
    audience: "Hot prospects",
  },
};

const PROJECTION_UNIT_LABELS: Record<number, string> = {
  1: "leads/mnd",
  2: "engaged/mnd",
  3: "meetings/mnd",
};

export function GrowthEngineFunnel({ layers, slug }: GrowthEngineFunnelProps) {
  const [projections, setProjections] = useState<FunnelLayerProjection[]>([]);

  useEffect(() => {
    fetch(`/api/clients/${slug}/funnel-projections`)
      .then((res) => (res.ok ? res.json() : []))
      .then(setProjections)
      .catch(() => {});
  }, [slug]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {layers.map(({ layer, total, running, completed }) => {
        const config = layerConfig[layer];
        const layerProj = projections.find((p) => p.layer === layer);
        const hasProjection = layerProj && layerProj.totalLeads.realistic > 0;

        return (
          <div
            key={layer}
            className={`relative rounded-2xl border bg-gradient-to-br ${config.bgGradient} p-5 overflow-hidden`}
          >
            <div
              className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${config.gradient}`}
            />
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br ${config.gradient} text-white text-sm font-bold`}
                >
                  {layer}
                </span>
                <div>
                  <h3 className="font-semibold text-sm">
                    {FUNNEL_LAYER_LABELS[layer]}
                  </h3>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                {config.description}
              </p>
              <div className="flex items-center gap-3 text-xs">
                <span className="font-medium">{total} experimenten</span>
                <span className="text-muted-foreground">|</span>
                <span className="text-emerald-600 dark:text-emerald-400">
                  {running} actief
                </span>
                <span className="text-muted-foreground">|</span>
                <span className="text-blue-600 dark:text-blue-400">
                  {completed} klaar
                </span>
              </div>
              {hasProjection && (
                <div className="rounded-lg bg-white/60 dark:bg-black/20 px-3 py-2">
                  <p className="text-xs text-muted-foreground mb-0.5">Projectie (realistisch)</p>
                  <p className="text-lg font-bold">
                    ~{layerProj.totalLeads.realistic}{" "}
                    <span className="text-xs font-normal text-muted-foreground">
                      {PROJECTION_UNIT_LABELS[layer] || "output/mnd"}
                    </span>
                  </p>
                </div>
              )}
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                {config.audience}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
