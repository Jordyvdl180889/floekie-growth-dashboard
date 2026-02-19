import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { SlideViewer } from "@/components/deliverables/SlideViewer";
import type { SlideContent } from "@/types";

interface Props {
  params: Promise<{ slug: string; deliverableId: string }>;
}

export default async function DeliverableDetailPage({ params }: Props) {
  const { slug, deliverableId } = await params;

  const client = await prisma.client.findUnique({
    where: { slug },
    select: { brandPrimary: true },
  });

  if (!client) notFound();

  const deliverable = await prisma.deliverable.findUnique({
    where: { id: Number(deliverableId) },
  });

  if (!deliverable) notFound();

  const slides = deliverable.slides as unknown as SlideContent[];
  const brandPrimary = client.brandPrimary || "#6366f1";

  return (
    <SlideViewer
      slides={slides}
      title={deliverable.title}
      brandPrimary={brandPrimary}
      slug={slug}
    />
  );
}
