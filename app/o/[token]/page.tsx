import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { CalendarClock, Check, Clock, MessageCircle, Phone, Scissors, Shirt, PartyPopper } from "lucide-react";
import { db } from "@/lib/supabase";
import { date, daysUntil, money, waNumber } from "@/lib/format";
import { LogoMark } from "@/components/Logo";
import { cx } from "@/components/ui";
import type { OrderStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

type Row = {
  title: string;
  status: OrderStatus;
  due_date: string | null;
  price: number | null;
  deposit: number | null;
  updated_at: string | null;
  clients: { full_name: string } | null;
  tailors: { business_name: string; phone: string | null; currency: string; status?: string } | null;
};

/** One small query; only what the client should see (no notes, no measurements). */
const getOrder = cache(async (token: string): Promise<Row | null> => {
  if (!/^[0-9a-f]{32}$/.test(token)) return null;
  const { data } = await db()
    .from("orders")
    .select("title, status, due_date, price, deposit, updated_at, clients(full_name), tailors(*)")
    .eq("share_token", token)
    .maybeSingle();
  if (!data) return null;
  const row = data as unknown as Row & { tailors: Record<string, unknown> | null };
  const t = row.tailors;
  return {
    ...row,
    tailors: t
      ? { business_name: String(t.business_name), phone: (t.phone as string) ?? null, currency: String(t.currency), status: t.status as string | undefined }
      : null,
  };
});

export async function generateMetadata({ params }: { params: Promise<{ token: string }> }): Promise<Metadata> {
  const o = await getOrder((await params).token);
  return {
    title: { absolute: o ? `${o.title} · ${o.tailors?.business_name}` : "Order not found" },
    description: o ? `Check the progress of your order from ${o.tailors?.business_name}.` : undefined,
    robots: { index: false, follow: false },
  };
}

const STEPS: { key: OrderStatus; label: string; text: string; Icon: typeof Clock }[] = [
  { key: "pending", label: "Booked", text: "Your order is booked and waiting to be cut.", Icon: Clock },
  { key: "in_progress", label: "Sewing", text: "Your garment is being sewn right now.", Icon: Scissors },
  { key: "ready", label: "Ready", text: "Your garment is ready. Come for pickup or fitting.", Icon: Shirt },
  { key: "delivered", label: "Delivered", text: "Delivered. Thank you for your patronage!", Icon: PartyPopper },
];

export default async function ClientOrder({ params }: { params: Promise<{ token: string }> }) {
  const o = await getOrder((await params).token);
  if (!o || !o.tailors || o.tailors.status === "blocked") notFound();

  const t = o.tailors;
  const current = STEPS.findIndex((s) => s.key === o.status);
  const step = STEPS[current];
  const first = o.clients?.full_name.split(" ")[0];
  const balance = o.price !== null ? Math.max(0, o.price - (o.deposit ?? 0)) : null;
  const n = daysUntil(o.due_date);
  const dueLine =
    !o.due_date || o.status === "delivered"
      ? null
      : n === 0
        ? "Due today"
        : n === 1
          ? "Due tomorrow"
          : n !== null && n > 1 && n <= 14
            ? `Due in ${n} days`
            : null;
  const wa = waNumber(t.phone, t.currency);
  const waText = encodeURIComponent(`Hello ${t.business_name}, I'm checking on my ${o.title}.`);

  return (
    <div className="min-h-dvh px-4 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))]">
      <div className="mx-auto flex w-full max-w-md flex-col gap-4">
        <header className="flex items-center gap-3 py-2">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary font-display text-lg font-semibold text-primary-ink">
            {t.business_name.trim()[0]?.toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate font-display text-lg font-semibold leading-tight">{t.business_name}</p>
            <p className="text-xs text-muted">Order status</p>
          </div>
        </header>

        <section className="overflow-hidden rounded-3xl border border-line bg-surface">
          <div className="p-5">
            {first && <p className="text-sm text-muted">Hello {first},</p>}
            <h1 className="mt-1 font-display text-2xl font-semibold leading-tight tracking-tight">{o.title}</h1>
            <div
              className={cx(
                "mt-4 flex items-center gap-3 rounded-2xl p-3.5",
                o.status === "ready" ? "bg-ok-soft text-ok" : o.status === "delivered" ? "bg-primary-soft text-primary" : o.status === "in_progress" ? "bg-info-soft text-info" : "bg-surface-2 text-ink"
              )}
            >
              <step.Icon className="h-6 w-6 shrink-0" />
              <div>
                <p className="font-display text-lg font-semibold leading-tight">{step.label}</p>
                <p className="text-sm opacity-90">{step.text}</p>
              </div>
            </div>
          </div>

          {/* Progress steps */}
          <ol className="grid grid-cols-4 gap-1 border-t border-line px-3 py-4">
            {STEPS.map((s, i) => {
              const done = i < current;
              const on = i === current;
              return (
                <li key={s.key} className="relative flex flex-col items-center gap-1.5 text-center">
                  {i > 0 && <span className={cx("absolute right-1/2 top-3.5 h-0.5 w-full -translate-y-1/2", i <= current ? "bg-primary" : "bg-line")} />}
                  <span
                    className={cx(
                      "relative z-10 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold",
                      done ? "bg-primary text-primary-ink" : on ? "bg-tape text-tape-ink ring-4 ring-tape/25" : "bg-surface-2 text-muted"
                    )}
                  >
                    {done ? <Check className="h-4 w-4" /> : i + 1}
                  </span>
                  <span className={cx("text-[11px] font-semibold", on ? "text-ink" : "text-muted")}>{s.label}</span>
                </li>
              );
            })}
          </ol>

          {o.due_date && (
            <div className="flex items-center gap-3 border-t border-line px-5 py-4">
              <CalendarClock className="h-5 w-5 shrink-0 text-muted" />
              <div className="flex-1">
                <p className="text-xs text-muted">{o.status === "delivered" ? "Was due" : "Expected"}</p>
                <p className="font-semibold">{date(o.due_date, { weekday: "long", day: "numeric", month: "long" })}</p>
              </div>
              {dueLine && <span className="rounded-full bg-tape-soft px-2.5 py-1 text-xs font-semibold text-warn">{dueLine}</span>}
            </div>
          )}

          {o.price !== null && (
            <div className="grid grid-cols-3 border-t border-line text-center">
              {[
                ["Price", money(o.price, t.currency)],
                ["Paid", money(o.deposit ?? 0, t.currency)],
                ["Balance", money(balance, t.currency)],
              ].map(([k, v], i) => (
                <div key={k} className={cx("px-2 py-4", i > 0 && "border-l border-line")}>
                  <p className="text-xs text-muted">{k}</p>
                  <p className={cx("tnum mt-0.5 font-semibold", k === "Balance" && (balance ? "text-warn" : "text-ok"))}>{v}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {t.phone && (
          <div className="grid grid-cols-2 gap-2">
            <a href={`tel:${t.phone}`} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-line bg-surface text-sm font-semibold hover:bg-surface-2">
              <Phone className="h-4 w-4" /> Call
            </a>
            <a
              href={`https://wa.me/${wa}?text=${waText}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#1f8a4c] text-sm font-semibold text-white hover:opacity-90"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
          </div>
        )}

        {o.updated_at && <p className="text-center text-xs text-muted">Last updated {date(o.updated_at, { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })}</p>}

        <Link href="/" className="mx-auto mt-4 flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-medium text-muted hover:text-ink">
          <LogoMark className="h-5 w-5" /> Tailor? Manage your orders with Onepad
        </Link>
      </div>
    </div>
  );
}
