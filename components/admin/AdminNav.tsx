"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, LogOut, Users, Wallet } from "lucide-react";
import { adminLogout } from "@/app/actions/admin";
import { Logo } from "../Logo";
import { ThemeButton } from "../ThemeToggle";
import { cx } from "../ui";
import PendingButton from "../PendingButton";

const tabs = [
  { href: "/admin", label: "Overview", icon: LayoutGrid, exact: true },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/payments", label: "Revenue", icon: Wallet },
];

export function AdminNav() {
  const path = usePathname();
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface/95 pt-[env(safe-area-inset-top)] backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:px-6">
        <Link href="/admin" className="flex items-center gap-2">
          <Logo />
          <span className="rounded-md bg-ink px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-bg">Admin</span>
        </Link>
        <nav className="ml-6 hidden gap-1 md:flex">
          {tabs.map(({ href, label, icon: Icon, exact }) => {
            const on = exact ? path === href : path.startsWith(href);
            return (
              <Link key={href} href={href} className={cx("flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium", on ? "bg-primary-soft text-primary" : "text-muted hover:bg-surface-2 hover:text-ink")}>
                <Icon className="h-4 w-4" /> {label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-1">
          <ThemeButton />
          <form action={adminLogout}>
            <PendingButton pendingText="" className="flex h-10 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-muted hover:bg-surface-2 hover:text-ink">
              <LogOut className="h-4 w-4" /> <span className="hidden sm:inline">Log out</span>
            </PendingButton>
          </form>
        </div>
      </div>
      <nav className="flex border-t border-line md:hidden">
        {tabs.map(({ href, label, icon: Icon, exact }) => {
          const on = exact ? path === href : path.startsWith(href);
          return (
            <Link key={href} href={href} className={cx("flex flex-1 items-center justify-center gap-1.5 border-b-2 py-2.5 text-sm font-semibold", on ? "border-primary text-primary" : "border-transparent text-muted")}>
              <Icon className="h-4 w-4" /> {label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
