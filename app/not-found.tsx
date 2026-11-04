import Link from "next/link";
import Mannequin from "@/components/Mannequin";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
      <Mannequin figure="female" active="height" className="h-48 w-auto" />
      <h1 className="font-display text-2xl font-semibold">This page doesn’t fit</h1>
      <p className="text-sm text-muted">It may have been deleted, or the link is wrong.</p>
      <Link href="/dashboard" className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-ink">Go to home</Link>
    </div>
  );
}
