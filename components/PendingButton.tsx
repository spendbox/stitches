"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { cx } from "./ui";

/**
 * A plain submit button for small forms (status changes, log out, approve…).
 * While the server is working it shows a spinner and can't be tapped twice.
 */
export default function PendingButton({
  children,
  pendingText,
  className,
  ...p
}: ComponentProps<"button"> & { pendingText?: ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button {...p} type="submit" disabled={pending || p.disabled} aria-busy={pending} className={cx(className, "disabled:cursor-wait disabled:opacity-70")}>
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
          {pendingText ?? children}
        </>
      ) : (
        children
      )}
    </button>
  );
}
