import type { Metadata } from "next";
import { Shippori_Mincho_B1, Noto_Sans_JP, Cinzel, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { SPOTS, FESTIVALS } from "@/lib/data";

const SPOT_COUNT = SPOTS.length;
const FEST_COUNT = FESTIVALS.length;

// フォント最適化: weight を最小化、preload は英文のみ
const fontDisplay = Shippori_Mincho_B1({
  variable: "--font-display-var",
  weight: ["700", "800"], // 500削減
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const fontSans = Noto_Sans_JP({
  variable: "--font-sans-var",
  weight: ["400", "700"], // 500削減
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const fontEnDisplay = Cinzel({
  variable: "--font-en-display-var",
  weight: ["700"], // 500削減
  subsets: ["latin"],
  display: "swap",
});

const fontEnSans = Inter({
  variable: "--font-en-sans-var",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://bizarrejapan.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Bizarre Japan / 異界巡礼 — 日本全国 珍スポット＆奇祭百景",
    template: "%s — Bizarre Japan / 異界巡礼",
  },
  description: `日本全国の一生記憶に残る珍スポット${SPOT_COUNT}件と奇祭${FEST_COUNT}件を、インタラクティブ地図と年間カレンダーで案内する文化アーカイブ。土俗の祭礼、廃墟、聖地、B級カオス。`,
  keywords: [
    "珍スポット",
    "奇祭",
    "日本全国",
    "民俗",
    "bizarre japan",
    "strange spots",
    "wild festivals",
    "fertility festival",
    "japan",
  ],
  authors: [{ name: "Bizarre Japan / 異界巡礼" }],
  icons: {
    icon: [
      { url: "/favicon.png" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/favicon-180.png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    siteName: "Bizarre Japan / 異界巡礼",
    title: `異界巡礼 — 日本全国 珍スポット${SPOT_COUNT}＆奇祭${FEST_COUNT}百景`,
    description: `日本全国の珍スポット${SPOT_COUNT}件と奇祭${FEST_COUNT}件を、地図と暦で案内する民俗アーカイブ。Strange spots and wild festivals across Japan.`,
    url: SITE_URL,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Bizarre Japan / 異界巡礼",
      },
    ],
    locale: "ja_JP",
    alternateLocale: ["en_US"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bizarre Japan / 異界巡礼",
    description: `${SPOT_COUNT} strange spots and ${FEST_COUNT} wild festivals across Japan, mapped and dated.`,
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "/",
    languages: {
      ja: "/",
      en: "/en",
    },
  },
  other: {
    "theme-color": "#0e0a08",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      suppressHydrationWarning
      className={`${fontDisplay.variable} ${fontSans.variable} ${fontEnDisplay.variable} ${fontEnSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
