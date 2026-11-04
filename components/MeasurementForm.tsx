"use client";

import { useActionState, useState } from "react";
import { Plus, X } from "lucide-react";
import { saveMeasurement } from "@/app/actions/data";
import Mannequin from "./Mannequin";
import { Card, Field, FormError, Input, Textarea, cx, inputCls } from "./ui";
import SubmitButton from "./SubmitButton";
import { GROUPS, fieldLabel, fieldsFor, type Figure } from "@/lib/measurements";
import type { Measurement } from "@/lib/types";

export default function MeasurementForm({
  clientId,
  figure,
  defaultUnit,
  existing,
  prefill,
}: {
  clientId: string;
  figure: Figure;
  defaultUnit: "in" | "cm";
  existing?: Measurement;
  prefill?: Measurement;
}) {
  const [state, action] = useActionState(saveMeasurement, undefined);
  const source = existing ?? prefill;
  const [unit, setUnit] = useState<"in" | "cm">(source?.unit ?? defaultUnit);
  const [active, setActive] = useState<string | null>(null);
  const [filled, setFilled] = useState<string[]>(Object.keys(source?.values ?? {}));
  const [extras, setExtras] = useState(source?.extras?.length ? source.extras : []);
  const fields = fieldsFor(figure);
  const activeField = fields.find((f) => f.key === active);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={action} className="grid gap-6 lg:grid-cols-[300px_1fr]">
      <input type="hidden" name="client_id" value={clientId} />
      {existing && <input type="hidden" name="id" value={existing.id} />}
      <input type="hidden" name="unit" value={unit} />

      {/* Mannequin guide: sticky strip on phones, sticky column on desktop */}
      <div className="sticky top-[calc(env(safe-area-inset-top)+60px)] z-10 lg:top-8 lg:self-start">
        <Card className="flex items-center gap-4 p-3 shadow-sm lg:flex-col lg:p-6 lg:shadow-none">
          <Mannequin figure={figure} active={active} measured={filled} className="h-28 w-auto shrink-0 lg:h-[420px]" />
          <div className="min-w-0 lg:w-full lg:text-center">
            {activeField ? (
              <>
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-warn">Measuring</p>
                <p className="font-display text-lg font-semibold leading-tight">{fieldLabel(activeField, figure)}</p>
                <p className="mt-0.5 text-xs text-muted">{activeField.hint}</p>
              </>
            ) : (
              <>
                <p className="font-display text-base font-semibold leading-tight">Tap a field</p>
                <p className="mt-0.5 text-xs text-muted">The yellow tape shows where to measure.</p>
              </>
            )}
            <p className="tnum mt-2 text-xs font-medium text-primary">
              {filled.length} of {fields.length} taken
            </p>
          </div>
        </Card>
      </div>

      <div className="flex min-w-0 flex-col gap-5">
        <FormError error={state?.error} />
        {prefill && !existing && (
          <p className="rounded-xl bg-info-soft px-3.5 py-2.5 text-sm text-info">
            Values are copied from the last set. Change only what’s different.
          </p>
        )}

        <Card className="grid gap-4 p-4 sm:grid-cols-[1fr_1fr_auto] sm:p-5">
          <Field label="Name this set" htmlFor="label">
            <Input id="label" name="label" defaultValue={existing?.label ?? "Standard"} placeholder="Standard, Wedding gown, Agbada…" />
          </Field>
          <Field label="Date taken" htmlFor="taken_at">
            <Input id="taken_at" name="taken_at" type="date" defaultValue={existing?.taken_at ?? today} />
          </Field>
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Unit</span>
            <div className="grid h-11 grid-cols-2 gap-1 rounded-xl bg-surface-2 p-1">
              {(["in", "cm"] as const).map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setUnit(u)}
                  aria-pressed={unit === u}
                  className={cx("rounded-lg px-4 text-sm font-semibold transition", unit === u ? "bg-surface text-ink shadow-sm" : "text-muted")}
                >
                  {u === "in" ? "inch" : "cm"}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {GROUPS.map((g) => {
          const gf = fields.filter((f) => f.group === g);
          if (!gf.length) return null;
          return (
            <Card key={g} className="p-4 sm:p-5">
              <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">{g}</h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                {gf.map((f) => (
                  <div key={f.key} className="flex flex-col gap-1">
                    <label htmlFor={`m_${f.key}`} className={cx("truncate text-xs font-medium transition", active === f.key ? "text-ink" : "text-muted")}>
                      {fieldLabel(f, figure)}
                    </label>
                    <div className="relative">
                      <input
                        id={`m_${f.key}`}
                        name={`m_${f.key}`}
                        inputMode="decimal"
                        autoComplete="off"
                        placeholder="0"
                        defaultValue={source?.values?.[f.key] ?? ""}
                        onFocus={() => setActive(f.key)}
                        onBlur={() => setActive((a) => (a === f.key ? null : a))}
                        onChange={(e) => {
                          const has = e.target.value.trim() !== "";
                          setFilled((p) => (has ? Array.from(new Set([...p, f.key])) : p.filter((k) => k !== f.key)));
                        }}
                        className={cx(inputCls, "tnum pr-10 font-mono", active === f.key && "!border-tape !ring-4 !ring-tape/30")}
                      />
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted">{unit === "in" ? "in" : "cm"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}

        <Card className="p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">Extra measurements</h3>
            <button
              type="button"
              onClick={() => setExtras((e) => [...e, { label: "", value: "" }])}
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary"
            >
              <Plus className="h-4 w-4" /> Add
            </button>
          </div>
          {extras.length === 0 ? (
            <p className="text-sm text-muted">Add anything else you measure, such as cap size or agbada length.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {extras.map((e, i) => (
                <div key={i} className="flex gap-2">
                  <input aria-label="Measurement name" name="extra_label" defaultValue={e.label} placeholder="Name" className={cx(inputCls, "flex-[2]")} />
                  <input aria-label="Value" name="extra_value" defaultValue={e.value} placeholder="Value" className={cx(inputCls, "tnum flex-1 font-mono")} />
                  <button
                    type="button"
                    aria-label="Remove"
                    onClick={() => setExtras((x) => x.filter((_, j) => j !== i))}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-muted hover:bg-surface-2"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-4 sm:p-5">
          <Field label="Notes" htmlFor="notes">
            <Textarea id="notes" name="notes" defaultValue={existing?.notes ?? ""} placeholder="Leaves 1 inch ease at the waist; left shoulder slightly lower" />
          </Field>
        </Card>

        <div className="sticky bottom-[calc(env(safe-area-inset-bottom)+84px)] z-10 lg:bottom-6">
          <SubmitButton className="h-12 w-full shadow-lg shadow-primary/20">{existing ? "Save changes" : "Save measurements"}</SubmitButton>
        </div>
      </div>
    </form>
  );
}
