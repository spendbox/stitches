"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "./ui";
import SubmitButton from "./SubmitButton";

export default function ConfirmDelete({
  action,
  fields,
  label = "Delete",
  message,
  compact,
}: {
  action: (form: FormData) => Promise<void>;
  fields: Record<string, string>;
  label?: string;
  message: string;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  if (!open) {
    return (
      <Button type="button" variant="ghost" className={compact ? "h-9 px-2.5 text-danger" : "text-danger"} onClick={() => setOpen(true)} aria-label={label}>
        <Trash2 className="h-4 w-4" />
        {!compact && label}
      </Button>
    );
  }
  return (
    <form action={action} className="flex flex-wrap items-center gap-2 rounded-xl bg-danger-soft p-2 pl-3">
      {Object.entries(fields).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}
      <span className="text-sm text-danger">{message}</span>
      <div className="ml-auto flex gap-2">
        <Button type="button" variant="secondary" className="h-9" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <SubmitButton variant="danger" className="h-9" pendingText="Deleting…">
          {label}
        </SubmitButton>
      </div>
    </form>
  );
}
