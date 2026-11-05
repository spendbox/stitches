"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/supabase";
import { requireTailorId } from "@/lib/session";
import { str } from "@/lib/format";
import { FIELDS } from "@/lib/measurements";
import { CURRENCIES, type OrderStatus } from "@/lib/types";
import type { FormState } from "./auth";

/* ---------------- Clients ---------------- */

function clientFields(form: FormData) {
  return {
    full_name: str(form.get("full_name")),
    phone: str(form.get("phone")),
    email: str(form.get("email")),
    gender: form.get("gender") === "male" ? "male" : "female",
    address: str(form.get("address")),
    notes: str(form.get("notes")),
  };
}

export async function saveClient(_: FormState, form: FormData): Promise<FormState> {
  const tailor_id = await requireTailorId();
  const id = str(form.get("id"));
  const values = clientFields(form);
  if (!values.full_name) return { error: "Enter the client's name." };

  if (id) {
    const { error } = await db().from("clients").update(values).eq("id", id).eq("tailor_id", tailor_id);
    if (error) return { error: "Could not save changes. Please try again." };
    revalidatePath(`/clients/${id}`);
    redirect(`/clients/${id}`);
  }

  const { data, error } = await db()
    .from("clients")
    .insert({ ...values, tailor_id })
    .select("id")
    .single();
  if (error || !data) return { error: "Could not add this client. Please try again." };
  revalidatePath("/clients");
  redirect(`/clients/${data.id}/measurements/new?first=1`);
}

export async function deleteClient(form: FormData) {
  const tailor_id = await requireTailorId();
  const id = str(form.get("id"));
  if (id) await db().from("clients").delete().eq("id", id).eq("tailor_id", tailor_id);
  revalidatePath("/clients");
  redirect("/clients");
}

/* ---------------- Measurements ---------------- */

export async function saveMeasurement(_: FormState, form: FormData): Promise<FormState> {
  const tailor_id = await requireTailorId();
  const client_id = str(form.get("client_id"));
  const id = str(form.get("id"));
  if (!client_id) return { error: "Missing client." };

  const owns = await db().from("clients").select("id").eq("id", client_id).eq("tailor_id", tailor_id).maybeSingle();
  if (!owns.data) return { error: "This client was not found." };

  const values: Record<string, number> = {};
  for (const f of FIELDS) {
    const raw = str(form.get(`m_${f.key}`));
    if (raw === null) continue;
    const n = Number(raw.replace(",", "."));
    if (!Number.isFinite(n) || n < 0 || n > 1000) {
      return { error: `Check the value for "${typeof f.label === "string" ? f.label : f.label.female}". Use numbers only.` };
    }
    values[f.key] = n;
  }

  const extraLabels = form.getAll("extra_label").map((v) => String(v).trim());
  const extraValues = form.getAll("extra_value").map((v) => String(v).trim());
  const extras = extraLabels
    .map((label, i) => ({ label, value: extraValues[i] ?? "" }))
    .filter((e) => e.label && e.value);

  if (Object.keys(values).length === 0 && extras.length === 0) {
    return { error: "Enter at least one measurement." };
  }

  const row = {
    client_id,
    tailor_id,
    label: str(form.get("label")) ?? "Standard",
    unit: form.get("unit") === "cm" ? "cm" : "in",
    values,
    extras,
    notes: str(form.get("notes")),
    taken_at: str(form.get("taken_at")) ?? new Date().toISOString().slice(0, 10),
  };

  const q = id
    ? db().from("measurements").update(row).eq("id", id).eq("tailor_id", tailor_id)
    : db().from("measurements").insert(row);
  const { error } = await q;
  if (error) return { error: "Could not save the measurements. Please try again." };

  await db().from("clients").update({ updated_at: new Date().toISOString() }).eq("id", client_id);
  revalidatePath(`/clients/${client_id}`);
  redirect(`/clients/${client_id}`);
}

export async function deleteMeasurement(form: FormData) {
  const tailor_id = await requireTailorId();
  const id = str(form.get("id"));
  const client_id = str(form.get("client_id"));
  if (id) await db().from("measurements").delete().eq("id", id).eq("tailor_id", tailor_id);
  revalidatePath(`/clients/${client_id}`);
  redirect(`/clients/${client_id}`);
}

/* ---------------- Orders ---------------- */

const STATUSES: OrderStatus[] = ["pending", "in_progress", "ready", "delivered"];

function safePath(v: FormDataEntryValue | null) {
  const s = str(v);
  return s && s.startsWith("/") && !s.startsWith("//") ? s : "/orders";
}

function num(v: FormDataEntryValue | null) {
  const s = str(v);
  if (s === null) return null;
  const n = Number(s.replace(/,/g, ""));
  return Number.isFinite(n) ? n : null;
}

export async function saveOrder(_: FormState, form: FormData): Promise<FormState> {
  const tailor_id = await requireTailorId();
  const id = str(form.get("id"));
  const client_id = str(form.get("client_id"));
  const title = str(form.get("title"));
  if (!client_id) return { error: "Choose a client for this order." };
  if (!title) return { error: "Describe the garment, for example “Senator suit”." };

  const owns = await db().from("clients").select("id").eq("id", client_id).eq("tailor_id", tailor_id).maybeSingle();
  if (!owns.data) return { error: "This client was not found." };

  const status = STATUSES.includes(form.get("status") as OrderStatus) ? (form.get("status") as OrderStatus) : "pending";
  const row = {
    tailor_id,
    client_id,
    title,
    status,
    due_date: str(form.get("due_date")),
    price: num(form.get("price")),
    deposit: num(form.get("deposit")),
    notes: str(form.get("notes")),
  };
  const q = id
    ? db().from("orders").update(row).eq("id", id).eq("tailor_id", tailor_id)
    : db().from("orders").insert(row);
  const { error } = await q;
  if (error) return { error: "Could not save the order. Please try again." };

  revalidatePath("/orders");
  revalidatePath(`/clients/${client_id}`);
  redirect(safePath(form.get("return_to")));
}

export async function setOrderStatus(form: FormData) {
  const tailor_id = await requireTailorId();
  const id = str(form.get("id"));
  const status = form.get("status") as OrderStatus;
  if (!id || !STATUSES.includes(status)) return;
  await db().from("orders").update({ status }).eq("id", id).eq("tailor_id", tailor_id);
  revalidatePath("/orders");
  revalidatePath("/dashboard");
  const client_id = str(form.get("client_id"));
  if (client_id) revalidatePath(`/clients/${client_id}`);
}

/** Make a new client link for an order; the old link stops working. */
export async function resetShareLink(form: FormData) {
  const tailor_id = await requireTailorId();
  const id = str(form.get("id"));
  if (!id) return;
  const token = crypto.randomUUID().replace(/-/g, "");
  await db().from("orders").update({ share_token: token }).eq("id", id).eq("tailor_id", tailor_id);
  revalidatePath(`/orders/${id}`);
}

export async function deleteOrder(form: FormData) {
  const tailor_id = await requireTailorId();
  const id = str(form.get("id"));
  if (id) await db().from("orders").delete().eq("id", id).eq("tailor_id", tailor_id);
  revalidatePath("/orders");
  redirect(safePath(form.get("return_to")));
}

/* ---------------- Settings ---------------- */

export async function saveSettings(_: FormState, form: FormData): Promise<FormState> {
  const id = await requireTailorId();
  const business_name = str(form.get("business_name"));
  const full_name = str(form.get("full_name"));
  if (!business_name || !full_name) return { error: "Business name and your name are required." };
  const currency = String(form.get("currency") ?? "USD");
  const { error } = await db()
    .from("tailors")
    .update({
      business_name,
      full_name,
      phone: str(form.get("phone")),
      unit: form.get("unit") === "cm" ? "cm" : "in",
      currency: CURRENCIES.includes(currency) ? currency : "USD",
    })
    .eq("id", id);
  if (error) return { error: "Could not save your settings. Please try again." };
  revalidatePath("/", "layout");
  return { fields: { saved: "1" } };
}

export async function changePassword(_: FormState, form: FormData): Promise<FormState> {
  const id = await requireTailorId();
  const current = String(form.get("current") ?? "");
  const next = String(form.get("next") ?? "");
  if (next.length < 8) return { error: "Use a new password with at least 8 characters." };
  const { data } = await db().from("tailors").select("password_hash").eq("id", id).single();
  if (!data || !(await bcrypt.compare(current, data.password_hash))) {
    return { error: "Your current password is not correct." };
  }
  await db().from("tailors").update({ password_hash: await bcrypt.hash(next, 10) }).eq("id", id);
  return { fields: { saved: "1" } };
}

/* ---------------- Business logo ---------------- */

const LOGO_TYPES: Record<string, { ext: string; magic: (b: Uint8Array) => boolean }> = {
  "image/png": { ext: "png", magic: (b) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 },
  "image/jpeg": { ext: "jpg", magic: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  "image/webp": { ext: "webp", magic: (b) => b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50 },
};

/** Remove every file in this business's logo folder (old versions included). */
async function clearLogoFolder(tailor_id: string) {
  const bucket = db().storage.from("logos");
  const { data } = await bucket.list(tailor_id);
  if (data?.length) await bucket.remove(data.map((f) => `${tailor_id}/${f.name}`));
}

export async function uploadLogo(_: FormState, form: FormData): Promise<FormState> {
  const tailor_id = await requireTailorId();
  const file = form.get("logo");
  if (!(file instanceof File) || file.size === 0) return { error: "Choose an image to upload." };
  if (file.size > 2 * 1024 * 1024) return { error: "That image is too large. Use one under 2 MB." };
  const bytes = new Uint8Array(await file.arrayBuffer());
  const type = Object.entries(LOGO_TYPES).find(([, t]) => t.magic(bytes));
  if (!type) return { error: "Use a PNG, JPG or WebP image." };
  const [contentType, { ext }] = type;

  await clearLogoFolder(tailor_id);
  // A new file name each time, so phones and WhatsApp don't keep showing the old logo.
  const path = `${tailor_id}/logo-${Date.now()}.${ext}`;
  const bucket = db().storage.from("logos");
  const { error } = await bucket.upload(path, bytes, { contentType, upsert: true, cacheControl: "31536000" });
  if (error) {
    return { error: /bucket/i.test(error.message) ? "Logo storage isn't set up yet. Ask your admin to run the latest database setup." : "Could not upload the logo. Please try again." };
  }
  const logo_url = bucket.getPublicUrl(path).data.publicUrl;
  const { error: saveErr } = await db().from("tailors").update({ logo_url }).eq("id", tailor_id);
  if (saveErr) return { error: "Logo uploaded but not saved. Ask your admin to run the latest database setup." };
  revalidatePath("/", "layout");
  return { fields: { saved: "1" } };
}

export async function removeLogo() {
  const tailor_id = await requireTailorId();
  await clearLogoFolder(tailor_id);
  await db().from("tailors").update({ logo_url: null }).eq("id", tailor_id);
  revalidatePath("/", "layout");
}
