"use client";

import { useActionState } from "react";
import { CheckCircle2 } from "lucide-react";
import { changePassword, saveSettings } from "@/app/actions/data";
import type { Tailor } from "@/lib/types";
import { CURRENCIES } from "@/lib/types";
import { Card, Field, FormError, Input, Select } from "./ui";
import SubmitButton from "./SubmitButton";

function Saved({ show, text = "Saved" }: { show?: boolean; text?: string }) {
  if (!show) return null;
  return (
    <p className="flex items-center gap-2 rounded-xl bg-ok-soft px-3.5 py-2.5 text-sm text-ok">
      <CheckCircle2 className="h-4 w-4" /> {text}
    </p>
  );
}

export function ProfileForm({ tailor }: { tailor: Tailor }) {
  const [state, action] = useActionState(saveSettings, undefined);
  return (
    <form action={action}>
      <Card className="flex flex-col gap-5 p-4 sm:p-6">
        <h2 className="font-display text-lg font-semibold">Workshop</h2>
        <FormError error={state?.error} />
        <Saved show={!!state?.fields?.saved} text="Settings saved" />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Business name" htmlFor="business_name">
            <Input id="business_name" name="business_name" required defaultValue={tailor.business_name} />
          </Field>
          <Field label="Your name" htmlFor="full_name">
            <Input id="full_name" name="full_name" required defaultValue={tailor.full_name} />
          </Field>
          <Field label="Work email" htmlFor="email" hint="Used to log in. Contact support to change it.">
            <Input id="email" value={tailor.email} disabled readOnly className="opacity-70" />
          </Field>
          <Field label="Phone" htmlFor="phone" hint="Shown on order links so clients can call or WhatsApp you.">
            <Input id="phone" name="phone" type="tel" defaultValue={tailor.phone ?? ""} placeholder="Optional" />
          </Field>
          <Field label="Default unit" htmlFor="unit" hint="Used for new measurement sets.">
            <Select id="unit" name="unit" defaultValue={tailor.unit}>
              <option value="in">Inches</option>
              <option value="cm">Centimetres</option>
            </Select>
          </Field>
          <Field label="Currency" htmlFor="currency">
            <Select id="currency" name="currency" defaultValue={tailor.currency}>
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </Field>
        </div>
        <div className="flex justify-end">
          <SubmitButton className="w-full sm:w-auto">Save settings</SubmitButton>
        </div>
      </Card>
    </form>
  );
}

export function PasswordForm() {
  const [state, action] = useActionState(changePassword, undefined);
  return (
    <form action={action}>
      <Card className="flex flex-col gap-5 p-4 sm:p-6">
        <h2 className="font-display text-lg font-semibold">Password</h2>
        <FormError error={state?.error} />
        <Saved show={!!state?.fields?.saved} text="Password changed" />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Current password" htmlFor="current">
            <Input id="current" name="current" type="password" required autoComplete="current-password" />
          </Field>
          <Field label="New password" htmlFor="next" hint="At least 8 characters.">
            <Input id="next" name="next" type="password" required minLength={8} autoComplete="new-password" />
          </Field>
        </div>
        <div className="flex justify-end">
          <SubmitButton variant="secondary" className="w-full sm:w-auto">Change password</SubmitButton>
        </div>
      </Card>
    </form>
  );
}
