/**
 * JSON-LD（schema.org）構造化データのビルダー群と注入用コンポーネント。
 *
 * 詳細ページに以下を出力する：
 * - spots: TouristAttraction
 * - festivals: Festival（Event のサブクラス）
 * - top: WebSite
 *
 * リッチリザルト（開催日カード・地図カード）対応のため、
 * Festival は startDate / location.Place / geo を必ず含める。
 */

import type { Spot, Festival, SpotEn, FestivalEn } from "@/lib/data";

const BASE = "https://bizarrejapan.com";

/** undefined/null/空文字フィールドを再帰的に削除した object を返す（@type 等は保持） */
function clean<T>(obj: T): T {
  if (Array.isArray(obj)) {
    return obj
      .map(clean)
      .filter((v) => v !== undefined && v !== null && v !== "") as unknown as T;
  }
  if (obj && typeof obj === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      const cleaned = clean(v);
      if (cleaned === undefined || cleaned === null || cleaned === "") continue;
      if (Array.isArray(cleaned) && cleaned.length === 0) continue;
      out[k] = cleaned;
    }
    return out as T;
  }
  return obj;
}

/** Spot エンティティを TouristAttraction として JSON-LD 化 */
export function buildSpotJsonLd(
  s: Spot | SpotEn,
  opts: { lang: "ja" | "en"; photoUrl?: string | null },
): object {
  const isEn = opts.lang === "en";
  const enriched = s as SpotEn;
  const name = isEn ? enriched.name_en ?? s.name : s.name;
  const description = (
    isEn ? enriched.summary_en ?? s.summary : s.summary
  )?.slice(0, 300);
  const path = `${isEn ? "/en" : ""}/spots/${s.id}`;

  const region = isEn ? enriched.prefecture_en ?? s.prefecture : s.prefecture;
  const locality = isEn ? enriched.city_en ?? s.city : s.city;

  return clean({
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    "@id": `${BASE}${path}`,
    name,
    description,
    url: `${BASE}${path}`,
    image: opts.photoUrl || undefined,
    address: {
      "@type": "PostalAddress",
      addressCountry: "JP",
      addressRegion: region,
      addressLocality: locality,
      streetAddress: s.address,
    },
    geo:
      s.lat && s.lng
        ? {
            "@type": "GeoCoordinates",
            latitude: s.lat,
            longitude: s.lng,
          }
        : undefined,
    sameAs: s.official_url ? [s.official_url] : undefined,
    inLanguage: isEn ? "en" : "ja",
    isAccessibleForFree:
      typeof s.fee === "string" && /無料|free/i.test(s.fee) ? true : undefined,
  });
}

/** Festival エンティティを Festival(Event) として JSON-LD 化 */
export function buildFestivalJsonLd(
  f: Festival | FestivalEn,
  opts: { lang: "ja" | "en"; photoUrl?: string | null },
): object {
  const isEn = opts.lang === "en";
  const enriched = f as FestivalEn;
  const name = isEn ? enriched.name_en ?? f.name : f.name;
  const description = (
    isEn ? enriched.summary_en ?? f.summary : f.summary
  )?.slice(0, 300);
  const path = `${isEn ? "/en" : ""}/festivals/${f.id}`;

  const startDate = f.date_2026;
  const endDate = f.date_2026_end ?? f.date_2026;
  const region = isEn ? (enriched.prefecture_en ?? f.prefecture) : f.prefecture;
  const locality = isEn ? (enriched.city_en ?? f.city) : f.city;
  const placeName =
    f.shrine ?? (`${region ?? ""}${locality ?? ""}` || undefined);

  return clean({
    "@context": "https://schema.org",
    "@type": "Festival",
    "@id": `${BASE}${path}`,
    name,
    description,
    url: `${BASE}${path}`,
    image: opts.photoUrl || undefined,
    startDate: startDate || undefined,
    endDate:
      endDate && endDate !== startDate ? endDate : startDate || undefined,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: placeName,
      address: {
        "@type": "PostalAddress",
        addressCountry: "JP",
        addressRegion: region,
        addressLocality: locality,
      },
      geo:
        f.lat && f.lng
          ? {
              "@type": "GeoCoordinates",
              latitude: f.lat,
              longitude: f.lng,
            }
          : undefined,
    },
    organizer: f.shrine
      ? { "@type": "Organization", name: f.shrine }
      : undefined,
    inLanguage: isEn ? "en" : "ja",
    isAccessibleForFree:
      typeof f.viewing_notes === "string" && /無料|free/i.test(f.viewing_notes)
        ? true
        : undefined,
  });
}

/** TOP（WebSite）の JSON-LD */
export function buildWebSiteJsonLd(opts: { lang: "ja" | "en" }): object {
  const isEn = opts.lang === "en";
  return clean({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE}${isEn ? "/en" : "/"}#website`,
    url: `${BASE}${isEn ? "/en" : "/"}`,
    name: isEn ? "Bizarre Japan" : "Bizarre Japan / 異界巡礼",
    alternateName: isEn ? "異界巡礼" : "Bizarre Japan",
    description: isEn
      ? "An archive of strange spots and wild festivals across Japan."
      : "日本全国の珍スポットと奇祭・カオスイベントを地図と暦で巡る民俗アーカイブ。",
    inLanguage: isEn ? "en" : "ja",
    publisher: {
      "@type": "Organization",
      name: "Bizarre Japan",
      url: BASE,
    },
  });
}

/**
 * JSON-LD を文字列化する補助。`<script>` への注入は別コンポーネント
 * (components/seo/json-ld.tsx) で行う。
 *
 * "</script>" 衝突を避けるため `<` を escape。
 */
export function stringifyJsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
