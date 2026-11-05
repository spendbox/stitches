import Link from "next/link";
import { ArrowRight, Ban, Clock, ShieldCheck, Users } from "lucide-react";
import { getPayments, getTailors, monthlySeries, thisMonthKey, totalsByCurrency, monthKey } from "@/lib/adminData";
import { date, money } from "@/lib/format";
import { Card } from "@/components/ui";
import { AccountBadge, RevenueChart, SetupNotice, StatusActions } from "@/components/admin/AdminUI";
import BusinessLogo from "@/components/BusinessLogo";

export const metadata = { title: "Admin" };
export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const [{ tailors, setupNeeded: s1 }, { payments, setupNeeded: s2 }] = await Promise.all([getTailors(), getPayments()]);
  const count = (s: string) => tailors.filter((t) => t.status === s).length;
  const all = totalsByCurrency(payments);
  const main = all[0]?.currency ?? "NGN";
  const month = totalsByCurrency(payments.filter((p) => monthKey(p.paid_at) === thisMonthKey()));
  const waiting = tailors.filter((t) => t.status === "trial").slice(0, 8);

  const stats = [
    { label: "All users", value: tailors.length, icon: Users, href: "/admin/users", tone: "bg-primary-soft text-primary" },
    { label: "On trial", value: count("trial"), icon: Clock, href: "/admin/users?status=trial", tone: "bg-tape-soft text-warn" },
    { label: "Paid", value: count("active"), icon: ShieldCheck, href: "/admin/users?status=active", tone: "bg-ok-soft text-ok" },
    { label: "Blocked", value: count("blocked"), icon: Ban, href: "/admin/users?status=blocked", tone: "bg-danger-soft text-danger" },
  ];

  return (
    <div className="flex flex-col gap-6">
      {(s1 || s2) && <SetupNotice />}
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">Overview</h1>
        <p className="mt-1 text-sm text-muted">Users, approvals and money received.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, href, tone }) => (
          <Link key={label} href={href} className="rounded-2xl border border-line bg-surface p-4 transition hover:border-primary/40">
            <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${tone}`}>
              <Icon className="h-[18px] w-[18px]" />
            </span>
            <p className="tnum mt-3 font-display text-2xl font-semibold">{value}</p>
            <p className="text-xs font-medium text-muted">{label}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Card className="p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-muted">Received this month</p>
              <p className="tnum mt-1 font-display text-3xl font-semibold">{money(month.find((m) => m.currency === main)?.amount ?? 0, main)}</p>
              {month.filter((m) => m.currency !== main).map((m) => (
                <p key={m.currency} className="tnum text-sm text-muted">+ {money(m.amount, m.currency)}</p>
              ))}
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-muted">All time</p>
              {all.length === 0 ? (
                <p className="tnum mt-1 font-display text-xl font-semibold">{money(0, main)}</p>
              ) : (
                all.map((m) => <p key={m.currency} className="tnum mt-1 font-display text-xl font-semibold">{money(m.amount, m.currency)}</p>)
              )}
            </div>
          </div>
          <p className="mt-6 mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-muted">Last 6 months · {main}</p>
          <RevenueChart data={monthlySeries(payments, main)} currency={main} />
          <Link href="/admin/payments" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
            Record or view payments <ArrowRight className="h-4 w-4" />
          </Link>
        </Card>

        <Card className="overflow-hidden">
          <div className="flex items-center justify-between px-4 pb-2 pt-4 sm:px-5">
            <h2 className="font-display text-lg font-semibold">Waiting for payment</h2>
            <Link href="/admin/users?status=trial" className="flex items-center gap-1 text-sm font-semibold text-primary">
              All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {waiting.length === 0 ? (
            <p className="px-5 pb-6 pt-2 text-sm text-muted">No one on trial right now.</p>
          ) : (
            <div className="divide-y divide-line">
              {waiting.map((t) => (
                <div key={t.id} className="flex flex-col gap-3 px-4 py-3 sm:px-5">
                  <Link href={`/admin/users/${t.id}`} className="flex min-w-0 items-center gap-3">
                    <BusinessLogo name={t.business_name} url={t.logo_url} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{t.business_name}</p>
                      <p className="truncate text-xs text-muted">Joined {date(t.created_at)} · {t.clients} clients</p>
                    </div>
                  </Link>
                  <StatusActions id={t.id} status={t.status} compact />
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="flex items-center justify-between px-4 pb-2 pt-4 sm:px-5">
          <h2 className="font-display text-lg font-semibold">Newest sign-ups</h2>
          <Link href="/admin/users" className="flex items-center gap-1 text-sm font-semibold text-primary">
            All users <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="divide-y divide-line">
          {tailors.slice(0, 5).map((t) => (
            <Link key={t.id} href={`/admin/users/${t.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-surface-2 sm:px-5">
              <BusinessLogo name={t.business_name} url={t.logo_url} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{t.business_name}</p>
                <p className="truncate text-xs text-muted">{t.email}</p>
              </div>
              <AccountBadge status={t.status} />
            </Link>
          ))}
          {tailors.length === 0 && <p className="px-5 pb-6 pt-2 text-sm text-muted">No one has signed up yet.</p>}
        </div>
      </Card>
    </div>
  );
}
