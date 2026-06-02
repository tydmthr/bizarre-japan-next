import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { FESTIVALS_EN } from "@/lib/data";
import { dict } from "@/lib/i18n";
import {
  MONTH_KEYS,
  MONTH_LABEL_EN,
  groupFestivalsByMonth,
  daysInMonth,
  firstWeekday,
  parseMonthKey,
} from "@/lib/calendar";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Calendar — Japan's Wildest Days ／ Bizarre Japan",
  description: "May 2026 – April 2027. Calendar of strange festivals across Japan.",
};

const WEEK_LABELS_EN = ["S", "M", "T", "W", "T", "F", "S"];

const CAT_COLOR: Record<string, string> = {
  folk: "var(--accent)",
  mystery: "var(--gold)",
  horror: "var(--color-sumi-500)",
  bkyu: "var(--color-sumi-400)",
};

export default function CalendarEnPage() {
  const t = dict("en");
  // FESTIVALS_EN is structurally compatible with Festival for grouping
  const grouped = groupFestivalsByMonth(FESTIVALS_EN);

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Section tone="bg" density="compact">
          <Heading variant="eyebrow">{t.calendar.eyebrow}</Heading>
          <Heading variant="hero" as="h1" className="mt-4">
            {t.calendar.title}
          </Heading>
          <p className="mt-2 text-ink-mute">{t.calendar.sub}</p>
        </Section>

        <Section tone="surface" density="default">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MONTH_KEYS.map((key) => {
              const { year, month } = parseMonthKey(key);
              const total = daysInMonth(year, month);
              const offset = firstWeekday(year, month);
              const cells: (number | null)[] = [];
              for (let i = 0; i < offset; i++) cells.push(null);
              for (let d = 1; d <= total; d++) cells.push(d);
              while (cells.length % 7 !== 0) cells.push(null);

              const fests = grouped[key] ?? [];
              const festsByDay: Record<number, typeof fests> = {};
              for (const f of fests) {
                (festsByDay[f.day] ??= []).push(f);
              }

              return (
                <div
                  key={key}
                  className="border border-border rounded-lg bg-bg overflow-hidden"
                >
                  <div className="px-5 py-3 border-b border-border bg-bg-raised flex items-baseline justify-between">
                    <h2 className="font-display text-lg font-bold tracking-wider text-ink-strong">
                      {MONTH_LABEL_EN[key]} {year}
                    </h2>
                    <span className="text-xs text-ink-mute tracking-widest">
                      {fests.length}
                    </span>
                  </div>

                  <div className="grid grid-cols-7 text-[10px] tracking-widest text-ink-mute bg-bg-raised">
                    {WEEK_LABELS_EN.map((w, i) => (
                      <div
                        key={i}
                        className="text-center py-1 border-r border-border last:border-r-0"
                      >
                        {w}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 text-xs">
                    {cells.map((d, i) => {
                      const fOnDay = d ? festsByDay[d] ?? [] : [];
                      const hasFest = fOnDay.length > 0;
                      return (
                        <div
                          key={i}
                          className={cn(
                            "aspect-square border-r border-b border-border last:border-r-0",
                            "p-1 flex flex-col gap-0.5",
                            d ? "bg-bg" : "bg-surface-mute",
                          )}
                        >
                          {d && (
                            <>
                              <span className="text-[10px] text-ink-mute">{d}</span>
                              {hasFest && (
                                <div className="flex-1 flex flex-col gap-0.5 overflow-hidden">
                                  {fOnDay.slice(0, 2).map((fad) => {
                                    const fe = fad.festival as typeof FESTIVALS_EN[number];
                                    return (
                                      <Link
                                        key={fe.id}
                                        href={`/en/festivals/${fe.id}`}
                                        className="text-[9px] leading-tight px-1 py-0.5 rounded-sm truncate"
                                        style={{
                                          backgroundColor:
                                            CAT_COLOR[fe.category] ??
                                            "var(--color-sumi-400)",
                                          color: "var(--bg)",
                                        }}
                                        title={fe.name_en ?? fe.name}
                                      >
                                        {fe.name_en ?? fe.name}
                                      </Link>
                                    );
                                  })}
                                  {fOnDay.length > 2 && (
                                    <span className="text-[9px] text-ink-faint">
                                      +{fOnDay.length - 2}
                                    </span>
                                  )}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {fests.length > 0 && (
                    <div className="px-4 py-3 border-t border-border space-y-1">
                      {fests.slice(0, 6).map((fad) => {
                        const fe = fad.festival as typeof FESTIVALS_EN[number];
                        return (
                          <Link
                            key={fe.id}
                            href={`/en/festivals/${fe.id}`}
                            className="flex items-center gap-2 text-xs text-ink hover:text-accent"
                          >
                            <span className="font-display text-gold w-8 shrink-0">
                              {fad.day}
                            </span>
                            <span className="truncate">{fe.name_en ?? fe.name}</span>
                          </Link>
                        );
                      })}
                      {fests.length > 6 && (
                        <p className="text-[10px] text-ink-faint">
                          + {fests.length - 6} more
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
