import { requireTailor } from "@/lib/session";
import { getClient } from "@/lib/queries";
import { PageHeader } from "@/components/ui";
import BackLink from "@/components/BackLink";
import ClientForm from "@/components/ClientForm";
import ConfirmDelete from "@/components/ConfirmDelete";
import { deleteClient } from "@/app/actions/data";

export const metadata = { title: "Edit client" };

export default async function EditClient({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tailor = await requireTailor();
  const client = await getClient(tailor.id, id);
  return (
    <div>
      <PageHeader title="Edit client" back={<BackLink href={`/clients/${id}`} label={client.full_name} />} />
      <ClientForm client={client} />
      <div className="mt-6">
        <ConfirmDelete
          action={deleteClient}
          fields={{ id }}
          label="Delete client"
          message="This removes the client with all their measurements and orders."
        />
      </div>
    </div>
  );
}
