import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { Tag, categoryLabelJa } from "@/components/ui/tag";
import { ArrowRight, ExternalLink, ChevronRight } from "@/components/icons";
import {
  getSpotById,
  getAllSpotIds,
  getPhotoFor,
  getAccessFor,
  effectiveDeepDive,
  getPrimaryPhotoUrl,
  CATEGORY_LABEL_JA,
  type Category,
} from "@/lib/data";
import {
  MetaTable,
  buildSpotMetaRows,
} from "@/components/content/spot-meta";
import { DeepDiveBlock } from "@/components/content/deepdive-block";
import { VisitToggle } from "@/components/ui/visit-toggle";

export function generateStaticParams() {
  return getAllSpotIds().map((id) => ({ id }));
}

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const s = getSpotById(id);
  if (!s) return { title: "Not Found" };
  const description = (s.summary ?? "").slice(0, 140);
  const path = `/spots/${id}`;
  const enPath = `/en/spots/${id}`;
  const photoUrl = getPrimaryPhotoUrl(id);
  const ogImages = photoUrl
    ? [{ url: photoUrl, width: 1200, height: 900, alt: s.name }]
    : [{ url: "/og-image.png", width: 1200, height: 630, alt: s.name }];
  return {
    title: s.name,
    description,
    alternates: {
      canonical: path,
      languages: {
        ja: path,
        en: enPath,
        "x-default": path,
      },
    },
    openGraph: {
      type: "article",
      title: s.name,
      description,
      url: path,
      siteName: "Bizarre Japan / 異界巡礼",
      locale: "ja_JP",
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: s.name,
      description,
      images: ogImages.map((i) => i.url),
    },
  };
}

export default async function SpotPage({ params }: PageProps) {
  const { id } = await params;
  const spot = getSpotById(id);
  if (!spot) notFound();

  const photo = getPhotoFor(id);
  const access = getAccessFor(id);
  const dd = effectiveDeepDive(spot);
  const metaRows = buildSpotMetaRows(spot, access);

  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="border-b border-border bg-surface">
          <div className="mx-auto max-w-[1120px] px-6 py-3 flex items-center gap-2 text-xs text-ink-mute">
            <Link href="/" className="hover:text-gold">
              序
            </Link>
            <ChevronRight size={12} />
            <Link href="/index-list" className="hover:text-gold">
              名鑑
            </Link>
            <ChevronRight size={12} />
            <span className="text-ink">{spot.name}</span>
          </div>
        </div>

        {/* Hero */}
        <Section tone="bg" density="compact" width="default">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12 items-start">
            <div>
              <Heading variant="eyebrow">
                S P O T ／ {spot.id.toUpperCase()}
              </Heading>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Tag tone={spot.category as Category}>
                  {CATEGORY_LABEL_JA[spot.category as Category] ??
                    spot.category}
                </Tag>
                {spot.editorial_status && (
                  <Tag tone="ghost" size="sm">
                    {spot.editorial_status}
                  </Tag>
                )}
              </div>
              <h1 className="h-hero text-ink-strong mt-6">{spot.name}</h1>
              <p className="mt-3 text-sm text-ink-mute tracking-wider">
                {spot.name_kana}
                {spot.name_en && (
                  <span className="ml-3 text-gold/80">／ {spot.name_en}</span>
                )}
              </p>
              <p className="mt-8 text-lg leading-loose text-ink max-w-[60ch]">
                {spot.summary}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <VisitToggle id={spot.id} variant="visited" lang="ja" />
                <VisitToggle id={spot.id} variant="wishlist" lang="ja" />
              </div>
            </div>

            {/* Photo */}
            <div className="relative">
              {photo?.primary ? (
                <figure>
                  <div className="relative rounded-lg overflow-hidden border border-border-paper aspect-[4/3] bg-surface">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.primary}
                      alt={photo.name ?? spot.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {photo.credit && (
                    <figcaption className="mt-2 text-xs text-ink-faint">
                      {photo.credit}
                    </figcaption>
                  )}
                </figure>
              ) : (
                <div className="rounded-lg border border-dashed border-border-paper bg-surface aspect-[4/3] flex items-center justify-center text-ink-faint text-xs tracking-widest">
                  N O P H O T O
                </div>
              )}
            </div>
          </div>
        </Section>

        {/* Highlights */}
        {spot.highlights.length > 0 && (
          <Section tone="surface" density="compact" width="default">
            <Heading variant="eyebrow">H I G H L I G H T S</Heading>
            <Heading variant="section" as="h2" className="mt-2 mb-6">
              見どころ
            </Heading>
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {spot.highlights.map((h, i) => (
                <li
                  key={i}
                  className="p-5 border border-border rounded-lg bg-bg flex gap-3"
                >
                  <span className="font-display text-gold text-xl shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-ink leading-relaxed">{h}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Meta */}
        <Section tone="bg" density="compact" width="default">
          <Heading variant="eyebrow">A C C E S S ／ M E T A</Heading>
          <Heading variant="section" as="h2" className="mt-2 mb-6">
            基本情報
          </Heading>
          <MetaTable rows={metaRows} />
        </Section>

        {/* Deepdive */}
        {dd && (
          <Section tone="surface" density="default" width="default">
            <Heading variant="eyebrow">D E E P D I V E</Heading>
            <Heading variant="section" as="h2" className="mt-2 mb-12">
              深掘り
            </Heading>
            <DeepDiveBlock dd={dd} />
          </Section>
        )}

        {/* Reference */}
        {spot.reference_urls.length > 0 && (
          <Section tone="bg" density="compact" width="default">
            <Heading variant="eyebrow">R E F E R E N C E</Heading>
            <Heading variant="section" as="h2" className="mt-2 mb-6">
              参考リンク
            </Heading>
            <ul className="space-y-2">
              {spot.reference_urls.map((u, i) => (
                <li key={i}>
                  <a
                    href={u}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex items-center gap-2 text-accent hover:text-accent-hover break-all"
                  >
                    <ExternalLink size={14} className="shrink-0" />
                    <span>{u}</span>
                  </a>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Footer nav */}
        <Section tone="ink" density="compact" width="default">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/index-list"
              className="inline-flex items-center gap-2 text-bg/85 hover:text-bg"
            >
              <span className="font-display tracking-widest">← 名鑑へ戻る</span>
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-bg/85 hover:text-bg"
            >
              <span className="font-display tracking-widest">序へ</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </Section>
      </main>

      <SiteFooter />
    </>
  );
}
