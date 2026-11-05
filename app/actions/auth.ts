"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/supabase";
import { createSession, destroySession } from "@/lib/session";
import { str } from "@/lib/format";

export type FormState = { error?: string; fields?: Record<string, string> } | undefined;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function register(_: FormState, form: FormData): Promise<FormState> {
  const business_name = str(form.get("business_name"));
  const full_name = str(form.get("full_name"));
  const email = str(form.get("email"))?.toLowerCase() ?? null;
  const password = (form.get("password") as string) ?? "";
  const fields = { business_name: business_name ?? "", full_name: full_name ?? "", email: email ?? "" };

  if (!business_name || !full_name) return { error: "Enter your business name and your full name.", fields };
  if (!email || !EMAIL.test(email)) return { error: "Enter a valid work email address.", fields };
  if (password.length < 8) return { error: "Use a password with at least 8 characters.", fields };

  const existing = await db().from("tailors").select("id").eq("email", email).maybeSingle();
  if (existing.data) return { error: "An account with this email already exists. Log in instead.", fields };

  const password_hash = await bcrypt.hash(password, 10);
  const { data, error } = await db()
    .from("tailors")
    .insert({ business_name, full_name, email, password_hash })
    .select("id")
    .single();
  if (error || !data) return { error: "We could not create your account. Please try again.", fields };

  await createSession(data.id);
  redirect("/dashboard");
}

export async function login(_: FormState, form: FormData): Promise<FormState> {
  const email = str(form.get("email"))?.toLowerCase() ?? "";
  const password = (form.get("password") as string) ?? "";
  const fields = { email };
  if (!email || !password) return { error: "Enter your work email and password.", fields };

  const { data } = await db().from("tailors").select("*").eq("email", email).maybeSingle();
  const ok = data ? await bcrypt.compare(password, data.password_hash) : false;
  if (!data || !ok) return { error: "That email and password don't match. Check them and try again.", fields };
  if (data.status === "blocked") {
    return { error: "This account has been blocked. Please contact the Stitches admin.", fields };
  }

  await createSession(data.id);
  redirect("/dashboard");
}

export async function logout() {
  await destroySession();
  redirect("/");
}
