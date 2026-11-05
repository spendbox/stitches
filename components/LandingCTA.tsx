"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";

/** True when this browser has a Stitches login (read from a non-secret hint cookie). */
function useSignedIn() {
  const [inn, setIn] = useState(false);
  useEffect(() => setIn(/(?:^|;\s*)stitches_in=1/.test(document.cookie)), []);
  return inn;
}

/** A link whose target and text switch to the dashboard for logged-in visitors. */
export function CTA({
  out,
  signedIn = { href: "/dashboard", label: "Open your workshop" },
  className,
  after,
}: {
  out: { href: string; label: string };
  signedIn?: { href: string; label: string };
  className?: string;
  after?: ReactNode;
}) {
  const inn = useSignedIn();
  const t = inn ? signedIn : out;
  return (
    <Link href={t.href} className={className}>
      {t.label}
      {after}
    </Link>
  );
}

/** Only shown to visitors who are not logged in. */
export function SignedOutOnly({ children }: { children: ReactNode }) {
  return useSignedIn() ? null : <>{children}</>;
}
