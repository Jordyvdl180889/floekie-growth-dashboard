"use client";

import { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Save, TrendingUp, ArrowUpFromLine } from "lucide-react";
import type { ProjectionInputs, ProjectionResult } from "@/types";
import { getInputFieldForChannel } from "@/lib/projection-utils";

interface ProjectionCardProps {
  experimentId: number;
  channels: string[];
  funnelLayer: number | null;
  initialInputs: ProjectionInputs | null;
}

const INPUT_CONFIG: Record<string, { label: string; prefix: string; placeholder: string }> = {
  monthlyBudget: { label: "Maandelijks budget", prefix: "\u20AC", placeholder: "500" },
  monthlyVisitors: { label: "Maandelijkse bezoekers", prefix: "", placeholder: "1000" },
  monthlyOutreachVolume: { label: "Outreach volume/maand", prefix: "", placeholder: "100" },
  monthlyImpressions: { label: "Maandelijkse impressies", prefix: "", placeholder: "10000" },
};

export function ProjectionCard({
  experimentId,
  channels,
  funnelLayer,
  initialInputs,
}: ProjectionCardProps) {
  const channel = channels[0] ?? null;
  const [inputs, setInputs] = useState<ProjectionInputs>(initialInputs ?? {});
  const [projection, setProjection] = useState<ProjectionResult | null>(null);
  const [upstreamLeads, setUpstreamLeads] = useState<{ pessimistic: number; realistic: number; optimistic: number } | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const inputField = getInputFieldForChannel(channel);
  const isUpstream = funnelLayer && funnelLayer > 1 && (channel === "email-warm" || !inputField);
  const showUpstreamToggle = isUpstream || (funnelLayer && funnelLayer > 1);

  const fetchProjection = useCallback(async () => {
    try {
      const res = await fetch(`/api/experiments/${experimentId}/projections`);
      if (res.ok) {
        const data = await res.json();
        if (data.inputs) setInputs(data.inputs);
        setProjection(data.projection);
        setUpstreamLeads(data.upstreamLeads);
      }
    } finally {
      setLoading(false);
    }
  }, [experimentId]);

  useEffect(() => {
    fetchProjection();
  }, [fetchProjection]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/experiments/${experimentId}/projections`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs),
      });
      if (res.ok) {
        await fetchProjection();
      }
    } finally {
      setSaving(false);
    }
  }, [experimentId, inputs, fetchProjection]);

  const handleInputChange = (key: string, value: string) => {
    setInputs((prev) => ({
      ...prev,
      [key]: value === "" ? undefined : Number(value),
    }));
  };

  const handleUpstreamModeChange = (mode: "auto" | "manual") => {
    // Clear direct inputs when switching to upstream mode
    setInputs((prev) => ({
      upstreamMode: mode,
      manualUpstreamLeads: prev.manualUpstreamLeads,
    }));
  };

  const handleSwitchToDirect = () => {
    // Clear upstream fields when switching back to direct input
    setInputs((prev) => {
      const cleaned: ProjectionInputs = {};
      if (prev.monthlyBudget) cleaned.monthlyBudget = prev.monthlyBudget;
      if (prev.monthlyVisitors) cleaned.monthlyVisitors = prev.monthlyVisitors;
      if (prev.monthlyOutreachVolume) cleaned.monthlyOutreachVolume = prev.monthlyOutreachVolume;
      if (prev.monthlyImpressions) cleaned.monthlyImpressions = prev.monthlyImpressions;
      return cleaned;
    });
  };

  if (loading) {
    return (
      <Card className="rounded-2xl">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-6">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const config = inputField ? INPUT_CONFIG[inputField] : null;

  return (
    <Card className="rounded-2xl border-dashed border-2 border-indigo-200 dark:border-indigo-800/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-indigo-600" />
          <h3 className="font-semibold text-sm">Projectie</h3>
        </div>
        <Button size="sm" variant="outline" onClick={handleSave} disabled={saving}>
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin mr-1" />
          ) : (
            <Save className="w-4 h-4 mr-1" />
          )}
          Opslaan
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Input field */}
        <div className="space-y-2">
          {showUpstreamToggle && (
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs text-muted-foreground">Input bron:</span>
              <button
                className={`text-xs px-2.5 py-1 rounded-full transition-colors ${
                  inputs.upstreamMode === "auto"
                    ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
                onClick={() => handleUpstreamModeChange("auto")}
              >
                Auto (uit vorige laag)
              </button>
              <button
                className={`text-xs px-2.5 py-1 rounded-full transition-colors ${
                  inputs.upstreamMode === "manual"
                    ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
                onClick={() => handleUpstreamModeChange("manual")}
              >
                Handmatig
              </button>
              {inputs.upstreamMode && config && (
                <button
                  className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
                  onClick={handleSwitchToDirect}
                >
                  Direct ({config.label})
                </button>
              )}
            </div>
          )}

          {inputs.upstreamMode === "auto" && upstreamLeads ? (
            <div className="flex items-center gap-2 text-sm">
              <ArrowUpFromLine className="w-4 h-4 text-amber-600" />
              <span className="text-muted-foreground">
                Gebaseerd op{" "}
                <span className="font-medium text-foreground">
                  {upstreamLeads.realistic} leads
                </span>{" "}
                uit Laag {(funnelLayer ?? 2) - 1}
              </span>
            </div>
          ) : inputs.upstreamMode === "auto" ? (
            <p className="text-xs text-muted-foreground">
              Geen projecties beschikbaar in de vorige laag. Voeg eerst inputs toe aan L{(funnelLayer ?? 2) - 1} experimenten.
            </p>
          ) : inputs.upstreamMode === "manual" || (isUpstream && !config) ? (
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                Upstream leads (handmatig)
              </label>
              <Input
                type="number"
                className="h-8 w-40 mt-1"
                placeholder="50"
                value={inputs.manualUpstreamLeads ?? ""}
                onChange={(e) => handleInputChange("manualUpstreamLeads", e.target.value)}
              />
            </div>
          ) : config ? (
            <div>
              <label className="text-xs font-medium text-muted-foreground">{config.label}</label>
              <div className="flex items-center gap-1 mt-1">
                {config.prefix && (
                  <span className="text-sm text-muted-foreground">{config.prefix}</span>
                )}
                <Input
                  type="number"
                  className="h-8 w-40"
                  placeholder={config.placeholder}
                  value={inputs[inputField as keyof ProjectionInputs] ?? ""}
                  onChange={(e) => handleInputChange(inputField!, e.target.value)}
                />
              </div>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              Geen projectie-input mogelijk voor dit kanaal ({channel}).
            </p>
          )}
        </div>

        {/* Projection output */}
        {projection && (
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-red-50 dark:bg-red-950/20 p-3 text-center">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                  Pessimistisch
                </p>
                <p className="text-xl font-bold text-red-600 dark:text-red-400">
                  {projection.pessimistic}
                </p>
              </div>
              <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950/20 p-3 text-center ring-2 ring-indigo-200 dark:ring-indigo-800">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                  Realistisch
                </p>
                <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                  {projection.realistic}
                </p>
              </div>
              <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/20 p-3 text-center">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                  Optimistisch
                </p>
                <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                  {projection.optimistic}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
              <span>{projection.label} ({projection.unit})</span>
              <span>{projection.benchmarkUsed}</span>
            </div>
          </div>
        )}

        {!projection && !loading && (
          <p className="text-xs text-muted-foreground">
            Vul een input in en klik opslaan om projecties te berekenen.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
