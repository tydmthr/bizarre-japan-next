import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { HeroIkai } from "@/components/marketing/hero-ikai";
import { IgFeed } from "@/components/marketing/ig-feed";
import { JsonLd } from "@/components/seo/json-ld";
import { buildWebSiteJsonLd } from "@/lib/seo";

export default function Home() {
  return (
    <>
      <JsonLd data={buildWebSiteJsonLd({ lang: "ja" })} />
      <SiteHeader />
      <main className="flex-1">
        <HeroIkai />
        <IgFeed lang="ja" />
      </main>
      <SiteFooter />
    </>
  );
}
