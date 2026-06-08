import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { Tag } from "@/components/ui/tag";
import { ArrowRight, ExternalLink, ChevronRight } from "@/components/icons";
import {
  getSpotEnById,
  getAllSpotIds,
  getPhotoFor,
  getAccessFor,
  effectiveDeepDive,
  getPrimaryPhotoUrl,
  CATEGORY_LABEL_EN,
  type Category,
} from "@/lib/data";
import { DeepDiveBlock } from "@/components/content/deepdive-block";
import { dict } from "@/lib/i18n";
import { VisitToggle } from "@/components/ui/visit-toggle";

export function generateStaticParams() {
  return getAllSpotIds().map((id) => ({ id }));
}

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const s = getSpotEnById(id);
  if (!s) return { title: "Not Found" };
  const title = s.name_en ?? s.name;
  const description = (s.summary_en ?? s.summary ?? "").slice(0, 140);
  const path = `/en/spots/${id}`;
  const jaPath = `/spots/${id}`;
  const photoUrl = getPrimaryPhotoUrl(id);
  const ogImages = photoUrl
    ? [{ url: photoUrl, width: 1200, height: 900, alt: title }]
    : [{ url: "/og-image.png", width: 1200, height: 630, alt: title }];
  return {
    title,
    description,
    alternates: {
      canonical: path,
      languages: {
        ja: jaPath,
        en: path,
        "x-default": jaPath,
      },
    },
    openGraph: {
      type: "article",
      title,
      description,
      url: path,
      siteName: "Bizarre Japan / 異界巡礼",
      locale: "en_US",
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImages.map((i) => i.url),
    },
  };
}

export default async function SpotEnPage({ params }: PageProps) {
  const { id } = await params;
  const spot = getSpotEnById(id);
  if (!spot) notFound();

  const photo = getPhotoFor(id);
  const access = getAccessFor(id);
  const dd = effectiveDeepDive(spot);
  const t = dict("en");

  const metaRows = [
    {
      label: "Location",
      value: `${spot.prefecture_en ?? spot.prefecture} ${spot.city_en ?? spot.city}`,
    },
    { label: "Address", value: spot.address },
    { label: "Fee", value: spot.fee },
    { label: "Hours", value: spot.hours },
    { label: "Status", value: spot.status },
  ];
  if (spot.official_url) {
    metaRows.push({
      label: "Official",
      value: spot.official_url,
    });
  }
  if (access) {
    if (access.nearest_station)
      metaRows.push({ label: "Nearest", value: access.nearest_station });
    if (access.walking_minutes !== null && access.walking_minutes !== undefined)
      metaRows.push({ label: "Walk", value: `${access.walking_minutes} min` });
    if (access.parking) metaRows.push({ label: "Parking", value: access.parking });
    if (access.time_required) metaRows.push({ label: "Time", value: access.time_required });
  }

  const displayName = spot.name_en ?? spot.name;
  const displaySummary = spot.summary_en ?? spot.summary ?? "";
  const displayHighlights = spot.highlights_en ?? spot.highlights ?? [];

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="border-b border-border bg-surface">
          <div className="mx-auto max-w-[1120px] px-6 py-3 flex items-center gap-2 text-xs text-ink-mute">
            <Link href="/en" className="hover:text-gold">{t.breadcrumb.home}</Link>
            <ChevronRight size={12} />
            <Link href="/en/index-list" className="hover:text-gold">{t.breadcrumb.list}</Link>
            <ChevronRight size={12} />
            <span className="text-ink">{displayName}</span>
          </div>
        </div>

        <Section tone="bg" density="compact" width="default">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12 items-start">
            <div>
              <Heading variant="eyebrow">S P O T ／ {spot.id.toUpperCase()}</Heading>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Tag tone={spot.category as Category}>
                  {CATEGORY_LABEL_EN[spot.category as Category] ?? spot.category}
                </Tag>
              </div>
              <h1 className="h-hero text-ink-strong mt-6">{displayName}</h1>
              {spot.name_en && spot.name && (
                <p className="mt-3 text-sm text-ink-mute tracking-wider">
                  <span className="text-gold/80">{spot.name}</span>
                  <span className="ml-3">{spot.name_kana}</span>
                </p>
              )}
              <p className="mt-8 text-lg leading-loose text-ink max-w-[60ch]">
                {displaySummary}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <VisitToggle id={spot.id} variant="visited" lang="en" />
                <VisitToggle id={spot.id} variant="wishlist" lang="en" />
              </div>
            </div>

            <div className="relative">
              {photo?.primary ? (
                <figure>
                  <div className="relative rounded-lg overflow-hidden border border-border-paper aspect-[4/3] bg-surface">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.primary}
                      alt={photo.name ?? displayName}
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
                  {t.nophoto}
                </div>
              )}
            </div>
          </div>
        </Section>

        {displayHighlights.length > 0 && (
          <Section tone="surface" density="compact" width="default">
            <Heading variant="eyebrow">H I G H L I G H T S</Heading>
            <Heading variant="section" as="h2" className="mt-2 mb-6">
              {t.section.highlights}
            </Heading>
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {displayHighlights.map((h, i) => (
                <li key={i} className="p-5 border border-border rounded-lg bg-bg flex gap-3">
                  <span className="font-display text-gold text-xl shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-ink leading-relaxed">{h}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        <Section tone="bg" density="compact" width="default">
          <Heading variant="eyebrow">A C C E S S ／ M E T A</Heading>
          <Heading variant="section" as="h2" className="mt-2 mb-6">
            {t.section.meta}
          </Heading>
          <dl className="border border-border rounded-lg divide-y divide-border overflow-hidden">
            {metaRows.map((r, i) => (
              <div
                key={i}
                className="grid grid-cols-[8rem_1fr] sm:grid-cols-[10rem_1fr] bg-surface text-sm"
              >
                <dt className="px-4 py-3 bg-bg-raised text-ink-mute font-display tracking-wider text-xs">
                  {r.label}
                </dt>
                <dd className="px-4 py-3 text-ink break-words">
                  {r.label === "Official" ? (
                    <a
                      href={r.value}
                      target="_blank"
                      rel="noopener"
                      className="text-accent hover:text-accent-hover break-all"
                    >
                      {r.value}
                    </a>
                  ) : (
                    r.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </Section>

        {dd && (
          <Section tone="surface" density="default" width="default">
            <Heading variant="eyebrow">D E E P D I V E</Heading>
            <Heading variant="section" as="h2" className="mt-2 mb-12">
              {t.section.deepdive}
            </Heading>
            <DeepDiveBlock dd={dd} lang="en" />
          </Section>
        )}

        {spot.reference_urls.length > 0 && (
          <Section tone="bg" density="compact" width="default">
            <Heading variant="eyebrow">R E F E R E N C E</Heading>
            <Heading variant="section" as="h2" className="mt-2 mb-6">
              {t.section.reference}
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

        <Section tone="ink" density="compact" width="default">
          <div className="flex items-center justify-between gap-4">
            <Link href="/en/index-list" className="inline-flex items-center gap-2 text-bg/85 hover:text-bg">
              <span className="font-display tracking-widest">← Index</span>
            </Link>
            <Link href="/en" className="inline-flex items-center gap-2 text-bg/85 hover:text-bg">
              <span className="font-display tracking-widest">Home</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
