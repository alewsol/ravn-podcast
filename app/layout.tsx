import type { Metadata } from "next";
import { Instrument_Serif, Mona_Sans } from "next/font/google";
import { getSiteUrl } from "@/lib/site";
import "./globals.css";

const monaSans = Mona_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: false,
  fallback: [
    "ui-sans-serif",
    "system-ui",
    "sans-serif",
    "Apple Color Emoji",
    "Segoe UI Emoji",
    "Segoe UI Symbol",
    "Noto Color Emoji",
  ],
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-editorial",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: "Budera — ATOMS & Founder Files",
  description:
    "The media for people building the future before it’s obvious.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${monaSans.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
