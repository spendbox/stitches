"use client";

import { useActionState } from "react";
import Link from "next/link";
import { UserPlus } from "lucide-react";
import Combobox from "./Combobox";
import { saveOrder } from "@/app/actions/data";
import type { Order } from "@/lib/types";
import { STATUS_LABEL } from "@/lib/types";
import { Card, Field, FormError, Input, Select, Textarea } from "./ui";
import SubmitButton from "./SubmitButton";

export default function OrderForm({
  order,
  clients,
  clientId,
  currency,
  returnTo,
}: {
  order?: Order;
  clients: { id: string; full_name: string; phone?: string | null }[];
  clientId?: string;
  currency: string;
  returnTo: string;
}) {
  const [state, action] = useActionState(saveOrder, undefined);
  return (
    <form action={action}>
      <Card className="flex flex-col gap-5 p-4 sm:p-6">
        {order && <input type="hidden" name="id" value={order.id} />}
        <input type="hidden" name="return_to" value={returnTo} />
        <FormError error={state?.error} />
        <Field label="Client" htmlFor="client_id">
          <Combobox
            id="client_id"
            name="client_id"
            required
            defaultValue={order?.client_id ?? clientId ?? ""}
            placeholder="Search clients by name or phone"
            emptyText="No client with that name."
            options={clients.map((c) => ({ id: c.id, label: c.full_name, sub: c.phone }))}
            footer={
              <Link href="/clients/new" className="flex items-center gap-2 px-3.5 py-3 text-sm font-semibold text-primary hover:bg-surface-2">
                <UserPlus className="h-4 w-4" /> Add a new client
              </Link>
            }
          />
        </Field>
        <Field label="Garment" htmlFor="title">
          <Input id="title" name="title" required defaultValue={order?.title} placeholder="Two-piece senator suit" />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Status" htmlFor="status">
            <Select id="status" name="status" defaultValue={order?.status ?? "pending"}>
              {Object.entries(STATUS_LABEL).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Due date" htmlFor="due_date">
            <Input id="due_date" name="due_date" type="date" defaultValue={order?.due_date ?? ""} />
          </Field>
          <Field label={`Price (${currency})`} htmlFor="price">
            <Input id="price" name="price" inputMode="decimal" className="tnum" defaultValue={order?.price ?? ""} placeholder="0" />
          </Field>
          <Field label={`Deposit paid (${currency})`} htmlFor="deposit">
            <Input id="deposit" name="deposit" inputMode="decimal" className="tnum" defaultValue={order?.deposit ?? ""} placeholder="0" />
          </Field>
        </div>
        <Field label="Notes" htmlFor="notes" hint="Fabric, style reference, lining, buttons.">
          <Textarea id="notes" name="notes" defaultValue={order?.notes ?? ""} placeholder="Client brings 4 yards of navy cashmere wool" />
        </Field>
        <div className="flex justify-end">
          <SubmitButton className="w-full sm:w-auto">{order ? "Save order" : "Create order"}</SubmitButton>
        </div>
      </Card>
    </form>
  );
}
