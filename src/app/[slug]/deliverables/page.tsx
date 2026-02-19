import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { DeliverableOverview } from "@/components/deliverables/DeliverableOverview";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function DeliverablesPage({ params }: Props) {
  const { slug } = await params;

  const client = await prisma.client.findUnique({
    where: { slug },
    include: {
      deliverables: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!client) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Deliverables</h1>
        <p className="text-muted-foreground mt-1">
          {client.deliverables.length} deliverable
          {client.deliverables.length !== 1 ? "s" : ""}
        </p>
      </div>
      <DeliverableOverview
        deliverables={client.deliverables.map((d) => ({
          id: d.id,
          title: d.title,
          subtitle: d.subtitle,
          slug: d.slug,
          category: d.category,
          slideCount: d.slideCount,
          slides: d.slides as unknown as import("@/types").SlideContent[],
          sortOrder: d.sortOrder,
        }))}
        slug={slug}
        brandPrimary={client.brandPrimary}
      />
    </div>
  );
}
