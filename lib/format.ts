export function money(n: number | null | undefined, currency: string) {
  if (n === null || n === undefined) return "—";
  try {
    return new Intl.NumberFormat("en", { style: "currency", currency, currencyDisplay: "narrowSymbol", maximumFractionDigits: 0 }).format(n);
  } catch {
    return `${currency} ${n.toLocaleString()}`;
  }
}

export function date(d: string | null | undefined, opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" }) {
  if (!d) return "—";
  const dt = new Date(d.length === 10 ? d + "T00:00:00" : d);
  return dt.toLocaleDateString("en-GB", opts);
}

export function daysUntil(d: string | null | undefined) {
  if (!d) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(d + "T00:00:00");
  return Math.round((due.getTime() - today.getTime()) / 86400000);
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
}

export function str(v: FormDataEntryValue | null) {
  const s = typeof v === "string" ? v.trim() : "";
  return s.length ? s : null;
}

const DIAL: Record<string, string> = { NGN: "234", GHS: "233", KES: "254", ZAR: "27", GBP: "44", INR: "91", AED: "971", USD: "1", CAD: "1" };

/**
 * Turn a phone number into the digits WhatsApp links need (country code first).
 * "+234 803…" stays as is; a local "0803…" uses the country of the tailor's currency.
 * Returns "" when unsure, which lets WhatsApp ask who to send to.
 */
export function waNumber(phone: string | null | undefined, currency?: string) {
  if (!phone) return "";
  const p = phone.trim();
  const digits = p.replace(/[^\d]/g, "");
  if (p.startsWith("+")) return digits;
  if (p.startsWith("00")) return digits.slice(2);
  const cc = currency ? DIAL[currency] : undefined;
  if (cc && digits.startsWith("0") && digits.length >= 9) return cc + digits.slice(1);
  if (cc && digits.startsWith(cc) && digits.length > 10) return digits;
  return "";
}
