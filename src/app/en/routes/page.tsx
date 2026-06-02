import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { Tag } from "@/components/ui/tag";
import { Card, CardEyebrow, CardTitle, CardBody, CardFooter } from "@/components/ui/card";
import { ArrowRight } from "@/components/icons";
import { ROUTES, CATEGORY_LABEL_EN, type Category } from "@/lib/data";
import { dict } from "@/lib/i18n";

export const metadata = {
  title: "Routes — Pilgrim Pilgrimages ／ Bizarre Japan",
  description:
    "Hand-picked themed pilgrimage routes. Half-day and full-day tours across the strange peripheries of Japan.",
};

export default function RoutesEnPage() {
  const t = dict("en");
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
              const toneByCat: Record<string, "shu" | "kin" | "neutral"> = {
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
                      <CardEyebrow>{r.duration_en}</CardEyebrow>
                      <CardTitle className="text-xl">{r.title_en}</CardTitle>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <Tag tone={r.cat as Category} size="sm">
                          {CATEGORY_LABEL_EN[r.cat as Category]}
                        </Tag>
                        <Tag tone="ghost" size="sm">
                          {r.season_en}
                        </Tag>
                        <Tag tone="ghost" size="sm">
                          {t.routes.stopsLabel(stops)}
                        </Tag>
                      </div>
                      <CardBody className="mt-4">{r.desc_en}</CardBody>
                      <CardFooter className="flex items-center justify-between">
                        <Link
                          href={`/en/map?route=${r.id}`}
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
