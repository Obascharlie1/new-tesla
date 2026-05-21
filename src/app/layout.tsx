import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";

/*
 * DM Sans — closest free match to ABC Diatype (ABC Dinamo).
 * To switch to the real ABC Diatype once you have the licensed files:
 *   1. Place .woff2 files in /public/fonts/
 *   2. Replace this block with next/font/local pointing to those files
 *      and set variable: "--font-sans"
 */
const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "QuantumVest — AI-Powered Investment Platform",
  description:
    "Access institutional-grade trading tools, real-time analytics, and automated portfolio management. Trusted by 10M+ investors.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${dmSans.variable} antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
