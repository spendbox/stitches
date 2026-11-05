"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/supabase";
import { checkAdminCredentials, createAdminSession, destroyAdminSession, requireAdmin } from "@/lib/admin";
import { str } from "@/lib/format";
import { CURRENCIES, type AccountStatus } from "@/lib/types";
import type { FormState } from "./auth";

export async function adminLogin(_: FormState, form: FormData): Promise<FormState> {
  const email = str(form.get("email")) ?? "";
  const password = String(form.get("password") ?? "");
  const fields = { email };
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    return { error: "Admin login is not set up. Add ADMIN_EMAIL and ADMIN_PASSWORD in Vercel, then redeploy.", fields };
  }
  if (!checkAdminCredentials(email, password)) {
    await new Promise((r) => setTimeout(r, 700)); // slow down guessing
    return { error: "Wrong admin email or password.", fields };
  }
  await createAdminSession();
  redirect("/admin");
}

export async function adminLogout() {
  await destroyAdminSession();
  redirect("/admin/login");
}

const STATUSES: AccountStatus[] = ["trial", "active", "blocked"];

function refresh(id?: string | null) {
  revalidatePath("/admin");
  revalidatePath("/admin/payments");
  if (id) revalidatePath(`/admin/users/${id}`);
}

export async function setTailorStatus(form: FormData) {
  await requireAdmin();
  const id = str(form.get("id"));
  const status = form.get("status") as AccountStatus;
  if (!id || !STATUSES.includes(status)) return;
  const patch: Record<string, unknown> = { status };
  if (status === "active") patch.approved_at = new Date().toISOString();
  await db().from("tailors").update(patch).eq("id", id);
  refresh(id);
}

export async function saveAdminNote(form: FormData) {
  await requireAdmin();
  const id = str(form.get("id"));
  if (!id) return;
  await db().from("tailors").update({ admin_note: str(form.get("admin_note")) }).eq("id", id);
  refresh(id);
}

export async function recordPayment(_: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  const tailor_id = str(form.get("tailor_id"));
  const amountRaw = str(form.get("amount"))?.replace(/,/g, "") ?? "";
  const amount = Number(amountRaw);
  if (!amountRaw || !Number.isFinite(amount) || amount < 0) return { error: "Enter the amount received, numbers only." };
  const currency = String(form.get("currency") ?? "NGN");

  let payer = str(form.get("payer"));
  if (tailor_id) {
    const { data } = await db().from("tailors").select("business_name").eq("id", tailor_id).maybeSingle();
    if (!data) return { error: "That user was not found." };
    payer = data.business_name;
  }
  if (!payer) return { error: "Choose a user or type who paid." };

  const { error } = await db()
    .from("payments")
    .insert({
      tailor_id,
      payer,
      amount,
      currency: CURRENCIES.includes(currency) ? currency : "NGN",
      method: str(form.get("method")),
      note: str(form.get("note")),
      paid_at: str(form.get("paid_at")) ?? new Date().toISOString().slice(0, 10),
    });
  if (error) return { error: "Could not save the payment. Have you run the latest supabase/schema.sql?" };

  if (tailor_id && form.get("approve") === "on") {
    await db().from("tailors").update({ status: "active", approved_at: new Date().toISOString() }).eq("id", tailor_id);
  }
  refresh(tailor_id);
  return { fields: { saved: "1" } };
}

export async function deletePayment(form: FormData) {
  await requireAdmin();
  const id = str(form.get("id"));
  if (!id) return;
  const { data } = await db().from("payments").delete().eq("id", id).select("tailor_id").maybeSingle();
  refresh(data?.tailor_id);
}
