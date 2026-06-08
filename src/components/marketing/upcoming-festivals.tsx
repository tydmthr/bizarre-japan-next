"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  FESTIVALS,
  getFestivalEnById,
  getPrimaryPhotoUrl,
} from "@/lib/data";
import {
  getFestivalsByDateOrder,
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

/** 月（1〜12）→ 漢数字 */
const MONTH_KANJI: Record<number, string> = {
  1: "一月",
  2: "二月",
  3: "三月",
  4: "四月",
  5: "五月",
  6: "六月",
  7: "七月",
  8: "八月",
  9: "九月",
  10: "十月",
  11: "十一月",
  12: "十二月",
};

/**
 * 画像なしフォールバック（紙地・縦書き月・墨×朱×鈍金）
 * 主役は大きな日付。右辺に縦書きの漢字月、左下に「Coming」、右下に祭名（控えめ）。
 */
function FallbackTile({
  date,
  monthLabel,
  name,
  lang,
}: {
  date: Date;
  monthLabel: string;
  name: string;
  lang: Lang;
}) {
  const kanjiMonth = MONTH_KANJI[date.getMonth() + 1] ?? monthLabel;
  return (
    <div
      className="relative aspect-[4/3] overflow-hidden bg-bg border-b border-border"
      style={{
        // 紙地テクスチャ風：淡い縦縞 + 微細な斜めグラデの重ね（低彩度）
        backgroundImage:
          "repeating-linear-gradient(90deg, rgba(0,0,0,0.018) 0 1px, transparent 1px 3px), linear-gradient(135deg, rgba(0,0,0,0.025), rgba(0,0,0,0) 60%)",
      }}
    >
      {/* 右辺：縦書きの漢字月（日本語時のみ縦書き、英語時は水平で小さく） */}
      {lang === "ja" ? (
        <div
          className="absolute top-3 right-3 font-display text-sm tracking-[0.4em] text-ink-mute"
          style={{ writingMode: "vertical-rl" }}
        >
          {kanjiMonth}
        </div>
      ) : (
        <div className="absolute top-3 right-3 font-display text-[10px] tracking-[0.3em] text-ink-mute uppercase">
          {monthLabel}
        </div>
      )}

      {/* 中央：日付（主役） */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="font-display text-7xl font-black text-accent leading-none">
          {date.getDate()}
        </div>
        <div className="mt-2 font-display text-[10px] tracking-[0.3em] text-ink-mute uppercase">
          ✦ Coming
        </div>
      </div>

      {/* 左下：年（小さく） */}
      <div className="absolute bottom-3 left-3 font-display text-[10px] tracking-[0.3em] text-ink-mute">
        {date.getFullYear()}
      </div>

      {/* 右下：祭名（控えめ1行） */}
      <div className="absolute bottom-3 right-3 max-w-[55%] font-display text-[11px] text-ink-mute truncate">
        {name}
      </div>
    </div>
  );
}

/** 1カード分。画像エラー状態を個別保持するため切り出し。 */
function FestivalCard({
  f,
  date,
  name,
  place,
  showDate,
  photoUrl,
  monthLabel,
  lang,
  prefix,
  sep,
}: {
  f: (typeof FESTIVALS)[number];
  date: Date;
  name: string;
  place: string;
  showDate: string;
  photoUrl: string | null;
  monthLabel: string;
  lang: Lang;
  prefix: string;
  sep: string;
}) {
  const [imageError, setImageError] = useState(false);
  const showFallback = !photoUrl || imageError;

  return (
    <Link
      href={`${prefix}/festivals/${f.id}`}
      className="group flex flex-col bg-bg-raised border border-border hover:border-accent hover:bg-surface transition-colors h-full"
    >
      {showFallback ? (
        <FallbackTile date={date} monthLabel={monthLabel} name={name} lang={lang} />
      ) : (
        <div className="relative aspect-[4/3] overflow-hidden bg-bg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photoUrl!}
            alt={name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
          <div className="absolute top-0 left-0 bg-ink/85 text-bg px-2.5 py-1.5 font-display leading-none flex items-baseline gap-1.5">
            <span className="text-2xl font-bold">{date.getDate()}</span>
            <span className="text-[10px] tracking-widest opacity-80">{monthLabel}</span>
          </div>
        </div>
      )}
      <div className="flex-1 p-4">
        <p className="text-[10px] tracking-widest text-ink-mute uppercase">
          {showDate}
        </p>
        <h3 className="mt-1 font-display text-base sm:text-lg text-ink-strong group-hover:text-accent line-clamp-2">
          {name}
        </h3>
        <p className="mt-2 text-xs text-ink-mute">
          {place}
          <span className="mx-2 opacity-50">{sep}</span>
          {festCatLabel(f.category, lang)}
        </p>
      </div>
    </Link>
  );
}

export function UpcomingFestivals({ lang = "ja" }: { lang?: Lang }) {
  const t = dict(lang);
  const prefix = langPrefix(lang);

  // SSR時に描く決定論的な初期リスト（サーバ／クライアントで完全一致）。
  // クローラ・JS無効でも消えないようにする。
  const initialList = useMemo(
    () => getFestivalsByDateOrder(FESTIVALS, 10),
    [],
  );

  // マウント後に「今日」をセット。null の間は SSR初期リストを使う。
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
  }, []);

  // now が入ったらクライアント側で「今日以降10件」に差し替え。
  const upcoming = useMemo(() => {
    if (!now) return initialList;
    return getUpcomingFestivals(FESTIVALS, now, 10);
  }, [now, initialList]);

  // subtitle: SSR/マウント前は固定で "次なる祭礼" / "Festivals Ahead"。
  // マウント後は今月の祭があれば月ラベル。
  const subtitle = useMemo(() => {
    if (!now) return t.hero.upcoming.subAhead;
    const hasThisMonth = upcoming.some(
      (x) => x.date.getMonth() === now.getMonth(),
    );
    return hasThisMonth
      ? t.hero.upcoming.subThisMonth(now.getMonth() + 1)
      : t.hero.upcoming.subAhead;
  }, [now, upcoming, t]);

  const sep = lang === "en" ? "/" : "／";

  return (
    <div className="mt-16 mx-auto max-w-[920px] text-left">
      <div className="text-center mb-8">
        <Heading variant="section" as="h2">
          {t.hero.upcoming.title}
        </Heading>
        <p className="mt-2 eyebrow" suppressHydrationWarning>
          {subtitle}
        </p>
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

            // EN locale: festivals_en.json の prefecture_en / city_en を使う。
            // 無ければ漢字フォールバック。
            let place: string;
            if (lang === "en") {
              const fEn = getFestivalEnById(f.id);
              const pref = fEn?.prefecture_en ?? f.prefecture;
              const city = fEn?.city_en ?? f.city ?? "";
              place = city ? `${pref} ${city}` : pref;
            } else {
              place = `${f.prefecture}${f.city ?? ""}`;
            }

            const showDate = f.date_2026
              ? formatYmd(date)
              : f.date_pattern;
            const photoUrl = getPrimaryPhotoUrl(f.id);
            const monthLabel =
              lang === "en"
                ? t.hero.upcoming.subThisMonth(date.getMonth() + 1)
                : `${date.getMonth() + 1}月`;
            return (
              <li key={f.id}>
                <FestivalCard
                  f={f}
                  date={date}
                  name={name}
                  place={place}
                  showDate={showDate}
                  photoUrl={photoUrl}
                  monthLabel={monthLabel}
                  lang={lang}
                  prefix={prefix}
                  sep={sep}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
