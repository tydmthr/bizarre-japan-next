import igRaw from "@/data/ig_feed.json";

export type IgPost = {
  id: string;
  caption?: string;
  permalink: string;
  media_type?: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  /** 旧サイト fetch_instagram_feed.py 形式 */
  image?: string;
  /** Instagram Graph API 形式 */
  media_url?: string;
  thumbnail_url?: string;
  timestamp?: string;
};

/** 表示用画像URL（複数フィールドフォールバック） */
export function igImageUrl(p: IgPost): string | undefined {
  return p.thumbnail_url ?? p.media_url ?? p.image;
}

export const IG_POSTS: IgPost[] = igRaw as unknown as IgPost[];

export function getIgPosts(): IgPost[] {
  return IG_POSTS;
}
