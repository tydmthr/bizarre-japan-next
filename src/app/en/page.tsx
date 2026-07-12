import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { HeroIkai } from "@/components/marketing/hero-ikai";
import { SPOTS, FESTIVALS } from "@/lib/data";
import { JsonLd } from "@/components/seo/json-ld";
import { buildWebSiteJsonLd } from "@/lib/seo";

const SPOT_COUNT = SPOTS.length;
const FEST_COUNT = FESTIVALS.length;

const EN_TITLE = "Bizarre Japan — Strange Spots & Wild Festivals";
const EN_DESCRIPTION = `An archive of folk shrines, fertility festivals, B-grade chaos, and haunted ruins across Japan. ${SPOT_COUNT} strange spots and ${FEST_COUNT} wild festivals, mapped and dated.`;

export const metadata: Metadata = {
  // template の二重掛けを避けるため absolute で確定
  title: { absolute: EN_TITLE },
  description: EN_DESCRIPTION,
  alternates: {
    canonical: "/en",
    languages: {
      ja: "/",
      en: "/en",
      "x-default": "/",
    },
  },
  openGraph: {
    type: "website",
    title: EN_TITLE,
    description: EN_DESCRIPTION,
    url: "/en",
    siteName: "Bizarre Japan",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: EN_TITLE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: EN_TITLE,
    description: EN_DESCRIPTION,
    images: ["/og-image.png"],
  },
};

export default function HomeEn() {
  return (
    <>
      <JsonLd data={buildWebSiteJsonLd({ lang: "en" })} />
      <SiteHeader />
      <main className="flex-1">
        <HeroIkai lang="en" />
      </main>
      <SiteFooter />
    </>
  );
}
