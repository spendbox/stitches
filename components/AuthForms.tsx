"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, Store, User } from "lucide-react";
import { login, register } from "@/app/actions/auth";
import { Field, FormError, inputCls, cx } from "./ui";
import SubmitButton from "./SubmitButton";

function IconInput({ icon: Icon, ...p }: React.ComponentProps<"input"> & { icon: typeof Mail }) {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted" />
      <input {...p} className={cx(inputCls, "pl-10", p.className)} />
    </div>
  );
}

function PasswordInput({ autoComplete }: { autoComplete: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted" />
      <input
        id="password"
        name="password"
        type={show ? "text" : "password"}
        required
        minLength={autoComplete === "new-password" ? 8 : undefined}
        autoComplete={autoComplete}
        placeholder="••••••••"
        className={cx(inputCls, "pl-10 pr-11")}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted hover:bg-surface-2"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
      </button>
    </div>
  );
}

export function LoginForm() {
  const [state, action] = useActionState(login, undefined);
  return (
    <form action={action} className="flex flex-col gap-5">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Welcome back</h1>
        <p className="mt-2 text-sm text-muted">Log in to your workshop.</p>
      </div>
      <FormError error={state?.error} />
      <Field label="Work email" htmlFor="email">
        <IconInput icon={Mail} id="email" name="email" type="email" required autoComplete="email" placeholder="you@yourstudio.com" defaultValue={state?.fields?.email} />
      </Field>
      <Field label="Password" htmlFor="password">
        <PasswordInput autoComplete="current-password" />
      </Field>
      <SubmitButton className="mt-1 h-12" pendingText="Logging in…">Log in</SubmitButton>
      <p className="text-center text-sm text-muted">
        New to Stitches?{" "}
        <Link href="/register" className="font-semibold text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}

export function RegisterForm() {
  const [state, action] = useActionState(register, undefined);
  return (
    <form action={action} className="flex flex-col gap-5">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Set up your workshop</h1>
        <p className="mt-2 text-sm text-muted">Free to start. Takes under a minute.</p>
      </div>
      <FormError error={state?.error} />
      <Field label="Business name" htmlFor="business_name">
        <IconInput icon={Store} id="business_name" name="business_name" required placeholder="Adaeze Couture" defaultValue={state?.fields?.business_name} />
      </Field>
      <Field label="Your full name" htmlFor="full_name">
        <IconInput icon={User} id="full_name" name="full_name" required autoComplete="name" placeholder="Adaeze Okafor" defaultValue={state?.fields?.full_name} />
      </Field>
      <Field label="Work email" htmlFor="email">
        <IconInput icon={Mail} id="email" name="email" type="email" required autoComplete="email" placeholder="you@yourstudio.com" defaultValue={state?.fields?.email} />
      </Field>
      <Field label="Password" htmlFor="password" hint="At least 8 characters.">
        <PasswordInput autoComplete="new-password" />
      </Field>
      <SubmitButton className="mt-1 h-12" pendingText="Creating account…">Create account</SubmitButton>
      <p className="text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
