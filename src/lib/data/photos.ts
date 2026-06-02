import photosRaw from "@/data/photos.json";
import type { PhotoEntry, PhotoMap } from "./types";

export const PHOTOS: PhotoMap = photosRaw as unknown as PhotoMap;

export function getPhotoFor(id: string): PhotoEntry | undefined {
  return PHOTOS[id];
}

export function getPrimaryPhotoUrl(id: string): string | null {
  const p = PHOTOS[id];
  return p?.primary ?? null;
}

export function getPhotoCredit(id: string): string | null {
  const p = PHOTOS[id];
  return p?.credit ?? null;
}
