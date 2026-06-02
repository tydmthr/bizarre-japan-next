import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Tag, categoryLabelJa } from "@/components/ui/tag";
import {
  Card,
  CardEyebrow,
  CardTitle,
  CardBody,
  CardFooter,
} from "@/components/ui/card";
import { ArrowRight } from "@/components/icons";

const tones = ["neutral", "shu", "kin", "ghost", "link"] as const;
const sizes = ["sm", "md", "lg"] as const;
const densities = ["compact", "default", "spacious"] as const;
const cardTones = ["neutral", "surface", "shu", "kin"] as const;
const tagTones = [
  "neutral",
  "shu",
  "kin",
  "folk",
  "bkyu",
  "horror",
  "mystery",
  "ghost",
] as const;

export default function CatalogPage() {
  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        {/* Intro */}
        <Section tone="bg" density="default">
          <Heading variant="eyebrow">B I Z A R R E ／ C A T A L O G</Heading>
          <Heading variant="hero" as="h1" className="mt-4">
            部品名鑑
          </Heading>
          <p className="mt-6 max-w-[65ch] text-ink-mute leading-loose">
            デザインシステム
            <code className="font-mono text-accent">v0.1</code>
            の見本帳。
            <br />
            色路線A（墨×朱×鈍金）、タイポT2（明朝×ゴシック使い分け）、Light=朝の襖／Dark=夜の和紙。
            <br />
            ヘッダー右上の月マークで切り替えできる。
          </p>
        </Section>

        {/* Heading variants */}
        <Section tone="surface" density="default">
          <Heading variant="eyebrow">T Y P O</Heading>
          <Heading variant="section" className="mt-2">
            見出しの段階
          </Heading>
          <div className="mt-8 space-y-6 max-w-[65ch]">
            <Heading variant="hero">忘れられぬ記憶のための、もう一つの日本。</Heading>
            <Heading variant="section">奇祭暦 — 一年で日本が一番ヤバい日々</Heading>
            <Heading variant="card">十宝山大乗院</Heading>
            <Heading variant="eyebrow">日 本 全 国 ／ 異 界 案 内</Heading>
            <p className="text-ink leading-loose">
              本文。表通りの観光案内には載らない。しかし確かに其処にある——個人が一生をかけて作り上げたコンクリートの楽園。
              千年続く土俗の祭礼。語り継がれた廃墟と祠。
            </p>
            <p className="text-ink-mute text-sm leading-relaxed">
              補助テキスト（ink-mute）。出典・キャプション・注意書きはここ。
            </p>
          </div>
        </Section>

        {/* Tag */}
        <Section tone="bg" density="default">
          <Heading variant="eyebrow">T A G</Heading>
          <Heading variant="section" className="mt-2">
            タグ — カテゴリ表示
          </Heading>
          <div className="mt-8 flex flex-wrap gap-3">
            {tagTones.map((t) => (
              <Tag key={t} tone={t}>
                {t in categoryLabelJa
                  ? categoryLabelJa[t as keyof typeof categoryLabelJa]
                  : t}
              </Tag>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            {tagTones.map((t) => (
              <Tag key={`${t}-sm`} tone={t} size="sm">
                {t}
              </Tag>
            ))}
          </div>
        </Section>

        {/* Card */}
        <Section tone="surface" density="default">
          <Heading variant="eyebrow">C A R D</Heading>
          <Heading variant="section" className="mt-2">
            カード — tone × density
          </Heading>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cardTones.map((t) => (
              <Card key={t} tone={t} density="default" interactive>
                <CardEyebrow>S P O T</CardEyebrow>
                <CardTitle>tone = {t}</CardTitle>
                <CardBody className="mt-2">
                  境内には参道がない。代わりに、ひとりの男が三十年で立てたコンクリートの像群が、奥宮までを埋めている。
                </CardBody>
                <CardFooter className="flex items-center justify-between">
                  <Tag tone="folk" size="sm">
                    土俗
                  </Tag>
                  <span className="inline-flex items-center gap-1 text-xs text-ink-mute">
                    詳細 <ArrowRight size={12} />
                  </span>
                </CardFooter>
              </Card>
            ))}
          </div>
        </Section>

        {/* Button matrix */}
        <Section tone="bg" density="default">
          <Heading variant="eyebrow">B U T T O N</Heading>
          <Heading variant="section" className="mt-2">
            ボタン — tone × size
          </Heading>
          <div className="mt-8 overflow-x-auto border border-border rounded-lg">
            <table className="min-w-full text-sm">
              <thead className="bg-surface text-ink-mute">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">tone \ size</th>
                  {sizes.map((s) => (
                    <th key={s} className="text-left px-4 py-3 font-medium">
                      {s}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tones.map((t) => (
                  <tr key={t} className="border-t border-border">
                    <td className="px-4 py-4 align-middle font-mono text-xs text-ink-mute">
                      {t}
                    </td>
                    {sizes.map((s) => (
                      <td key={s} className="px-4 py-4">
                        <Button tone={t} size={s}>
                          {t === "link" ? `${t} →` : `${t} / ${s}`}
                        </Button>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Heading variant="card" className="mt-12 mb-6">
            Density（tone=shu, size=md）
          </Heading>
          <div className="flex flex-wrap items-center gap-4 p-6 border border-border rounded-lg bg-surface">
            {densities.map((d) => (
              <div key={d} className="flex flex-col items-start gap-2">
                <span className="text-xs text-ink-mute font-mono">{d}</span>
                <Button tone="shu" size="md" density={d}>
                  地図で巡る
                </Button>
              </div>
            ))}
          </div>
        </Section>

        {/* Section tones */}
        <Section tone="raised" density="default">
          <Heading variant="eyebrow">S E C T I O N</Heading>
          <Heading variant="section" className="mt-2">
            セクションの面
          </Heading>
          <p className="mt-4 text-ink-mute leading-relaxed max-w-[65ch]">
            このセクション自体が tone=&quot;raised&quot;（bg-raised）。
            <br />
            上下のセクション（surface / bg）と段差を作る。
          </p>
        </Section>

        <Section tone="ink" density="compact">
          <Heading variant="eyebrow" tone="gold" className="text-bg">
            I N K
          </Heading>
          <Heading variant="card" className="mt-2 text-bg">
            tone=&quot;ink&quot; の反転面
          </Heading>
          <p className="mt-2 text-sm opacity-80">
            ヒーロー直前・引用・締めなどで使う反転面。
          </p>
        </Section>
      </main>

      <SiteFooter />
    </>
  );
}
