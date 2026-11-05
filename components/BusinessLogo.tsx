import { cx } from "./ui";

const SIZES = { sm: "h-9 w-9 rounded-xl text-sm", md: "h-11 w-11 rounded-2xl text-lg", lg: "h-16 w-16 rounded-2xl text-2xl", xl: "h-24 w-24 rounded-3xl text-4xl" };

/** A business's uploaded logo, or the first letter of its name when there is none. */
export default function BusinessLogo({ name, url, size = "md", className }: { name: string; url?: string | null; size?: keyof typeof SIZES; className?: string }) {
  if (url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt={`${name} logo`}
        loading="lazy"
        decoding="async"
        className={cx("shrink-0 border border-line bg-white object-contain p-1", SIZES[size], className)}
      />
    );
  }
  return (
    <span className={cx("flex shrink-0 items-center justify-center bg-primary font-display font-semibold text-primary-ink", SIZES[size], className)} aria-hidden="true">
      {name.trim()[0]?.toUpperCase() ?? "?"}
    </span>
  );
}
