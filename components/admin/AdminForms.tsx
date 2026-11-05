"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { CheckCircle2, Lock, Mail } from "lucide-react";
import { adminLogin, recordPayment } from "@/app/actions/admin";
import { CURRENCIES } from "@/lib/types";
import { Card, Field, FormError, Input, Select, cx, inputCls } from "../ui";
import SubmitButton from "../SubmitButton";
import Combobox from "../Combobox";

export function AdminLoginForm() {
  const [state, action] = useActionState(adminLogin, undefined);
  return (
    <form action={action} className="flex flex-col gap-5">
      <FormError error={state?.error} />
      <Field label="Admin email" htmlFor="email">
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted" />
          <input id="email" name="email" type="email" required autoComplete="username" defaultValue={state?.fields?.email} className={cx(inputCls, "pl-10")} />
        </div>
      </Field>
      <Field label="Password" htmlFor="password">
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted" />
          <input id="password" name="password" type="password" required autoComplete="current-password" className={cx(inputCls, "pl-10")} />
        </div>
      </Field>
      <SubmitButton className="h-12" pendingText="Checking…">Log in to admin</SubmitButton>
    </form>
  );
}

type UserOpt = { id: string; business_name: string; full_name: string; email: string; currency: string; status: string };

/** Record money received. Pass `user` to lock the form to one account. */
export function PaymentForm({ users, user, defaultCurrency = "NGN" }: { users?: UserOpt[]; user?: UserOpt; defaultCurrency?: string }) {
  const [state, action] = useActionState(recordPayment, undefined);
  const [picked, setPicked] = useState<string>(user?.id ?? "");
  const [currency, setCurrency] = useState(user?.currency ?? defaultCurrency);
  const form = useRef<HTMLFormElement>(null);
  const today = new Date().toISOString().slice(0, 10);
  const chosen = user ?? users?.find((u) => u.id === picked);
  const [round, setRound] = useState(0);

  useEffect(() => {
    if (!state?.fields?.saved) return;
    form.current?.reset();
    setPicked(user?.id ?? "");
    setRound((r) => r + 1); // fresh, empty user search
  }, [state, user?.id]);

  return (
    <form ref={form} action={action}>
      <Card className="flex flex-col gap-4 p-4 sm:p-5">
        <h2 className="font-display text-lg font-semibold">Record a payment</h2>
        <FormError error={state?.error} />
        {state?.fields?.saved && (
          <p className="flex items-center gap-2 rounded-xl bg-ok-soft px-3.5 py-2.5 text-sm text-ok">
            <CheckCircle2 className="h-4 w-4" /> Payment saved
          </p>
        )}
        {user ? (
          <input type="hidden" name="tailor_id" value={user.id} />
        ) : (
          <Field label="Who paid" htmlFor="tailor_pick" hint="Search by business, name or email.">
            <Combobox
              key={round}
              id="tailor_pick"
              name="tailor_id"
              placeholder="Search users"
              options={(users ?? []).map((u) => ({ id: u.id, label: u.business_name, sub: `${u.full_name} · ${u.email}` }))}
              onChange={(id) => {
                setPicked(id);
                const u = users?.find((x) => x.id === id);
                if (u) setCurrency(u.currency);
              }}
            />
          </Field>
        )}
        <div className="grid grid-cols-[1fr_7rem] gap-3">
          <Field label="Amount received" htmlFor="amount">
            <Input id="amount" name="amount" inputMode="decimal" required placeholder="0" className="tnum" />
          </Field>
          <Field label="Currency" htmlFor="currency">
            <Select id="currency" name="currency" value={currency} onChange={(e) => setCurrency(e.target.value)}>
              {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
            </Select>
          </Field>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Date paid" htmlFor="paid_at">
            <Input id="paid_at" name="paid_at" type="date" defaultValue={today} />
          </Field>
          <Field label="Method" htmlFor="method">
            <Select id="method" name="method" defaultValue="Bank transfer">
              <option>Bank transfer</option>
              <option>Cash</option>
              <option>POS</option>
              <option>Mobile money</option>
              <option>Other</option>
            </Select>
          </Field>
        </div>
        <Field label="Note" htmlFor="note">
          <Input id="note" name="note" placeholder="e.g. 12 months, ref 2231" />
        </Field>
        {chosen && chosen.status !== "active" && (
          <label className="flex items-center gap-3 rounded-xl bg-primary-soft px-3.5 py-3 text-sm font-medium text-primary">
            <input type="checkbox" name="approve" defaultChecked className="h-4 w-4 accent-[var(--primary)]" />
            Also approve {chosen.business_name} for full access
          </label>
        )}
        <SubmitButton className="w-full">Save payment</SubmitButton>
      </Card>
    </form>
  );
}
