/**
 * Onepad mark: the "o" of onepad drawn as a tape-measure reel, with the yellow
 * tape pulled out to its metal end tab.
 */
export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <rect width="40" height="40" rx="11" fill="var(--primary)" />
      <rect x="16" y="24.5" width="16" height="4.6" rx="1" fill="var(--tape)" />
      <path d="M24.5 24.5v2.3M27 24.5v1.4M29.5 24.5v2.3" stroke="var(--tape-ink)" strokeWidth="0.85" />
      <rect x="31.2" y="22.6" width="2.2" height="8.4" rx="0.8" fill="var(--primary-ink)" />
      <circle cx="16" cy="18" r="8.4" fill="none" stroke="var(--primary-ink)" strokeWidth="4.6" />
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark />
      <span className="font-display text-xl font-semibold tracking-tight text-ink">onepad</span>
    </span>
  );
}
