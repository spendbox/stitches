"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Copy, Pencil, Plus, Ruler } from "lucide-react";
import Mannequin from "./Mannequin";
import { ButtonLink, Card, cx } from "./ui";
import { GROUPS, fieldLabel, fieldsFor, formatValue, type Figure } from "@/lib/measurements";
import type { Measurement } from "@/lib/types";
import { date } from "@/lib/format";

export default function MeasurementViewer({
  sets,
  figure,
  clientId,
  clientName,
}: {
  sets: Measurement[];
  figure: Figure;
  clientId: string;
  clientName: string;
}) {
  const [idx, setIdx] = useState(0);
  const [active, setActive] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (sets.length === 0) {
    return (
      <Card className="flex flex-col items-center gap-5 p-6 text-center sm:flex-row sm:text-left">
        <Mannequin figure={figure} showAll className="h-48 w-auto shrink-0" />
        <div>
          <h3 className="font-display text-lg font-semibold">No measurements yet</h3>
          <p className="mt-1 max-w-sm text-sm text-muted">
            Take {clientName.split(" ")[0]}’s measurements. The mannequin shows where each one goes as you type.
          </p>
          <ButtonLink href={`/clients/${clientId}/measurements/new`} className="mt-4">
            <Ruler className="h-4 w-4" /> Take measurements
          </ButtonLink>
        </div>
      </Card>
    );
  }

  const set = sets[idx]!;
  const fields = fieldsFor(figure).filter((f) => set.values[f.key] !== undefined);
  const measured = fields.map((f) => f.key);

  async function copy() {
    const lines = [
      `${clientName} · ${set.label} (${date(set.taken_at)})`,
      ...fields.map((f) => `${fieldLabel(f, figure)}: ${formatValue(set.values[f.key], set.unit)}`),
      ...set.extras.map((e) => `${e.label}: ${e.value}`),
      ...(set.notes ? [`Notes: ${set.notes}`] : []),
    ];
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <Card className="overflow-hidden">
      {sets.length > 1 && (
        <div className="flex gap-2 overflow-x-auto border-b border-line px-4 py-3 sm:px-5">
          {sets.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setIdx(i)}
              className={cx(
                "shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                i === idx ? "border-primary bg-primary-soft text-primary" : "border-line text-muted hover:text-ink"
              )}
            >
              {s.label} · {date(s.taken_at, { day: "numeric", month: "short", year: "2-digit" })}
            </button>
          ))}
        </div>
      )}
      <div className="grid md:grid-cols-[240px_1fr]">
        <div className="flex items-center justify-center border-b border-line bg-surface-2/60 p-4 md:border-b-0 md:border-r">
          <Mannequin figure={figure} active={active} measured={measured} className="h-60 w-auto md:h-[440px]" />
        </div>
        <div className="min-w-0 p-4 sm:p-5">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="font-display text-lg font-semibold">{set.label}</h3>
              <p className="text-xs text-muted">
                Taken {date(set.taken_at)} · in {set.unit === "cm" ? "centimetres" : "inches"}
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={copy} className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-line px-3 text-xs font-semibold hover:bg-surface-2">
                {copied ? <Check className="h-3.5 w-3.5 text-ok" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
              <Link href={`/clients/${clientId}/measurements/${set.id}`} className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-line px-3 text-xs font-semibold hover:bg-surface-2">
                <Pencil className="h-3.5 w-3.5" /> Edit
              </Link>
              <Link href={`/clients/${clientId}/measurements/new`} className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-primary px-3 text-xs font-semibold text-primary-ink hover:opacity-90">
                <Plus className="h-3.5 w-3.5" /> New set
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            {GROUPS.map((g) => {
              const gf = fields.filter((f) => f.group === g);
              if (!gf.length) return null;
              return (
                <div key={g}>
                  <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">{g}</p>
                  <div className="grid grid-cols-2 gap-x-6 sm:grid-cols-3">
                    {gf.map((f) => (
                      <button
                        key={f.key}
                        onMouseEnter={() => setActive(f.key)}
                        onMouseLeave={() => setActive(null)}
                        onFocus={() => setActive(f.key)}
                        onBlur={() => setActive(null)}
                        onClick={() => setActive(active === f.key ? null : f.key)}
                        className={cx(
                          "flex items-baseline justify-between gap-2 border-b border-dashed border-line py-2 text-left transition",
                          active === f.key && "border-tape"
                        )}
                      >
                        <span className="truncate text-sm text-muted">{fieldLabel(f, figure)}</span>
                        <span className="tnum font-mono text-sm font-medium text-ink">{formatValue(set.values[f.key], set.unit)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
            {set.extras.length > 0 && (
              <div>
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">Extra</p>
                <div className="grid grid-cols-2 gap-x-6 sm:grid-cols-3">
                  {set.extras.map((e, i) => (
                    <div key={i} className="flex items-baseline justify-between gap-2 border-b border-dashed border-line py-2">
                      <span className="truncate text-sm text-muted">{e.label}</span>
                      <span className="tnum font-mono text-sm font-medium">{e.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {set.notes && <p className="rounded-xl bg-surface-2 p-3 text-sm text-muted">{set.notes}</p>}
          </div>
        </div>
      </div>
    </Card>
  );
}
