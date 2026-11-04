import { notFound } from "next/navigation";
import { db } from "./supabase";
import type { Client } from "./types";

export async function getClient(tailorId: string, id: string): Promise<Client> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const { data } = await db().from("clients").select("*").eq("id", id).eq("tailor_id", tailorId).maybeSingle();
  if (!data) notFound();
  return data as Client;
}
