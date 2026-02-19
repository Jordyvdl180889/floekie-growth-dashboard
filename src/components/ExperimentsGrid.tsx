"use client";

import { useState, useMemo } from "react";
import { ExperimentCard } from "./ExperimentCard";
import { FilterBar } from "./FilterBar";
import { FUNNEL_LAYER_LABELS } from "@/types";

interface Experiment {
  id: number;
  name: string;
  description: string | null;
  tier: number;
  aarrStage: string;
  riseReach: number;
  riseImpact: number;
  riseConfidence: number;
  riseEase: number;
  riseTotal: number;
  status: string;
  sprint: number | null;
  contentType: string | null;
  funnelLayer: number | null;
  offerType: string | null;
  channels: string[];
}

interface ExperimentsGridProps {
  experiments: Experiment[];
  slug: string;
  sprintNumbers: number[];
}

type ViewMode = "funnel" | "grid";

export function ExperimentsGrid({
  experiments,
  slug,
  sprintNumbers,
}: ExperimentsGridProps) {
  const [status, setStatus] = useState("all");
  const [tier, setTier] = useState("all");
  const [aarrStage, setAarrStage] = useState("all");
  const [sprint, setSprint] = useState("all");
  const [funnelLayer, setFunnelLayer] = useState("all");
  const [viewMode, setViewMode] = useState<ViewMode>("funnel");

  const filtered = useMemo(() => {
    return experiments.filter((e) => {
      if (status !== "all" && e.status !== status) return false;
      if (tier !== "all" && e.tier !== parseInt(tier)) return false;
      if (aarrStage !== "all" && e.aarrStage !== aarrStage) return false;
      if (sprint !== "all" && e.sprint !== parseInt(sprint)) return false;
      if (funnelLayer !== "all") {
        if (funnelLayer === "backlog" && e.funnelLayer !== null) return false;
        if (funnelLayer !== "backlog" && e.funnelLayer !== parseInt(funnelLayer)) return false;
      }
      return true;
    });
  }, [experiments, status, tier, aarrStage, sprint, funnelLayer]);

  const grouped = useMemo(() => {
    const layers: Record<string, typeof filtered> = {
      "1": [],
      "2": [],
      "3": [],
      backlog: [],
    };
    for (const exp of filtered) {
      const key = exp.funnelLayer ? String(exp.funnelLayer) : "backlog";
      layers[key].push(exp);
    }
    return layers;
  }, [filtered]);

  function handleReset() {
    setStatus("all");
    setTier("all");
    setAarrStage("all");
    setSprint("all");
    setFunnelLayer("all");
  }

  const hasFunnelData = experiments.some((e) => e.funnelLayer !== null);

  return (
    <div className="space-y-6">
      <FilterBar
        status={status}
        tier={tier}
        aarrStage={aarrStage}
        sprint={sprint}
        funnelLayer={funnelLayer}
        onStatusChange={setStatus}
        onTierChange={setTier}
        onAarrStageChange={setAarrStage}
        onSprintChange={setSprint}
        onFunnelLayerChange={setFunnelLayer}
        onReset={handleReset}
        sprintNumbers={sprintNumbers}
        hasFunnelData={hasFunnelData}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          Geen experimenten gevonden met deze filters
        </div>
      ) : viewMode === "funnel" && hasFunnelData ? (
        <div className="space-y-8">
          {([1, 2, 3] as const).map((layer) => {
            const layerExps = grouped[String(layer)];
            if (layerExps.length === 0) return null;
            return (
              <FunnelLayerSection
                key={layer}
                layer={layer}
                experiments={layerExps}
                slug={slug}
              />
            );
          })}
          {grouped.backlog.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📦</span>
                  <h2 className="text-lg font-semibold text-muted-foreground">
                    Strategic Backlog
                  </h2>
                </div>
                <span className="text-sm text-muted-foreground">
                  {grouped.backlog.length} experimenten (niet in testfase)
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 opacity-75">
                {grouped.backlog.map((exp) => (
                  <ExperimentCard
                    key={exp.id}
                    id={exp.id}
                    slug={slug}
                    name={exp.name}
                    description={exp.description}
                    tier={exp.tier}
                    aarrStage={exp.aarrStage}
                    riseReach={exp.riseReach}
                    riseImpact={exp.riseImpact}
                    riseConfidence={exp.riseConfidence}
                    riseEase={exp.riseEase}
                    riseTotal={exp.riseTotal}
                    status={exp.status}
                    sprint={exp.sprint}
                    contentType={exp.contentType}
                    funnelLayer={exp.funnelLayer}
                    offerType={exp.offerType}
                    channels={exp.channels}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((exp) => (
            <ExperimentCard
              key={exp.id}
              id={exp.id}
              slug={slug}
              name={exp.name}
              description={exp.description}
              tier={exp.tier}
              aarrStage={exp.aarrStage}
              riseReach={exp.riseReach}
              riseImpact={exp.riseImpact}
              riseConfidence={exp.riseConfidence}
              riseEase={exp.riseEase}
              riseTotal={exp.riseTotal}
              status={exp.status}
              sprint={exp.sprint}
              contentType={exp.contentType}
              funnelLayer={exp.funnelLayer}
              offerType={exp.offerType}
              channels={exp.channels}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const layerColors: Record<number, string> = {
  1: "from-blue-500 to-cyan-500",
  2: "from-amber-500 to-orange-500",
  3: "from-rose-500 to-pink-500",
};

function FunnelLayerSection({
  layer,
  experiments,
  slug,
}: {
  layer: number;
  experiments: Experiment[];
  slug: string;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div
          className={`w-1 h-8 rounded-full bg-gradient-to-b ${layerColors[layer]}`}
        />
        <div>
          <h2 className="text-lg font-semibold">
            Laag {layer}: {FUNNEL_LAYER_LABELS[layer]}
          </h2>
          <p className="text-sm text-muted-foreground">
            {experiments.length} experiment{experiments.length !== 1 ? "en" : ""}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {experiments.map((exp) => (
          <ExperimentCard
            key={exp.id}
            id={exp.id}
            slug={slug}
            name={exp.name}
            description={exp.description}
            tier={exp.tier}
            aarrStage={exp.aarrStage}
            riseReach={exp.riseReach}
            riseImpact={exp.riseImpact}
            riseConfidence={exp.riseConfidence}
            riseEase={exp.riseEase}
            riseTotal={exp.riseTotal}
            status={exp.status}
            sprint={exp.sprint}
            contentType={exp.contentType}
            funnelLayer={exp.funnelLayer}
            offerType={exp.offerType}
            channels={exp.channels}
          />
        ))}
      </div>
    </div>
  );
}
