"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

/**
 * A thin yellow bar across the top of the screen that starts the moment a link
 * is tapped, and finishes when the new page is ready.
 */
function Bar() {
  const path = usePathname();
  const search = useSearchParams();
  const [p, setP] = useState(0); // 0 = hidden, 0..1 = progress
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const safety = useRef<ReturnType<typeof setTimeout> | null>(null);

  function stopTimers() {
    if (timer.current) clearInterval(timer.current);
    if (safety.current) clearTimeout(safety.current);
    timer.current = null;
  }

  function start() {
    stopTimers();
    setP(0.12);
    // Creep towards 90% so it always looks alive, never "done" too early.
    timer.current = setInterval(() => setP((v) => (v > 0 && v < 0.9 ? v + (0.9 - v) * 0.12 : v)), 180);
    safety.current = setTimeout(done, 15000);
  }

  function done() {
    stopTimers();
    setP((v) => (v > 0 ? 1 : 0));
    setTimeout(() => setP(0), 320);
  }

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname && url.search === location.search) return; // same page / #anchor
      start();
    };
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // New page arrived.
  useEffect(() => {
    done();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, search]);

  return (
    <div
      aria-hidden="true"
      className="nav-progress"
      style={{ transform: `scaleX(${p})`, opacity: p > 0 && p < 1 ? 1 : 0 }}
    />
  );
}

export default function NavProgress() {
  return (
    <Suspense fallback={null}>
      <Bar />
    </Suspense>
  );
}
