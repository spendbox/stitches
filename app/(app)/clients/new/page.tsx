import { PageHeader } from "@/components/ui";
import BackLink from "@/components/BackLink";
import ClientForm from "@/components/ClientForm";

export const metadata = { title: "New client" };

export default function NewClient() {
  return (
    <div>
      <PageHeader title="New client" back={<BackLink href="/clients" label="Clients" />} />
      <ClientForm />
    </div>
  );
}
