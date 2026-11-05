import Link from "next/link";
import { Search } from "lucide-react";
import { getTailors } from "@/lib/adminData";
import { date } from "@/lib/format";
import { Avatar, Card, cx, inputCls } from "@/components/ui";
import { AccountBadge, SetupNotice, StatusActions } from "@/components/admin/AdminUI";

export const metadata = { title: "Users · Admin" };
export const dynamic = "force-dynamic";

const FILTERS = [
  { key: "", label: "All" },
  { key: "trial", label: "Trial" },
  { key: "active", label: "Paid" },
  { key: "blocked", label: "Blocked" },
];

export default async function AdminUsers({ searchParams }: { searchParams: Promise<{ q?: string; status?: string }> }) {
  const { q = "", status = "" } = await searchParams;
  const { tailors, setupNeeded } = await getTailors();
  const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const shown = tailors.filter(
    (t) =>
      (!status || t.status === status) &&
      words.every((w) => `${t.business_name} ${t.full_name} ${t.email} ${t.phone ?? ""}`.toLowerCase().includes(w))
  );
  const href = (s: string) => `/admin/users?${new URLSearchParams({ ...(q ? { q } : {}), ...(s ? { status: s } : {}) })}`;

  return (
    <div className="flex flex-col gap-5">
      {setupNeeded && <SetupNotice />}
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">Users</h1>
        <p className="mt-1 text-sm text-muted">{tailors.length} workshops signed up.</p>
      </div>

      <form className="relative">
        {status && <input type="hidden" name="status" value={status} />}
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted" />
        <input name="q" defaultValue={q} placeholder="Search business, name, email or phone" className={cx(inputCls, "pl-10")} type="search" />
      </form>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        {FILTERS.map((f) => {
          const n = f.key ? tailors.filter((t) => t.status === f.key).length : tailors.length;
          return (
            <Link
              key={f.key}
              href={href(f.key)}
              className={cx(
                "flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-sm font-semibold",
                status === f.key ? "border-primary bg-primary text-primary-ink" : "border-line bg-surface text-muted hover:text-ink"
              )}
            >
              {f.label} <span className="tnum opacity-70">{n}</span>
            </Link>
          );
        })}
      </div>

      <Card className="overflow-hidden">
        {shown.length === 0 ? (
          <p className="p-6 text-sm text-muted">No users match.</p>
        ) : (
          <div className="divide-y divide-line">
            {shown.map((t) => (
              <div key={t.id} className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:px-5">
                <Link href={`/admin/users/${t.id}`} className="flex min-w-0 flex-1 items-center gap-3">
                  <Avatar name={t.business_name} size="sm" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-semibold hover:underline">{t.business_name}</p>
                      <AccountBadge status={t.status} />
                    </div>
                    <p className="truncate text-xs text-muted">
                      {t.full_name} · {t.email}
                    </p>
                    <p className="text-xs text-muted">
                      Joined {date(t.created_at)} · {t.clients} clients
                    </p>
                  </div>
                </Link>
                <StatusActions id={t.id} status={t.status} compact />
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
