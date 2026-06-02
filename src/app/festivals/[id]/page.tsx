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
  getFestivalById,
  getAllFestivalIds,
  getPhotoFor,
  getAccessFor,
  effectiveDeepDive,
  CATEGORY_LABEL_JA,
  type Category,
} from "@/lib/data";
import {
  MetaTable,
  buildFestivalMetaRows,
} from "@/components/content/spot-meta";
import { DeepDiveBlock } from "@/components/content/deepdive-block";
import { VisitToggle } from "@/components/ui/visit-toggle";

export function generateStaticParams() {
  return getAllFestivalIds().map((id) => ({ id }));
}

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const f = getFestivalById(id);
  if (!f) return { title: "Not Found / Bizarre Japan" };
  return {
    title: `${f.name} — ${f.prefecture}${f.city} ／ 奇祭暦 ／ 異界巡礼`,
    description: f.summary.slice(0, 140),
  };
}

export default async function FestivalPage({ params }: PageProps) {
  const { id } = await params;
  const fest = getFestivalById(id);
  if (!fest) notFound();

  const photo = getPhotoFor(id);
  const access = getAccessFor(id);
  const dd = effectiveDeepDive(fest);
  const metaRows = buildFestivalMetaRows(fest, access);

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
            <Link href="/index-list?tab=festivals" className="hover:text-gold">
              祭暦
            </Link>
            <ChevronRight size={12} />
            <span className="text-ink">{fest.name}</span>
          </div>
        </div>

        {/* Hero */}
        <Section tone="bg" density="compact" width="default">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12 items-start">
            <div>
              <Heading variant="eyebrow">
                F E S T I V A L ／ {fest.id.toUpperCase()}
              </Heading>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Tag tone={fest.category as Category}>
                  {CATEGORY_LABEL_JA[fest.category as Category] ??
                    fest.category}
                </Tag>
              </div>
              <h1 className="h-hero text-ink-strong mt-6">{fest.name}</h1>
              <p className="mt-3 text-sm text-ink-mute tracking-wider">
                {fest.name_kana}
                {fest.name_en && (
                  <span className="ml-3 text-gold/80">／ {fest.name_en}</span>
                )}
              </p>

              {/* Date emphasis */}
              <div className="mt-6 inline-flex items-center gap-3 border-y border-gold py-3 px-5">
                <span className="font-display text-gold text-xs tracking-[0.3em]">
                  斎 行
                </span>
                <span className="font-display text-ink-strong text-lg font-bold tracking-wider">
                  {fest.date_2026}
                  {fest.date_2026_end && (
                    <span className="text-ink-mute"> 〜 {fest.date_2026_end}</span>
                  )}
                </span>
              </div>

              <p className="mt-8 text-lg leading-loose text-ink max-w-[60ch]">
                {fest.summary}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <VisitToggle id={fest.id} variant="visited" lang="ja" />
                <VisitToggle id={fest.id} variant="wishlist" lang="ja" />
              </div>
            </div>

            <div className="relative">
              {photo?.primary ? (
                <figure>
                  <div className="relative rounded-lg overflow-hidden border border-border-paper aspect-[4/3] bg-surface">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.primary}
                      alt={photo.name ?? fest.name}
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
        {fest.highlights.length > 0 && (
          <Section tone="surface" density="compact" width="default">
            <Heading variant="eyebrow">H I G H L I G H T S</Heading>
            <Heading variant="section" as="h2" className="mt-2 mb-6">
              見どころ
            </Heading>
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {fest.highlights.map((h, i) => (
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
        {fest.reference_urls.length > 0 && (
          <Section tone="bg" density="compact" width="default">
            <Heading variant="eyebrow">R E F E R E N C E</Heading>
            <Heading variant="section" as="h2" className="mt-2 mb-6">
              参考リンク
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
            <Link
              href="/index-list?tab=festivals"
              className="inline-flex items-center gap-2 text-bg/85 hover:text-bg"
            >
              <span className="font-display tracking-widest">← 祭暦へ戻る</span>
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
