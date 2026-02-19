import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateUtmSets } from "@/lib/utm-utils";

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
      include: { client: { select: { id: true } } },
    });

    if (!experiment) {
      return NextResponse.json({ error: "Experiment not found" }, { status: 404 });
    }

    // Determine experimentCode if not set
    let experimentCode = experiment.experimentCode;
    if (!experimentCode) {
      const maxCodeExp = await prisma.experiment.findFirst({
        where: {
          clientId: experiment.clientId,
          experimentCode: { not: null },
        },
        orderBy: { experimentCode: "desc" },
      });

      let nextNumber = 1;
      if (maxCodeExp?.experimentCode) {
        const match = maxCodeExp.experimentCode.match(/^GH(\d+)$/);
        if (match) {
          nextNumber = parseInt(match[1], 10) + 1;
        }
      }

      experimentCode = `GH${nextNumber}`;
    }

    const utmSets = generateUtmSets({
      experimentCode,
      name: experiment.name,
      channels: experiment.channels,
    });

    const updated = await prisma.experiment.update({
      where: { id: experimentId },
      data: {
        experimentCode,
        utmSets: utmSets as unknown as import("@prisma/client").Prisma.InputJsonValue,
      },
    });

    return NextResponse.json({
      experimentCode: updated.experimentCode,
      utmSets: updated.utmSets,
    });
  } catch (error) {
    console.error("Generate UTMs error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
