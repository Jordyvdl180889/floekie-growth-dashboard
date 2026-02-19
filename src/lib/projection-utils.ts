import type { ProjectionInputs, ProjectionResult, ExperimentTargetData } from "@/types";

/**
 * Calculate projection for a single experiment based on its inputs and benchmark targets.
 */
export function calculateProjection(
  inputs: ProjectionInputs | null,
  targets: ExperimentTargetData[],
  channels: string[],
  upstreamProjectedLeads?: { pessimistic: number; realistic: number; optimistic: number }
): ProjectionResult | null {
  if (!inputs) return null;

  // Upstream mode takes priority — if set, skip direct input checks
  if (inputs.upstreamMode) {
    const upstreamLeads = resolveUpstreamLeads(inputs, upstreamProjectedLeads);
    if (upstreamLeads) {
      const click = targets.find((t) => t.metricName === "click_rate");
      const conv = targets.find((t) => t.metricName === "conversion_rate");
      const metric = click || conv;
      if (metric) {
        const label = click ? "Verwachte engaged leads" : "Verwachte leads";
        const unit = click ? "engaged/maand" : "leads/maand";
        return {
          pessimistic: Math.max(1, Math.floor(upstreamLeads.pessimistic * (metric.pessimistic / 100))),
          realistic: Math.max(1, Math.floor(upstreamLeads.realistic * (metric.realistic / 100))),
          optimistic: Math.max(1, Math.floor(upstreamLeads.optimistic * (metric.optimistic / 100))),
          unit,
          label,
          inputLabel: inputs.upstreamMode === "auto" ? "Upstream leads (auto)" : "Upstream leads (handmatig)",
          inputValue: upstreamLeads.realistic,
          benchmarkUsed: `${metric.metricName}: ${metric.pessimistic}% / ${metric.realistic}% / ${metric.optimistic}%`,
        };
      }
    }
    return null;
  }

  // Paid ads: budget / CPL = leads
  if (inputs.monthlyBudget) {
    const cpl = targets.find((t) => t.metricName === "cpl");
    if (cpl) {
      return {
        pessimistic: Math.floor(inputs.monthlyBudget / cpl.pessimistic),
        realistic: Math.floor(inputs.monthlyBudget / cpl.realistic),
        optimistic: Math.floor(inputs.monthlyBudget / cpl.optimistic),
        unit: "leads/maand",
        label: "Verwachte leads",
        inputLabel: "Maandelijks budget",
        inputValue: inputs.monthlyBudget,
        benchmarkUsed: `CPL: ${formatEur(cpl.pessimistic)} / ${formatEur(cpl.realistic)} / ${formatEur(cpl.optimistic)}`,
      };
    }
  }

  // Landing page / popup / assessment: visitors × conversion_rate
  if (inputs.monthlyVisitors) {
    const conv = targets.find(
      (t) => t.metricName === "conversion_rate" || t.metricName === "completion_rate"
    );
    if (conv) {
      const label = conv.metricName === "completion_rate" ? "Verwachte completions" : "Verwachte leads";
      const unit = conv.metricName === "completion_rate" ? "completions/maand" : "leads/maand";
      return {
        pessimistic: Math.floor(inputs.monthlyVisitors * (conv.pessimistic / 100)),
        realistic: Math.floor(inputs.monthlyVisitors * (conv.realistic / 100)),
        optimistic: Math.floor(inputs.monthlyVisitors * (conv.optimistic / 100)),
        unit,
        label,
        inputLabel: "Maandelijkse bezoekers",
        inputValue: inputs.monthlyVisitors,
        benchmarkUsed: `Conversie: ${conv.pessimistic}% / ${conv.realistic}% / ${conv.optimistic}%`,
      };
    }
  }

  // Cold outreach: volume × reply_rate
  if (inputs.monthlyOutreachVolume) {
    const reply = targets.find((t) => t.metricName === "reply_rate");
    const meeting = targets.find((t) => t.metricName === "meeting_booked_rate");
    if (reply && meeting) {
      return {
        pessimistic: Math.max(1, Math.round(inputs.monthlyOutreachVolume * (reply.pessimistic / 100) * (meeting.pessimistic / 100))),
        realistic: Math.max(1, Math.round(inputs.monthlyOutreachVolume * (reply.realistic / 100) * (meeting.realistic / 100))),
        optimistic: Math.max(1, Math.round(inputs.monthlyOutreachVolume * (reply.optimistic / 100) * (meeting.optimistic / 100))),
        unit: "meetings/maand",
        label: "Verwachte meetings",
        inputLabel: "Outreach volume/maand",
        inputValue: inputs.monthlyOutreachVolume,
        benchmarkUsed: `Reply: ${reply.pessimistic}%-${reply.optimistic}%, Meeting: ${meeting.pessimistic}%-${meeting.optimistic}%`,
      };
    }
    if (reply) {
      return {
        pessimistic: Math.floor(inputs.monthlyOutreachVolume * (reply.pessimistic / 100)),
        realistic: Math.floor(inputs.monthlyOutreachVolume * (reply.realistic / 100)),
        optimistic: Math.floor(inputs.monthlyOutreachVolume * (reply.optimistic / 100)),
        unit: "replies/maand",
        label: "Verwachte replies",
        inputLabel: "Outreach volume/maand",
        inputValue: inputs.monthlyOutreachVolume,
        benchmarkUsed: `Reply rate: ${reply.pessimistic}% / ${reply.realistic}% / ${reply.optimistic}%`,
      };
    }
  }

  // Organic social: impressions × engagement_rate
  if (inputs.monthlyImpressions) {
    const eng = targets.find((t) => t.metricName === "engagement_rate" || t.metricName === "ctr");
    if (eng) {
      return {
        pessimistic: Math.floor(inputs.monthlyImpressions * (eng.pessimistic / 100)),
        realistic: Math.floor(inputs.monthlyImpressions * (eng.realistic / 100)),
        optimistic: Math.floor(inputs.monthlyImpressions * (eng.optimistic / 100)),
        unit: "engagements/maand",
        label: "Verwachte engagements",
        inputLabel: "Maandelijkse impressies",
        inputValue: inputs.monthlyImpressions,
        benchmarkUsed: `Engagement: ${eng.pessimistic}% / ${eng.realistic}% / ${eng.optimistic}%`,
      };
    }
  }

  return null;
}

function resolveUpstreamLeads(
  inputs: ProjectionInputs,
  upstreamProjectedLeads?: { pessimistic: number; realistic: number; optimistic: number }
): { pessimistic: number; realistic: number; optimistic: number } | null {
  if (inputs.upstreamMode === "auto" && upstreamProjectedLeads) {
    return upstreamProjectedLeads;
  }
  if (inputs.manualUpstreamLeads) {
    const v = inputs.manualUpstreamLeads;
    return { pessimistic: v, realistic: v, optimistic: v };
  }
  return null;
}

function formatEur(v: number): string {
  return `\u20AC${v % 1 === 0 ? v : v.toFixed(2)}`;
}

/**
 * Determine which input field is relevant for a given experiment channel.
 */
export function getInputFieldForChannel(channel: string | null): keyof ProjectionInputs | null {
  if (!channel) return null;
  const paidChannels = ["linkedin-ads", "meta-ads", "google-ads", "reddit-ads"];
  if (paidChannels.includes(channel)) return "monthlyBudget";
  if (channel === "landing-page" || channel === "popup") return "monthlyVisitors";
  if (channel === "cold-email" || channel === "outbound") return "monthlyOutreachVolume";
  if (channel === "organic-social") return "monthlyImpressions";
  if (channel === "email-warm") return "upstreamMode";
  return null;
}

export interface FunnelLayerProjection {
  layer: number;
  totalLeads: { pessimistic: number; realistic: number; optimistic: number };
  experiments: Array<{
    id: number;
    name: string;
    projection: ProjectionResult | null;
  }>;
}

/**
 * Calculate cascading funnel projections for all experiments of a client.
 */
export function calculateFunnelProjections(
  experiments: Array<{
    id: number;
    name: string;
    funnelLayer: number | null;
    channels: string[];
    projectionInputs: ProjectionInputs | null;
    targets: ExperimentTargetData[];
  }>
): FunnelLayerProjection[] {
  const result: FunnelLayerProjection[] = [];

  for (const layer of [1, 2, 3]) {
    const layerExps = experiments.filter((e) => e.funnelLayer === layer);
    const prevLayer = result.find((r) => r.layer === layer - 1);
    const upstreamLeads = prevLayer ? prevLayer.totalLeads : undefined;

    const expProjections = layerExps.map((exp) => ({
      id: exp.id,
      name: exp.name,
      projection: calculateProjection(
        exp.projectionInputs,
        exp.targets,
        exp.channels,
        upstreamLeads
      ),
    }));

    const totalLeads = {
      pessimistic: expProjections.reduce((sum, e) => sum + (e.projection?.pessimistic ?? 0), 0),
      realistic: expProjections.reduce((sum, e) => sum + (e.projection?.realistic ?? 0), 0),
      optimistic: expProjections.reduce((sum, e) => sum + (e.projection?.optimistic ?? 0), 0),
    };

    result.push({ layer, totalLeads, experiments: expProjections });
  }

  return result;
}
