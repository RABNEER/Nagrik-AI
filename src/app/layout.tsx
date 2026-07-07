import type { Metadata } from "next";
import { Instrument_Sans, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { LanguageOverlay } from "@/components/nagrik/lang-overlay";

const instrumentSans = Instrument_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "NagrikAI — Your Trusted AI Companion for Every Government Service",
  description:
    "NagrikAI helps Indian citizens understand government schemes, check suspicious messages for scams, and report grievances — in plain language, in your own language. Trust-first civic AI built on DPDP Act 2023 principles.",
  keywords: [
    "NagrikAI",
    "India government services",
    "civic AI",
    "scam protection",
    "Aadhaar",
    "PM-Kisan",
    "Ayushman Bharat",
    "grievance redressal",
    "DPDP Act",
  ],
  authors: [{ name: "NagrikAI" }],
  openGraph: {
    title: "NagrikAI — Your Trusted AI Companion",
    description:
      "Understand schemes, detect scams, report grievances — in your language. Trust-first civic AI for every Indian.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NagrikAI — Trusted AI for Government Services",
    description:
      "Understand schemes, detect scams, report grievances — in your language.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${instrumentSans.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} antialiased bg-background text-foreground font-sans`}
      >
        {children}
        <LanguageOverlay />
        <Toaster />
      </body>
    </html>
  );
}
