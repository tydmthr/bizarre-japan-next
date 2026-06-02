"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { Tag } from "@/components/ui/tag";
import {
  Card,
  CardEyebrow,
  CardTitle,
  CardBody,
  CardFooter,
} from "@/components/ui/card";
import { ArrowRight, SearchIcon } from "@/components/icons";
import { SPOTS, FESTIVALS, PHOTOS, CATEGORY_LABEL_JA } from "@/lib/data";
import { cn } from "@/lib/utils";
import type { Category } from "@/lib/data";
import { VisitBadge } from "@/components/ui/visit-toggle";
import { createSpotFuse, createFestivalFuse } from "@/lib/search";

type Tab = "spots" | "festivals";
type CatFilter = "all" | Category;

const CATS: { key: CatFilter; label: string }[] = [
  { key: "all", label: "すべて" },
  { key: "folk", label: "土俗" },
  { key: "bkyu", label: "B級" },
  { key: "horror", label: "心霊" },
  { key: "mystery", label: "聖地" },
];

function IndexListContent() {
  const router = useRouter();
  const params = useSearchParams();
  const initialTab = (params.get("tab") === "festivals" ? "festivals" : "spots") as Tab;
  const initialCat = (params.get("cat") ?? "all") as CatFilter;
  const initialQ = params.get("q") ?? "";

  const [tab, setTab] = useState<Tab>(initialTab);
  const [cat, setCat] = useState<CatFilter>(initialCat);
  const [q, setQ] = useState(initialQ);

  // URL sync
  useEffect(() => {
    const p = new URLSearchParams();
    if (tab !== "spots") p.set("tab", tab);
    if (cat !== "all") p.set("cat", cat);
    if (q) p.set("q", q);
    const qs = p.toString();
    router.replace(`/index-list${qs ? `?${qs}` : ""}`, { scroll: false });
  }, [tab, cat, q, router]);

  // Fuse instances (memo)
  const spotFuse = useMemo(() => createSpotFuse(SPOTS), []);
  const festFuse = useMemo(() => createFestivalFuse(FESTIVALS), []);

  const spots = useMemo(() => {
    let arr = SPOTS;
    if (cat !== "all") arr = arr.filter((s) => s.category === cat);
    if (q.trim()) {
      const ids = new Set(spotFuse.search(q).map((r) => r.item.id));
      arr = arr.filter((s) => ids.has(s.id));
    }
    return arr;
  }, [cat, q, spotFuse]);

  const fests = useMemo(() => {
    let arr = FESTIVALS;
    if (cat !== "all") arr = arr.filter((f) => f.category === cat);
    if (q.trim()) {
      const ids = new Set(festFuse.search(q).map((r) => r.item.id));
      arr = arr.filter((f) => ids.has(f.id));
    }
    return arr;
  }, [cat, q, festFuse]);

  const items = tab === "spots" ? spots : fests;

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Section tone="bg" density="compact">
          <Heading variant="eyebrow">I N D E X</Heading>
          <Heading variant="hero" as="h1" className="mt-4">
            百景名鑑
          </Heading>
          <p className="mt-4 text-ink-mute max-w-[65ch]">
            日本全国の珍スポット {SPOTS.length} 件と奇祭 {FESTIVALS.length} 件。
            タブ・カテゴリ・検索で絞り込める。URL に状態が乗るので共有可。
          </p>

          <div className="mt-10 inline-flex border border-border rounded-sm overflow-hidden">
            {(["spots", "festivals"] as Tab[]).map((tk) => (
              <button
                key={tk}
                onClick={() => setTab(tk)}
                className={cn(
                  "px-5 py-2 text-sm font-display tracking-widest transition-colors",
                  tab === tk
                    ? "bg-gold text-ink"
                    : "bg-bg text-ink-mute hover:text-gold",
                )}
              >
                {tk === "spots"
                  ? `スポット ${SPOTS.length}`
                  : `奇祭 ${FESTIVALS.length}`}
              </button>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {CATS.map((c) => (
              <button
                key={c.key}
                onClick={() => setCat(c.key)}
                className={cn(
                  "h-9 px-3 rounded-full border text-xs tracking-wider transition-colors",
                  cat === c.key
                    ? "bg-accent text-on-accent border-accent"
                    : "bg-transparent text-ink-mute border-border hover:border-accent hover:text-accent",
                )}
              >
                {c.label}
              </button>
            ))}

            <div className="relative ml-auto">
              <SearchIcon
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint"
              />
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="名前・地域・要約で検索"
                className="h-9 pl-8 pr-3 w-64 rounded-sm bg-surface border border-border text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <p className="mt-4 text-xs text-ink-mute tracking-wider">
            該当 {items.length} 件
          </p>
        </Section>

        <Section tone="surface" density="default">
          {items.length === 0 ? (
            <p className="text-center text-ink-mute py-20">
              該当なし。条件を緩めてみてください。
            </p>
          ) : tab === "spots" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {spots.map((s) => {
                const photo = PHOTOS[s.id];
                return (
                  <Link key={s.id} href={`/spots/${s.id}`} className="contents">
                    <Card interactive tone="neutral" className="overflow-hidden p-0">
                      <div className="relative aspect-[4/3] bg-bg-raised">
                        <div className="absolute top-2 right-2 z-10">
                          <VisitBadge id={s.id} lang="ja" />
                        </div>
                        {photo?.primary ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={photo.primary}
                            alt={s.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-ink-faint text-xs tracking-widest">
                            N O P H O T O
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <CardEyebrow>
                          {s.prefecture} {s.city}
                        </CardEyebrow>
                        <CardTitle className="text-base">{s.name}</CardTitle>
                        <CardBody className="mt-2 line-clamp-2">
                          {s.summary}
                        </CardBody>
                        <CardFooter className="flex items-center justify-between">
                          <Tag tone={s.category as Category} size="sm">
                            {CATEGORY_LABEL_JA[s.category as Category]}
                          </Tag>
                          <span className="inline-flex items-center gap-1 text-xs text-ink-mute">
                            詳細 <ArrowRight size={12} />
                          </span>
                        </CardFooter>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {fests.map((f) => {
                const photo = PHOTOS[f.id];
                return (
                  <Link
                    key={f.id}
                    href={`/festivals/${f.id}`}
                    className="contents"
                  >
                    <Card interactive tone="neutral" className="overflow-hidden p-0">
                      <div className="relative aspect-[4/3] bg-bg-raised">
                        <div className="absolute top-2 right-2 z-10">
                          <VisitBadge id={f.id} lang="ja" />
                        </div>
                        {photo?.primary ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={photo.primary}
                            alt={f.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-ink-faint text-xs tracking-widest">
                            N O P H O T O
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <CardEyebrow>{f.date_2026}</CardEyebrow>
                        <CardTitle className="text-base">{f.name}</CardTitle>
                        <CardBody className="mt-2 line-clamp-2">
                          {f.summary}
                        </CardBody>
                        <CardFooter className="flex items-center justify-between">
                          <Tag tone={f.category as Category} size="sm">
                            {CATEGORY_LABEL_JA[f.category as Category]}
                          </Tag>
                          <span className="inline-flex items-center gap-1 text-xs text-ink-mute">
                            詳細 <ArrowRight size={12} />
                          </span>
                        </CardFooter>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}

export default function IndexListPage() {
  return (
    <Suspense fallback={null}>
      <IndexListContent />
    </Suspense>
  );
}
