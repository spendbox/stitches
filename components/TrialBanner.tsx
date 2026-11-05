import { Sparkles, MessageCircle, Mail } from "lucide-react";
import { adminContact } from "@/lib/admin";

/** Shown to every account the admin has not yet approved. */
export default function TrialBanner({ business, name, email: userEmail }: { business: string; name: string; email: string }) {
  const { email, phone } = adminContact();
  const digits = phone?.replace(/[^\d]/g, "");
  // Spell out who is asking so the admin can find the account under Users.
  const msg = encodeURIComponent(
    [
      "Hello, I'd like to pay for full access to my Onepad account.",
      "",
      `Business name: ${business}`,
      `My name: ${name}`,
      `Login email: ${userEmail}`,
      "",
      "Please send me the payment details.",
    ].join("\n")
  );
  const href = digits ? `https://wa.me/${digits}?text=${msg}` : email ? `mailto:${email}?subject=${encodeURIComponent("Onepad full access")}&body=${msg}` : null;

  return (
    <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-tape/40 bg-tape-soft px-4 py-3 sm:flex-row sm:items-center sm:gap-4">
      <span className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-tape text-tape-ink sm:flex">
        <Sparkles className="h-[18px] w-[18px]" />
      </span>
      <div className="min-w-0 flex-1 text-sm">
        <p className="font-semibold text-ink">You’re using Onepad in trial mode</p>
        <p className="text-muted">
          Everything works. To keep full access, contact the admin to pay
          {phone ? <> on <span className="font-medium text-ink">{phone}</span></> : email ? <> at <span className="font-medium text-ink">{email}</span></> : null}. Your account is upgraded as soon as payment is confirmed.
        </p>
      </div>
      {href && (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-tape px-4 text-sm font-semibold text-tape-ink hover:opacity-90"
        >
          {digits ? <MessageCircle className="h-4 w-4" /> : <Mail className="h-4 w-4" />} Contact admin
        </a>
      )}
    </div>
  );
}
