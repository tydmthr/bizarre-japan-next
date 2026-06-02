import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { HeroIkai } from "@/components/marketing/hero-ikai";
import { IgFeed } from "@/components/marketing/ig-feed";

export const metadata = {
  title: "Bizarre Japan — Strange Spots & Wild Festivals",
  description:
    "An archive of folk shrines, fertility festivals, B-grade chaos, and haunted ruins across Japan. 219 strange spots and 172 wild festivals.",
};

export default function HomeEn() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <HeroIkai lang="en" />
        <IgFeed lang="en" />
      </main>
      <SiteFooter />
    </>
  );
}
