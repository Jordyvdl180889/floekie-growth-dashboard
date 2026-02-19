"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Sparkles, Save } from "lucide-react";
import type { ExperimentTargetData } from "@/types";
import {
  evaluateTargetStatus,
  METRIC_LABELS,
  CHANNEL_LABELS,
  formatMetricValue,
  type TargetStatus,
} from "@/lib/benchmark-utils";

interface BenchmarkTargetsCardProps {
  experimentId: number;
  targets: ExperimentTargetData[];
  hasContentType: boolean;
}

const STATUS_CONFIG: Record<TargetStatus, { color: string; bg: string; label: string }> = {
  exceeding: { color: "text-green-600", bg: "bg-green-100", label: "★" },
  on_target: { color: "text-green-600", bg: "bg-green-50", label: "●" },
  approaching: { color: "text-yellow-600", bg: "bg-yellow-50", label: "●" },
  below: { color: "text-red-600", bg: "bg-red-50", label: "●" },
  no_data: { color: "text-gray-400", bg: "bg-gray-50", label: "○" },
};

export function BenchmarkTargetsCard({
  experimentId,
  targets: initialTargets,
  hasContentType,
}: BenchmarkTargetsCardProps) {
  const [targets, setTargets] = useState<ExperimentTargetData[]>(initialTargets);
  const [actuals, setActuals] = useState<Record<number, string>>(() => {
    const map: Record<number, string> = {};
    for (const t of initialTargets) {
      map[t.id] = t.actual != null ? String(t.actual) : "";
    }
    return map;
  });
  const [suggesting, setSuggesting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSuggest = useCallback(async () => {
    setSuggesting(true);
    setError(null);
    try {
      const res = await fetch(`/api/experiments/${experimentId}/targets/suggest`, {
        method: "POST",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || `Fout bij het genereren van targets (${res.status})`);
        return;
      }
      // Refetch full targets
      const targetsRes = await fetch(`/api/experiments/${experimentId}/targets`);
      if (targetsRes.ok) {
        const newTargets = await targetsRes.json();
        setTargets(newTargets);
        const newActuals: Record<number, string> = {};
        for (const t of newTargets) {
          newActuals[t.id] = t.actual != null ? String(t.actual) : "";
        }
        setActuals(newActuals);
        if (newTargets.length === 0) {
          setError("Geen benchmarks beschikbaar voor dit content type en industry.");
        }
      }
    } catch {
      setError("Netwerkfout bij het genereren van targets.");
    } finally {
      setSuggesting(false);
    }
  }, [experimentId]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const updates = targets.map((t) => ({
        id: t.id,
        actual: actuals[t.id] ? parseFloat(actuals[t.id]) : null,
      }));

      const res = await fetch(`/api/experiments/${experimentId}/targets`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targets: updates }),
      });

      if (res.ok) {
        const updated = await res.json();
        setTargets(
          targets.map((t) => {
            const u = updated.find((x: ExperimentTargetData) => x.id === t.id);
            return u ? { ...t, actual: u.actual } : t;
          })
        );
      }
    } finally {
      setSaving(false);
    }
  }, [experimentId, targets, actuals]);

  // Group targets by channel
  const grouped = targets.reduce<Record<string, ExperimentTargetData[]>>((acc, t) => {
    if (!acc[t.channel]) acc[t.channel] = [];
    acc[t.channel].push(t);
    return acc;
  }, {});

  if (targets.length === 0) {
    return (
      <Card className="rounded-2xl">
        <CardContent className="pt-6">
          <div className="text-center space-y-4 py-8">
            <p className="text-sm text-muted-foreground">
              Nog geen benchmark targets ingesteld voor dit experiment.
            </p>
            {hasContentType && (
              <Button onClick={handleSuggest} disabled={suggesting}>
                {suggesting ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Sparkles className="w-4 h-4 mr-2" />
                )}
                Auto-suggest Targets
              </Button>
            )}
            {!hasContentType && (
              <p className="text-xs text-muted-foreground">
                Stel eerst een content type in om targets te genereren.
              </p>
            )}
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <h3 className="font-semibold">Benchmark Targets</h3>
        <div className="flex gap-2">
          {hasContentType && (
            <Button variant="outline" size="sm" onClick={handleSuggest} disabled={suggesting}>
              {suggesting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-1" />
              ) : (
                <Sparkles className="w-4 h-4 mr-1" />
              )}
              Refresh
            </Button>
          )}
          <Button size="sm" onClick={handleSave} disabled={saving}>
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin mr-1" />
            ) : (
              <Save className="w-4 h-4 mr-1" />
            )}
            Save
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-2 pr-4 font-medium text-muted-foreground">Channel</th>
                <th className="pb-2 pr-4 font-medium text-muted-foreground">Metric</th>
                <th className="pb-2 pr-2 font-medium text-muted-foreground text-right">Pessim.</th>
                <th className="pb-2 pr-2 font-medium text-muted-foreground text-right">Target</th>
                <th className="pb-2 pr-2 font-medium text-muted-foreground text-right">Stretch</th>
                <th className="pb-2 pr-2 font-medium text-muted-foreground text-right w-28">Actueel</th>
                <th className="pb-2 font-medium text-muted-foreground text-center w-8"></th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(grouped).map(([channel, channelTargets]) =>
                channelTargets.map((t, i) => {
                  const status = evaluateTargetStatus(
                    actuals[t.id] ? parseFloat(actuals[t.id]) : t.actual,
                    t.pessimistic,
                    t.realistic,
                    t.optimistic,
                    t.direction
                  );
                  const cfg = STATUS_CONFIG[status];

                  return (
                    <tr key={t.id} className={`border-b last:border-0 ${cfg.bg}`}>
                      <td className="py-2 pr-4">
                        {i === 0 ? (
                          <span className="font-medium">{CHANNEL_LABELS[channel] || channel}</span>
                        ) : null}
                      </td>
                      <td className="py-2 pr-4">{METRIC_LABELS[t.metricName] || t.metricName}</td>
                      <td className="py-2 pr-2 text-right text-muted-foreground">
                        {formatMetricValue(t.pessimistic, t.unit)}
                      </td>
                      <td className="py-2 pr-2 text-right font-medium">
                        {formatMetricValue(t.realistic, t.unit)}
                      </td>
                      <td className="py-2 pr-2 text-right text-muted-foreground">
                        {formatMetricValue(t.optimistic, t.unit)}
                      </td>
                      <td className="py-2 pr-2 text-right">
                        <Input
                          type="number"
                          step="any"
                          className="h-7 w-24 text-right text-sm ml-auto"
                          placeholder="—"
                          value={actuals[t.id] || ""}
                          onChange={(e) =>
                            setActuals((prev) => ({ ...prev, [t.id]: e.target.value }))
                          }
                        />
                      </td>
                      <td className="py-2 text-center">
                        <span className={`text-lg ${cfg.color}`} title={status}>
                          {cfg.label}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="flex gap-4 mt-4 text-xs text-muted-foreground">
          <span><span className="text-green-600">★</span> Exceeding</span>
          <span><span className="text-green-600">●</span> On target</span>
          <span><span className="text-yellow-600">●</span> Approaching</span>
          <span><span className="text-red-600">●</span> Below</span>
          <span><span className="text-gray-400">○</span> No data</span>
        </div>
      </CardContent>
    </Card>
  );
}
