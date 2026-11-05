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
            <div style={{ width: 84, height: 84, borderRadius: 24, background: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 34, height: 46, background: "#1f4d43", borderRadius: "14px 14px 6px 6px" }} />
            </div>
            <div style={{ fontSize: 64, fontWeight: 700, letterSpacing: -2 }}>Onepad</div>
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
