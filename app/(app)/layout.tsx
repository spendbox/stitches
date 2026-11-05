import { requireTailor } from "@/lib/session";
import { MobileBar, MobileTop, Sidebar } from "@/components/Nav";
import TrialBanner from "@/components/TrialBanner";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const tailor = await requireTailor();
  return (
    <div className="flex min-h-dvh">
      <Sidebar business={tailor.business_name} name={tailor.full_name} logo={tailor.logo_url ?? null} />
      <div className="min-w-0 flex-1">
        <MobileTop business={tailor.business_name} logo={tailor.logo_url ?? null} />
        <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-6 sm:px-6 lg:px-10 lg:pb-12 lg:pt-10">
          {tailor.status !== "active" && <TrialBanner business={tailor.business_name} name={tailor.full_name} email={tailor.email} />}
          {children}
        </main>
      </div>
      <MobileBar />
    </div>
  );
}
