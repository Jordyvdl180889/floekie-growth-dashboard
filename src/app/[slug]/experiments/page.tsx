import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ExperimentsGrid } from "@/components/ExperimentsGrid";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ExperimentsPage({ params }: Props) {
  const { slug } = await params;

  const client = await prisma.client.findUnique({
    where: { slug },
    include: {
      experiments: { orderBy: { riseTotal: "desc" } },
    },
  });

  if (!client) notFound();

  const sprintNumbers = [
    ...new Set(
      client.experiments.filter((e) => e.sprint).map((e) => e.sprint as number)
    ),
  ].sort();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Experiments</h1>
        <p className="text-muted-foreground mt-1">
          {client.experiments.length} growth experimenten
        </p>
      </div>
      <ExperimentsGrid
        experiments={client.experiments.map((e) => ({
          id: e.id,
          name: e.name,
          description: e.description,
          tier: e.tier,
          aarrStage: e.aarrStage,
          riseReach: e.riseReach,
          riseImpact: e.riseImpact,
          riseConfidence: e.riseConfidence,
          riseEase: e.riseEase,
          riseTotal: e.riseTotal,
          status: e.status,
          sprint: e.sprint,
          contentType: e.contentType,
          funnelLayer: e.funnelLayer,
          offerType: e.offerType,
          channels: e.channels,
        }))}
        slug={slug}
        sprintNumbers={sprintNumbers}
      />
    </div>
  );
}
