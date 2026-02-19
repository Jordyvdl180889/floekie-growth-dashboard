"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "./StatusBadge";
import { AARRRBadge } from "./AARRRBadge";
import { TierBadge } from "./TierBadge";
import { FunnelLayerBadge } from "./FunnelLayerBadge";
import { RISEScoreVisual } from "./RISEScoreVisual";
import { RISEScoreEditor } from "./RISEScoreEditor";
import { ContentDisplay } from "./ContentDisplay";
import { BenchmarkTargetsCard } from "./BenchmarkTargetsCard";
import { ProjectionCard } from "./ProjectionCard";
import type { ExperimentStatus, ContentSection, ExperimentTargetData, AudienceSpecs, DesignBriefing, ProjectionInputs, RiseInputs, UtmSet } from "@/types";
import { OFFER_TYPE_LABELS, CHANNEL_LABELS, AUDIENCE_TYPE_LABELS } from "@/types";
import { ArrowLeft, Save, Loader2, FileText, Download, Target, Users, Palette, Pencil, Link2, ChevronDown } from "lucide-react";
import { ExperimentTracking } from "./ExperimentTracking";

interface ExperimentData {
  id: number;
  name: string;
  description: string | null;
  hypothesis: string | null;
  tier: number;
  aarrStage: string;
  riseReach: number;
  riseImpact: number;
  riseConfidence: number;
  riseEase: number;
  riseTotal: number;
  riseInputs: RiseInputs | null;
  status: string;
  timeline: string | null;
  cost: string | null;
  expectedEffect: string | null;
  successMetric: string | null;
  guardrailMetric: string | null;
  implementationSteps: string[] | null;
  sprint: number | null;
  startDate: string | null;
  endDate: string | null;
  baselineMetric: string | null;
  resultMetric: string | null;
  improvement: string | null;
  isSignificant: boolean | null;
  decision: string | null;
  learnings: string | null;
  contentType: string | null;
  content: { sections: ContentSection[] } | null;
  targets: ExperimentTargetData[];
  funnelLayer: number | null;
  offerType: string | null;
  channels: string[];
  audienceType: string | null;
  audienceSpecs: AudienceSpecs | null;
  designBriefing: DesignBriefing | null;
  projectionInputs: ProjectionInputs | null;
  experimentCode: string | null;
  utmSets: UtmSet[] | null;
}

interface ExperimentDetailProps {
  experiment: ExperimentData;
  slug: string;
  brandPrimary?: string | null;
}

export function ExperimentDetail({
  experiment,
  slug,
}: ExperimentDetailProps) {
  const router = useRouter();
  const [status, setStatus] = useState(experiment.status);
  const [learnings, setLearnings] = useState(experiment.learnings || "");
  const [resultMetric, setResultMetric] = useState(
    experiment.resultMetric || ""
  );
  const [improvement, setImprovement] = useState(experiment.improvement || "");
  const [decision, setDecision] = useState(experiment.decision || "");
  const [saving, setSaving] = useState(false);
  const [editingRise, setEditingRise] = useState(false);
  const [openDesignAssets, setOpenDesignAssets] = useState<Set<number>>(new Set());

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`/api/experiments/${experiment.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          learnings: learnings || null,
          resultMetric: resultMetric || null,
          improvement: improvement || null,
          decision: decision || null,
        }),
      });
      if (res.ok) {
        router.refresh();
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <Link
        href={`/${slug}/experiments`}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Terug naar experiments
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">
            {experiment.experimentCode && (
              <span className="text-primary mr-2">{experiment.experimentCode}</span>
            )}
            {experiment.name}
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={status as ExperimentStatus} />
            <FunnelLayerBadge layer={experiment.funnelLayer} />
            {experiment.channels.map((ch) => (
              <span key={ch} className="inline-flex items-center rounded-full bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 px-2.5 py-0.5 text-xs font-medium text-violet-700 dark:text-violet-300">
                {CHANNEL_LABELS[ch] || ch}
              </span>
            ))}
            {experiment.offerType && (
              <span className="inline-flex items-center rounded-full bg-gradient-to-r from-teal-100 to-emerald-100 dark:from-teal-900/30 dark:to-emerald-900/30 px-2.5 py-0.5 text-xs font-medium text-teal-700 dark:text-teal-300">
                {OFFER_TYPE_LABELS[experiment.offerType] || experiment.offerType}
              </span>
            )}
            {experiment.audienceType && (
              <span className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 px-2.5 py-0.5 text-xs font-medium text-orange-700 dark:text-orange-300">
                {AUDIENCE_TYPE_LABELS[experiment.audienceType] || experiment.audienceType}
              </span>
            )}
            <AARRRBadge stage={experiment.aarrStage} />
            {!experiment.funnelLayer && <TierBadge tier={experiment.tier} />}
            {experiment.sprint && (
              <span className="text-sm text-muted-foreground">
                Sprint {experiment.sprint}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="planned">Planned</SelectItem>
              <SelectItem value="running">Running</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="stopped">Stopped</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() =>
              window.open(`/api/experiments/${experiment.id}/export`, "_blank")
            }
          >
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-1" />
            )}
            Save
          </Button>
        </div>
      </div>

      <Card className="rounded-2xl">
        <CardContent className="pt-6">
          {editingRise && experiment.riseInputs ? (
            <RISEScoreEditor
              experimentId={experiment.id}
              initialInputs={experiment.riseInputs}
              onSaved={() => {
                setEditingRise(false);
                router.refresh();
              }}
              onCancel={() => setEditingRise(false)}
            />
          ) : (
            <div>
              <RISEScoreVisual
                reach={experiment.riseReach}
                impact={experiment.riseImpact}
                confidence={experiment.riseConfidence}
                ease={experiment.riseEase}
                total={experiment.riseTotal}
                riseInputs={experiment.riseInputs}
              />
              {experiment.riseInputs && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-3"
                  onClick={() => setEditingRise(true)}
                >
                  <Pencil className="w-3.5 h-3.5 mr-1" />
                  Bewerken
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overzicht</TabsTrigger>
          <TabsTrigger value="implementation">Implementatie</TabsTrigger>
          <TabsTrigger value="results">Resultaten</TabsTrigger>
          <TabsTrigger value="learnings">Learnings</TabsTrigger>
          <TabsTrigger value="targets" className="gap-1.5">
            <Target className="w-3.5 h-3.5" />
            Targets
          </TabsTrigger>
          {experiment.audienceSpecs && (
            <TabsTrigger value="audiences" className="gap-1.5">
              <Users className="w-3.5 h-3.5" />
              Audiences
            </TabsTrigger>
          )}
          {experiment.designBriefing && (
            <TabsTrigger value="design" className="gap-1.5">
              <Palette className="w-3.5 h-3.5" />
              Design Brief
            </TabsTrigger>
          )}
          {experiment.utmSets && experiment.utmSets.length > 0 && (
            <TabsTrigger value="tracking" className="gap-1.5">
              <Link2 className="w-3.5 h-3.5" />
              Tracking
            </TabsTrigger>
          )}
          {experiment.content && (
            <TabsTrigger value="content" className="gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              Content
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="overview">
          <Card className="rounded-2xl">
            <CardContent className="pt-6 space-y-4">
              {experiment.description && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Beschrijving
                  </h3>
                  <p className="text-sm">{experiment.description}</p>
                </div>
              )}
              {experiment.hypothesis && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Hypothese
                  </h3>
                  <p className="text-sm italic">{experiment.hypothesis}</p>
                </div>
              )}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                {experiment.timeline && (
                  <div>
                    <p className="text-xs text-muted-foreground">Timeline</p>
                    <p className="text-sm font-medium">
                      {experiment.timeline}
                    </p>
                  </div>
                )}
                {experiment.cost && (
                  <div>
                    <p className="text-xs text-muted-foreground">Kosten</p>
                    <p className="text-sm font-medium">{experiment.cost}</p>
                  </div>
                )}
                {experiment.expectedEffect && (
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Verwacht effect
                    </p>
                    <p className="text-sm font-medium">
                      {experiment.expectedEffect}
                    </p>
                  </div>
                )}
              </div>
              {experiment.successMetric && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Success Metric
                  </h3>
                  <p className="text-sm">{experiment.successMetric}</p>
                </div>
              )}
              {experiment.guardrailMetric && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Guardrail Metric
                  </h3>
                  <p className="text-sm">{experiment.guardrailMetric}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="implementation">
          <Card className="rounded-2xl">
            <CardHeader>
              <h3 className="font-semibold">Implementatie Stappen</h3>
            </CardHeader>
            <CardContent>
              {experiment.implementationSteps &&
              experiment.implementationSteps.length > 0 ? (
                <ol className="space-y-3">
                  {experiment.implementationSteps.map(
                    (step: string, i: number) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 text-white text-xs font-bold flex-shrink-0 mt-0.5">
                          {i + 1}
                        </div>
                        <p className="text-sm">{step}</p>
                      </li>
                    )
                  )}
                </ol>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Geen implementatie stappen gedefinieerd
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results">
          <Card className="rounded-2xl">
            <CardHeader>
              <h3 className="font-semibold">Resultaten</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Resultaat Metric
                </label>
                <Textarea
                  value={resultMetric}
                  onChange={(e) => setResultMetric(e.target.value)}
                  placeholder="Bijv. Bounce rate daalde van 65% naar 42%"
                  className="mt-1"
                  rows={2}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Verbetering
                </label>
                <Textarea
                  value={improvement}
                  onChange={(e) => setImprovement(e.target.value)}
                  placeholder="Bijv. +35% meer conversies"
                  className="mt-1"
                  rows={2}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Beslissing
                </label>
                <Textarea
                  value={decision}
                  onChange={(e) => setDecision(e.target.value)}
                  placeholder="Bijv. Doorgaan en opschalen naar andere markten"
                  className="mt-1"
                  rows={2}
                />
              </div>
              {experiment.baselineMetric && (
                <div>
                  <p className="text-xs text-muted-foreground">
                    Baseline Metric
                  </p>
                  <p className="text-sm">{experiment.baselineMetric}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="learnings">
          <Card className="rounded-2xl">
            <CardHeader>
              <h3 className="font-semibold">Learnings</h3>
            </CardHeader>
            <CardContent>
              <Textarea
                value={learnings}
                onChange={(e) => setLearnings(e.target.value)}
                placeholder="Wat heb je geleerd van dit experiment? Wat zou je de volgende keer anders doen?"
                rows={6}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="targets">
          <div className="space-y-4">
            <ProjectionCard
              experimentId={experiment.id}
              channels={experiment.channels}
              funnelLayer={experiment.funnelLayer}
              initialInputs={experiment.projectionInputs}
            />
            <BenchmarkTargetsCard
              experimentId={experiment.id}
              targets={experiment.targets}
              hasContentType={!!experiment.contentType}
            />
          </div>
        </TabsContent>
        {experiment.audienceSpecs && (
          <TabsContent value="audiences">
            <div className="space-y-4">
              {experiment.audienceSpecs.channels.map((ch, i) => (
                <Card key={i} className="rounded-2xl">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">
                        {CHANNEL_LABELS[ch.channel] || ch.channel}
                      </h3>
                      <div className="flex items-center gap-2">
                        {ch.estimatedSize && (
                          <span className="text-xs bg-muted px-2 py-1 rounded-lg">
                            {ch.estimatedSize} audience
                          </span>
                        )}
                        {ch.budget && (
                          <span className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded-lg">
                            {ch.budget}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {ch.targeting.jobTitles && ch.targeting.jobTitles.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Job Titles</p>
                        <div className="flex flex-wrap gap-1">{ch.targeting.jobTitles.map((t, j) => <span key={j} className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">{t}</span>)}</div>
                      </div>
                    )}
                    {ch.targeting.industries && ch.targeting.industries.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Industries</p>
                        <div className="flex flex-wrap gap-1">{ch.targeting.industries.map((t, j) => <span key={j} className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full">{t}</span>)}</div>
                      </div>
                    )}
                    {ch.targeting.interests && ch.targeting.interests.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Interests</p>
                        <div className="flex flex-wrap gap-1">{ch.targeting.interests.map((t, j) => <span key={j} className="text-xs bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 px-2 py-0.5 rounded-full">{t}</span>)}</div>
                      </div>
                    )}
                    {ch.targeting.keywords && ch.targeting.keywords.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Keywords</p>
                        <div className="flex flex-wrap gap-1">{ch.targeting.keywords.map((t, j) => <span key={j} className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full">{t}</span>)}</div>
                      </div>
                    )}
                    {ch.targeting.seniority && ch.targeting.seniority.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Seniority</p>
                        <div className="flex flex-wrap gap-1">{ch.targeting.seniority.map((t, j) => <span key={j} className="text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full">{t}</span>)}</div>
                      </div>
                    )}
                    {ch.targeting.companySize && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Company Size</p>
                        <p className="text-sm">{ch.targeting.companySize}</p>
                      </div>
                    )}
                    {ch.targeting.skills && ch.targeting.skills.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Skills</p>
                        <div className="flex flex-wrap gap-1">{ch.targeting.skills.map((t, j) => <span key={j} className="text-xs bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 px-2 py-0.5 rounded-full">{t}</span>)}</div>
                      </div>
                    )}
                    {ch.targeting.behaviors && ch.targeting.behaviors.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Behaviors</p>
                        <div className="flex flex-wrap gap-1">{ch.targeting.behaviors.map((t, j) => <span key={j} className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-2 py-0.5 rounded-full">{t}</span>)}</div>
                      </div>
                    )}
                    {ch.targeting.subreddits && ch.targeting.subreddits.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Subreddits</p>
                        <div className="flex flex-wrap gap-1">{ch.targeting.subreddits.map((t, j) => <span key={j} className="text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-2 py-0.5 rounded-full">{t}</span>)}</div>
                      </div>
                    )}
                    {ch.targeting.groups && ch.targeting.groups.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Groups</p>
                        <div className="flex flex-wrap gap-1">{ch.targeting.groups.map((t, j) => <span key={j} className="text-xs bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 px-2 py-0.5 rounded-full">{t}</span>)}</div>
                      </div>
                    )}
                    {ch.targeting.customAudience && (
                      <div className="rounded-xl bg-muted/50 p-3 space-y-1">
                        <p className="text-xs font-medium">Custom Audience: {ch.targeting.customAudience.type}</p>
                        <p className="text-xs text-muted-foreground">{ch.targeting.customAudience.description}</p>
                        {ch.targeting.customAudience.minSize && <p className="text-xs text-muted-foreground">Min. grootte: {ch.targeting.customAudience.minSize}</p>}
                      </div>
                    )}
                    {ch.targeting.lookalike && (
                      <div className="rounded-xl bg-muted/50 p-3 space-y-1">
                        <p className="text-xs font-medium">Lookalike Audience</p>
                        <p className="text-xs text-muted-foreground">Bron: {ch.targeting.lookalike.source} | {ch.targeting.lookalike.percentage} | {ch.targeting.lookalike.country}</p>
                      </div>
                    )}
                    {ch.targeting.retargeting && (
                      <div className="rounded-xl bg-muted/50 p-3 space-y-1">
                        <p className="text-xs font-medium">Retargeting</p>
                        <p className="text-xs text-muted-foreground">Bron: {ch.targeting.retargeting.source} | Window: {ch.targeting.retargeting.window}</p>
                        {ch.targeting.retargeting.excludeConverted && <p className="text-xs text-muted-foreground">Converted leads uitgesloten</p>}
                      </div>
                    )}
                    {ch.notes && (
                      <div className="pt-2 border-t">
                        <p className="text-xs text-muted-foreground italic">{ch.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        )}
        {experiment.designBriefing && (
          <TabsContent value="design">
            <div className="space-y-3">
              {experiment.designBriefing.generalNotes && (
                <Card className="rounded-2xl">
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground italic">{experiment.designBriefing.generalNotes}</p>
                  </CardContent>
                </Card>
              )}
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{experiment.designBriefing.assets.length} assets</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => {
                    const allOpen = openDesignAssets.size === experiment.designBriefing!.assets.length;
                    setOpenDesignAssets(allOpen ? new Set() : new Set(experiment.designBriefing!.assets.map((_, i) => i)));
                  }}
                >
                  {openDesignAssets.size === experiment.designBriefing.assets.length ? "Alles inklappen" : "Alles uitklappen"}
                </Button>
              </div>
              {experiment.designBriefing.assets.map((asset, i) => {
                const isOpen = openDesignAssets.has(i);
                return (
                  <Card key={i} className="rounded-2xl">
                    <CardHeader
                      className="pb-3 cursor-pointer select-none hover:bg-muted/30 transition-colors"
                      onClick={() => setOpenDesignAssets((prev) => {
                        const next = new Set(prev);
                        if (next.has(i)) next.delete(i); else next.add(i);
                        return next;
                      })}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200 ${isOpen ? "" : "-rotate-90"}`} />
                          <h3 className="font-semibold text-sm">{asset.type}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-muted px-2 py-1 rounded-lg font-mono">{asset.format}</span>
                          {asset.variants && <span className="text-xs bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 px-2 py-1 rounded-lg">{asset.variants}x varianten</span>}
                        </div>
                      </div>
                    </CardHeader>
                    {isOpen && (
                      <CardContent className="space-y-3">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">Beschrijving</p>
                          <p className="text-sm">{asset.description}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">Copy op Asset</p>
                          <div className="rounded-lg bg-muted/50 p-3">
                            <p className="text-sm font-medium select-all">{asset.copyOnAsset}</p>
                          </div>
                        </div>
                        {asset.style && (
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1">Stijl</p>
                            <p className="text-sm">{asset.style}</p>
                          </div>
                        )}
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        )}
        {experiment.utmSets && experiment.utmSets.length > 0 && experiment.experimentCode && (
          <TabsContent value="tracking">
            <ExperimentTracking
              utmSets={experiment.utmSets}
              experimentCode={experiment.experimentCode}
              experimentId={experiment.id}
            />
          </TabsContent>
        )}
        {experiment.content && (
          <TabsContent value="content">
            <ContentDisplay sections={experiment.content.sections} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
