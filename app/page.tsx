import Link from "next/link";
import {
  ArrowRight,
  CalendarClock,
  Check,
  ChevronDown,
  Copy,
  Layers,
  Lock,
  Ruler,
  Smartphone,
  Wallet,
} from "lucide-react";
import { getTailorId } from "@/lib/session";
import { Logo } from "@/components/Logo";
import Mannequin from "@/components/Mannequin";
import { ThemeButton } from "@/components/ThemeToggle";

export const metadata = {
  title: { absolute: "Stitches · Measurements and orders for tailors" },
};

const features = [
  {
    icon: Ruler,
    title: "Measure on the mannequin",
    text: "Tap a field and a yellow tape shows exactly where it goes on the body. No more guessing what “round sleeve” meant.",
  },
  {
    icon: Layers,
    title: "Several sets per client",
    text: "Keep “Standard”, “Wedding gown” and “Agbada” side by side. Start a new set from the last one and change only what’s different.",
  },
  {
    icon: CalendarClock,
    title: "Orders and due dates",
    text: "Track every garment from Not started to Sewing, Ready and Delivered, and see what’s due this week at a glance.",
  },
  {
    icon: Wallet,
    title: "Know who still owes you",
    text: "Record the price and the deposit. Stitches adds up the balance to collect across all your open orders.",
  },
  {
    icon: Copy,
    title: "Send to WhatsApp",
    text: "Copy a full measurement set in one tap and paste it to your cutter, apprentice or the client.",
  },
  {
    icon: Smartphone,
    title: "Made for your phone",
    text: "Works in the browser on any phone, tablet or computer. Nothing to install, and your records follow you.",
  },
];

const steps = [
  { n: "1", title: "Create your workshop", text: "Sign up with your business name and email. It takes under a minute." },
  { n: "2", title: "Add a client", text: "Name and phone number, then take their measurements on the mannequin guide." },
  { n: "3", title: "Book the order", text: "Add the garment, due date, price and deposit. Update the status as you sew." },
];

const faqs = [
  {
    q: "Do I need to install anything?",
    a: "No. Stitches runs in your phone’s browser. You can add it to your home screen so it opens like an app.",
  },
  {
    q: "How does payment work?",
    a: "Every new account starts in trial mode with everything unlocked. When you’re ready, contact the admin and pay by transfer or cash. Your account is upgraded to full access as soon as payment is confirmed.",
  },
  {
    q: "Can I use inches and centimetres?",
    a: "Yes. Pick a default in Settings and switch any measurement set between inches and centimetres.",
  },
  {
    q: "Who can see my clients?",
    a: "Only you. Every record is tied to your account, passwords are stored encrypted, and the database is locked to the public.",
  },
];

export default async function Landing() {
  const loggedIn = Boolean(await getTailorId());
  const primary = loggedIn ? { href: "/dashboard", label: "Open your workshop" } : { href: "/register", label: "Start free trial" };

  return (
    <div className="min-h-dvh overflow-x-clip">
      {/* ---------- Header ---------- */}
      <header className="sticky top-0 z-40 border-b border-line/70 bg-bg/85 pt-[env(safe-area-inset-top)] backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
          <Link href="/" aria-label="Stitches home">
            <Logo />
          </Link>
          <nav className="ml-6 hidden items-center gap-6 text-sm font-medium text-muted md:flex">
            <a href="#features" className="hover:text-ink">Features</a>
            <a href="#how" className="hover:text-ink">How it works</a>
            <a href="#pricing" className="hover:text-ink">Pricing</a>
            <a href="#faq" className="hover:text-ink">FAQ</a>
          </nav>
          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <ThemeButton />
            {!loggedIn && (
              <Link href="/login" className="hidden h-10 items-center rounded-xl px-3 text-sm font-semibold text-ink hover:bg-surface-2 sm:flex">
                Log in
              </Link>
            )}
            <Link
              href={primary.href}
              className="flex h-10 items-center gap-1.5 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-ink hover:opacity-90"
            >
              {loggedIn ? "Dashboard" : "Get started"}
            </Link>
          </div>
        </div>
      </header>

      {/* ---------- Hero ---------- */}
      <section className="relative">
        <div className="grain pointer-events-none absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:pb-24 lg:pt-20">
          <div className="rise">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-tape" /> For tailors and fashion designers
            </span>
            <h1 className="mt-5 font-display text-[2.6rem] font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl">
              Every client’s measurements, <span className="relative whitespace-nowrap text-primary">ready when<svg viewBox="0 0 200 12" preserveAspectRatio="none" className="absolute -bottom-1.5 left-0 h-2.5 w-full" aria-hidden="true"><path d="M2 8 Q50 2 100 6 T198 5" fill="none" stroke="var(--tape)" strokeWidth="4" strokeLinecap="round" /></svg></span> they walk in.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              Stitches keeps neck-to-hem measurements for every client, tracks the garments you’re sewing, and shows how much is still owed. Right on your phone.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={primary.href}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-[15px] font-semibold text-primary-ink shadow-lg shadow-primary/20 hover:opacity-90"
              >
                {primary.label} <ArrowRight className="h-4 w-4" />
              </Link>
              {!loggedIn && (
                <Link
                  href="/login"
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-line bg-surface px-6 text-[15px] font-semibold text-ink hover:bg-surface-2"
                >
                  I have an account
                </Link>
              )}
            </div>
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
              {["Free trial, no card", "Works on any phone", "Inches or cm"].map((t) => (
                <li key={t} className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-ok" /> {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Product preview */}
          <div className="rise relative mx-auto w-full max-w-md [animation-delay:120ms] lg:max-w-none">
            <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-primary-soft/70 blur-2xl" />
            <div className="rounded-3xl border border-line bg-surface p-4 shadow-2xl shadow-black/[0.07] sm:p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-tape-soft text-sm font-semibold text-warn">AO</span>
                  <div>
                    <p className="text-sm font-semibold text-ink">Amaka Obi</p>
                    <p className="text-xs text-muted">Wedding gown · taken today</p>
                  </div>
                </div>
                <span className="rounded-full bg-ok-soft px-2.5 py-1 text-xs font-semibold text-ok">Ready</span>
              </div>
              <div className="mt-4 grid grid-cols-[auto_1fr] items-center gap-4 rounded-2xl bg-surface-2 p-3 sm:gap-6 sm:p-4">
                <Mannequin
                  figure="female"
                  active="waist"
                  measured={["neck", "chest", "hips", "dress_length", "sleeve_length"]}
                  className="h-56 w-auto sm:h-64"
                />
                <dl className="grid gap-1.5 text-sm">
                  {[
                    ["Bust", "36″"],
                    ["Waist", "28″", true],
                    ["Hips", "40″"],
                    ["Sleeve", "23″"],
                    ["Dress length", "58″"],
                  ].map(([k, v, on]) => (
                    <div
                      key={k as string}
                      className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 ${on ? "bg-tape-soft ring-1 ring-tape" : "bg-surface"}`}
                    >
                      <dt className={on ? "font-semibold text-ink" : "text-muted"}>{k}</dt>
                      <dd className="tnum font-mono text-[13px] text-ink">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="mt-3 flex items-center justify-between rounded-2xl border border-line px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-ink">Lace wedding gown</p>
                  <p className="text-xs text-muted">Due Friday, 14 Nov</p>
                </div>
                <div className="text-right">
                  <p className="tnum text-sm font-semibold text-ink">₦85,000</p>
                  <p className="tnum text-xs text-warn">₦25,000 to collect</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="tape-strip h-5 w-full opacity-90" />
      </section>

      {/* ---------- Features ---------- */}
      <section id="features" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6 lg:py-28">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-primary">Everything in one place</p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Put away the notebook. Keep the measuring tape.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted">
            Built around how a workshop actually runs: clients walk in, you measure, you sew, they pay the balance on pickup.
          </p>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl border border-line bg-surface p-6 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/[0.04]">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold text-ink">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- How it works ---------- */}
      <section id="how" className="scroll-mt-20 border-y border-line bg-surface">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_1.2fr] lg:items-center lg:py-28">
          <div>
            <p className="text-sm font-semibold text-primary">How it works</p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Up and running before your next fitting.</h2>
            <ol className="mt-10 flex flex-col gap-8">
              {steps.map((s) => (
                <li key={s.n} className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-tape font-display text-base font-semibold text-tape-ink">{s.n}</span>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-ink">{s.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="flex items-end justify-center gap-4 rounded-3xl bg-surface-2 px-6 pb-6 pt-10 sm:gap-10">
            <Mannequin figure="female" showAll className="h-64 w-auto sm:h-80" />
            <Mannequin figure="male" active="shoulder" measured={["neck", "chest", "waist", "sleeve_length", "trouser_length"]} className="h-72 w-auto sm:h-[22rem]" />
          </div>
        </div>
      </section>

      {/* ---------- Pricing ---------- */}
      <section id="pricing" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6 lg:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold text-primary">Pricing</p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Try everything first. Pay when you’re sure.</h2>
        </div>
        <div className="mx-auto mt-12 grid max-w-4xl gap-4 md:grid-cols-2">
          <div className="flex flex-col rounded-3xl border border-line bg-surface p-7">
            <p className="font-display text-xl font-semibold text-ink">Trial</p>
            <p className="mt-1 text-sm text-muted">Every new workshop starts here.</p>
            <p className="mt-6 font-display text-4xl font-semibold text-ink">Free</p>
            <ul className="mt-6 flex flex-col gap-3 text-sm text-ink">
              {["All features unlocked", "Unlimited clients and orders", "A reminder to upgrade inside the app"].map((t) => (
                <li key={t} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-ok" /> {t}</li>
              ))}
            </ul>
            <Link href={primary.href} className="mt-8 inline-flex h-11 items-center justify-center rounded-xl border border-line bg-surface text-sm font-semibold text-ink hover:bg-surface-2">
              {loggedIn ? "Open your workshop" : "Start free trial"}
            </Link>
          </div>
          <div className="relative flex flex-col overflow-hidden rounded-3xl bg-primary p-7 text-white [--primary:#1f4d43]">
            <div className="tape-strip absolute inset-x-0 top-0 h-2" />
            <p className="font-display text-xl font-semibold">Full access</p>
            <p className="mt-1 text-sm text-white/70">For workshops that run on Stitches.</p>
            <p className="mt-6 font-display text-3xl font-semibold leading-tight">Pay the admin directly</p>
            <ul className="mt-6 flex flex-col gap-3 text-sm">
              {["Bank transfer or cash, no card needed", "Approved as soon as payment is confirmed", "No more trial notice"].map((t) => (
                <li key={t} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#f0c34a]" /> {t}</li>
              ))}
            </ul>
            <Link href={primary.href} className="mt-8 inline-flex h-11 items-center justify-center rounded-xl bg-[#f0c34a] text-sm font-semibold text-[#241b02] hover:opacity-90">
              {loggedIn ? "Go to dashboard" : "Create your account"}
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section id="faq" className="scroll-mt-20 border-t border-line bg-surface">
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:py-24">
          <h2 className="text-center font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Questions</h2>
          <div className="mt-10 divide-y divide-line rounded-2xl border border-line bg-bg">
            {faqs.map((f) => (
              <details key={f.q} className="group px-5 py-4 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-ink">
                  {f.q}
                  <ChevronDown className="h-5 w-5 shrink-0 text-muted transition group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Closing call to action ---------- */}
      <section className="relative overflow-hidden bg-primary [--primary:#1f4d43]">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 py-20 text-center sm:px-6 lg:flex-row lg:text-left">
          <div className="flex-1">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">Your next client is on the way.</h2>
            <p className="mt-3 text-white/75">Have their measurements ready before they reach the door.</p>
            <Link
              href={primary.href}
              className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#f0c34a] px-6 text-[15px] font-semibold text-[#241b02] hover:opacity-90"
            >
              {primary.label} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="pointer-events-none flex items-end gap-4 [--mq-fill:#2b5c51] [--mq-shade:#173a32] [--mq-stroke:#4f8073] [--mq-seam:#3d6f62] [--mq-guide:#f0c34a] [--tape:#f0c34a] [--surface:#1f4d43]">
            <Mannequin figure="female" active="hips" measured={["neck", "chest", "waist"]} className="h-48 w-auto sm:h-56" />
            <Mannequin figure="male" active="neck" measured={["shoulder", "chest", "waist", "inseam"]} className="h-52 w-auto sm:h-60" />
          </div>
        </div>
        <div className="tape-strip h-4 w-full opacity-90" />
      </section>

      {/* ---------- Footer ---------- */}
      <footer className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-10 pb-[max(2.5rem,env(safe-area-inset-bottom))] text-sm text-muted sm:flex-row sm:px-6">
        <Logo />
        <p className="flex items-center gap-1.5"><Lock className="h-3.5 w-3.5" /> Your client records stay private to your account.</p>
        <p>© {new Date().getFullYear()} Stitches</p>
      </footer>
    </div>
  );
}
