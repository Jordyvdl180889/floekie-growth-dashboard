"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "./StatusBadge";
import { AARRRBadge } from "./AARRRBadge";
import { TierBadge } from "./TierBadge";
import { RISEScoreVisual } from "./RISEScoreVisual";
import { FunnelLayerBadge } from "./FunnelLayerBadge";
import type { ExperimentStatus } from "@/types";
import { OFFER_TYPE_LABELS, CHANNEL_LABELS } from "@/types";

const contentTypeLabels: Record<string, string> = {
  "website-copy": "Website Copy",
  "lead-magnet": "Lead Magnet",
  "service-page": "Service Page",
  assessment: "Assessment",
  "social-content": "Social Content",
  "event-page": "Event Page",
  "email-sequence": "Email Sequence",
  "landing-page": "Landing Page",
  "case-study": "Case Study",
  popup: "Popup",
  "email-template": "Email Template",
  article: "Artikel",
  "content-outline": "Content Outline",
};

interface ExperimentCardProps {
  id: number;
  slug: string;
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

export function ExperimentCard({
  id,
  slug,
  name,
  description,
  tier,
  aarrStage,
  riseReach,
  riseImpact,
  riseConfidence,
  riseEase,
  riseTotal,
  status,
  sprint,
  contentType,
  funnelLayer,
  offerType,
  channels,
}: ExperimentCardProps) {
  return (
    <Link href={`/${slug}/experiments/${id}`}>
      <Card className="group relative overflow-hidden rounded-2xl border hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-teal-400 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-base leading-tight line-clamp-2">
              {name}
            </h3>
            <RISEScoreVisual
              reach={riseReach}
              impact={riseImpact}
              confidence={riseConfidence}
              ease={riseEase}
              total={riseTotal}
              compact
            />
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          {description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {description}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={status as ExperimentStatus} />
            <FunnelLayerBadge layer={funnelLayer} />
            {channels.map((ch) => (
              <span key={ch} className="inline-flex items-center rounded-full bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 px-2.5 py-0.5 text-xs font-medium text-violet-700 dark:text-violet-300">
                {CHANNEL_LABELS[ch] || ch}
              </span>
            ))}
            {offerType && (
              <span className="inline-flex items-center rounded-full bg-gradient-to-r from-teal-100 to-emerald-100 dark:from-teal-900/30 dark:to-emerald-900/30 px-2.5 py-0.5 text-xs font-medium text-teal-700 dark:text-teal-300">
                {OFFER_TYPE_LABELS[offerType] || offerType}
              </span>
            )}
            {!offerType && contentType && (
              <span className="inline-flex items-center rounded-full bg-gradient-to-r from-teal-100 to-emerald-100 dark:from-teal-900/30 dark:to-emerald-900/30 px-2.5 py-0.5 text-xs font-medium text-teal-700 dark:text-teal-300">
                {contentTypeLabels[contentType] || contentType}
              </span>
            )}
            {!funnelLayer && <TierBadge tier={tier} />}
            {sprint && (
              <span className="text-xs text-muted-foreground">
                Sprint {sprint}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
