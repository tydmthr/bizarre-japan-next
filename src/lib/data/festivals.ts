import festivalsRaw from "@/data/festivals.json";
import festivalsEnRaw from "@/data/festivals_en.json";
import type { Festival, FestivalEn } from "./types";

export const FESTIVALS = festivalsRaw as unknown as Festival[];
export const FESTIVALS_EN = festivalsEnRaw as unknown as FestivalEn[];

const FESTIVAL_MAP = new Map<string, Festival>(
  FESTIVALS.map((f) => [f.id, f]),
);
const FESTIVAL_EN_MAP = new Map<string, FestivalEn>(
  FESTIVALS_EN.map((f) => [f.id, f]),
);

export function getAllFestivals(): Festival[] {
  return FESTIVALS;
}

export function getFestivalById(id: string): Festival | undefined {
  return FESTIVAL_MAP.get(id);
}

export function getFestivalEnById(id: string): FestivalEn | undefined {
  return FESTIVAL_EN_MAP.get(id);
}

export function getFestivalsByCategory(
  category: Festival["category"],
): Festival[] {
  return FESTIVALS.filter((f) => f.category === category);
}

export function getAllFestivalIds(): string[] {
  return FESTIVALS.map((f) => f.id);
}
