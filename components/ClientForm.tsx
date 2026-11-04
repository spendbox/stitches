"use client";

import { useActionState, useState } from "react";
import { saveClient } from "@/app/actions/data";
import type { Client } from "@/lib/types";
import { Card, Field, FormError, Input, Textarea, cx } from "./ui";
import SubmitButton from "./SubmitButton";
import Mannequin from "./Mannequin";

export default function ClientForm({ client }: { client?: Client }) {
  const [state, action] = useActionState(saveClient, undefined);
  const [gender, setGender] = useState<"female" | "male">(client?.gender ?? "female");
  return (
    <form action={action} className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <Card className="flex flex-col gap-5 p-4 sm:p-6">
        {client && <input type="hidden" name="id" value={client.id} />}
        <FormError error={state?.error} />
        <Field label="Full name" htmlFor="full_name">
          <Input id="full_name" name="full_name" required defaultValue={client?.full_name} placeholder="Chiamaka Eze" autoFocus={!client} />
        </Field>

        <fieldset className="flex flex-col gap-1.5">
          <legend className="mb-1.5 text-sm font-medium">Body figure</legend>
          <input type="hidden" name="gender" value={gender} />
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-surface-2 p-1">
            {(["female", "male"] as const).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGender(g)}
                aria-pressed={gender === g}
                className={cx("h-10 rounded-lg text-sm font-semibold transition", gender === g ? "bg-surface text-ink shadow-sm" : "text-muted")}
              >
                {g === "female" ? "Female" : "Male"}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted">Sets which measurements and mannequin guide you’ll see.</p>
        </fieldset>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Phone" htmlFor="phone">
            <Input id="phone" name="phone" type="tel" inputMode="tel" defaultValue={client?.phone ?? ""} placeholder="+234 803 000 0000" />
          </Field>
          <Field label="Email" htmlFor="email">
            <Input id="email" name="email" type="email" defaultValue={client?.email ?? ""} placeholder="Optional" />
          </Field>
        </div>
        <Field label="Address" htmlFor="address">
          <Input id="address" name="address" defaultValue={client?.address ?? ""} placeholder="Optional" />
        </Field>
        <Field label="Notes" htmlFor="notes" hint="Style preferences, fabric, fitting habits.">
          <Textarea id="notes" name="notes" defaultValue={client?.notes ?? ""} placeholder="Prefers slim fit, wears trousers high on the waist" />
        </Field>
        <div className="flex justify-end">
          <SubmitButton className="w-full sm:w-auto">{client ? "Save changes" : "Save and take measurements"}</SubmitButton>
        </div>
      </Card>
      <Card className="hidden items-center justify-center p-6 lg:flex">
        <Mannequin figure={gender} showAll className="h-[380px] w-auto" />
      </Card>
    </form>
  );
}
