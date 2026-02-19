"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  parseTimeline,
  FUNNEL_LAYER_CONFIG,
  SPRINT_LABELS,
} from "@/lib/roadmap-utils";

interface RoadmapExperiment {
  id: number;
  name: string;
  timeline: string | null;
  sprint: number | null;
  status: string;
  riseTotal: number;
  funnelLayer: number | null;
}

interface RoadmapGanttProps {
  experiments: RoadmapExperiment[];
  slug: string;
  totalWeeks?: number;
}

export function RoadmapGantt({
  experiments,
  slug,
  totalWeeks = 16,
}: RoadmapGanttProps) {
  const weeks = Array.from({ length: totalWeeks }, (_, i) => i + 1);

  // Group by funnel layer: 1, 2, 3, then null → 0 (backlog)
  const layerKeys = [1, 2, 3, 0];
  const grouped = layerKeys
    .map((layer) => ({
      layer,
      experiments: experiments
        .filter((e) => (e.funnelLayer ?? 0) === layer)
        .sort((a, b) => b.riseTotal - a.riseTotal),
    }))
    .filter((g) => g.experiments.length > 0);

  return (
    <div className="overflow-x-auto">
      <div
        className="min-w-[900px]"
        style={{
          display: "grid",
          gridTemplateColumns: `200px repeat(${totalWeeks}, 1fr)`,
        }}
      >
        {/* Header: sprint bands */}
        <div className="sticky left-0 z-10 bg-card" />
        {SPRINT_LABELS.map((sp) => {
          const colStart = sp.startWeek;
          const colSpan = sp.endWeek - sp.startWeek + 1;
          return (
            <div
              key={sp.label}
              className="text-center text-xs font-semibold text-muted-foreground py-1 border-b"
              style={{
                gridColumn: `${colStart + 1} / span ${colSpan}`,
              }}
            >
              {sp.label}
            </div>
          );
        })}

        {/* Header: week numbers */}
        <div className="sticky left-0 z-10 bg-card border-b px-3 py-1.5 text-xs font-medium text-muted-foreground">
          Experiment
        </div>
        {weeks.map((w) => (
          <div
            key={w}
            className={cn(
              "text-center text-xs text-muted-foreground py-1.5 border-b",
              w === 4 || w === 8 || w === 12 ? "border-r border-dashed border-border" : ""
            )}
          >
            W{w}
          </div>
        ))}

        {/* Experiment rows per layer */}
        {grouped.map((group) => {
          const config = FUNNEL_LAYER_CONFIG[group.layer];
          return (
            <div key={group.layer} className="contents">
              {/* Layer header spanning full width */}
              <div
                className={cn(
                  "sticky left-0 z-10 bg-muted/50 px-3 py-2 text-xs font-bold uppercase tracking-wider",
                  config.color
                )}
                style={{
                  gridColumn: `1 / -1`,
                }}
              >
                {config.label} ({group.experiments.length})
              </div>

              {/* Experiment rows */}
              {group.experiments.map((exp) => {
                const range = parseTimeline(exp.timeline, exp.sprint);

                return (
                  <div key={exp.id} className="contents group/row">
                    {/* Name cell */}
                    <div className="sticky left-0 z-10 bg-card px-3 py-2 text-sm truncate border-b flex items-center gap-2 group-hover/row:bg-muted/30 transition-colors">
                      <Link
                        href={`/${slug}/experiments/${exp.id}`}
                        className="truncate hover:underline"
                        title={exp.name}
                      >
                        {exp.name}
                      </Link>
                    </div>

                    {/* Week cells with bar + kill/scale markers */}
                    {weeks.map((w) => {
                      const isInRange =
                        w >= range.startWeek && w <= range.endWeek;
                      const isStart = w === range.startWeek;
                      const isEnd = w === range.endWeek;
                      const killScaleWeek = range.startWeek + 4;
                      const isKillScale =
                        w === killScaleWeek &&
                        killScaleWeek <= totalWeeks &&
                        killScaleWeek > range.endWeek;

                      return (
                        <div
                          key={w}
                          className={cn(
                            "py-2 border-b relative group-hover/row:bg-muted/10 transition-colors",
                            w === 4 || w === 8 || w === 12
                              ? "border-r border-dashed border-border"
                              : ""
                          )}
                        >
                          {isInRange && (
                            <Link
                              href={`/${slug}/experiments/${exp.id}`}
                              className={cn(
                                "absolute inset-y-1.5 inset-x-0.5 flex items-center",
                                exp.status === "planned"
                                  ? "border-2 border-dashed"
                                  : "",
                                isStart ? "rounded-l-md pl-2" : "",
                                isEnd ? "rounded-r-md pr-1" : "",
                                "hover:brightness-110 transition-all cursor-pointer"
                              )}
                              style={{
                                backgroundColor:
                                  exp.status === "planned"
                                    ? `${config.hex}33`
                                    : `${config.hex}cc`,
                                borderColor:
                                  exp.status === "planned"
                                    ? `${config.hex}88`
                                    : undefined,
                              }}
                              title={`${exp.name} — RISE: ${exp.riseTotal} — ${exp.timeline ?? "Geen timeline"} — Status: ${exp.status}`}
                            >
                              {isStart && (
                                <span
                                  className={cn(
                                    "text-[10px] font-bold truncate leading-none",
                                    exp.status === "planned"
                                      ? "text-foreground"
                                      : "text-white"
                                  )}
                                >
                                  {exp.riseTotal.toFixed(1)}
                                </span>
                              )}
                              {isEnd &&
                                exp.status === "completed" && (
                                  <span className="text-white text-[10px] ml-auto">
                                    ✓
                                  </span>
                                )}
                            </Link>
                          )}
                          {isKillScale && (
                            <div
                              className="absolute inset-y-0 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center"
                              title={`Kill/scale beslissing — Week ${killScaleWeek}`}
                            >
                              <div
                                className="w-2.5 h-2.5 rotate-45"
                                style={{ backgroundColor: config.hex }}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* Empty state */}
        {grouped.length === 0 && (
          <div
            className="text-center text-muted-foreground py-12 text-sm"
            style={{ gridColumn: "1 / -1" }}
          >
            Geen experimenten met timeline data
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div
            className="w-6 h-3 rounded-sm"
            style={{ backgroundColor: "#3b82f6cc" }}
          />
          <span>Actief</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div
            className="w-6 h-3 rounded-sm border-2 border-dashed"
            style={{
              backgroundColor: "#3b82f633",
              borderColor: "#3b82f688",
            }}
          />
          <span>Gepland</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div
            className="w-6 h-3 rounded-sm flex items-center justify-center text-white text-[8px]"
            style={{ backgroundColor: "#3b82f6cc" }}
          >
            ✓
          </div>
          <span>Afgerond</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div
            className="w-2.5 h-2.5 rotate-45 rounded-[1px]"
            style={{ backgroundColor: "#3b82f6" }}
          />
          <span>Kill/scale beslissing</span>
        </div>
        <span className="text-muted-foreground/50">|</span>
        {[1, 2, 3].map((l) => {
          const c = FUNNEL_LAYER_CONFIG[l];
          return (
            <div key={l} className="flex items-center gap-1.5">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: c.hex }}
              />
              <span>{c.label.split(":")[0]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
