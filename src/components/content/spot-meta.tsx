import type { Spot, Festival, AccessInfo } from "@/lib/data";

type Row = { label: string; value: React.ReactNode };

export function MetaTable({ rows }: { rows: Row[] }) {
  return (
    <dl className="border border-border rounded-lg divide-y divide-border overflow-hidden">
      {rows.map((r, i) => (
        <div
          key={i}
          className="grid grid-cols-[8rem_1fr] sm:grid-cols-[10rem_1fr] bg-surface text-sm"
        >
          <dt className="px-4 py-3 bg-bg-raised text-ink-mute font-display tracking-wider text-xs">
            {r.label}
          </dt>
          <dd className="px-4 py-3 text-ink break-words">{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function buildSpotMetaRows(s: Spot, a?: AccessInfo): Row[] {
  const rows: Row[] = [
    { label: "所在地", value: `${s.prefecture} ${s.city}` },
    { label: "住所", value: s.address },
    { label: "拝観料", value: s.fee },
    { label: "時間", value: s.hours },
    { label: "状態", value: s.status },
    { label: "亀山から", value: s.from_kameyama },
  ];
  if (s.official_url) {
    rows.push({
      label: "公式",
      value: (
        <a
          href={s.official_url}
          target="_blank"
          rel="noopener"
          className="text-accent hover:text-accent-hover break-all"
        >
          {s.official_url}
        </a>
      ),
    });
  }
  if (a) {
    if (a.nearest_station) rows.push({ label: "最寄駅", value: a.nearest_station });
    if (a.walking_minutes !== null && a.walking_minutes !== undefined)
      rows.push({ label: "徒歩", value: `${a.walking_minutes}分` });
    if (a.parking) rows.push({ label: "駐車場", value: a.parking });
    if (a.time_required) rows.push({ label: "所要", value: a.time_required });
  }
  return rows;
}

export function buildFestivalMetaRows(
  f: Festival,
  a?: AccessInfo,
): Row[] {
  const rows: Row[] = [
    { label: "所在地", value: `${f.prefecture} ${f.city}` },
    { label: "斎行", value: f.shrine ?? "—" },
    { label: "日程", value: `${f.date_2026}${f.date_2026_end ? ` 〜 ${f.date_2026_end}` : ""}` },
    { label: "周期", value: f.date_pattern },
    { label: "起源", value: f.origin },
  ];
  if (f.viewing_notes) rows.push({ label: "観覧", value: f.viewing_notes });
  if (f.official_url) {
    rows.push({
      label: "公式",
      value: (
        <a
          href={f.official_url}
          target="_blank"
          rel="noopener"
          className="text-accent hover:text-accent-hover break-all"
        >
          {f.official_url}
        </a>
      ),
    });
  }
  if (a) {
    if (a.nearest_station) rows.push({ label: "最寄駅", value: a.nearest_station });
    if (a.walking_minutes !== null && a.walking_minutes !== undefined)
      rows.push({ label: "徒歩", value: `${a.walking_minutes}分` });
    if (a.parking) rows.push({ label: "駐車場", value: a.parking });
  }
  return rows;
}
