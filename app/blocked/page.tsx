import { redirect } from "next/navigation";
import { Ban, LogOut, Mail, MessageCircle } from "lucide-react";
import { getTailorId } from "@/lib/session";
import { db } from "@/lib/supabase";
import { adminContact } from "@/lib/admin";
import { logout } from "@/app/actions/auth";
import { Logo } from "@/components/Logo";
import PendingButton from "@/components/PendingButton";

export const metadata = { title: "Account blocked" };

export default async function Blocked() {
  const id = await getTailorId();
  if (!id) redirect("/login");
  const { data } = await db().from("tailors").select("*").eq("id", id).maybeSingle();
  if (!data || data.status !== "blocked") redirect("/dashboard");
  const { email, phone } = adminContact();
  const digits = phone?.replace(/[^\d]/g, "");

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-12 text-center">
      <Logo />
      <span className="mt-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-danger-soft text-danger">
        <Ban className="h-7 w-7" />
      </span>
      <h1 className="mt-5 font-display text-2xl font-semibold">This account is blocked</h1>
      <p className="mt-2 max-w-sm text-sm text-muted">
        Access to <span className="font-semibold text-ink">{data.business_name}</span> has been paused by the Stitches admin. Your records are safe. Contact the admin to restore access.
      </p>
      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        {digits && (
          <a href={`https://wa.me/${digits}`} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-ink">
            <MessageCircle className="h-4 w-4" /> WhatsApp admin
          </a>
        )}
        {email && (
          <a href={`mailto:${email}`} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-line bg-surface px-5 text-sm font-semibold">
            <Mail className="h-4 w-4" /> Email admin
          </a>
        )}
        <form action={logout}>
          <PendingButton pendingText="Logging out…" className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold text-muted hover:bg-surface-2">
            <LogOut className="h-4 w-4" /> Log out
          </PendingButton>
        </form>
      </div>
    </div>
  );
}
