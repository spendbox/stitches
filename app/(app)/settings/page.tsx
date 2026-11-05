import { LogOut } from "lucide-react";
import { requireTailor } from "@/lib/session";
import { logout } from "@/app/actions/auth";
import { Card, PageHeader } from "@/components/ui";
import { ThemeSwitch } from "@/components/ThemeToggle";
import { PasswordForm, ProfileForm } from "@/components/SettingsForms";
import SubmitButton from "@/components/SubmitButton";
import LogoUpload from "@/components/LogoUpload";

export const metadata = { title: "Settings" };

export default async function Settings() {
  const tailor = await requireTailor();
  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <PageHeader
        title="Settings"
        subtitle={
          tailor.status === "active" ? (
            <span className="font-medium text-ok">Full access · thank you for paying</span>
          ) : (
            <span className="font-medium text-warn">Trial mode · contact the admin to pay for full access</span>
          )
        }
      />
      <LogoUpload business={tailor.business_name} logoUrl={tailor.logo_url ?? null} />
      <ProfileForm tailor={tailor} />
      <Card className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h2 className="font-display text-lg font-semibold">Appearance</h2>
          <p className="mt-1 text-sm text-muted">Saved on this device.</p>
        </div>
        <ThemeSwitch />
      </Card>
      <PasswordForm />
      <form action={logout}>
        <SubmitButton variant="secondary" className="w-full sm:w-auto" pendingText="Logging out…">
          <LogOut className="h-4 w-4" /> Log out
        </SubmitButton>
      </form>
    </div>
  );
}
