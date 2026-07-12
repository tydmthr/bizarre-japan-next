"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FEATURED_SPOTS } from "@/lib/data/featured";
import { Heading } from "@/components/ui/heading";
import { Reveal } from "@/components/ui/reveal";
import { langPrefix, type Lang } from "@/lib/i18n";

const COPY = {
  ja: {
    eyebrow: "T O N I G H T",
    title: "今宵の異界",
    sub: "日替わりで三つ、扉を開けておく。",
    more: "すべての異界を見る",
  },
  en: {
    eyebrow: "T O N I G H T",
    title: "Tonight's Gates",
    sub: "Three doors a night, rotated daily.",
    more: "Browse all realms",
  },
} as const;

/** 年内通算日（日替わりローテーションの種） */
function dayOfYear(d: Date): number {
  const start = Date.UTC(d.getFullYear(), 0, 0);
  return Math.floor((d.getTime() - start) / 86400000);
}

export function TonightIkai({ lang = "ja" }: { lang?: Lang }) {
  const t = COPY[lang];
  const prefix = langPrefix(lang);
  const n = FEATURED_SPOTS.length;

  // SSR/初期HTMLは先頭3件で確定（hydration一致）→ マウント後に日替わりへ
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    setOffset((dayOfYear(new Date()) * 3) % n);
  }, [n]);

  const picks = [0, 1, 2].map((i) => FEATURED_SPOTS[(offset + i) % n]);

  return (
    <div className="mt-24 text-left">
      <Reveal>
        <div className="text-center">
          <Heading variant="eyebrow" className="inline-block px-4 py-1.5 border-y border-accent/50">
            {t.eyebrow}
          </Heading>
          <h2 className="font-display mt-5 text-3xl md:text-4xl font-black text-ink-strong tracking-wide">
            {t.title}
          </h2>
          <p className="mt-3 text-sm text-ink-mute tracking-wider">{t.sub}</p>
        </div>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
        {picks.map((s, i) => (
          <Reveal key={s.id} delay={i * 120}>
            <Link
              href={`${prefix}/spots/${s.id}`}
              className="group relative block aspect-[4/3] overflow-hidden rounded-lg border border-border bg-sumi-900 shadow-paper transition-all duration-300 hover:shadow-card hover:border-accent/60 hover:-translate-y-1"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.photo}
                alt={lang === "ja" ? s.ja : s.en}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
              />
              {/* 下部スクリム */}
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, oklch(0.10 0.008 35 / 0.88) 0%, oklch(0.10 0.008 35 / 0.35) 38%, transparent 62%)",
                }}
              />
              {/* 朱の落款風マーク */}
              <span
                aria-hidden
                className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-sm font-display text-base font-black"
                style={{
                  background: "var(--color-shu-600)",
                  color: "var(--color-sumi-50)",
                  opacity: 0.92,
                }}
              >
                異
              </span>
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="text-[11px] tracking-[0.25em]" style={{ color: "var(--color-kin-300)" }}>
                  {lang === "ja" ? s.prefJa : s.prefEn}
                </p>
                <p
                  className="font-display mt-1 text-lg md:text-xl font-bold leading-snug"
                  style={{ color: "var(--color-sumi-50)" }}
                >
                  {lang === "ja" ? s.ja : s.en}
                </p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>

      <Reveal delay={200}>
        <p className="mt-8 text-center">
          <Link
            href={`${prefix}/index-list`}
            className="inline-block text-sm tracking-widest text-ink-mute underline decoration-accent/50 underline-offset-4 transition-colors hover:text-accent"
          >
            {t.more} →
          </Link>
        </p>
      </Reveal>
    </div>
  );
}
