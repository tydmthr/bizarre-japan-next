import { IG_POSTS } from "@/lib/data";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";

const COPY = {
  ja: {
    eyebrow: "F I E L D N O T E S",
    title: "現地から届く未収録の異界",
    sub: (handle: string) =>
      `@${handle} で配信中。気になる景色があれば DM で投稿どうぞ。`,
    handle: "bizarre_japan",
  },
  en: {
    eyebrow: "F I E L D N O T E S",
    title: "Unfiltered records from the field",
    sub: (handle: string) =>
      `Posted at @${handle}. DM us if you spot something we should record.`,
    handle: "bizarre_japan",
  },
} as const;

export function IgFeed({ lang = "ja" }: { lang?: "ja" | "en" }) {
  // データ未提供時は完全に hidden（Computer 側 cron 提供後に有効化）
  if (IG_POSTS.length === 0) return null;

  const t = COPY[lang];
  // Display up to 8 most recent
  const posts = IG_POSTS.slice(0, 8);

  return (
    <Section tone="surface" density="default" width="default">
      <div className="flex items-baseline justify-between flex-wrap gap-4">
        <div>
          <Heading variant="eyebrow">{t.eyebrow}</Heading>
          <Heading variant="section" as="h2" className="mt-2">
            {t.title}
          </Heading>
        </div>
        <a
          href={`https://www.instagram.com/${t.handle}/`}
          target="_blank"
          rel="noopener"
          className="text-sm text-accent hover:text-accent-hover"
        >
          @{t.handle} →
        </a>
      </div>
      <p className="mt-3 text-ink-mute text-sm">{t.sub(t.handle)}</p>

      <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {posts.map((p) => (
          <a
            key={p.id}
            href={p.permalink}
            target="_blank"
            rel="noopener"
            className="relative aspect-square bg-bg-raised border border-border overflow-hidden group"
          >
            {(p.thumbnail_url ?? p.media_url) && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={p.thumbnail_url ?? p.media_url}
                alt={p.caption?.slice(0, 60) ?? "Instagram post"}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
            )}
            {p.caption && (
              <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-ink/85 to-transparent text-bg text-[10px] leading-tight opacity-0 group-hover:opacity-100 transition-opacity line-clamp-3">
                {p.caption}
              </div>
            )}
          </a>
        ))}
      </div>
    </Section>
  );
}
