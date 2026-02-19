import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateProjection, calculateFunnelProjections } from "@/lib/projection-utils";
import type { ProjectionInputs, ExperimentTargetData } from "@/types";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const experimentId = parseInt(id, 10);
    if (isNaN(experimentId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const experiment = await prisma.experiment.findUnique({
      where: { id: experimentId },
      include: {
        targets: { orderBy: [{ channel: "asc" }, { metricName: "asc" }] },
        client: { select: { id: true } },
      },
    });

    if (!experiment) {
      return NextResponse.json({ error: "Experiment not found" }, { status: 404 });
    }

    const inputs = experiment.projectionInputs as ProjectionInputs | null;
    const targets = experiment.targets as unknown as ExperimentTargetData[];

    // For upstream experiments, use full cascading funnel calculation
    let upstreamLeads: { pessimistic: number; realistic: number; optimistic: number } | undefined;
    if (inputs?.upstreamMode && experiment.funnelLayer && experiment.funnelLayer > 1) {
      // Fetch ALL funnel experiments for this client to calculate cascading projections
      const allFunnelExps = await prisma.experiment.findMany({
        where: {
          clientId: experiment.client.id,
          funnelLayer: { not: null },
        },
        include: { targets: true },
      });

      const funnelProjections = calculateFunnelProjections(
        allFunnelExps.map((e) => ({
          id: e.id,
          name: e.name,
          funnelLayer: e.funnelLayer,
          channels: e.channels,
          projectionInputs: e.projectionInputs as ProjectionInputs | null,
          targets: e.targets as unknown as ExperimentTargetData[],
        }))
      );

      // Get the totals from the previous layer
      const prevLayer = funnelProjections.find((fp) => fp.layer === experiment.funnelLayer! - 1);
      if (prevLayer) {
        upstreamLeads = prevLayer.totalLeads;
      }
    }

    const projection = calculateProjection(inputs, targets, experiment.channels, upstreamLeads);

    return NextResponse.json({
      inputs,
      projection,
      upstreamLeads: upstreamLeads ?? null,
      funnelLayer: experiment.funnelLayer,
      channels: experiment.channels,
    });
  } catch (error) {
    console.error("GET projections error:", error);
    return NextResponse.json({ error: "Failed to fetch projections" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const experimentId = parseInt(id, 10);
    if (isNaN(experimentId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const body = await request.json();

    // Validate input fields
    const allowedKeys = [
      "monthlyBudget",
      "monthlyVisitors",
      "monthlyOutreachVolume",
      "monthlyImpressions",
      "upstreamMode",
      "manualUpstreamLeads",
    ];

    const inputs: ProjectionInputs = {};
    for (const key of allowedKeys) {
      if (body[key] !== undefined) {
        (inputs as Record<string, unknown>)[key] = body[key];
      }
    }

    const updated = await prisma.experiment.update({
      where: { id: experimentId },
      data: { projectionInputs: inputs as unknown as Record<string, number | string> },
      select: { projectionInputs: true },
    });

    return NextResponse.json(updated.projectionInputs);
  } catch (error) {
    console.error("PATCH projections error:", error);
    return NextResponse.json({ error: "Failed to update projection inputs" }, { status: 500 });
  }
}
