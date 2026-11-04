import { requireTailor } from "@/lib/session";
import { getClient } from "@/lib/queries";
import { db } from "@/lib/supabase";
import { PageHeader } from "@/components/ui";
import BackLink from "@/components/BackLink";
import MeasurementForm from "@/components/MeasurementForm";
import { toFigure } from "@/lib/measurements";
import type { Measurement } from "@/lib/types";

export const metadata = { title: "Take measurements" };

export default async function NewMeasurement({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tailor = await requireTailor();
  const client = await getClient(tailor.id, id);
  const { data } = await db()
    .from("measurements")
    .select("*")
    .eq("client_id", id)
    .eq("tailor_id", tailor.id)
    .order("taken_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return (
    <div>
      <PageHeader
        title="Take measurements"
        subtitle={client.full_name}
        back={<BackLink href={`/clients/${id}`} label={client.full_name} />}
      />
      <MeasurementForm clientId={id} figure={toFigure(client.gender)} defaultUnit={tailor.unit} prefill={(data as Measurement) ?? undefined} />
    </div>
  );
}
