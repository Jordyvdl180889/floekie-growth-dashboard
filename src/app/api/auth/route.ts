import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, setSessionCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { slug, password } = await request.json();

    if (!slug || !password) {
      return NextResponse.json(
        { error: "Missing slug or password" },
        { status: 400 }
      );
    }

    const client = await prisma.client.findUnique({
      where: { slug },
      select: { passwordHash: true, slug: true },
    });

    if (!client) {
      return NextResponse.json(
        { error: "Client not found" },
        { status: 404 }
      );
    }

    const valid = await verifyPassword(password, client.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { error: "Incorrect password" },
        { status: 401 }
      );
    }

    await setSessionCookie(slug);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
