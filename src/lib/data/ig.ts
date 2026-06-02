import igRaw from "@/data/ig_feed.json";

export type IgPost = {
  id: string;
  caption?: string;
  permalink: string;
  media_type?: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url?: string;
  thumbnail_url?: string;
  timestamp?: string;
};

export const IG_POSTS: IgPost[] = igRaw as unknown as IgPost[];

export function getIgPosts(): IgPost[] {
  return IG_POSTS;
}
