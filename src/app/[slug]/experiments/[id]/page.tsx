import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ExperimentDetail } from "@/components/ExperimentDetail";

interface Props {
  params: Promise<{ slug: string; id: string }>;
}

export default async function ExperimentDetailPage({ params }: Props) {
  const { slug, id } = await params;
  const experimentId = parseInt(id, 10);

  if (isNaN(experimentId)) notFound();

  const experiment = await prisma.experiment.findUnique({
    where: { id: experimentId },
    include: {
      client: { select: { slug: true, brandPrimary: true } },
      targets: { orderBy: [{ channel: "asc" }, { metricName: "asc" }] },
    },
  });

  if (!experiment || experiment.client.slug !== slug) notFound();

  return (
    <ExperimentDetail
      experiment={{
        id: experiment.id,
        name: experiment.name,
        description: experiment.description,
        hypothesis: experiment.hypothesis,
        tier: experiment.tier,
        aarrStage: experiment.aarrStage,
        riseReach: experiment.riseReach,
        riseImpact: experiment.riseImpact,
        riseConfidence: experiment.riseConfidence,
        riseEase: experiment.riseEase,
        riseTotal: experiment.riseTotal,
        riseInputs: experiment.riseInputs as import("@/types").RiseInputs | null,
        status: experiment.status,
        timeline: experiment.timeline,
        cost: experiment.cost,
        expectedEffect: experiment.expectedEffect,
        successMetric: experiment.successMetric,
        guardrailMetric: experiment.guardrailMetric,
        implementationSteps: experiment.implementationSteps as string[] | null,
        sprint: experiment.sprint,
        startDate: experiment.startDate?.toISOString() ?? null,
        endDate: experiment.endDate?.toISOString() ?? null,
        baselineMetric: experiment.baselineMetric,
        resultMetric: experiment.resultMetric,
        improvement: experiment.improvement,
        isSignificant: experiment.isSignificant,
        decision: experiment.decision,
        learnings: experiment.learnings,
        contentType: experiment.contentType,
        content: experiment.content as { sections: { title: string; type: string; body: string }[] } | null,
        funnelLayer: experiment.funnelLayer,
        offerType: experiment.offerType,
        channels: experiment.channels,
        audienceType: experiment.audienceType,
        audienceSpecs: experiment.audienceSpecs as import("@/types").AudienceSpecs | null,
        designBriefing: experiment.designBriefing as import("@/types").DesignBriefing | null,
        projectionInputs: experiment.projectionInputs as import("@/types").ProjectionInputs | null,
        experimentCode: experiment.experimentCode,
        utmSets: experiment.utmSets as import("@/types").UtmSet[] | null,
        targets: experiment.targets.map((t) => ({
          id: t.id,
          experimentId: t.experimentId,
          benchmarkId: t.benchmarkId,
          channel: t.channel,
          metricName: t.metricName,
          unit: t.unit,
          pessimistic: t.pessimistic,
          realistic: t.realistic,
          optimistic: t.optimistic,
          actual: t.actual,
          direction: t.direction,
        })),
      }}
      slug={slug}
      brandPrimary={experiment.client.brandPrimary}
    />
  );
}
