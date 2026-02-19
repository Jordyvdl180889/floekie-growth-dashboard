import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { RoadmapGantt } from "@/components/RoadmapGantt";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function RoadmapPage({ params }: Props) {
  const { slug } = await params;

  const client = await prisma.client.findUnique({
    where: { slug },
    include: {
      experiments: {
        orderBy: [{ funnelLayer: "asc" }, { riseTotal: "desc" }],
        select: {
          id: true,
          name: true,
          timeline: true,
          sprint: true,
          status: true,
          riseTotal: true,
          funnelLayer: true,
        },
      },
    },
  });

  if (!client) notFound();

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Roadmap</h1>
        <p className="text-muted-foreground mt-1">
          16-weken Gantt overzicht van alle experimenten per funnel laag
        </p>
      </div>

      <RoadmapGantt experiments={client.experiments} slug={slug} totalWeeks={16} />
    </div>
  );
}
