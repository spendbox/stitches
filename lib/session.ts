import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { db } from "./supabase";
import type { Tailor } from "./types";

const COOKIE = "stitches_session";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function secret() {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) throw new Error("SESSION_SECRET must be set to at least 32 characters.");
  return new TextEncoder().encode(s);
}

export async function createSession(tailorId: string) {
  const token = await new SignJWT({ sub: tailorId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret());
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function getTailorId(): Promise<string | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return typeof payload.sub === "string" ? payload.sub : null;
  } catch {
    return null;
  }
}

/** Returns the logged-in tailor or sends the visitor to /login. */
export const requireTailor = cache(async (): Promise<Tailor> => {
  const id = await getTailorId();
  if (!id) redirect("/login");
  const { data } = await db()
    .from("tailors")
    .select("id, business_name, full_name, email, phone, unit, currency, created_at")
    .eq("id", id)
    .maybeSingle();
  if (!data) redirect("/login");
  return data as Tailor;
});

/** For server actions: the tailor id, or redirect to login. */
export async function requireTailorId(): Promise<string> {
  const id = await getTailorId();
  if (!id) redirect("/login");
  return id;
}
