import { db } from "./supabase";
import type { AccountStatus, Payment } from "./types";

export type AdminTailor = {
  id: string;
  business_name: string;
  full_name: string;
  email: string;
  phone: string | null;
  currency: string;
  created_at: string;
  status: AccountStatus;
  approved_at: string | null;
  admin_note: string | null;
  logo_url: string | null;
  clients: number;
};

/** True when the admin columns/tables from the latest schema.sql are missing. */
export function isSchemaError(e: { message?: string; code?: string } | null | undefined) {
  if (!e) return false;
  return e.code === "42P01" || e.code === "42703" || e.code === "PGRST205" || e.code === "PGRST204" || /does not exist|schema cache/i.test(e.message ?? "");
}

export async function getTailors(): Promise<{ tailors: AdminTailor[]; setupNeeded: boolean }> {
  const { data, error } = await db()
    .from("tailors")
    .select("*, clients(count)")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  const tailors = (data ?? []).map((t) => {
    const { password_hash: _p, clients, ...rest } = t as Record<string, unknown> & { clients?: { count: number }[] };
    void _p;
    return {
      ...(rest as Omit<AdminTailor, "clients" | "status">),
      status: ((rest.status as AccountStatus) ?? "trial") as AccountStatus,
      approved_at: (rest.approved_at as string) ?? null,
      admin_note: (rest.admin_note as string) ?? null,
      logo_url: (rest.logo_url as string) ?? null,
      clients: clients?.[0]?.count ?? 0,
    } as AdminTailor;
  });
  const setupNeeded = Boolean(data?.length && !("status" in (data[0] as object)));
  return { tailors, setupNeeded };
}

export async function getPayments(tailorId?: string): Promise<{ payments: Payment[]; setupNeeded: boolean }> {
  let q = db().from("payments").select("*").order("paid_at", { ascending: false }).order("created_at", { ascending: false });
  if (tailorId) q = q.eq("tailor_id", tailorId);
  const { data, error } = await q;
  if (error) {
    if (isSchemaError(error)) return { payments: [], setupNeeded: true };
    throw new Error(error.message);
  }
  return { payments: (data ?? []).map((p) => ({ ...p, amount: Number(p.amount) })) as Payment[], setupNeeded: false };
}

/** Sum amounts per currency, largest first. */
export function totalsByCurrency(payments: Payment[]) {
  const m = new Map<string, number>();
  for (const p of payments) m.set(p.currency, (m.get(p.currency) ?? 0) + p.amount);
  return [...m.entries()].map(([currency, amount]) => ({ currency, amount })).sort((a, b) => b.amount - a.amount);
}

export function monthKey(d: string) {
  return d.slice(0, 7); // YYYY-MM
}

/** The last `n` months (oldest first) with the total received in `currency`. */
export function monthlySeries(payments: Payment[], currency: string, n = 6) {
  const now = new Date();
  const months: { key: string; label: string; amount: number }[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    months.push({ key, label: d.toLocaleDateString("en-GB", { month: "short" }), amount: 0 });
  }
  for (const p of payments) {
    if (p.currency !== currency) continue;
    const m = months.find((x) => x.key === monthKey(p.paid_at));
    if (m) m.amount += p.amount;
  }
  return months;
}

export function thisMonthKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
