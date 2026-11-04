import { LogOut } from "lucide-react";
import { requireTailor } from "@/lib/session";
import { logout } from "@/app/actions/auth";
import { Button, PageHeader } from "@/components/ui";
import { PasswordForm, ProfileForm } from "@/components/SettingsForms";

export const metadata = { title: "Settings" };

export default async function Settings() {
  const tailor = await requireTailor();
  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <PageHeader title="Settings" />
      <ProfileForm tailor={tailor} />
      <PasswordForm />
      <form action={logout}>
        <Button variant="secondary" className="w-full sm:w-auto">
          <LogOut className="h-4 w-4" /> Log out
        </Button>
      </form>
    </div>
  );
}
