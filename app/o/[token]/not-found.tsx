import Link from "next/link";
import { LogoMark } from "@/components/Logo";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-3 px-6 text-center">
      <LogoMark className="h-12 w-12" />
      <h1 className="mt-2 font-display text-2xl font-semibold">This link isn’t working</h1>
      <p className="max-w-xs text-sm text-muted">The order may have been removed or your tailor sent a newer link. Ask your tailor for the latest one.</p>
      <Link href="/" className="mt-2 text-sm font-semibold text-primary">About Stitches</Link>
    </div>
  );
}
