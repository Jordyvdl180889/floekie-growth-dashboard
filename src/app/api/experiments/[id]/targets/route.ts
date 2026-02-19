import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    const targets = await prisma.experimentTarget.findMany({
      where: { experimentId },
      orderBy: [{ channel: "asc" }, { metricName: "asc" }],
    });

    return NextResponse.json(targets);
  } catch (error) {
    console.error("GET targets error:", error);
    return NextResponse.json({ error: "Failed to fetch targets" }, { status: 500 });
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
    const { targets } = body as { targets: { id: number; actual: number | null }[] };

    if (!Array.isArray(targets)) {
      return NextResponse.json({ error: "targets array required" }, { status: 400 });
    }

    const updates = await Promise.all(
      targets.map((t) =>
        prisma.experimentTarget.update({
          where: { id: t.id },
          data: { actual: t.actual },
        })
      )
    );

    return NextResponse.json(updates);
  } catch (error) {
    console.error("PATCH targets error:", error);
    return NextResponse.json({ error: "Failed to update targets" }, { status: 500 });
  }
}
