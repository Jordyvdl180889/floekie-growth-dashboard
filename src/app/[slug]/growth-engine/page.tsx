import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { GrowthEngineFunnel } from "@/components/GrowthEngineFunnel";
import { GrowthEngineLayer } from "@/components/GrowthEngineLayer";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function GrowthEnginePage({ params }: Props) {
  const { slug } = await params;

  const client = await prisma.client.findUnique({
    where: { slug },
    include: {
      experiments: {
        where: { funnelLayer: { not: null } },
        orderBy: [{ funnelLayer: "asc" }, { riseTotal: "desc" }],
      },
    },
  });

  if (!client) notFound();

  const layers = [1, 2, 3] as const;
  const grouped = layers.map((layer) => ({
    layer,
    experiments: client.experiments.filter((e) => e.funnelLayer === layer),
  }));

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Growth Engine</h1>
        <p className="text-muted-foreground mt-1">
          3-laags funnel model: van bereik naar kwalificatie
        </p>
      </div>

      <GrowthEngineFunnel
        slug={slug}
        layers={grouped.map((g) => ({
          layer: g.layer,
          total: g.experiments.length,
          running: g.experiments.filter((e) => e.status === "running").length,
          completed: g.experiments.filter((e) => e.status === "completed")
            .length,
        }))}
      />

      <div className="space-y-8">
        {grouped.map((g) => (
          <GrowthEngineLayer
            key={g.layer}
            layer={g.layer}
            slug={slug}
            experiments={g.experiments.map((e) => ({
              id: e.id,
              name: e.name,
              description: e.description,
              status: e.status,
              riseTotal: e.riseTotal,
              offerType: e.offerType,
              channels: e.channels,
              audienceType: e.audienceType,
              sprint: e.sprint,
            }))}
          />
        ))}
      </div>

      {client.experiments.length === 0 && (
        <p className="text-muted-foreground text-center py-12">
          Geen experimenten in de Growth Engine
        </p>
      )}
    </div>
  );
}
