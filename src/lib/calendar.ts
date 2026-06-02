/**
 * 奇祭暦のための日付ユーティリティ。
 * 2026年5月〜2027年4月の年間サイクルを基準。
 */

import type { Festival } from "./data/types";

/** YYYY-MM 形式の月キー */
export const MONTH_KEYS: string[] = [
  "2026-05",
  "2026-06",
  "2026-07",
  "2026-08",
  "2026-09",
  "2026-10",
  "2026-11",
  "2026-12",
  "2027-01",
  "2027-02",
  "2027-03",
  "2027-04",
];

export const MONTH_LABEL_JA: Record<string, string> = {
  "2026-05": "5月",
  "2026-06": "6月",
  "2026-07": "7月",
  "2026-08": "8月",
  "2026-09": "9月",
  "2026-10": "10月",
  "2026-11": "11月",
  "2026-12": "12月",
  "2027-01": "1月",
  "2027-02": "2月",
  "2027-03": "3月",
  "2027-04": "4月",
};

export const MONTH_LABEL_EN: Record<string, string> = {
  "2026-05": "May",
  "2026-06": "Jun",
  "2026-07": "Jul",
  "2026-08": "Aug",
  "2026-09": "Sep",
  "2026-10": "Oct",
  "2026-11": "Nov",
  "2026-12": "Dec",
  "2027-01": "Jan",
  "2027-02": "Feb",
  "2027-03": "Mar",
  "2027-04": "Apr",
};

/** date_2026 文字列を Date に。失敗時は null */
export function parseFestivalDate(raw: string | null | undefined): Date | null {
  if (!raw) return null;
  // 例: "2026-05-15", "2026-05-15T18:00:00", "2026-05" などゆるく対応
  const m = raw.match(/^(\d{4})-(\d{2})(?:-(\d{2}))?/);
  if (!m) return null;
  const y = parseInt(m[1], 10);
  const mo = parseInt(m[2], 10) - 1;
  const d = m[3] ? parseInt(m[3], 10) : 1;
  const dt = new Date(y, mo, d);
  return isNaN(dt.getTime()) ? null : dt;
}

export type FestivalAtDate = {
  festival: Festival;
  date: Date;
  monthKey: string; // YYYY-MM
  day: number; // 1..31
};

/** festivals を月キー → 日 → festivals[] にグルーピング */
export function groupFestivalsByMonth(
  festivals: Festival[],
): Record<string, FestivalAtDate[]> {
  const result: Record<string, FestivalAtDate[]> = {};
  for (const m of MONTH_KEYS) result[m] = [];
  for (const f of festivals) {
    const d = parseFestivalDate(f.date_2026);
    if (!d) continue;
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (!result[monthKey]) continue; // out of range
    result[monthKey].push({
      festival: f,
      date: d,
      monthKey,
      day: d.getDate(),
    });
  }
  for (const m of MONTH_KEYS) result[m].sort((a, b) => a.day - b.day);
  return result;
}

/** 月の日数 */
export function daysInMonth(year: number, month: number /* 0..11 */): number {
  return new Date(year, month + 1, 0).getDate();
}

/** 月の初日が何曜日か (0=Sun, 6=Sat) */
export function firstWeekday(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

/** YYYY-MM を { year, month } に展開 */
export function parseMonthKey(key: string): { year: number; month: number } {
  const [y, m] = key.split("-").map(Number);
  return { year: y, month: m - 1 };
}
