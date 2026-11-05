import { createHash, timingSafeEqual } from "node:crypto";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Admin login. The admin's email and password live only in the hosting
 * environment (ADMIN_EMAIL and ADMIN_PASSWORD on Vercel), never in the database.
 */
const COOKIE = "stitches_admin";
const MAX_AGE = 60 * 60 * 12; // 12 hours

function secret() {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) throw new Error("SESSION_SECRET must be set to at least 32 characters.");
  return new TextEncoder().encode(`admin:${s}`);
}

export function adminConfigured() {
  return Boolean(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD);
}

function adminEmail() {
  return (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
}

/** Compares two strings in constant time so the password can't be guessed by timing. */
function same(a: string, b: string) {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function checkAdminCredentials(email: string, password: string) {
  if (!adminConfigured()) return false;
  const okEmail = same(email.trim().toLowerCase(), adminEmail());
  const okPass = same(password, process.env.ADMIN_PASSWORD ?? "");
  return okEmail && okPass;
}

export async function createAdminSession() {
  const token = await new SignJWT({ sub: adminEmail(), role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret());
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroyAdminSession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function isAdmin(): Promise<boolean> {
  if (!adminConfigured()) return false;
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, secret());
    // Changing ADMIN_EMAIL on Vercel signs out any old admin session.
    return payload.role === "admin" && payload.sub === adminEmail();
  } catch {
    return false;
  }
}

export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}

/** How trial users reach the admin to pay. */
export function adminContact() {
  return {
    email: process.env.SUPPORT_EMAIL || process.env.ADMIN_EMAIL || null,
    phone: process.env.SUPPORT_PHONE || null,
  };
}
