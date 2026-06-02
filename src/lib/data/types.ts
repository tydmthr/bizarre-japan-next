/**
 * Bizarre Japan データ型定義
 * Workflow による旧JSON分析（2026-06-03）に基づく。
 * 詳細は docs/roadmap.md と Workflow1 結果を参照。
 *
 * 重要な実態:
 * - spots.json / festivals.json / spots_en.json は素の配列（{spots:[]} ではない）
 * - photos.json / access_info.json は ID をキーにした Record オブジェクト
 * - deepdive と deep_dive の2系統スキーマが共存（旧Batch=deep_dive、新=deepdive）
 * - deepdive 内の related_works/trivia/external_reviews/sources は string | string[] のドリフトあり
 */

/** カテゴリ（事実上の enum） */
export type Category = "folk" | "bkyu" | "horror" | "mystery";

/** カテゴリ slug → 日本語ラベル */
export const CATEGORY_LABEL_JA: Record<Category, string> = {
  folk: "土俗・奇祭",
  bkyu: "B級・カオス",
  horror: "心霊・廃墟",
  mystery: "聖地・ミステリー",
};

/** カテゴリ slug → 英語ラベル */
export const CATEGORY_LABEL_EN: Record<Category, string> = {
  folk: "Folk & Ritual",
  bkyu: "B-Grade Chaos",
  horror: "Haunted & Ruined",
  mystery: "Sacred & Strange",
};

/**
 * Deepdive 詳細解説。
 * Batch ごとにスキーマが揺れているので、ほぼ全て optional。
 * related_works/trivia/external_reviews/sources は festivals.json で string | string[] のドリフトあり。
 */
export type DeepDive = {
  // 標準19キー（Batch 6+ canonical）
  history_jp?: string;
  cultural_context_jp?: string;
  local_perspective_jp?: string;
  best_visit_time?: string;
  photo_tips?: string;
  warnings_extra?: string;
  related_works?: string | string[];
  trivia?: string | string[];
  external_reviews?: string | string[];
  sources?: string | string[];

  // English variants
  history_jp_en?: string;
  cultural_context_jp_en?: string;
  local_perspective_jp_en?: string;
  best_visit_time_en?: string;
  photo_tips_en?: string;
  warnings_extra_en?: string;
  related_works_en?: string | string[];
  trivia_en?: string | string[];
  external_reviews_en?: string | string[];
  sources_en?: string | string[];

  // 旧Batch (deep_dive snake_case)、または拡張スキーマ
  history_en?: string;
  architecture_jp?: string;
  architecture_en?: string;
  cultural_property_jp?: string;
  cultural_property_en?: string;
  religion_jp?: string;
  religion_en?: string;
  legend_jp?: string;
  legend_en?: string;
  access_jp?: string;
  access_en?: string;
};

/** Spot エンティティ（spots.json の1件） */
export type Spot = {
  // === Required core (presenceRate ≈ 1.0) ===
  id: string;
  name: string;
  name_kana: string;
  category: Category;
  prefecture: string;
  city: string;
  address: string;
  lat: number;
  lng: number;
  status: string;
  fee: string;
  hours: string;
  reference_urls: string[];
  summary: string;
  highlights: string[];
  from_kameyama: string;

  // === Near-required ===
  official_url?: string; // 99.5%

  // === English (sparse, 25.7%) ===
  name_en?: string;

  // === Editorial meta (~22%) ===
  category_label?: string;
  region?: string;
  editorial_status?: string;
  source_quality?: string;
  last_verified?: string;
  safety_level?: string;
  safety_note?: string;
  visit_priority?: string;

  // === Media ===
  photo_url?: string;
  visit_url?: string;

  // === Top-level escapees (8.5%) ===
  best_visit_time?: string;
  phototips?: string;
  trivia?: string;
  related_works?: string;
  external_reviews?: string;
  sources?: string;
  warnings_extra?: string;

  // === Detailed ===
  deepdive?: DeepDive;
  deep_dive?: DeepDive; // 18件のみ legacy snake_case
};

/** Spot の英語拡張版（spots_en.json） */
export type SpotEn = Spot & {
  name_en: string;
  prefecture_en?: string;
  city_en?: string;
  summary_en?: string;
  highlights_en?: string[];
};

/** Festival の英語拡張版（festivals_en.json） */
export type FestivalEn = Festival & {
  name_en: string;
  prefecture_en?: string;
  city_en?: string;
  shrine_en?: string;
  origin_en?: string;
  summary_en?: string;
  highlights_en?: string[];
  viewing_notes_en?: string;
  date_pattern_en?: string;
  from_kameyama?: string;
};

/** Festival エンティティ */
export type Festival = {
  // === Required core ===
  id: string;
  name: string;
  name_kana: string;
  category: Category;
  prefecture: string;
  city: string;
  lat: number;
  lng: number;
  date_pattern: string;
  date_2026: string;
  summary: string;
  highlights: string[];
  origin: string;
  reference_urls: string[];

  // === Near-required ===
  shrine?: string;
  official_url?: string;
  viewing_notes?: string;
  date_2026_end?: string | null;

  // === Sparse ===
  name_en?: string;
  editorial_status?: string;

  // === Detailed ===
  deepdive?: DeepDive;
};

/** photos.json の1エントリ（valueの型） */
export type PhotoEntry = {
  name: string;
  primary: string | null;
  credit: string | null;
  alt_photos: string[];

  // Openverse 拡張（4-5%）
  creator?: string;
  creator_url?: string;
  license?: string;
  license_url?: string;
  provider?: string;
  source_url?: string;
  title?: string;
};

/** photos.json 全体（id → PhotoEntry） */
export type PhotoMap = Record<string, PhotoEntry>;

/** access_info.json の1エントリ */
export type AccessInfo = {
  name: string;
  nearest_station: string | null;
  walking_minutes: number | null;
  bus_info: string | null;
  parking: string | null;
  difficulty: string;
  warnings: string;
  best_season: string;
  time_required: string;
};

/** access_info.json 全体 */
export type AccessMap = Record<string, AccessInfo>;

/** ID プレフィックス判別 */
export function isSpotId(id: string): boolean {
  return id.startsWith("spot-");
}
export function isFestivalId(id: string): boolean {
  return id.startsWith("fest-");
}

/** deepdive を deep_dive と統合した「effective deepdive」を返す（deepdive 優先） */
export function effectiveDeepDive(
  s: Spot | Festival,
): DeepDive | undefined {
  if (s.deepdive) return s.deepdive;
  if ("deep_dive" in s && s.deep_dive) return s.deep_dive;
  return undefined;
}

/** string | string[] | undefined を string[] に正規化 */
export function asStringArray(v: string | string[] | undefined): string[] {
  if (!v) return [];
  if (Array.isArray(v)) return v;
  // 改行で分割（festivals.json の古いバッチが改行入りの string で持っている）
  return v
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
}
