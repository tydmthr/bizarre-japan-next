import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { Tag } from "@/components/ui/tag";
import { Card, CardEyebrow, CardTitle, CardBody, CardFooter } from "@/components/ui/card";
import { ArrowRight } from "@/components/icons";
import { ROUTES, CATEGORY_LABEL_JA, type Category } from "@/lib/data";
import { dict } from "@/lib/i18n";

export const metadata = {
  title: "巡路 — 巡礼コース ／ 異界巡礼",
  description: "テーマ別に厳選した巡礼ルート。半日・一日で巡る異界。",
};

export default function RoutesPage() {
  const t = dict("ja");
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Section tone="bg" density="compact">
          <Heading variant="eyebrow">{t.routes.eyebrow}</Heading>
          <Heading variant="hero" as="h1" className="mt-4">
            {t.routes.title}
          </Heading>
          <p className="mt-4 text-ink-mute max-w-[65ch]">{t.routes.sub}</p>
        </Section>

        <Section tone="surface" density="default">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ROUTES.map((r) => {
              const stops =
                (r.spots?.length ?? 0) + (r.festivals?.length ?? 0);
              const toneByCat: Record<string, "shu" | "kin" | "neutral" | "surface"> = {
                folk: "shu",
                mystery: "kin",
                horror: "neutral",
                bkyu: "neutral",
              };
              const tone = toneByCat[r.cat] ?? "neutral";
              return (
                <Card key={r.id} tone={tone} density="spacious" interactive>
                  <div className="flex items-start gap-4">
                    <span
                      className="font-display text-5xl shrink-0 leading-none"
                      style={{
                        color:
                          tone === "shu"
                            ? "var(--accent)"
                            : tone === "kin"
                              ? "var(--gold)"
                              : "var(--ink-mute)",
                      }}
                    >
                      {r.glyph}
                    </span>
                    <div className="flex-1">
                      <CardEyebrow>{r.duration_ja}</CardEyebrow>
                      <CardTitle className="text-xl">{r.title_ja}</CardTitle>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <Tag tone={r.cat as Category} size="sm">
                          {CATEGORY_LABEL_JA[r.cat as Category]}
                        </Tag>
                        <Tag tone="ghost" size="sm">
                          {r.season_ja}
                        </Tag>
                        <Tag tone="ghost" size="sm">
                          {t.routes.stopsLabel(stops)}
                        </Tag>
                      </div>
                      <CardBody className="mt-4">{r.desc_ja}</CardBody>
                      <CardFooter className="flex items-center justify-between">
                        <Link
                          href={`/map?route=${r.id}`}
                          className="inline-flex items-center gap-1 text-sm text-accent hover:text-accent-hover"
                        >
                          {t.routes.title} <ArrowRight size={14} />
                        </Link>
                        <span className="text-xs text-ink-faint">{r.id}</span>
                      </CardFooter>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
