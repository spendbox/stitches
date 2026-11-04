import Link from "next/link";
import { CalendarClock } from "lucide-react";
import type { Order } from "@/lib/types";
import { daysUntil, date, money } from "@/lib/format";
import { StatusPill, cx } from "./ui";

export function dueText(d: string | null, status: string) {
  if (!d) return { text: "No due date", tone: "text-muted" };
  if (status === "delivered") return { text: date(d), tone: "text-muted" };
  const n = daysUntil(d)!;
  if (n < 0) return { text: `${-n} day${n === -1 ? "" : "s"} overdue`, tone: "text-danger" };
  if (n === 0) return { text: "Due today", tone: "text-warn" };
  if (n === 1) return { text: "Due tomorrow", tone: "text-warn" };
  if (n <= 7) return { text: `Due in ${n} days`, tone: "text-ink" };
  return { text: date(d), tone: "text-muted" };
}

export default function OrderRow({ order, currency, showClient = true }: { order: Order; currency: string; showClient?: boolean }) {
  const due = dueText(order.due_date, order.status);
  const balance = order.price !== null ? order.price - (order.deposit ?? 0) : null;
  return (
    <Link
      href={`/orders/${order.id}`}
      className="flex items-center gap-3 px-4 py-3.5 transition hover:bg-surface-2 sm:px-5"
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-semibold text-ink">{order.title}</p>
        <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-muted">
          {showClient && order.clients?.full_name && <span className="truncate">{order.clients.full_name}</span>}
          {showClient && order.clients?.full_name && <span aria-hidden>·</span>}
          <span className={cx("inline-flex items-center gap-1 font-medium", due.tone)}>
            <CalendarClock className="h-3.5 w-3.5" />
            {due.text}
          </span>
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <StatusPill status={order.status} />
        {balance !== null && balance > 0 && order.status !== "delivered" && (
          <span className="tnum text-xs text-muted">{money(balance, currency)} due</span>
        )}
      </div>
    </Link>
  );
}
