"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FESTIVALS } from "@/lib/data";
import {
  getUpcomingFestivals,
  formatYmd,
} from "@/lib/calendar";
import { dict, type Lang, langPrefix } from "@/lib/i18n";
import { Heading } from "@/components/ui/heading";

/** 奇祭の細カテゴリ → 表示ラベル（旧サイト fcatLabel 移植） */
const FEST_CAT_LABEL_JA: Record<string, string> = {
  naked: "裸祭",
  fire: "火祭",
  weird: "奇習",
  sex: "性祭",
  animal: "動物",
  other: "その他",
  folk: "土俗",
};
const FEST_CAT_LABEL_EN: Record<string, string> = {
  naked: "Naked",
  fire: "Fire",
  weird: "Weird",
  sex: "Fertility",
  animal: "Animal",
  other: "Other",
  folk: "Folk",
};
function festCatLabel(cat: string, lang: Lang): string {
  return lang === "en"
    ? FEST_CAT_LABEL_EN[cat] ?? cat
    : FEST_CAT_LABEL_JA[cat] ?? cat;
}

export function UpcomingFestivals({ lang = "ja" }: { lang?: Lang }) {
  const t = dict(lang);
  const prefix = langPrefix(lang);

  // SSG/ハイドレーションミスマッチ回避のため、初期は null。
  // ブラウザマウント後に「今日」基準で計算してセット。
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
  }, []);

  if (!now) {
    // 初回SSRとマウント直後は何も出さない（hydration safe）
    return null;
  }

  const upcoming = getUpcomingFestivals(FESTIVALS, now, 10);
  const hasThisMonth = upcoming.some(
    (x) => x.date.getMonth() === now.getMonth(),
  );
  const subtitle = hasThisMonth
    ? t.hero.upcoming.subThisMonth(now.getMonth() + 1)
    : t.hero.upcoming.subAhead;

  return (
    <div className="mt-16 mx-auto max-w-[920px] text-left">
      <div className="text-center mb-8">
        <Heading variant="section" as="h2">
          {t.hero.upcoming.title}
        </Heading>
        <p className="mt-2 eyebrow">{subtitle}</p>
      </div>

      {upcoming.length === 0 ? (
        <p className="text-center text-sm text-ink-mute">
          {t.hero.upcoming.empty}
        </p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3">
          {upcoming.map(({ festival: f, date }) => {
            const name =
              lang === "en" && f.name_en ? f.name_en : f.name;
            const place = `${f.prefecture}${f.city ?? ""}`;
            const showDate = f.date_2026
              ? formatYmd(date)
              : f.date_pattern;
            return (
              <li key={f.id}>
                <Link
                  href={`${prefix}/festivals/${f.id}`}
                  className="group flex items-start gap-4 p-4 bg-bg-raised border border-border hover:border-accent hover:bg-surface transition-colors"
                >
                  <div className="flex-shrink-0 w-16 text-center border-r border-border pr-4">
                    <div className="font-display text-2xl font-bold text-accent leading-none">
                      {date.getDate()}
                    </div>
                    <div className="mt-1 text-[10px] tracking-widest text-ink-mute uppercase">
                      {lang === "en"
                        ? t.hero.upcoming.subThisMonth(date.getMonth() + 1)
                        : `${date.getMonth() + 1}月`}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] tracking-widest text-ink-mute uppercase">
                      {showDate}
                    </p>
                    <h3 className="mt-1 font-display text-base text-ink-strong group-hover:text-accent line-clamp-2">
                      {name}
                    </h3>
                    <p className="mt-1 text-xs text-ink-mute">
                      {place}
                      <span className="mx-2 opacity-50">／</span>
                      {festCatLabel(f.category, lang)}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
