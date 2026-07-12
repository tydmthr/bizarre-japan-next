import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardEyebrow, CardTitle, CardBody } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Map, Calendar } from "@/components/icons";
import { dict, type Lang, langPrefix } from "@/lib/i18n";
import { SPOTS, FESTIVALS } from "@/lib/data";
import { UpcomingFestivals } from "./upcoming-festivals";
import { TonightIkai } from "./tonight-ikai";
import { CountUp } from "@/components/ui/count-up";
import { Reveal } from "@/components/ui/reveal";

export function HeroIkai({ lang = "ja" }: { lang?: Lang }) {
  const t = dict(lang);
  const prefix = langPrefix(lang);

  const spotCount = SPOTS.length;
  const festCount = FESTIVALS.length;
  const prefCount = new Set(
    SPOTS.map((s) => s.prefecture).concat(FESTIVALS.map((f) => f.prefecture)),
  ).size;

  const stats = [
    { num: spotCount, label: t.hero.statLabels.spots },
    { num: festCount, label: t.hero.statLabels.festivals },
    { num: prefCount, label: t.hero.statLabels.prefectures },
  ];

  const realmTones = ["shu", "neutral", "neutral", "kin"] as const;

  return (
    <section className="relative overflow-hidden bg-bg pt-20 pb-32">
      {/* Kanji backdrop */}
      <div
        aria-hidden
        className="anim-drift pointer-events-none absolute inset-0 select-none flex items-center justify-center"
        style={{ transform: "rotate(-15deg)" }}
      >
        <p
          className="font-display font-black whitespace-nowrap"
          style={{
            fontSize: "clamp(120px, 22vw, 320px)",
            letterSpacing: "0.3em",
            color: "var(--color-shu-500)",
            opacity: 0.04,
          }}
        >
          鬼 神 異 怪 祟 祓 呪 霊 祠 荒
        </p>
      </div>

      {/* Dot grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(currentColor 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          color: "var(--color-kin-500)",
          opacity: 0.06,
        }}
      />

      {/* 紙の粒（マット質感） */}
      <div aria-hidden className="noise-overlay pointer-events-none absolute inset-0" />

      <div className="relative mx-auto max-w-[920px] px-6 text-center">
        <div className="anim-fade-up">
          <Heading variant="eyebrow" className="inline-block px-4 py-1.5 border-y border-gold/70">
            {t.hero.eyebrow}
          </Heading>
        </div>

        <h1 className="h-hero mt-8 text-ink-strong">
          <span className="anim-fade-up block" style={{ animationDelay: "0.1s" }}>{t.hero.title[0]}</span>
          <span className="anim-fade-up block text-accent" style={{ animationDelay: "0.22s" }}>{t.hero.title[1]}</span>
          <span className="anim-fade-up block" style={{ animationDelay: "0.34s" }}>{t.hero.title[2]}</span>
        </h1>

        <p className="anim-fade-up mt-10 mx-auto max-w-[620px] text-base leading-loose text-ink-mute" style={{ animationDelay: "0.5s" }}>
          {t.hero.lede[0]}
          <br />
          {t.hero.lede[1]}
          <br />
          {t.hero.lede[2]}
          <br />
          <strong className="text-gold font-bold">{t.hero.ledeStrong(spotCount, festCount)}</strong>
        </p>

        {/* Stats */}
        <div className="anim-fade-up mt-12 flex items-center justify-center gap-8 md:gap-12" style={{ animationDelay: "0.62s" }}>
          {stats.map((s, i) => (
            <div key={s.label} className="flex items-center gap-8 md:gap-12">
              {i > 0 && <span aria-hidden className="w-px h-12 bg-border-strong" />}
              <div className="flex flex-col items-center">
                <span className="font-display text-5xl md:text-6xl font-black text-gold leading-none tabular-nums">
                  <CountUp value={s.num} />
                </span>
                <span className="mt-2 text-[11px] tracking-[0.3em] text-ink-mute">
                  {s.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="anim-fade-up mt-12 flex flex-wrap items-center justify-center gap-4" style={{ animationDelay: "0.74s" }}>
          <Link href={`${prefix}/map`} className="contents">
            <Button tone="shu" size="lg" density="spacious">
              <Map size={18} />
              <span>{t.hero.ctaMap}</span>
            </Button>
          </Link>
          <Link href={`${prefix}/calendar`} className="contents">
            <Button tone="kin" size="lg" density="spacious">
              <Calendar size={18} />
              <span>{t.hero.ctaCalendar}</span>
            </Button>
          </Link>
        </div>

        {/* Tonight — 今宵の異界（日替わり3枚） */}
        <TonightIkai lang={lang} />

        {/* Upcoming Festivals — 直近の異界 */}
        <UpcomingFestivals lang={lang} />

        {/* Categories */}
        <Reveal className="mt-24">
          <p className="eyebrow text-center">{t.hero.realmsTitle}</p>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-[820px] mx-auto">
            {t.realms.map((r, i) => {
              const tone = realmTones[i];
              return (
                <Card
                  key={r.title}
                  tone={tone}
                  density="default"
                  interactive
                  className="text-left"
                >
                  <CardEyebrow>
                    <span
                      className="font-display text-2xl"
                      style={{
                        color:
                          tone === "shu"
                            ? "var(--accent)"
                            : tone === "kin"
                              ? "var(--gold)"
                              : "var(--ink-mute)",
                        letterSpacing: 0,
                      }}
                    >
                      {r.glyph}
                    </span>
                  </CardEyebrow>
                  <CardTitle className="text-lg">{r.title}</CardTitle>
                  <CardBody className="mt-2 whitespace-pre-line">
                    {r.body}
                  </CardBody>
                </Card>
              );
            })}
          </div>
        </Reveal>

        {/* Note */}
        <p className="mt-20 text-xs text-ink-faint leading-relaxed">
          {t.hero.note[0]}
          <br />
          {t.hero.note[1]}
        </p>
      </div>
    </section>
  );
}
