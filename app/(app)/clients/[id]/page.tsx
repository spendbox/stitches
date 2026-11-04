import Link from "next/link";
import { Mail, MapPin, Pencil, Phone, Plus } from "lucide-react";
import { requireTailor } from "@/lib/session";
import { getClient } from "@/lib/queries";
import { db } from "@/lib/supabase";
import { Avatar, ButtonLink, Card } from "@/components/ui";
import BackLink from "@/components/BackLink";
import MeasurementViewer from "@/components/MeasurementViewer";
import OrderRow from "@/components/OrderRow";
import { toFigure } from "@/lib/measurements";
import type { Measurement, Order } from "@/lib/types";

export default async function ClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tailor = await requireTailor();
  const client = await getClient(tailor.id, id);
  const [m, o] = await Promise.all([
    db().from("measurements").select("*").eq("client_id", id).eq("tailor_id", tailor.id).order("taken_at", { ascending: false }).order("created_at", { ascending: false }),
    db().from("orders").select("*").eq("client_id", id).eq("tailor_id", tailor.id).order("created_at", { ascending: false }),
  ]);
  const sets = (m.data ?? []) as Measurement[];
  const orders = (o.data ?? []) as Order[];
  const figure = toFigure(client.gender);

  const contact = [
    client.phone && { icon: Phone, text: client.phone, href: `tel:${client.phone}` },
    client.email && { icon: Mail, text: client.email, href: `mailto:${client.email}` },
    client.address && { icon: MapPin, text: client.address },
  ].filter(Boolean) as { icon: typeof Phone; text: string; href?: string }[];

  return (
    <div className="flex flex-col gap-6">
      <BackLink href="/clients" label="Clients" />
      <div className="flex flex-wrap items-center gap-4">
        <Avatar name={client.full_name} gender={client.gender} size="lg" />
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">{client.full_name}</h1>
          <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
            {contact.length === 0 && <span>No contact details saved</span>}
            {contact.map(({ icon: Icon, text, href }) =>
              href ? (
                <a key={text} href={href} className="inline-flex items-center gap-1.5 hover:text-primary">
                  <Icon className="h-4 w-4" /> {text}
                </a>
              ) : (
                <span key={text} className="inline-flex items-center gap-1.5">
                  <Icon className="h-4 w-4" /> {text}
                </span>
              )
            )}
          </div>
        </div>
        <ButtonLink href={`/clients/${id}/edit`} variant="secondary" className="h-10">
          <Pencil className="h-4 w-4" /> Edit
        </ButtonLink>
      </div>

      {client.notes && (
        <p className="rounded-2xl border border-tape/40 bg-tape-soft px-4 py-3 text-sm text-ink">{client.notes}</p>
      )}

      <section>
        <h2 className="mb-3 font-display text-lg font-semibold">Measurements</h2>
        <MeasurementViewer sets={sets} figure={figure} clientId={id} clientName={client.full_name} />
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Orders</h2>
          <Link href={`/orders/new?client=${id}`} className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
            <Plus className="h-4 w-4" /> New order
          </Link>
        </div>
        <Card className="divide-y divide-line overflow-hidden">
          {orders.length === 0 ? (
            <p className="p-5 text-sm text-muted">No orders yet for {client.full_name.split(" ")[0]}.</p>
          ) : (
            orders.map((ord) => <OrderRow key={ord.id} order={ord} currency={tailor.currency} showClient={false} />)
          )}
        </Card>
      </section>
    </div>
  );
}
