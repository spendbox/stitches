"use client";

import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { CheckCircle2, ImagePlus, Loader2, Trash2 } from "lucide-react";
import { removeLogo, uploadLogo } from "@/app/actions/data";
import BusinessLogo from "./BusinessLogo";
import PendingButton from "./PendingButton";
import { Card, FormError, cx } from "./ui";

const MAX = 512; // longest side in pixels; plenty for a logo and loads fast

/** Shrink the picture in the browser so uploads are quick even on slow data. */
async function shrink(file: File): Promise<Blob> {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    const scale = Math.min(1, MAX / Math.max(img.naturalWidth, img.naturalHeight));
    const w = Math.max(1, Math.round(img.naturalWidth * scale));
    const h = Math.max(1, Math.round(img.naturalHeight * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
    const png = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/png"));
    if (png && png.size < 900_000) return png;
    const webp = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/webp", 0.9));
    return webp ?? png ?? file;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export default function LogoUpload({ business, logoUrl }: { business: string; logoUrl: string | null }) {
  const [state, action, pending] = useActionState(uploadLogo, undefined);
  const [preparing, setPreparing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const busy = preparing || pending;

  useEffect(() => {
    if (state && !pending) setPreview(null); // show the saved logo from the server
  }, [state, pending]);

  async function pick(file: File | undefined) {
    if (!file) return;
    setLocalError(null);
    if (!file.type.startsWith("image/")) return setLocalError("Choose an image file (PNG or JPG).");
    setPreparing(true);
    try {
      const blob = await shrink(file);
      setPreview(URL.createObjectURL(blob));
      const fd = new FormData();
      fd.set("logo", new File([blob], `logo.${blob.type.split("/")[1] ?? "png"}`, { type: blob.type }));
      startTransition(() => action(fd));
    } catch {
      setLocalError("We couldn't read that image. Try another file.");
    } finally {
      setPreparing(false);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <Card className="flex flex-col gap-4 p-4 sm:p-6">
      <div>
        <h2 className="font-display text-lg font-semibold">Business logo</h2>
        <p className="mt-1 text-sm text-muted">Shown in your app and on the order links you send clients. A square logo looks best.</p>
      </div>
      <FormError error={localError ?? state?.error} />
      {state?.fields?.saved && !busy && (
        <p className="flex items-center gap-2 rounded-xl bg-ok-soft px-3.5 py-2.5 text-sm text-ok">
          <CheckCircle2 className="h-4 w-4" /> Logo saved
        </p>
      )}
      <div className="flex items-center gap-4">
        <div className="relative">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="" className="h-24 w-24 rounded-3xl border border-line bg-white object-contain p-1" />
          ) : (
            <BusinessLogo name={business} url={logoUrl} size="xl" />
          )}
          {busy && (
            <span className="absolute inset-0 flex items-center justify-center rounded-3xl bg-surface/70">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <input ref={input} id="logo-file" type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={(e) => pick(e.target.files?.[0])} />
          <label
            htmlFor="logo-file"
            className={cx(
              "inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-ink hover:opacity-90",
              busy && "pointer-events-none opacity-60"
            )}
          >
            <ImagePlus className="h-4 w-4" /> {busy ? "Uploading…" : logoUrl ? "Change logo" : "Upload logo"}
          </label>
          {logoUrl && !busy && (
            <form action={removeLogo}>
              <PendingButton pendingText="Removing…" className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2 text-xs font-semibold text-muted hover:bg-danger-soft hover:text-danger">
                <Trash2 className="h-3.5 w-3.5" /> Remove logo
              </PendingButton>
            </form>
          )}
          <p className="text-xs text-muted">PNG, JPG or WebP.</p>
        </div>
      </div>
    </Card>
  );
}
