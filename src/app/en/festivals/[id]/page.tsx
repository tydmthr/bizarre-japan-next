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
  getFestivalEnById,
  getAllFestivalIds,
  getPhotoFor,
  getAccessFor,
  effectiveDeepDive,
  CATEGORY_LABEL_EN,
  type Category,
} from "@/lib/data";
import { DeepDiveBlock } from "@/components/content/deepdive-block";
import { dict } from "@/lib/i18n";
import { VisitToggle } from "@/components/ui/visit-toggle";

export function generateStaticParams() {
  return getAllFestivalIds().map((id) => ({ id }));
}

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const f = getFestivalEnById(id);
  if (!f) return { title: "Not Found / Bizarre Japan" };
  const title = f.name_en ?? f.name;
  const description = f.summary_en ?? f.summary ?? "";
  return {
    title: `${title} — ${f.prefecture_en ?? f.prefecture} ／ Festivals ／ Bizarre Japan`,
    description: description.slice(0, 140),
  };
}

export default async function FestivalEnPage({ params }: PageProps) {
  const { id } = await params;
  const fest = getFestivalEnById(id);
  if (!fest) notFound();

  const photo = getPhotoFor(id);
  const access = getAccessFor(id);
  const dd = effectiveDeepDive(fest);
  const t = dict("en");

  const displayName = fest.name_en ?? fest.name;
  const displaySummary = fest.summary_en ?? fest.summary ?? "";
  const displayHighlights = fest.highlights_en ?? fest.highlights ?? [];

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="border-b border-border bg-surface">
          <div className="mx-auto max-w-[1120px] px-6 py-3 flex items-center gap-2 text-xs text-ink-mute">
            <Link href="/en" className="hover:text-gold">{t.breadcrumb.home}</Link>
            <ChevronRight size={12} />
            <Link href="/en/index-list?tab=festivals" className="hover:text-gold">{t.breadcrumb.calendar}</Link>
            <ChevronRight size={12} />
            <span className="text-ink">{displayName}</span>
          </div>
        </div>

        <Section tone="bg" density="compact" width="default">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12 items-start">
            <div>
              <Heading variant="eyebrow">F E S T I V A L ／ {fest.id.toUpperCase()}</Heading>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Tag tone={fest.category as Category}>
                  {CATEGORY_LABEL_EN[fest.category as Category] ?? fest.category}
                </Tag>
              </div>
              <h1 className="h-hero text-ink-strong mt-6">{displayName}</h1>
              <p className="mt-3 text-sm text-ink-mute tracking-wider">
                <span className="text-gold/80">{fest.name}</span>
                <span className="ml-3">{fest.name_kana}</span>
              </p>

              <div className="mt-6 inline-flex items-center gap-3 border-y border-gold py-3 px-5">
                <span className="font-display text-gold text-xs tracking-[0.3em]">
                  D A T E
                </span>
                <span className="font-display text-ink-strong text-lg font-bold tracking-wider">
                  {fest.date_2026}
                  {fest.date_2026_end && (
                    <span className="text-ink-mute"> — {fest.date_2026_end}</span>
                  )}
                </span>
              </div>

              <p className="mt-8 text-lg leading-loose text-ink max-w-[60ch]">
                {displaySummary}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <VisitToggle id={fest.id} variant="visited" lang="en" />
                <VisitToggle id={fest.id} variant="wishlist" lang="en" />
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

        {dd && (
          <Section tone="surface" density="default" width="default">
            <Heading variant="eyebrow">D E E P D I V E</Heading>
            <Heading variant="section" as="h2" className="mt-2 mb-12">
              {t.section.deepdive}
            </Heading>
            <DeepDiveBlock dd={dd} lang="en" />
          </Section>
        )}

        {fest.reference_urls.length > 0 && (
          <Section tone="bg" density="compact" width="default">
            <Heading variant="eyebrow">R E F E R E N C E</Heading>
            <Heading variant="section" as="h2" className="mt-2 mb-6">
              {t.section.reference}
            </Heading>
            <ul className="space-y-2">
              {fest.reference_urls.map((u, i) => (
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
            <Link href="/en/index-list?tab=festivals" className="inline-flex items-center gap-2 text-bg/85 hover:text-bg">
              <span className="font-display tracking-widest">← Calendar</span>
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
