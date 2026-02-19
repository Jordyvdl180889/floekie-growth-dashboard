import { NextRequest, NextResponse } from "next/server";
import { setAdminCookie } from "@/lib/auth";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "stretch2026";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: "Missing password" },
        { status: 400 }
      );
    }

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "Incorrect password" },
        { status: 401 }
      );
    }

    await setAdminCookie();

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
