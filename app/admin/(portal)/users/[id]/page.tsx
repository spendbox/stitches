import { notFound } from "next/navigation";
import { Mail, Phone } from "lucide-react";
import { db } from "@/lib/supabase";
import { getPayments, getTailors, totalsByCurrency } from "@/lib/adminData";
import { date, money } from "@/lib/format";
import { deletePayment, saveAdminNote } from "@/app/actions/admin";
import { Avatar, Card, Textarea } from "@/components/ui";
import BackLink from "@/components/BackLink";
import ConfirmDelete from "@/components/ConfirmDelete";
import { AccountBadge, SetupNotice, StatusActions } from "@/components/admin/AdminUI";
import { PaymentForm } from "@/components/admin/AdminForms";
import SubmitButton from "@/components/SubmitButton";

export const dynamic = "force-dynamic";

export default async function AdminUser({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [{ tailors, setupNeeded: s1 }, { payments, setupNeeded: s2 }] = await Promise.all([getTailors(), getPayments(id)]);
  const t = tailors.find((x) => x.id === id);
  if (!t) notFound();
  const [orders, measurements] = await Promise.all([
    db().from("orders").select("id", { count: "exact", head: true }).eq("tailor_id", id),
    db().from("measurements").select("id", { count: "exact", head: true }).eq("tailor_id", id),
  ]);
  const paid = totalsByCurrency(payments);

  return (
    <div className="flex flex-col gap-6">
      {(s1 || s2) && <SetupNotice />}
      <BackLink href="/admin/users" label="All users" />

      <Card className="p-4 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <Avatar name={t.business_name} size="lg" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-2xl font-semibold tracking-tight">{t.business_name}</h1>
              <AccountBadge status={t.status} />
            </div>
            <p className="mt-1 text-sm text-muted">{t.full_name}</p>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm">
              <a href={`mailto:${t.email}`} className="flex items-center gap-1.5 text-primary hover:underline">
                <Mail className="h-4 w-4" /> {t.email}
              </a>
              {t.phone && (
                <a href={`tel:${t.phone}`} className="flex items-center gap-1.5 text-primary hover:underline">
                  <Phone className="h-4 w-4" /> {t.phone}
                </a>
              )}
            </div>
            <p className="mt-2 text-xs text-muted">
              Joined {date(t.created_at)}
              {t.approved_at && t.status === "active" && <> · Approved {date(t.approved_at)}</>}
            </p>
          </div>
          <StatusActions id={t.id} status={t.status} />
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ["Clients", t.clients],
            ["Measurement sets", measurements.count ?? 0],
            ["Orders", orders.count ?? 0],
            ["Paid to you", paid.length ? paid.map((p) => money(p.amount, p.currency)).join(" + ") : "Nothing yet"],
          ].map(([k, v]) => (
            <div key={k as string} className="rounded-xl bg-surface-2 p-3">
              <p className="tnum truncate font-display text-lg font-semibold">{v}</p>
              <p className="text-xs text-muted">{k}</p>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="flex flex-col gap-6">
          <PaymentForm user={{ id: t.id, business_name: t.business_name, full_name: t.full_name, email: t.email, currency: t.currency, status: t.status }} />
          <form action={saveAdminNote}>
            <Card className="flex flex-col gap-3 p-4 sm:p-5">
              <input type="hidden" name="id" value={t.id} />
              <label htmlFor="admin_note" className="font-display text-lg font-semibold">Private note</label>
              <Textarea id="admin_note" name="admin_note" defaultValue={t.admin_note ?? ""} placeholder="Only admins see this. e.g. Paid for 1 year, renews Nov 2027" />
              <SubmitButton variant="secondary" className="self-end">Save note</SubmitButton>
            </Card>
          </form>
        </div>

        <Card className="overflow-hidden">
          <h2 className="px-4 pb-2 pt-4 font-display text-lg font-semibold sm:px-5">Payment history</h2>
          {payments.length === 0 ? (
            <p className="px-5 pb-6 pt-2 text-sm text-muted">No payments recorded for this user.</p>
          ) : (
            <div className="divide-y divide-line">
              {payments.map((p) => (
                <div key={p.id} className="flex items-center gap-3 px-4 py-3 sm:px-5">
                  <div className="min-w-0 flex-1">
                    <p className="tnum text-sm font-semibold">{money(p.amount, p.currency)}</p>
                    <p className="truncate text-xs text-muted">
                      {date(p.paid_at)}
                      {p.method && ` · ${p.method}`}
                      {p.note && ` · ${p.note}`}
                    </p>
                  </div>
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
