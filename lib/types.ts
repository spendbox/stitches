export type Tailor = {
  id: string;
  business_name: string;
  full_name: string;
  email: string;
  phone: string | null;
  unit: "in" | "cm";
  currency: string;
  created_at: string;
  /** Missing until the latest schema.sql has been run; treat as "trial". */
  status?: AccountStatus;
  /** Public link to the business logo, if one was uploaded. */
  logo_url?: string | null;
};

export type AccountStatus = "trial" | "active" | "blocked";

export type Payment = {
  id: string;
  tailor_id: string | null;
  payer: string;
  amount: number;
  currency: string;
  method: string | null;
  note: string | null;
  paid_at: string;
  created_at: string;
};

export type Client = {
  id: string;
  tailor_id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  gender: "female" | "male";
  address: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Measurement = {
  id: string;
  client_id: string;
  label: string;
  unit: "in" | "cm";
  values: Record<string, number>;
  extras: { label: string; value: string }[];
  notes: string | null;
  taken_at: string;
  created_at: string;
};

export type OrderStatus = "pending" | "in_progress" | "ready" | "delivered";

export type Order = {
  id: string;
  client_id: string;
  title: string;
  status: OrderStatus;
  due_date: string | null;
  price: number | null;
  deposit: number | null;
  notes: string | null;
  created_at: string;
  updated_at?: string;
  /** Code for the client's status link (/o/<code>). Missing until the latest schema.sql is run. */
  share_token?: string | null;
  clients?: { full_name: string; phone?: string | null } | null;
};

export const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Not started",
  in_progress: "Sewing",
  ready: "Ready",
  delivered: "Delivered",
};

export const CURRENCIES = ["NGN", "USD", "GBP", "EUR", "GHS", "KES", "ZAR", "CAD", "INR", "AED"];
