"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cx } from "./ui";

const KEY = "stitches-theme";

function apply(dark: boolean) {
  const root = document.documentElement;
  if (dark) root.dataset.theme = "dark";
  else delete root.dataset.theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", dark ? "#0d1412" : "#f4f6f3");
  try {
    localStorage.setItem(KEY, dark ? "dark" : "light");
  } catch {}
}

function useDark() {
  const [dark, setDark] = useState(false);
  useEffect(() => setDark(document.documentElement.dataset.theme === "dark"), []);
  return [dark, (d: boolean) => (apply(d), setDark(d))] as const;
}

/** Small round moon/sun button. */
export function ThemeButton({ className }: { className?: string }) {
  const [dark, setDark] = useDark();
  return (
    <button
      type="button"
      onClick={() => setDark(!dark)}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Light mode" : "Dark mode"}
      className={cx("flex h-10 w-10 items-center justify-center rounded-xl text-muted transition hover:bg-surface-2 hover:text-ink", className)}
    >
      {dark ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
    </button>
  );
}

/** Light / Dark segmented switch for the settings page. */
export function ThemeSwitch() {
  const [dark, setDark] = useDark();
  return (
    <div className="grid h-11 w-full grid-cols-2 gap-1 rounded-xl bg-surface-2 p-1 sm:w-64">
      {[
        { d: false, label: "Light", Icon: Sun },
        { d: true, label: "Dark", Icon: Moon },
      ].map(({ d, label, Icon }) => (
        <button
          key={label}
          type="button"
          aria-pressed={dark === d}
          onClick={() => setDark(d)}
          className={cx("flex items-center justify-center gap-2 rounded-lg text-sm font-semibold transition", dark === d ? "bg-surface text-ink shadow-sm" : "text-muted")}
        >
          <Icon className="h-4 w-4" /> {label}
        </button>
      ))}
    </div>
  );
}
