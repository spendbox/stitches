import Link from "next/link";
import { getPayments, getTailors, monthKey, monthlySeries, thisMonthKey, totalsByCurrency } from "@/lib/adminData";
import { date, money } from "@/lib/format";
import { deletePayment } from "@/app/actions/admin";
import { Card } from "@/components/ui";
import ConfirmDelete from "@/components/ConfirmDelete";
import { RevenueChart, SetupNotice } from "@/components/admin/AdminUI";
import { PaymentForm } from "@/components/admin/AdminForms";

export const metadata = { title: "Revenue · Admin" };
export const dynamic = "force-dynamic";

export default async function AdminPayments() {
  const [{ tailors, setupNeeded: s1 }, { payments, setupNeeded: s2 }] = await Promise.all([getTailors(), getPayments()]);
  const all = totalsByCurrency(payments);
  const main = all[0]?.currency ?? "NGN";
  const month = totalsByCurrency(payments.filter((p) => monthKey(p.paid_at) === thisMonthKey()));
  const year = String(new Date().getFullYear());
  const thisYear = totalsByCurrency(payments.filter((p) => p.paid_at.startsWith(year)));
  const show = (t: { currency: string; amount: number }[]) => (t.length ? t.map((x) => money(x.amount, x.currency)).join(" + ") : money(0, main));

  return (
    <div className="flex flex-col gap-6">
      {(s1 || s2) && <SetupNotice />}
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">Revenue</h1>
        <p className="mt-1 text-sm text-muted">Record payments you receive offline. Totals update straight away.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          ["This month", show(month)],
          [`In ${year}`, show(thisYear)],
          ["All time", show(all)],
        ].map(([k, v]) => (
          <Card key={k} className="p-4">
            <p className="text-xs font-medium text-muted">{k}</p>
            <p className="tnum mt-1 font-display text-2xl font-semibold">{v}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        <div className="flex flex-col gap-6">
          <PaymentForm
            users={tailors.map((t) => ({ id: t.id, business_name: t.business_name, full_name: t.full_name, email: t.email, currency: t.currency, status: t.status }))}
            defaultCurrency={main}
          />
          <Card className="p-4 sm:p-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-muted">Last 12 months · {main}</p>
            <RevenueChart data={monthlySeries(payments, main, 12)} currency={main} />
          </Card>
        </div>

        <Card className="overflow-hidden">
          <h2 className="px-4 pb-2 pt-4 font-display text-lg font-semibold sm:px-5">All payments</h2>
          {payments.length === 0 ? (
            <p className="px-5 pb-6 pt-2 text-sm text-muted">No payments yet. When a user pays you, record it here.</p>
          ) : (
            <div className="divide-y divide-line">
              {payments.map((p) => (
                <div key={p.id} className="flex items-center gap-3 px-4 py-3 sm:px-5">
                  <div className="min-w-0 flex-1">
                    {p.tailor_id ? (
                      <Link href={`/admin/users/${p.tailor_id}`} className="truncate text-sm font-semibold hover:underline">{p.payer}</Link>
                    ) : (
                      <p className="truncate text-sm font-semibold">{p.payer}</p>
                    )}
                    <p className="truncate text-xs text-muted">
                      {date(p.paid_at)}
                      {p.method && ` · ${p.method}`}
                      {p.note && ` · ${p.note}`}
                    </p>
                  </div>
                  <p className="tnum shrink-0 text-sm font-semibold">{money(p.amount, p.currency)}</p>
                  <ConfirmDelete action={deletePayment} fields={{ id: p.id }} label="Delete payment" message="Delete this payment?" compact />
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
