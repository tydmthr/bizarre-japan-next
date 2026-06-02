import type { DeepDive } from "@/lib/data";
import { asStringArray } from "@/lib/data";
import { Heading } from "@/components/ui/heading";

type Section = { key: keyof DeepDive; label: string };

const SPOT_SECTIONS_JA: Section[] = [
  { key: "history_jp", label: "歴史" },
  { key: "cultural_context_jp", label: "文化的背景" },
  { key: "local_perspective_jp", label: "地元視点" },
  { key: "religion_jp", label: "宗教" },
  { key: "architecture_jp", label: "建築" },
  { key: "legend_jp", label: "伝承" },
  { key: "cultural_property_jp", label: "文化財" },
  { key: "best_visit_time", label: "ベストシーズン" },
  { key: "photo_tips", label: "撮影のコツ" },
  { key: "warnings_extra", label: "注意事項" },
];

const SPOT_LIST_SECTIONS_JA: Section[] = [
  { key: "related_works", label: "関連作品" },
  { key: "trivia", label: "トリビア" },
  { key: "external_reviews", label: "外部レビュー" },
  { key: "sources", label: "出典" },
];

const SPOT_SECTIONS_EN: Section[] = [
  { key: "history_jp_en", label: "History" },
  { key: "cultural_context_jp_en", label: "Cultural Context" },
  { key: "local_perspective_jp_en", label: "Local Perspective" },
  { key: "religion_en", label: "Religion" },
  { key: "architecture_en", label: "Architecture" },
  { key: "legend_en", label: "Legend" },
  { key: "cultural_property_en", label: "Cultural Property" },
  { key: "best_visit_time_en", label: "Best Visit Time" },
  { key: "photo_tips_en", label: "Photo Tips" },
  { key: "warnings_extra_en", label: "Warnings" },
];

const SPOT_LIST_SECTIONS_EN: Section[] = [
  { key: "related_works_en", label: "Related Works" },
  { key: "trivia_en", label: "Trivia" },
  { key: "external_reviews_en", label: "External Reviews" },
  { key: "sources_en", label: "Sources" },
];

function renderInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    parts.push(
      <a
        key={i++}
        href={m[2]}
        target="_blank"
        rel="noopener"
        className="text-accent hover:text-accent-hover underline underline-offset-2 decoration-accent/40"
      >
        {m[1]}
      </a>,
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts.length > 0 ? parts : text;
}

function renderParagraphs(text: string) {
  return text.split(/\n\n+/).map((para, i) => (
    <p key={i} className="mb-4 leading-loose text-ink">
      {renderInline(para)}
    </p>
  ));
}

export function DeepDiveBlock({
  dd,
  lang = "ja",
}: {
  dd: DeepDive;
  lang?: "ja" | "en";
}) {
  const sections = lang === "en" ? SPOT_SECTIONS_EN : SPOT_SECTIONS_JA;
  const listSections = lang === "en" ? SPOT_LIST_SECTIONS_EN : SPOT_LIST_SECTIONS_JA;

  return (
    <div className="space-y-12">
      {sections.map(({ key, label }) => {
        const v = dd[key] as string | undefined;
        if (!v) return null;
        return (
          <section key={key}>
            <Heading variant="eyebrow">{label}</Heading>
            <Heading variant="card" as="h3" className="mt-2 mb-4">
              {label}
            </Heading>
            <div>{renderParagraphs(v)}</div>
          </section>
        );
      })}

      {listSections.map(({ key, label }) => {
        const items = asStringArray(dd[key] as string | string[] | undefined);
        if (items.length === 0) return null;
        return (
          <section key={key}>
            <Heading variant="eyebrow">{label}</Heading>
            <Heading variant="card" as="h3" className="mt-2 mb-4">
              {label}
            </Heading>
            <ul className="space-y-2">
              {items.map((it, i) => (
                <li
                  key={i}
                  className="text-ink leading-relaxed pl-4 border-l-2 border-gold/40"
                >
                  {renderInline(it)}
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
