import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const experimentId = parseInt(id, 10);

    if (isNaN(experimentId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const body = await request.json();

    const allowedFields = [
      "status",
      "baselineMetric",
      "resultMetric",
      "improvement",
      "isSignificant",
      "decision",
      "learnings",
      "startDate",
      "endDate",
      "contentType",
      "content",
      "riseInputs",
      "riseReach",
      "riseImpact",
      "riseConfidence",
      "riseEase",
      "riseTotal",
      "utmSets",
      "experimentCode",
    ];

    const updateData: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (field in body) {
        if ((field === "startDate" || field === "endDate") && body[field]) {
          updateData[field] = new Date(body[field]);
        } else {
          updateData[field] = body[field];
        }
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const experiment = await prisma.experiment.update({
      where: { id: experimentId },
      data: updateData,
    });

    return NextResponse.json(experiment);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
