import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import type { OrderStatus } from "@/lib/types";
import { STATUS_LABEL } from "@/lib/types";

export function cx(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

const btn = {
  primary: "bg-primary text-primary-ink hover:opacity-90",
  secondary: "bg-surface text-ink border border-line hover:bg-surface-2",
  ghost: "text-ink hover:bg-surface-2",
  danger: "bg-danger text-white hover:opacity-90",
  tape: "bg-tape text-tape-ink hover:opacity-90",
};
const base =
  "inline-flex items-center justify-center gap-2 rounded-xl px-4 h-11 text-sm font-semibold transition disabled:opacity-60 disabled:pointer-events-none whitespace-nowrap";

export function Button({
  variant = "primary",
  className,
  ...p
}: ComponentProps<"button"> & { variant?: keyof typeof btn }) {
  return <button className={cx(base, btn[variant], className)} {...p} />;
}

export function ButtonLink({
  variant = "primary",
  className,
  ...p
}: ComponentProps<typeof Link> & { variant?: keyof typeof btn }) {
  return <Link className={cx(base, btn[variant], className)} {...p} />;
}

export function Field({ label, hint, children, htmlFor }: { label: string; hint?: string; children: ReactNode; htmlFor: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-muted">{hint}</p>}
    </div>
  );
}

export const inputCls =
  "w-full h-11 rounded-xl border border-line bg-surface px-3.5 text-[15px] text-ink placeholder:text-muted/70 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15";

export function Input(p: ComponentProps<"input">) {
  return <input {...p} className={cx(inputCls, p.className)} />;
}
export function Textarea(p: ComponentProps<"textarea">) {
  return <textarea rows={3} {...p} className={cx(inputCls, "h-auto py-2.5", p.className)} />;
}
export function Select(p: ComponentProps<"select">) {
  return <select {...p} className={cx(inputCls, "appearance-none bg-no-repeat pr-9", p.className)} style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%238a9690' stroke-width='2' viewBox='0 0 24 24'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")", backgroundPosition: "right 12px center" }} />;
}

export function Card({ className, ...p }: ComponentProps<"div">) {
  return <div className={cx("rounded-2xl border border-line bg-surface", className)} {...p} />;
}

export function FormError({ error }: { error?: string }) {
  if (!error) return null;
  return (
    <p role="alert" className="rounded-xl bg-danger-soft px-3.5 py-2.5 text-sm text-danger">
      {error}
    </p>
  );
}

const statusCls: Record<OrderStatus, string> = {
  pending: "bg-surface-2 text-muted",
  in_progress: "bg-info-soft text-info",
  ready: "bg-ok-soft text-ok",
  delivered: "bg-primary-soft text-primary",
};

export function StatusPill({ status }: { status: OrderStatus }) {
  return (
    <span className={cx("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold", statusCls[status])}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {STATUS_LABEL[status]}
    </span>
  );
}

export function Avatar({ name, gender, size = "md" }: { name: string; gender?: string; size?: "sm" | "md" | "lg" }) {
  const s = size === "lg" ? "h-16 w-16 text-xl" : size === "sm" ? "h-9 w-9 text-xs" : "h-11 w-11 text-sm";
  const tone = gender === "male" ? "bg-primary-soft text-primary" : "bg-tape-soft text-warn";
  const ini = name.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]!.toUpperCase()).join("");
  return <span className={cx("inline-flex shrink-0 items-center justify-center rounded-full font-semibold", s, tone)}>{ini}</span>;
}

export function PageHeader({ title, subtitle, action, back }: { title: string; subtitle?: ReactNode; action?: ReactNode; back?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3">
      {back}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
        </div>
        {action}
      </div>
    </div>
  );
}
