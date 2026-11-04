import Link from "next/link";
import { ChevronRight, Phone, Plus, Search } from "lucide-react";
import { requireTailor } from "@/lib/session";
import { db } from "@/lib/supabase";
import { Avatar, ButtonLink, Card, PageHeader, inputCls, cx } from "@/components/ui";
import Mannequin from "@/components/Mannequin";
import { date } from "@/lib/format";
import type { Client } from "@/lib/types";

export const metadata = { title: "Clients" };

export default async function ClientsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const tailor = await requireTailor();
  const { q = "" } = await searchParams;
  const term = q.trim().replace(/[%,()]/g, "");

  let query = db()
    .from("clients")
    .select("*, measurements(count)")
    .eq("tailor_id", tailor.id)
    .order("full_name", { ascending: true })
    .limit(500);
  if (term) query = query.or(`full_name.ilike.%${term}%,phone.ilike.%${term}%,email.ilike.%${term}%`);
  const { data } = await query;
  const clients = (data ?? []) as (Client & { measurements: { count: number }[] })[];

  return (
    <div>
      <PageHeader
        title="Clients"
        subtitle={`${clients.length} ${clients.length === 1 ? "client" : "clients"}${term ? ` matching “${term}”` : ""}`}
        action={
          <ButtonLink href="/clients/new" className="hidden sm:inline-flex">
            <Plus className="h-4 w-4" /> New client
          </ButtonLink>
        }
      />

      <form className="relative mb-5">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted" />
        <input
          id="client-search"
          name="q"
          defaultValue={q}
          type="search"
          placeholder="Search by name, phone or email"
          className={cx(inputCls, "h-12 pl-10")}
        />
      </form>

      {clients.length === 0 ? (
        <Card className="flex flex-col items-center px-6 py-10 text-center">
          <Mannequin figure="male" showAll className="h-44 w-auto" />
          <h2 className="mt-4 font-display text-lg font-semibold">{term ? "No clients found" : "No clients yet"}</h2>
          <p className="mt-1 max-w-xs text-sm text-muted">
            {term ? "Try a different name or phone number." : "Add a client, then record their measurements on the mannequin guide."}
          </p>
          {!term && <ButtonLink href="/clients/new" className="mt-5"><Plus className="h-4 w-4" /> Add your first client</ButtonLink>}
        </Card>
      ) : (
        <Card className="divide-y divide-line overflow-hidden">
          {clients.map((c) => {
            const sets = c.measurements?.[0]?.count ?? 0;
            return (
              <Link key={c.id} href={`/clients/${c.id}`} className="flex items-center gap-3 px-4 py-3.5 transition hover:bg-surface-2 sm:px-5">
                <Avatar name={c.full_name} gender={c.gender} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-semibold">{c.full_name}</p>
                  <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-muted">
                    {c.phone ? (<><Phone className="h-3 w-3" /> {c.phone}</>) : (c.email ?? "No contact saved")}
                  </p>
                </div>
                <div className="hidden text-right sm:block">
                  <p className="tnum text-sm font-semibold">{sets} {sets === 1 ? "set" : "sets"}</p>
                  <p className="text-xs text-muted">Updated {date(c.updated_at, { day: "numeric", month: "short" })}</p>
                </div>
                <span className={cx("tnum rounded-full px-2 py-0.5 text-xs font-semibold sm:hidden", sets ? "bg-primary-soft text-primary" : "bg-surface-2 text-muted")}>
                  {sets}
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted" />
              </Link>
            );
          })}
        </Card>
      )}
    </div>
  );
}
