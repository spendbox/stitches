import Link from "next/link";
import { Plus } from "lucide-react";
import { requireTailor } from "@/lib/session";
import { db } from "@/lib/supabase";
import { ButtonLink, Card, PageHeader, cx } from "@/components/ui";
import OrderRow from "@/components/OrderRow";
import { STATUS_LABEL, type Order, type OrderStatus } from "@/lib/types";

export const metadata = { title: "Orders" };

const TABS: { key: "open" | OrderStatus | "all"; label: string }[] = [
  { key: "open", label: "Open" },
  { key: "pending", label: STATUS_LABEL.pending },
  { key: "in_progress", label: STATUS_LABEL.in_progress },
  { key: "ready", label: STATUS_LABEL.ready },
  { key: "delivered", label: STATUS_LABEL.delivered },
  { key: "all", label: "All" },
];

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ s?: string }> }) {
  const tailor = await requireTailor();
  const { s = "open" } = await searchParams;
  let q = db().from("orders").select("*, clients(full_name)").eq("tailor_id", tailor.id);
  if (s === "open") q = q.neq("status", "delivered");
  else if (s !== "all") q = q.eq("status", s);
  q = s === "delivered" || s === "all"
    ? q.order("created_at", { ascending: false })
    : q.order("due_date", { ascending: true, nullsFirst: false });
  const { data } = await q.limit(300);
  const orders = (data ?? []) as Order[];

  return (
    <div>
      <PageHeader
        title="Orders"
        subtitle="Garments you’re making, and what’s due."
        action={
          <ButtonLink href="/orders/new">
            <Plus className="h-4 w-4" /> New order
          </ButtonLink>
        }
      />
      <div className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
        {TABS.map((t) => (
          <Link
            key={t.key}
            href={t.key === "open" ? "/orders" : `/orders?s=${t.key}`}
            className={cx(
              "shrink-0 rounded-full border px-3.5 py-2 text-sm font-semibold transition",
              s === t.key ? "border-primary bg-primary text-primary-ink" : "border-line bg-surface text-muted hover:text-ink"
            )}
          >
            {t.label}
          </Link>
        ))}
      </div>
      <Card className="divide-y divide-line overflow-hidden">
        {orders.length === 0 ? (
          <p className="p-6 text-sm text-muted">No orders here yet.</p>
        ) : (
          orders.map((o) => <OrderRow key={o.id} order={o} currency={tailor.currency} />)
        )}
      </Card>
    </div>
  );
}
