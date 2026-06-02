import { SiteHeader } from "@/components/layout/site-header";
import { SpotMap } from "@/components/marketing/spot-map";
import { SPOTS, FESTIVALS } from "@/lib/data";

export const metadata = {
  title: "地図 — 異界巡礼",
  description: "日本全国の珍スポットと奇祭を地図上で巡る。",
};

export default function MapPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <SpotMap spots={SPOTS} festivals={FESTIVALS} lang="ja" />
      </main>
    </>
  );
}
