import { redirect } from "next/navigation";
import { getTailorId } from "@/lib/session";
import { Logo } from "@/components/Logo";
import Mannequin from "@/components/Mannequin";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  if (await getTailorId()) redirect("/dashboard");
  return (
    <div className="grid min-h-dvh lg:grid-cols-[1.05fr_1fr]">
      <aside className="relative hidden overflow-hidden bg-primary lg:flex lg:flex-col lg:p-12 [--primary:#1f4d43]">
        <div className="[--primary:#ffffff] [--primary-ink:#1f4d43]">
          <Logo className="[&_span]:!text-white" />
        </div>
        <div className="relative z-10 mt-14 max-w-md">
          <h2 className="font-display text-4xl font-semibold leading-tight text-white">Every client’s measurements, ready when they walk in.</h2>
          <p className="mt-4 text-base leading-relaxed text-white/75">
            Keep neck to hem on file for each client, track the garments you’re sewing, and know what’s due this week.
          </p>
        </div>
        <div className="pointer-events-none mt-auto flex items-end justify-center gap-6 pb-6 [--mq-fill:#2b5c51] [--mq-shade:#173a32] [--mq-stroke:#4f8073] [--mq-seam:#3d6f62] [--mq-guide:#f0c34a] [--tape:#f0c34a] [--surface:#1f4d43]">
          <Mannequin figure="female" active="waist" measured={["neck", "chest", "hips", "sleeve_length", "dress_length"]} className="h-[44vh] max-h-[430px] min-h-[240px] w-auto" />
          <Mannequin figure="male" active="chest" measured={["neck", "shoulder", "waist", "trouser_length", "inseam", "wrist"]} className="h-[48vh] max-h-[470px] min-h-[260px] w-auto" />
        </div>
        <div className="tape-strip absolute bottom-0 left-0 h-6 w-full opacity-90" />
      </aside>
      <main className="flex flex-col px-5 pb-10 pt-[max(1.5rem,env(safe-area-inset-top))] sm:px-10 lg:justify-center">
        <div className="flex items-center justify-between lg:hidden">
          <Logo />
        </div>
        <div className="mx-auto w-full max-w-sm flex-1 pt-10 lg:flex-none lg:pt-0">{children}</div>
      </main>
    </div>
  );
}
