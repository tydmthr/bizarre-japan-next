import { SiteHeader } from "@/components/layout/site-header";
import { SpotMap } from "@/components/marketing/spot-map";
import { SPOTS, FESTIVALS } from "@/lib/data";

export const metadata = {
  title: "Map — Bizarre Japan",
  description: "Map of strange spots and wild festivals across Japan.",
};

export default function MapEnPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <SpotMap spots={SPOTS} festivals={FESTIVALS} lang="en" />
      </main>
    </>
  );
}
