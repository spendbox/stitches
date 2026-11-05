"use client";

import { useEffect, useState } from "react";
import { Check, Copy, ExternalLink, Link2, MessageCircle, RefreshCw, Share2 } from "lucide-react";
import { resetShareLink } from "@/app/actions/data";
import PendingButton from "./PendingButton";
import { Card, cx } from "./ui";
import { waNumber } from "@/lib/format";

/** Lets the tailor send the client a link to follow this order without logging in. */
export default function ShareOrder({
  orderId,
  token,
  clientName,
  clientPhone,
  garment,
  business,
  currency,
}: {
  orderId: string;
  token: string;
  clientName: string;
  clientPhone: string | null;
  garment: string;
  business: string;
  currency: string;
}) {
  const [url, setUrl] = useState(`/o/${token}`);
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    setUrl(`${location.origin}/o/${token}`);
    setCanShare(typeof navigator.share === "function");
    setConfirmReset(false);
  }, [token]);

  const first = clientName.split(" ")[0];
  const message = `Hello ${first}, you can check the progress of your ${garment} from ${business} here: ${url}`;
  // wa.me needs an international number; otherwise WhatsApp lets you pick the chat.
  const intl = waNumber(clientPhone, currency);
  const whatsapp = `https://wa.me/${intl}?text=${encodeURIComponent(message)}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const el = document.getElementById("share-url") as HTMLInputElement | null;
      el?.select();
      document.execCommand?.("copy");
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  async function share() {
    try {
      await navigator.share({ title: `${garment} · ${business}`, text: message.replace(url, "").trim(), url });
    } catch {
      /* closed the share sheet */
    }
  }

  const btn = "inline-flex h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition";

  return (
    <Card className="mb-5 p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
          <Link2 className="h-[18px] w-[18px]" />
        </span>
        <div className="min-w-0">
          <h2 className="font-display text-lg font-semibold leading-tight">Send {first} a status link</h2>
          <p className="mt-0.5 text-sm text-muted">They can check progress, due date and balance anytime. No login needed, and it updates when you change the status.</p>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <input
          id="share-url"
          readOnly
          value={url}
          onFocus={(e) => e.target.select()}
          className="h-11 min-w-0 flex-1 rounded-xl border border-line bg-surface-2 px-3 font-mono text-xs text-muted outline-none"
          aria-label="Client link"
        />
        <button type="button" onClick={copy} className={cx(btn, "border border-line bg-surface hover:bg-surface-2", copied && "text-ok")}>
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <a href={whatsapp} target="_blank" rel="noreferrer" className={cx(btn, "bg-[#1f8a4c] text-white hover:opacity-90")}>
          <MessageCircle className="h-4 w-4" /> Send on WhatsApp
        </a>
        {canShare ? (
          <button type="button" onClick={share} className={cx(btn, "border border-line bg-surface hover:bg-surface-2")}>
            <Share2 className="h-4 w-4" /> Share another way
          </button>
        ) : (
          <a href={`/o/${token}`} target="_blank" rel="noreferrer" className={cx(btn, "border border-line bg-surface hover:bg-surface-2")}>
            <ExternalLink className="h-4 w-4" /> Preview client view
          </a>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
        {canShare && (
          <a href={`/o/${token}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold hover:text-ink">
            <ExternalLink className="h-3.5 w-3.5" /> Preview what the client sees
          </a>
        )}
        {confirmReset ? (
          <form action={resetShareLink} className="ml-auto flex items-center gap-2">
            <input type="hidden" name="id" value={orderId} />
            <span>Old link will stop working.</span>
            <button type="button" onClick={() => setConfirmReset(false)} className="rounded-lg px-2 py-1 font-semibold hover:bg-surface-2">
              Cancel
            </button>
            <PendingButton pendingText="Making…" className="inline-flex items-center gap-1 rounded-lg bg-danger-soft px-2 py-1 font-semibold text-danger">
              Make new link
            </PendingButton>
          </form>
        ) : (
          <button type="button" onClick={() => setConfirmReset(true)} className="ml-auto inline-flex items-center gap-1 font-semibold hover:text-ink">
            <RefreshCw className="h-3.5 w-3.5" /> Make a new link
          </button>
        )}
      </div>
    </Card>
  );
}
