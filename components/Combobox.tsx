"use client";

import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";
import { cx, inputCls } from "./ui";

export type ComboOption = { id: string; label: string; sub?: string | null };

/**
 * A searchable drop-down. Type to filter, use arrow keys or tap to choose.
 * The chosen id is sent with the form under `name`.
 */
export default function Combobox({
  id,
  name,
  options,
  defaultValue,
  placeholder = "Search…",
  required,
  emptyText = "No matches",
  footer,
  onChange,
}: {
  id?: string;
  name: string;
  options: ComboOption[];
  defaultValue?: string | null;
  placeholder?: string;
  required?: boolean;
  emptyText?: string;
  footer?: ReactNode;
  onChange?: (id: string) => void;
}) {
  const auto = useId();
  const inputId = id ?? auto;
  const listId = `${inputId}-list`;
  const initial = options.find((o) => o.id === defaultValue) ?? null;
  const [selected, setSelected] = useState<ComboOption | null>(initial);
  const [query, setQuery] = useState(initial?.label ?? "");
  const [open, setOpen] = useState(false);
  const [hi, setHi] = useState(0);
  const wrap = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLUListElement>(null);

  const typing = !selected || query !== selected.label;
  const results = useMemo(() => {
    const q = typing ? query.trim().toLowerCase() : "";
    if (!q) return options;
    const words = q.split(/\s+/);
    return options.filter((o) => {
      const hay = `${o.label} ${o.sub ?? ""}`.toLowerCase();
      return words.every((w) => hay.includes(w));
    });
  }, [options, query, typing]);

  // Keep browser validation honest: the visible box must hold a real choice.
  useEffect(() => {
    input.current?.setCustomValidity(required && !selected ? "Choose one from the list." : "");
  }, [required, selected]);

  useEffect(() => {
    if (!open) return;
    const close = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) {
        setOpen(false);
        setQuery(selected?.label ?? "");
      }
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open, selected]);

  useEffect(() => {
    list.current?.querySelector<HTMLElement>(`[data-i="${hi}"]`)?.scrollIntoView({ block: "nearest" });
  }, [hi]);

  function choose(o: ComboOption) {
    setSelected(o);
    setQuery(o.label);
    setOpen(false);
    onChange?.(o.id);
  }

  function clear() {
    setSelected(null);
    setQuery("");
    setOpen(true);
    setHi(0);
    onChange?.("");
    input.current?.focus();
  }

  return (
    <div ref={wrap} className="relative">
      <input type="hidden" name={name} value={selected?.id ?? ""} />
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted" />
      <input
        ref={input}
        id={inputId}
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={open && results[hi] ? `${listId}-${hi}` : undefined}
        autoComplete="off"
        placeholder={placeholder}
        value={query}
        onFocus={(e) => {
          setOpen(true);
          e.target.select();
        }}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          setHi(0);
          if (selected && e.target.value !== selected.label) {
            setSelected(null);
            onChange?.("");
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
            setHi((h) => Math.min(h + 1, results.length - 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHi((h) => Math.max(h - 1, 0));
          } else if (e.key === "Enter" && open) {
            e.preventDefault();
            if (results[hi]) choose(results[hi]);
          } else if (e.key === "Escape") {
            setOpen(false);
            setQuery(selected?.label ?? "");
          }
        }}
        className={cx(inputCls, "pl-10 pr-16")}
      />
      <div className="absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center">
        {query && (
          <button type="button" onClick={clear} aria-label="Clear" className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-surface-2">
            <X className="h-4 w-4" />
          </button>
        )}
        <button
          type="button"
          tabIndex={-1}
          aria-label={open ? "Close list" : "Open list"}
          onClick={() => {
            setOpen((o) => !o);
            input.current?.focus();
          }}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-surface-2"
        >
          <ChevronDown className={cx("h-4 w-4 transition", open && "rotate-180")} />
        </button>
      </div>

      {open && (
        <div className="absolute inset-x-0 top-full z-40 mt-1.5 overflow-hidden rounded-xl border border-line bg-surface shadow-xl shadow-black/10">
          <ul ref={list} id={listId} role="listbox" className="max-h-64 overflow-y-auto overscroll-contain py-1">
            {results.length === 0 ? (
              <li className="px-3.5 py-3 text-sm text-muted">{emptyText}</li>
            ) : (
              results.map((o, i) => (
                <li
                  key={o.id}
                  id={`${listId}-${i}`}
                  data-i={i}
                  role="option"
                  aria-selected={selected?.id === o.id}
                  onPointerDown={(e) => e.preventDefault()}
                  onClick={() => choose(o)}
                  onMouseEnter={() => setHi(i)}
                  className={cx("flex cursor-pointer items-center gap-3 px-3.5 py-2.5", i === hi && "bg-surface-2")}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{o.label}</p>
                    {o.sub && <p className="truncate text-xs text-muted">{o.sub}</p>}
                  </div>
                  {selected?.id === o.id && <Check className="h-4 w-4 shrink-0 text-primary" />}
                </li>
              ))
            )}
          </ul>
          {footer && <div className="border-t border-line">{footer}</div>}
        </div>
      )}
    </div>
  );
}
