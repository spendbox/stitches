import { requireTailor } from "@/lib/session";
import { db } from "@/lib/supabase";
import { ButtonLink, Card, PageHeader } from "@/components/ui";
import BackLink from "@/components/BackLink";
import OrderForm from "@/components/OrderForm";

export const metadata = { title: "New order" };

export default async function NewOrder({ searchParams }: { searchParams: Promise<{ client?: string }> }) {
  const tailor = await requireTailor();
  const { client } = await searchParams;
  const { data } = await db().from("clients").select("id, full_name, phone").eq("tailor_id", tailor.id).order("full_name");
  const clients = data ?? [];
  const back = client ? `/clients/${client}` : "/orders";
  return (
    <div className="max-w-2xl">
      <PageHeader title="New order" back={<BackLink href={back} label="Back" />} />
      {clients.length === 0 ? (
        <Card className="p-6 text-sm text-muted">
          Add a client first, then create an order for them.
          <div className="mt-4"><ButtonLink href="/clients/new">Add client</ButtonLink></div>
        </Card>
      ) : (
        <OrderForm clients={clients} clientId={client} currency={tailor.currency} returnTo={back} />
      )}
    </div>
  );
}
