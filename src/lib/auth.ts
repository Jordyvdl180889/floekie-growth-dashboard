import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const COOKIE_NAME = "growth_session";
const ADMIN_COOKIE_NAME = "growth_admin";

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function setSessionCookie(slug: string): Promise<void> {
  const cookieStore = await cookies();
  const value = Buffer.from(JSON.stringify({ slug, ts: Date.now() })).toString(
    "base64"
  );
  cookieStore.set(COOKIE_NAME, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

export async function getSession(): Promise<{ slug: string } | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME);
  if (!cookie) return null;
  try {
    const data = JSON.parse(
      Buffer.from(cookie.value, "base64").toString("utf-8")
    );
    return { slug: data.slug };
  } catch {
    return null;
  }
}

export async function setAdminCookie(): Promise<void> {
  const cookieStore = await cookies();
  const value = Buffer.from(
    JSON.stringify({ admin: true, ts: Date.now() })
  ).toString("base64");
  cookieStore.set(ADMIN_COOKIE_NAME, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export async function getAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(ADMIN_COOKIE_NAME);
  if (!cookie) return false;
  try {
    const data = JSON.parse(
      Buffer.from(cookie.value, "base64").toString("utf-8")
    );
    return data.admin === true;
  } catch {
    return false;
  }
}
