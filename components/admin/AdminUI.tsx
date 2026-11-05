import { Ban, CheckCircle2, Clock, RotateCcw, ShieldCheck, TriangleAlert } from "lucide-react";
import { setTailorStatus } from "@/app/actions/admin";
import { money } from "@/lib/format";
import type { AccountStatus } from "@/lib/types";
import { cx } from "../ui";

const meta: Record<AccountStatus, { label: string; cls: string; Icon: typeof Clock }> = {
  trial: { label: "Trial", cls: "bg-tape-soft text-warn", Icon: Clock },
  active: { label: "Paid", cls: "bg-ok-soft text-ok", Icon: ShieldCheck },
  blocked: { label: "Blocked", cls: "bg-danger-soft text-danger", Icon: Ban },
};

export function AccountBadge({ status }: { status: AccountStatus }) {
  const { label, cls, Icon } = meta[status] ?? meta.trial;
  return (
    <span className={cx("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold", cls)}>
      <Icon className="h-3.5 w-3.5" /> {label}
    </span>
  );
}

/** Approve / block / unblock buttons for one user. */
export function StatusActions({ id, status, compact }: { id: string; status: AccountStatus; compact?: boolean }) {
  const btn = cx(
    "inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold transition",
    compact ? "h-9 px-3 text-xs" : "h-10 px-4 text-sm"
  );
  const Act = ({ to, children, cls }: { to: AccountStatus; children: React.ReactNode; cls: string }) => (
    <form action={setTailorStatus}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={to} />
      <button className={cx(btn, cls)}>{children}</button>
    </form>
  );
  return (
    <div className="flex flex-wrap gap-2">
      {status !== "active" && status !== "blocked" && (
        <Act to="active" cls="bg-primary text-primary-ink hover:opacity-90">
          <CheckCircle2 className="h-4 w-4" /> Approve
        </Act>
      )}
      {status === "active" && (
        <Act to="trial" cls="border border-line bg-surface text-ink hover:bg-surface-2">
          <RotateCcw className="h-4 w-4" /> Back to trial
        </Act>
      )}
      {status === "blocked" ? (
        <Act to="trial" cls="border border-line bg-surface text-ink hover:bg-surface-2">
          <RotateCcw className="h-4 w-4" /> Unblock
        </Act>
      ) : (
        <Act to="blocked" cls="text-danger hover:bg-danger-soft">
          <Ban className="h-4 w-4" /> Block
        </Act>
      )}
    </div>
  );
}

export function SetupNotice() {
  return (
    <div className="mb-6 flex gap-3 rounded-2xl border border-tape/40 bg-tape-soft p-4 text-sm">
      <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-warn" />
      <div>
        <p className="font-semibold text-ink">One-time database update needed</p>
        <p className="mt-1 text-muted">
          Open Supabase → SQL Editor → New query, paste everything from <code className="font-mono text-ink">supabase/schema.sql</code> and click Run.
          This adds user status (trial, paid, blocked) and the payments list. Your existing data is kept.
        </p>
      </div>
    </div>
  );
}

/** Single-series monthly revenue bars. Hover (or tap) a bar for the exact amount. */
export function RevenueChart({ data, currency }: { data: { key: string; label: string; amount: number }[]; currency: string }) {
  const max = Math.max(...data.map((d) => d.amount), 1);
  const last = data[data.length - 1];
  return (
    <figure>
      <div className="flex h-44 items-end gap-2 border-b border-line sm:gap-3" aria-hidden="true">
        {data.map((d) => {
          const h = d.amount > 0 ? Math.max(3, (d.amount / max) * 100) : 0;
          return (
            <div key={d.key} tabIndex={0} className="group relative flex h-full flex-1 items-end justify-center outline-none">
              <span className="pointer-events-none absolute bottom-full z-10 mb-1 hidden whitespace-nowrap rounded-lg border border-line bg-surface px-2 py-1 text-xs font-semibold text-ink shadow-md group-hover:block group-focus:block" style={{ bottom: `${h}%` }}>
                {money(d.amount, currency)}
              </span>
              <div
                className={cx("w-full max-w-10 rounded-t-[4px] transition", d.key === last.key ? "bg-primary" : "bg-primary/45 group-hover:bg-primary/70")}
                style={{ height: `${h}%` }}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex gap-2 sm:gap-3" aria-hidden="true">
        {data.map((d) => (
          <span key={d.key} className="flex-1 text-center text-xs text-muted">{d.label}</span>
        ))}
      </div>
      <table className="sr-only">
        <caption>Revenue per month in {currency}</caption>
        <tbody>
          {data.map((d) => (
            <tr key={d.key}><th>{d.label}</th><td>{money(d.amount, currency)}</td></tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
