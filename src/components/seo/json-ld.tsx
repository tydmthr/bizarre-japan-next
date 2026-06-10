import { stringifyJsonLd } from "@/lib/seo";

/**
 * `<script type="application/ld+json">` を出力する共通コンポーネント。
 *
 * `dangerouslySetInnerHTML` を使うが、JSON.stringify した構造化データを
 * stringifyJsonLd で escape 済みなので XSS リスクはない。
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: stringifyJsonLd(data) }}
    />
  );
}
