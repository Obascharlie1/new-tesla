import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});
import { ThemeProvider } from "@/providers/ThemeProvider";
import { TawkChat } from "@/components/ui/TawkChat";
import { SessionGuard } from "@/components/ui/SessionGuard";

const SITE_URL = 'https://tesla-bridges-capital.vercel.app'
const OG_IMAGE = `${SITE_URL}/images/og-cover.jpg`

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Tesla Capital — Invest in Forex, Stocks & Crypto",
  description:
    "Putting Our Clients First For Over A Decade. Tesla Capital is a trusted trading platform for Forex, Stock Market & Crypto — generate returns on rising and falling markets worldwide.",
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "Tesla Capital — Invest in Forex, Stocks & Crypto",
    description:
      "Putting Our Clients First For Over A Decade. Tesla Capital is a trusted trading platform for Forex, Stock Market & Crypto — generate returns on rising and falling markets worldwide.",
    siteName: "Tesla Capital",
    images: [
      {
        url: OG_IMAGE,
        secureUrl: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Tesla Capital — Invest, Trade & Grow",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tesla Capital — Invest in Forex, Stocks & Crypto",
    description:
      "Putting Our Clients First For Over A Decade. Tesla Capital is a trusted trading platform for Forex, Stock Market & Crypto — generate returns on rising and falling markets worldwide.",
    images: [OG_IMAGE],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={geist.variable}>
      <body className="antialiased">
        <ThemeProvider>{children}</ThemeProvider>
        <SessionGuard />
        <TawkChat />
      </body>
    </html>
  );
}
