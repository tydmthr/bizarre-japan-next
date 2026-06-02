import spotsRaw from "@/data/spots.json";
import spotsEnRaw from "@/data/spots_en.json";
import type { Spot, SpotEn } from "./types";

/** 全スポット（型キャストして配列） */
export const SPOTS = spotsRaw as unknown as Spot[];
export const SPOTS_EN = spotsEnRaw as unknown as SpotEn[];

/** ID→Spot の Map */
const SPOT_MAP = new Map<string, Spot>(SPOTS.map((s) => [s.id, s]));
const SPOT_EN_MAP = new Map<string, SpotEn>(SPOTS_EN.map((s) => [s.id, s]));

export function getAllSpots(): Spot[] {
  return SPOTS;
}

export function getSpotById(id: string): Spot | undefined {
  return SPOT_MAP.get(id);
}

export function getSpotEnById(id: string): SpotEn | undefined {
  return SPOT_EN_MAP.get(id);
}

export function getSpotsByCategory(category: Spot["category"]): Spot[] {
  return SPOTS.filter((s) => s.category === category);
}

export function getSpotsByPrefecture(prefecture: string): Spot[] {
  return SPOTS.filter((s) => s.prefecture === prefecture);
}

/** 全 spot id のリスト（generateStaticParams 用） */
export function getAllSpotIds(): string[] {
  return SPOTS.map((s) => s.id);
}
