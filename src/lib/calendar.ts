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

/** 第N曜日を計算（year, month=1-12, n=1..5, wday=0(日)..6(土)） */
function nthWeekdayOfMonth(
  year: number,
  month: number,
  n: number,
  wday: number,
): Date | null {
  const first = new Date(year, month - 1, 1);
  const offset = (wday - first.getDay() + 7) % 7;
  const day = 1 + offset + (n - 1) * 7;
  const d = new Date(year, month - 1, day);
  return d.getMonth() === month - 1 ? d : null;
}

/**
 * date_pattern から概算日付を推定（指定年で評価）。
 * 「休止／終了」は除外。返値は Date または null。
 * 旧サイト app.js の estimateFestDate を移植。
 */
export function estimateFestivalDate(
  pattern: string | null | undefined,
  year: number,
): Date | null {
  if (!pattern) return null;
  if (/休止|終了/.test(pattern)) return null;
  const WD = "日月火水木金土";
  let m: RegExpMatchArray | null;

  // 1) 年入り具体日: 「2026年は10月2日」
  m = pattern.match(new RegExp(year + "年[はの]?(\\d{1,2})月(\\d{1,2})日"));
  if (m) return new Date(year, +m[1] - 1, +m[2]);

  // 2) 「N月第M曜日」
  m = pattern.match(/(\d{1,2})月第(\d)([日月火水木金土])曜/);
  if (m) return nthWeekdayOfMonth(year, +m[1], +m[2], WD.indexOf(m[3]));

  // 3) 「N月M日」固定日
  m = pattern.match(/(\d{1,2})月(\d{1,2})日/);
  if (m) return new Date(year, +m[1] - 1, +m[2]);

  // 4) 「N月上旬・中旬・下旬」
  m = pattern.match(/(\d{1,2})月(上旬|中旬|下旬)/);
  if (m) {
    const day: Record<string, number> = { 上旬: 5, 中旬: 15, 下旬: 25 };
    return new Date(year, +m[1] - 1, day[m[2]]);
  }

  // 5) 「N月」のみ → 月初として1日と近似
  m = pattern.match(/(\d{1,2})月/);
  if (m) return new Date(year, +m[1] - 1, 1);

  return null;
}

/**
 * 「今日以降の直近の祭」を昇順で返す。
 * date_2026 が今日以降ならそれを採用、過去 or 無いなら date_pattern を
 * 今年・来年の2候補で評価して今日以降の最早を採用（年またぎ対応）。
 */
export function getUpcomingFestivals(
  festivals: Festival[],
  today: Date,
  limit = 10,
): Array<{ festival: Festival; date: Date }> {
  const todayStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const thisYear = todayStart.getFullYear();
  const items: Array<{ festival: Festival; date: Date }> = [];

  for (const f of festivals) {
    let dt: Date | null = null;

    if (f.date_2026) {
      const parsed = parseFestivalDate(f.date_2026);
      if (parsed && parsed >= todayStart) dt = parsed;
    }

    if (!dt && f.date_pattern) {
      const cands = [
        estimateFestivalDate(f.date_pattern, thisYear),
        estimateFestivalDate(f.date_pattern, thisYear + 1),
      ].filter((d): d is Date => d !== null && d >= todayStart);
      cands.sort((a, b) => a.getTime() - b.getTime());
      if (cands.length > 0) dt = cands[0];
    }

    if (dt) items.push({ festival: f, date: dt });
  }

  items.sort((a, b) => a.date.getTime() - b.date.getTime());
  return items.slice(0, limit);
}

/** YYYY-MM-DD（hyphen）の表記。lang問わず使える素朴版 */
export function formatYmd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
