/** Onepad mark: a dress form on its stand, with a stitched seam. */
export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <rect width="40" height="40" rx="11" fill="var(--primary)" />
      <path
        d="M14 9.5c1.6 1.2 3.7 1.8 6 1.8s4.4-.6 6-1.8c.9 2.6 1 5-.2 7.4-.9 1.8-.9 3.4 0 5 1 1.9 1.1 3.9.2 5.9H14c-.9-2-.8-4 .2-5.9.9-1.6.9-3.2 0-5-1.2-2.4-1.1-4.8-.2-7.4Z"
        fill="var(--primary-ink)"
      />
      <path d="M20 12v15.5" stroke="var(--primary)" strokeWidth="1.2" strokeDasharray="1.6 1.6" />
      <path d="M20 27.8v4.2M15.5 32.5h9" stroke="var(--tape)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark />
      <span className="font-display text-xl font-semibold tracking-tight text-ink">Onepad</span>
    </span>
  );
}
