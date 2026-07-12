import type { MetadataRoute } from "next";
import { getAllSpotIds, getAllFestivalIds } from "@/lib/data";

export const dynamic = "force-static";

const BASE = "https://bizarrejapan.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date("2026-06-03");

  const staticPaths = [
    "",
    "/index-list",
    "/calendar",
    "/map",
    "/en",
    "/en/index-list",
    "/en/calendar",
    "/en/map",
  ];

  const spots = getAllSpotIds().flatMap((id) => [
    `/spots/${id}`,
    `/en/spots/${id}`,
  ]);
  const festivals = getAllFestivalIds().flatMap((id) => [
    `/festivals/${id}`,
    `/en/festivals/${id}`,
  ]);

  const all = [...staticPaths, ...spots, ...festivals];

  return all.map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority:
      path === "" ? 1.0 : path.startsWith("/spots/") || path.startsWith("/en/spots/") ? 0.7 : 0.8,
    alternates: {
      languages: {
        ja: path.startsWith("/en/")
          ? `${BASE}${path.replace(/^\/en/, "") || "/"}`
          : `${BASE}${path || "/"}`,
        en: path.startsWith("/en")
          ? `${BASE}${path}`
          : `${BASE}/en${path === "" ? "" : path}`,
      },
    },
  }));
}
