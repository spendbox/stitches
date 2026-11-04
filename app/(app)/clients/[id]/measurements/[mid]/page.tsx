import { notFound } from "next/navigation";
import { requireTailor } from "@/lib/session";
import { getClient } from "@/lib/queries";
import { db } from "@/lib/supabase";
import { PageHeader } from "@/components/ui";
import BackLink from "@/components/BackLink";
import MeasurementForm from "@/components/MeasurementForm";
import ConfirmDelete from "@/components/ConfirmDelete";
import { deleteMeasurement } from "@/app/actions/data";
import { toFigure } from "@/lib/measurements";
import type { Measurement } from "@/lib/types";

export const metadata = { title: "Edit measurements" };

export default async function EditMeasurement({ params }: { params: Promise<{ id: string; mid: string }> }) {
  const { id, mid } = await params;
  const tailor = await requireTailor();
  const client = await getClient(tailor.id, id);
  if (!/^[0-9a-f-]{36}$/i.test(mid)) notFound();
  const { data } = await db().from("measurements").select("*").eq("id", mid).eq("tailor_id", tailor.id).maybeSingle();
  if (!data) notFound();
  return (
    <div>
      <PageHeader
        title="Edit measurements"
        subtitle={client.full_name}
        back={<BackLink href={`/clients/${id}`} label={client.full_name} />}
        action={
          <ConfirmDelete action={deleteMeasurement} fields={{ id: mid, client_id: id }} label="Delete set" message="Delete this measurement set?" />
        }
      />
      <MeasurementForm clientId={id} figure={toFigure(client.gender)} defaultUnit={tailor.unit} existing={data as Measurement} />
    </div>
  );
}
