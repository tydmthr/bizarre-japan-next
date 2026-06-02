import accessRaw from "@/data/access_info.json";
import type { AccessInfo, AccessMap } from "./types";

export const ACCESS: AccessMap = accessRaw as unknown as AccessMap;

export function getAccessFor(id: string): AccessInfo | undefined {
  return ACCESS[id];
}
