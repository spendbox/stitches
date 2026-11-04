import Link from "next/link";
import { notFound } from "next/navigation";
import { requireTailor } from "@/lib/session";
import { db } from "@/lib/supabase";
import { Card, PageHeader, StatusPill, cx } from "@/components/ui";
import BackLink from "@/components/BackLink";
import OrderForm from "@/components/OrderForm";
import ConfirmDelete from "@/components/ConfirmDelete";
import { deleteOrder, setOrderStatus } from "@/app/actions/data";
import { money } from "@/lib/format";
import { STATUS_LABEL, type Order, type OrderStatus } from "@/lib/types";

export const metadata = { title: "Order" };

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const tailor = await requireTailor();
  const [{ data }, { data: clients }] = await Promise.all([
    db().from("orders").select("*, clients(full_name)").eq("id", id).eq("tailor_id", tailor.id).maybeSingle(),
    db().from("clients").select("id, full_name").eq("tailor_id", tailor.id).order("full_name"),
  ]);
  if (!data) notFound();
  const order = data as Order;
  const balance = order.price !== null ? order.price - (order.deposit ?? 0) : null;
  const steps = Object.keys(STATUS_LABEL) as OrderStatus[];

  return (
    <div className="max-w-2xl">
      <PageHeader
        title={order.title}
        subtitle={
          <Link href={`/clients/${order.client_id}`} className="font-medium text-primary hover:underline">
            {order.clients?.full_name}
          </Link>
        }
        back={<BackLink href="/orders" label="Orders" />}
        action={<StatusPill status={order.status} />}
      />

      <Card className="mb-5 p-4 sm:p-5">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">Move to</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {steps.map((st) => (
            <form key={st} action={setOrderStatus}>
              <input type="hidden" name="id" value={order.id} />
              <input type="hidden" name="client_id" value={order.client_id} />
              <input type="hidden" name="status" value={st} />
              <button
                className={cx(
                  "h-11 w-full rounded-xl border text-sm font-semibold transition",
                  order.status === st ? "border-primary bg-primary text-primary-ink" : "border-line hover:bg-surface-2"
                )}
              >
                {STATUS_LABEL[st]}
              </button>
            </form>
          ))}
        </div>
        {balance !== null && (
          <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-surface-2 p-3 text-center">
            <div><p className="text-xs text-muted">Price</p><p className="tnum font-semibold">{money(order.price, tailor.currency)}</p></div>
            <div><p className="text-xs text-muted">Paid</p><p className="tnum font-semibold">{money(order.deposit ?? 0, tailor.currency)}</p></div>
            <div><p className="text-xs text-muted">Balance</p><p className={cx("tnum font-semibold", balance > 0 ? "text-warn" : "text-ok")}>{money(balance, tailor.currency)}</p></div>
          </div>
        )}
      </Card>

      <OrderForm order={order} clients={clients ?? []} currency={tailor.currency} returnTo={`/orders/${order.id}`} />
      <div className="mt-6">
        <ConfirmDelete action={deleteOrder} fields={{ id: order.id, return_to: "/orders" }} label="Delete order" message="Delete this order?" />
      </div>
    </div>
  );
}
