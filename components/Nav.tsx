"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Users, Scissors, Settings, Plus, LogOut } from "lucide-react";
import { Logo } from "./Logo";
import { cx } from "./ui";
import { ThemeButton } from "./ThemeToggle";
import { logout } from "@/app/actions/auth";

const items = [
  { href: "/dashboard", label: "Home", icon: LayoutGrid },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/orders", label: "Orders", icon: Scissors },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ business, name }: { business: string; name: string }) {
  const path = usePathname();
  return (
    <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-line bg-surface px-4 py-6 lg:flex">
      <Link href="/dashboard" className="px-2">
        <Logo />
      </Link>
      <Link
        href="/clients/new"
        className="mt-8 flex h-11 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-ink hover:opacity-90"
      >
        <Plus className="h-[18px] w-[18px]" /> New client
      </Link>
      <nav className="mt-6 flex flex-col gap-1">
        {items.map(({ href, label, icon: Icon }) => {
          const on = path.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cx(
                "flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition",
                on ? "bg-primary-soft text-primary" : "text-muted hover:bg-surface-2 hover:text-ink"
              )}
            >
              <Icon className="h-[19px] w-[19px]" strokeWidth={on ? 2.2 : 1.8} />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto rounded-2xl bg-surface-2 p-3">
        <div className="flex items-start gap-2">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-ink">{business}</p>
            <p className="truncate text-xs text-muted">{name}</p>
          </div>
          <ThemeButton className="-mr-1 -mt-1 h-8 w-8" />
        </div>
        <form action={logout}>
          <button className="mt-3 flex items-center gap-2 text-xs font-semibold text-muted hover:text-ink">
            <LogOut className="h-3.5 w-3.5" /> Log out
          </button>
        </form>
      </div>
    </aside>
  );
}

export function MobileBar() {
  const path = usePathname();
  const left = items.slice(0, 2);
  const right = items.slice(2);
  const tab = ({ href, label, icon: Icon }: (typeof items)[number]) => {
    const on = path.startsWith(href);
    return (
      <Link key={href} href={href} className={cx("flex flex-1 flex-col items-center gap-1 py-2 text-[11px] font-semibold", on ? "text-primary" : "text-muted")}>
        <Icon className="h-[22px] w-[22px]" strokeWidth={on ? 2.2 : 1.8} />
        {label}
      </Link>
    );
  };
  return (
    <nav className="kb-hide fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
      <div className="mx-auto flex max-w-lg items-end px-2">
        {left.map(tab)}
        <Link
          href="/clients/new"
          aria-label="New client"
          className="-mt-6 mx-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-ink shadow-lg shadow-primary/30"
        >
          <Plus className="h-6 w-6" />
        </Link>
        {right.map(tab)}
      </div>
    </nav>
  );
}

export function MobileTop() {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-line bg-bg/90 px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur lg:hidden">
      <Link href="/dashboard">
        <Logo />
      </Link>
      <ThemeButton className="-mr-2" />
    </header>
  );
}
