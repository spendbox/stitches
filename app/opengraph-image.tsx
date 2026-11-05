import { ImageResponse } from "next/og";

// The picture shown when an onepad.site link is shared on WhatsApp, X, Facebook, etc.
export const alt = "Onepad: measurements and orders for tailors";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  const ticks = Array.from({ length: 150 }, (_, i) => i);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#1f4d43", color: "#ffffff" }}>
        <div style={{ display: "flex", flex: 1, flexDirection: "column", justifyContent: "center", padding: "0 90px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
            <svg width="88" height="88" viewBox="0 0 40 40">
              <rect width="40" height="40" rx="11" fill="#ffffff" />
              <rect x="16" y="24.5" width="16" height="4.6" rx="1" fill="#e5b22b" />
              <path d="M24.5 24.5v2.3M27 24.5v1.4M29.5 24.5v2.3" stroke="#2b2206" strokeWidth="0.85" />
              <rect x="31.2" y="22.6" width="2.2" height="8.4" rx="0.8" fill="#1f4d43" />
              <circle cx="16" cy="18" r="8.4" fill="none" stroke="#1f4d43" strokeWidth="4.6" />
            </svg>
            <div style={{ fontSize: 64, fontWeight: 700, letterSpacing: -2 }}>onepad</div>
          </div>
          <div style={{ marginTop: 44, fontSize: 68, fontWeight: 700, lineHeight: 1.08, letterSpacing: -2, maxWidth: 940 }}>
            Every client’s measurements, ready when they walk in.
          </div>
          <div style={{ marginTop: 28, fontSize: 30, color: "rgba(255,255,255,0.75)" }}>Measurements · Orders · Balances · onepad.site</div>
        </div>
        <div style={{ display: "flex", height: 54, background: "#f0c34a", alignItems: "flex-start" }}>
          {ticks.map((i) => (
            <div key={i} style={{ width: 8, height: i % 5 === 0 ? 30 : 16, borderLeft: "2px solid #241b02" }} />
          ))}
        </div>
      </div>
    ),
    size
  );
}
