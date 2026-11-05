/** Placeholder shown instantly while a page's data is loading. */
export default function PageSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-6" aria-busy="true" aria-label="Loading">
      <div className="flex flex-col gap-2">
        <div className="skel h-4 w-24" />
        <div className="skel h-8 w-56 sm:w-72" />
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-line bg-surface p-4">
            <div className="skel h-9 w-9" />
            <div className="skel mt-3 h-6 w-16" />
            <div className="skel mt-2 h-3 w-20" />
          </div>
        ))}
      </div>
      <div className="overflow-hidden rounded-2xl border border-line bg-surface">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 border-b border-line px-4 py-3.5 last:border-0 sm:px-5">
            <div className="skel h-9 w-9 shrink-0 rounded-full" />
            <div className="flex-1">
              <div className="skel h-4 w-2/5" />
              <div className="skel mt-2 h-3 w-1/4" />
            </div>
            <div className="skel h-6 w-16 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
