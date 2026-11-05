import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import NavProgress from "@/components/NavProgress";
import "./globals.css";

// Fonts are bundled with the site (no extra trip to Google) and shown instantly.
const sans = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--f-sans", display: "swap" });
const display = Bricolage_Grotesque({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--f-display", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["500"], variable: "--f-mono", display: "swap", preload: false });

export const metadata: Metadata = {
  title: { default: "Stitches", template: "%s · Stitches" },
  description: "Client measurements, orders and balances for tailors and fashion designers. Works on your phone.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f4f6f3",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${sans.variable} ${display.variable} ${mono.variable}`}>
      <head>
        {/* Light by default; apply dark before paint only if the user chose it. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem("stitches-theme")==="dark")document.documentElement.dataset.theme="dark"}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-dvh">
        <NavProgress />
        {children}
      </body>
    </html>
  );
}
