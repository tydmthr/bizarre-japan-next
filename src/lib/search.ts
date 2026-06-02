import Fuse, { type IFuseOptions } from "fuse.js";
import type { Spot, Festival, SpotEn, FestivalEn } from "./data";

const SPOT_KEYS_JA: IFuseOptions<Spot>["keys"] = [
  { name: "name", weight: 3 },
  { name: "name_kana", weight: 2 },
  { name: "prefecture", weight: 1.2 },
  { name: "city", weight: 1.2 },
  { name: "summary", weight: 0.8 },
  { name: "highlights", weight: 0.5 },
];

const FEST_KEYS_JA: IFuseOptions<Festival>["keys"] = [
  { name: "name", weight: 3 },
  { name: "name_kana", weight: 2 },
  { name: "prefecture", weight: 1.2 },
  { name: "city", weight: 1.2 },
  { name: "shrine", weight: 1.2 },
  { name: "summary", weight: 0.8 },
  { name: "highlights", weight: 0.5 },
];

const SPOT_KEYS_EN: IFuseOptions<SpotEn>["keys"] = [
  { name: "name_en", weight: 3 },
  { name: "name", weight: 2 },
  { name: "name_kana", weight: 1.5 },
  { name: "prefecture_en", weight: 1.2 },
  { name: "city_en", weight: 1.2 },
  { name: "prefecture", weight: 1 },
  { name: "summary_en", weight: 0.8 },
  { name: "summary", weight: 0.6 },
  { name: "highlights_en", weight: 0.5 },
];

const FEST_KEYS_EN: IFuseOptions<FestivalEn>["keys"] = [
  { name: "name_en", weight: 3 },
  { name: "name", weight: 2 },
  { name: "name_kana", weight: 1.5 },
  { name: "prefecture_en", weight: 1.2 },
  { name: "city_en", weight: 1.2 },
  { name: "shrine_en", weight: 1 },
  { name: "summary_en", weight: 0.8 },
  { name: "summary", weight: 0.6 },
];

const COMMON: IFuseOptions<unknown> = {
  threshold: 0.35,
  ignoreLocation: true,
  includeScore: false,
  shouldSort: true,
  minMatchCharLength: 1,
};

export function createSpotFuse(spots: Spot[]) {
  return new Fuse<Spot>(spots, { ...COMMON, keys: SPOT_KEYS_JA });
}

export function createFestivalFuse(festivals: Festival[]) {
  return new Fuse<Festival>(festivals, { ...COMMON, keys: FEST_KEYS_JA });
}

export function createSpotEnFuse(spots: SpotEn[]) {
  return new Fuse<SpotEn>(spots, { ...COMMON, keys: SPOT_KEYS_EN });
}

export function createFestivalEnFuse(festivals: FestivalEn[]) {
  return new Fuse<FestivalEn>(festivals, { ...COMMON, keys: FEST_KEYS_EN });
}
