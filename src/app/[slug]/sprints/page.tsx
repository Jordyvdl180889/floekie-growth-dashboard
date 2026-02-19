import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { SprintTimeline } from "@/components/SprintTimeline";
import type { SprintActivity } from "@/types";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function SprintsPage({ params }: Props) {
  const { slug } = await params;

  const client = await prisma.client.findUnique({
    where: { slug },
    include: {
      sprints: { orderBy: { number: "asc" } },
    },
  });

  if (!client) notFound();

  const sprintsData = client.sprints.map((s) => ({
    id: s.id,
    number: s.number,
    name: s.name,
    weeks: s.weeks,
    focus: s.focus,
    activities: (s.activities as unknown as SprintActivity[]) || null,
    successCriteria: (s.successCriteria as unknown as string[]) || null,
    status: s.status,
  }));

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sprints</h1>
        <p className="text-muted-foreground mt-1">
          Growth sprint planning en voortgang
        </p>
      </div>

      <SprintTimeline sprints={sprintsData} />

      {client.sprints.length === 0 && (
        <p className="text-muted-foreground text-center py-12">
          Geen sprints gedefinieerd
        </p>
      )}
    </div>
  );
}
