import Link from "next/link";
import { ArrowRight, Ruler, Users, Scissors, Wallet, ChevronRight } from "lucide-react";
import { requireTailor } from "@/lib/session";
import { db } from "@/lib/supabase";
import { Avatar, ButtonLink, Card } from "@/components/ui";
import OrderRow from "@/components/OrderRow";
import Mannequin from "@/components/Mannequin";
import { money } from "@/lib/format";
import type { Client, Order } from "@/lib/types";

export const metadata = { title: "Home" };

export default async function Dashboard() {
  const tailor = await requireTailor();
  const t = tailor.id;
  const [clients, measurements, openOrders, recent] = await Promise.all([
    db().from("clients").select("id", { count: "exact", head: true }).eq("tailor_id", t),
    db().from("measurements").select("id", { count: "exact", head: true }).eq("tailor_id", t),
    db()
      .from("orders")
      .select("*, clients(full_name)")
      .eq("tailor_id", t)
      .neq("status", "delivered")
      .order("due_date", { ascending: true, nullsFirst: false })
      .limit(50),
    db().from("clients").select("*").eq("tailor_id", t).order("updated_at", { ascending: false }).limit(6),
  ]);

  const orders = (openOrders.data ?? []) as Order[];
  const outstanding = orders.reduce((s, o) => s + Math.max(0, (o.price ?? 0) - (o.deposit ?? 0)), 0);
  const recentClients = (recent.data ?? []) as Client[];
  const first = tailor.full_name.split(" ")[0];
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const stats = [
    { label: "Clients", value: clients.count ?? 0, icon: Users, href: "/clients" },
    { label: "Measurement sets", value: measurements.count ?? 0, icon: Ruler, href: "/clients" },
    { label: "Open orders", value: orders.length, icon: Scissors, href: "/orders" },
    { label: "Balance to collect", value: money(outstanding, tailor.currency), icon: Wallet, href: "/orders" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm text-muted">{greet}, {first}</p>
        <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight sm:text-3xl">{tailor.business_name}</h1>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <Link key={label} href={href} className="group rounded-2xl border border-line bg-surface p-4 transition hover:border-primary/40">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <Icon className="h-[18px] w-[18px]" />
            </span>
            <p className="tnum mt-3 truncate font-display text-2xl font-semibold text-ink">{value}</p>
            <p className="text-xs font-medium text-muted">{label}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between px-4 pb-2 pt-4 sm:px-5">
            <h2 className="font-display text-lg font-semibold">Coming up</h2>
            <Link href="/orders" className="flex items-center gap-1 text-sm font-semibold text-primary">
              All orders <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {orders.length === 0 ? (
            <div className="px-5 pb-6 pt-2 text-sm text-muted">
              No open orders. Add one from a client’s page when they book a garment.
            </div>
          ) : (
            <div className="divide-y divide-line">
              {orders.slice(0, 6).map((o) => (
                <OrderRow key={o.id} order={o} currency={tailor.currency} />
              ))}
            </div>
          )}
        </Card>

        <Card className="overflow-hidden">
          <div className="flex items-center justify-between px-4 pb-2 pt-4 sm:px-5">
            <h2 className="font-display text-lg font-semibold">Recent clients</h2>
            <Link href="/clients" className="flex items-center gap-1 text-sm font-semibold text-primary">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {recentClients.length === 0 ? (
            <div className="flex items-center gap-4 px-5 pb-6 pt-2">
              <Mannequin figure="female" showAll className="h-36 w-auto shrink-0" />
              <div>
                <p className="text-sm text-muted">Add your first client and take their measurements on the mannequin guide.</p>
                <ButtonLink href="/clients/new" className="mt-3">Add client</ButtonLink>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-line">
              {recentClients.map((c) => (
                <Link key={c.id} href={`/clients/${c.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-surface-2 sm:px-5">
                  <Avatar name={c.full_name} gender={c.gender} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{c.full_name}</p>
                    <p className="truncate text-xs text-muted">{c.phone ?? c.email ?? "No contact saved"}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted" />
                </Link>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
