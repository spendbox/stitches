import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="inline-flex w-fit items-center gap-1 text-sm font-medium text-muted hover:text-ink">
      <ChevronLeft className="h-4 w-4" /> {label}
    </Link>
  );
}
