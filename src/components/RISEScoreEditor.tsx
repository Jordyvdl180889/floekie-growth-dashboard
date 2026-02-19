"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2, Save, X } from "lucide-react";
import type { RiseInputs } from "@/types";
import { calculateRise } from "@/lib/rise-utils";

interface RISEScoreEditorProps {
  experimentId: number;
  initialInputs: RiseInputs;
  onSaved: () => void;
  onCancel: () => void;
}

export function RISEScoreEditor({
  experimentId,
  initialInputs,
  onSaved,
  onCancel,
}: RISEScoreEditorProps) {
  const [inputs, setInputs] = useState<RiseInputs>({ ...initialInputs });
  const [saving, setSaving] = useState(false);

  const scores = calculateRise(inputs);

  function update<K extends keyof RiseInputs>(key: K, value: RiseInputs[K]) {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`/api/experiments/${experimentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          riseInputs: inputs,
          riseReach: scores.reach,
          riseImpact: scores.impact,
          riseConfidence: scores.confidence,
          riseEase: scores.ease,
          riseTotal: scores.total,
        }),
      });
      if (res.ok) {
        onSaved();
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">RISE Score Bewerken</h3>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold text-sm">
            {Number.isInteger(scores.total)
              ? scores.total
              : scores.total.toFixed(1)}
            /50
          </div>
        </div>
      </div>

      {/* REACH */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 rounded-full bg-sky-500" />
          <h4 className="text-xs font-semibold uppercase tracking-wide">
            Reach{" "}
            <span className="font-normal text-muted-foreground">
              ({scores.reach}/10)
            </span>
          </h4>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Wie bereik je?</Label>
            <Select
              value={String(inputs.peopleReached)}
              onValueChange={(v) => update("peopleReached", Number(v))}
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 — Niemand</SelectItem>
                <SelectItem value="2">2 — Specifiek segment</SelectItem>
                <SelectItem value="3">3 — Meerdere segmenten</SelectItem>
                <SelectItem value="4">4 — Groot deel</SelectItem>
                <SelectItem value="5">5 — Iedereen</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Kanaal bereik</Label>
            <Select
              value={String(inputs.channelReach)}
              onValueChange={(v) => update("channelReach", Number(v))}
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 — Intern</SelectItem>
                <SelectItem value="2">2 — Niche kanaal</SelectItem>
                <SelectItem value="3">3 — Social media</SelectItem>
                <SelectItem value="4">4 — Email+site</SelectItem>
                <SelectItem value="5">5 — Paid breed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* IMPACT */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 rounded-full bg-teal-500" />
          <h4 className="text-xs font-semibold uppercase tracking-wide">
            Impact{" "}
            <span className="font-normal text-muted-foreground">
              ({scores.impact}/20)
            </span>
          </h4>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-between gap-2">
            <Label className="text-xs">Nieuw kanaal?</Label>
            <Switch
              checked={inputs.isNewChannel}
              onCheckedChange={(v) => update("isNewChannel", v)}
            />
          </div>
          <div className="flex items-center justify-between gap-2">
            <Label className="text-xs">Above the fold?</Label>
            <Switch
              checked={inputs.isAboveFold}
              onCheckedChange={(v) => update("isAboveFold", v)}
            />
          </div>
          <div className="flex items-center justify-between gap-2">
            <Label className="text-xs">Opvallend in 5s?</Label>
            <Switch
              checked={inputs.isNoticeable5s}
              onCheckedChange={(v) => update("isNoticeable5s", v)}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Omvang wijziging</Label>
            <Select
              value={String(inputs.changeSize)}
              onValueChange={(v) => update("changeSize", Number(v))}
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 — Micro copy</SelectItem>
                <SelectItem value="2">2 — Hele sectie</SelectItem>
                <SelectItem value="3">3 — Volledige pagina</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Type wijziging</Label>
            <Select
              value={String(inputs.changeType)}
              onValueChange={(v) => update("changeType", Number(v))}
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0 — Copy</SelectItem>
                <SelectItem value="1">1 — Navigatie</SelectItem>
                <SelectItem value="2">2 — Design</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* CONFIDENCE */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 rounded-full bg-blue-500" />
          <h4 className="text-xs font-semibold uppercase tracking-wide">
            Confidence{" "}
            <span className="font-normal text-muted-foreground">
              ({scores.confidence}/10)
            </span>
          </h4>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-between gap-2">
            <Label className="text-xs">User feedback (+4)</Label>
            <Switch
              checked={inputs.hasUserFeedback}
              onCheckedChange={(v) => update("hasUserFeedback", v)}
            />
          </div>
          <div className="flex items-center justify-between gap-2">
            <Label className="text-xs">Competitie data (+2)</Label>
            <Switch
              checked={inputs.hasCompetitorData}
              onCheckedChange={(v) => update("hasCompetitorData", v)}
            />
          </div>
          <div className="flex items-center justify-between gap-2">
            <Label className="text-xs">Analytics data (+2)</Label>
            <Switch
              checked={inputs.hasAnalyticsData}
              onCheckedChange={(v) => update("hasAnalyticsData", v)}
            />
          </div>
          <div className="flex items-center justify-between gap-2">
            <Label className="text-xs">Best practices (+2)</Label>
            <Switch
              checked={inputs.hasBestPractices}
              onCheckedChange={(v) => update("hasBestPractices", v)}
            />
          </div>
        </div>
      </div>

      {/* EASE */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 rounded-full bg-purple-500" />
          <h4 className="text-xs font-semibold uppercase tracking-wide">
            Ease{" "}
            <span className="font-normal text-muted-foreground">
              ({Number.isInteger(scores.ease)
                ? scores.ease
                : scores.ease.toFixed(1)}
              /10)
            </span>
          </h4>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Tijd om op te zetten</Label>
            <Select
              value={String(inputs.timeToSetup)}
              onValueChange={(v) => update("timeToSetup", Number(v))}
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 — Minder dan 1 uur</SelectItem>
                <SelectItem value="2">2 — Halve dag</SelectItem>
                <SelectItem value="3">3 — Volle dag</SelectItem>
                <SelectItem value="4">4 — Week</SelectItem>
                <SelectItem value="5">5 — Meer dan week</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Afhankelijkheid</Label>
            <Select
              value={String(inputs.dependencyLevel)}
              onValueChange={(v) => update("dependencyLevel", Number(v))}
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0 — Zelf uitvoerbaar</SelectItem>
                <SelectItem value="1">1 — Dev nodig</SelectItem>
                <SelectItem value="2">2 — Extern</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Preview + Actions */}
      <div className="flex items-center justify-between pt-2 border-t">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>
            R:{scores.reach} I:{scores.impact} C:{scores.confidence} E:
            {Number.isInteger(scores.ease)
              ? scores.ease
              : scores.ease.toFixed(1)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-4 h-4 mr-1" />
            Annuleren
          </Button>
          <Button size="sm" onClick={handleSave} disabled={saving}>
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-1" />
            )}
            Opslaan
          </Button>
        </div>
      </div>
    </div>
  );
}
