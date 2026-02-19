import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getChannelMetricsForContentType } from "@/lib/benchmark-mapping";

interface Params {
  params: Promise<{ id: string }>;
}

export async function POST(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const experimentId = parseInt(id, 10);
    if (isNaN(experimentId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const experiment = await prisma.experiment.findUnique({
      where: { id: experimentId },
      include: { client: { select: { industry: true } } },
    });

    if (!experiment) {
      return NextResponse.json({ error: "Experiment not found" }, { status: 404 });
    }

    const industry = experiment.client.industry;
    const contentType = experiment.contentType;

    if (!industry || !contentType) {
      return NextResponse.json(
        { error: "Client industry or experiment contentType not set" },
        { status: 400 }
      );
    }

    const channelMetrics = getChannelMetricsForContentType(contentType);

    if (channelMetrics.length === 0) {
      return NextResponse.json(
        { error: "No benchmark mapping for this content type", contentType },
        { status: 400 }
      );
    }

    const created: Array<Record<string, unknown>> = [];

    for (const cm of channelMetrics) {
      for (const metricName of cm.metrics) {
        // Find matching benchmark
        const benchmark = await prisma.benchmark.findFirst({
          where: {
            industry,
            channel: cm.channel,
            offerType: cm.offerType,
            metricName,
            region: "eu",
          },
        });

        if (!benchmark) continue;

        // Upsert to avoid duplicates
        const target = await prisma.experimentTarget.upsert({
          where: {
            experimentId_channel_metricName: {
              experimentId,
              channel: cm.channel,
              metricName,
            },
          },
          create: {
            experimentId,
            benchmarkId: benchmark.id,
            channel: cm.channel,
            metricName,
            unit: benchmark.unit,
            pessimistic: benchmark.pessimistic,
            realistic: benchmark.realistic,
            optimistic: benchmark.optimistic,
            direction: benchmark.direction,
          },
          update: {},
        });

        created.push(target);
      }
    }

    return NextResponse.json({ targets: created });
  } catch (error) {
    console.error("Suggest targets error:", error);
    return NextResponse.json({ error: "Failed to suggest targets" }, { status: 500 });
  }
}
