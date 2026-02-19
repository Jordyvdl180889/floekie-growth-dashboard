"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { RiseInputs } from "@/types";
import { calculateRise, generateRiseExplanation } from "@/lib/rise-utils";

interface RISEScoreVisualProps {
  reach: number;
  impact: number;
  confidence: number;
  ease: number;
  total: number;
  riseInputs?: RiseInputs | null;
  compact?: boolean;
}

function ScoreBar({
  label,
  value,
  max,
  color,
  lines,
  expanded,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
  lines?: string[];
  expanded?: boolean;
}) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="text-xs font-medium text-muted-foreground w-28">
          {label} <span className="text-[10px] opacity-60">/{max}</span>
        </span>
        <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${color}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-sm font-bold w-8 text-right">
          {Number.isInteger(value) ? value : value.toFixed(1)}
        </span>
      </div>
      {expanded && lines && lines.length > 0 && (
        <div className="ml-[7.5rem] mt-1 mb-2 space-y-0.5">
          {lines.map((line, i) => (
            <p key={i} className="text-[11px] text-muted-foreground">
              {line}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export function RISEScoreVisual({
  reach,
  impact,
  confidence,
  ease,
  total,
  riseInputs,
  compact = false,
}: RISEScoreVisualProps) {
  const [expanded, setExpanded] = useState(false);

  if (compact) {
    return (
      <div className="flex items-center gap-1.5">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 text-white font-bold text-sm">
          {Number.isInteger(total) ? total : total.toFixed(1)}
        </div>
        <div className="flex flex-col text-[10px] text-muted-foreground leading-tight">
          <span>R:{Number.isInteger(reach) ? reach : reach.toFixed(1)}</span>
          <span>I:{Number.isInteger(impact) ? impact : impact.toFixed(1)}</span>
          <span>C:{confidence}</span>
          <span>E:{Number.isInteger(ease) ? ease : ease.toFixed(1)}</span>
        </div>
      </div>
    );
  }

  const explanation =
    riseInputs && expanded
      ? generateRiseExplanation(riseInputs, calculateRise(riseInputs))
      : null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold">RISE Score</span>
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center px-3 py-1 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold text-sm">
            {Number.isInteger(total) ? total : total.toFixed(1)}
            <span className="text-[10px] font-normal opacity-75 ml-0.5">/50</span>
          </div>
          {riseInputs && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
            >
              {expanded ? (
                <>
                  Verberg <ChevronUp className="w-3 h-3" />
                </>
              ) : (
                <>
                  Toelichting <ChevronDown className="w-3 h-3" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <ScoreBar
          label="Reach"
          value={reach}
          max={10}
          color="bg-gradient-to-r from-sky-400 to-sky-500"
          lines={explanation?.reach.lines}
          expanded={expanded}
        />
        <ScoreBar
          label="Impact"
          value={impact}
          max={20}
          color="bg-gradient-to-r from-teal-400 to-teal-500"
          lines={explanation?.impact.lines}
          expanded={expanded}
        />
        <ScoreBar
          label="Confidence"
          value={confidence}
          max={10}
          color="bg-gradient-to-r from-blue-400 to-blue-500"
          lines={explanation?.confidence.lines}
          expanded={expanded}
        />
        <ScoreBar
          label="Ease"
          value={ease}
          max={10}
          color="bg-gradient-to-r from-purple-400 to-purple-500"
          lines={explanation?.ease.lines}
          expanded={expanded}
        />
      </div>
    </div>
  );
}
