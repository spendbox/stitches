import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { adminConfigured, isAdmin } from "@/lib/admin";
import { Logo } from "@/components/Logo";
import { AdminLoginForm } from "@/components/admin/AdminForms";

export const metadata = { title: "Admin login", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AdminLogin() {
  if (await isAdmin()) redirect("/admin");
  return (
    <div className="flex min-h-dvh items-center justify-center px-5 py-12">
      <div className="w-full max-w-sm">
        <Logo />
        <div className="mt-8 rounded-2xl border border-line bg-surface p-6 shadow-sm">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <h1 className="mt-4 font-display text-2xl font-semibold">Admin portal</h1>
          <p className="mt-1 mb-6 text-sm text-muted">Approve, block and track payments.</p>
          {!adminConfigured() && (
            <p className="mb-5 rounded-xl bg-tape-soft px-3.5 py-2.5 text-sm text-warn">
              Admin login is not set up yet. Add <b>ADMIN_EMAIL</b> and <b>ADMIN_PASSWORD</b> in Vercel → Settings → Environment Variables, then redeploy.
            </p>
          )}
          <AdminLoginForm />
        </div>
      </div>
    </div>
  );
}
