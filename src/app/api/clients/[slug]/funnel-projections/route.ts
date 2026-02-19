import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateFunnelProjections } from "@/lib/projection-utils";
import type { ProjectionInputs, ExperimentTargetData } from "@/types";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { slug } = await params;

    const client = await prisma.client.findUnique({
      where: { slug },
      include: {
        experiments: {
          where: { funnelLayer: { not: null } },
          include: { targets: true },
          orderBy: [{ funnelLayer: "asc" }, { sortOrder: "asc" }],
        },
      },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    const projections = calculateFunnelProjections(
      client.experiments.map((e) => ({
        id: e.id,
        name: e.name,
        funnelLayer: e.funnelLayer,
        channels: e.channels,
        projectionInputs: e.projectionInputs as ProjectionInputs | null,
        targets: e.targets as unknown as ExperimentTargetData[],
      }))
    );

    return NextResponse.json(projections);
  } catch (error) {
    console.error("GET funnel projections error:", error);
    return NextResponse.json({ error: "Failed to fetch funnel projections" }, { status: 500 });
  }
}
