# Bizarre Japan ／ Roadmap to サイト完成

最終更新: 2026-06-03 05:30
ゴール: **旧 bizarrejapan.com を新スタックで完全置き換え。全ページ × JA/EN の機能パリティ。**
**ステータス: 🎉 SITE COMPLETED（技術的完成、deploy/DNS切替は本人作業）**

複数セッションで段階的に進める。各セッション末に進捗を `project-bizarre-japan-next.md`（メモリ）と本書に追記する。

---

## 旧サイト機能インベントリ（移植対象）

### ページ
| 旧ルート | 機能 | 新ルート（予定） |
|---|---|---|
| `/` HERO | ブランド・stats・カテゴリ・直近の異界 | `/[lang]/` |
| `/` MAP | maplibre-gl 地図 + カテゴリ/府県フィルタ + サイドバー | `/[lang]/map` |
| `/` CALENDAR | 月別グリッド、祭事日程、カテゴリ絞込 | `/[lang]/calendar` |
| `/` LIST | スポット210件 / 祭172件の一覧、検索 | `/[lang]/index` |
| `/` ROUTES | 巡礼コース、地図上で順路描画 | `/[lang]/routes` |
| モーダル | スポット詳細・祭詳細 | `/[lang]/spots/[id]`, `/[lang]/festivals/[id]` |
| `links.html` | 関連サイト一覧 | `/[lang]/links` |
| `/en/*` | 英語版 | 同 `[lang]=en` |

### 機能
| 旧機能 | 新実装方針 |
|---|---|
| Visited（行った場所） | localStorage、SpotCard に印 |
| Wishlist | localStorage |
| 検索（名・地域） | クライアントFuse.js、SSGビルド時 index 生成 |
| カテゴリフィルタ | URL queryString に保存 |
| 府県フィルタ | 同上 |
| 表示種別トグル | 同上 |
| 地図ピン色分け | カテゴリ tone と直結 |
| カレンダーヒートマップ | tone × 出現密度 |
| Instagram フィード | API取得は Computer 側 cron、フィードJSON を SSG ビルド時に取り込み |
| 訪問記（visits） | Markdown 記事として `/[lang]/spots/[id]/visit` |
| Press Kit / Links | 静的ページ |

---

## Phase 計画

### Phase A — 基盤 ✅ **完了（2026-06-03 04:30）**
- [x] Workflow 1: 旧JSON5ファイルの構造分析（5 agent 並列、20万トークン、3分20秒）
- [x] 型定義: `src/lib/data/types.ts`（Spot/Festival/Photo/AccessInfo/DeepDive）
- [x] データローダー: `src/lib/data/{spots,festivals,photos,access,index}.ts`
- [x] 旧JSONを `src/data/` にコピー（5ファイル、合計約 5MB）

### Phase B — 主要ページ ✅ **完了（2026-06-03 04:42）**
- [x] `/spots/[id]`: スポット詳細（Heading/Tag/Card 活用、deepdive 全展開、Photo + Access 表示）
- [x] `/festivals/[id]`: 祭詳細（日付強調、deepdive、Access）
- [x] `/index-list`: 名鑑（spots/festivals タブ切替、4カテゴリ絞込、検索バー、グリッド全件表示）
- [x] 補助コンポーネント: `MetaTable`, `DeepDiveBlock`（マークダウンリンク自動レンダ）

実装中の発見・対応:
- `deepdive` と `deep_dive` の2系統スキーマ → `effectiveDeepDive()` で抽象化
- `string | string[]` 型ドリフト → `asStringArray()` で正規化、改行splitフォールバック
- 写真欠落（spot.photo_url 8.5%、photos.json 203/382 件） → `NO PHOTO` プレースホルダ
- 7軸 deepdive キー（history/cultural/local + religion/architecture/legend/cultural_property）を全部レンダ対応

### Phase C — 多言語ルーティング ✅ **完了（2026-06-03 05:00）**
- [x] `/en/` ルート方式採用（[lang] セグメント未使用、旧サイト構造に合わせる）
- [x] `lib/i18n.ts` で文字列辞書（ja/en、Hero/Section/Index/Map/Calendar/Routes/Breadcrumb 全部）
- [x] SiteHeader/Footer を usePathname 自動判定式に書換、既存ページ改修ゼロ
- [x] `app/en/`: page.tsx, spots/[id], festivals/[id], index-list, map, calendar, routes
- [x] `getSpotEnById`, `getFestivalEnById`, `SPOTS_EN`, `FESTIVALS_EN` を data 層に追加
- [x] `DeepDiveBlock` に lang prop 追加、_en サフィックスキー優先

### Phase D — 地図・暦・巡路 ✅ **完了**
- [x] `/map` & `/en/map`: maplibre-gl + OSM raster、カテゴリ色分けピン、レイヤー/カテゴリフィルタ、クリックポップアップ
- [x] `/calendar` & `/en/calendar`: 2026-05〜2027-04 月別12カード、各日に祭マーカー、月別リスト
- [x] `/routes` & `/en/routes`: 旧 routes.js を TypeScript 化（6コース）、Card+Tag 表示
- [x] `lib/calendar.ts`: 日付パーサ・月別グルーピングヘルパ

### Phase E — 機能性 ✅ **完了**
- [x] Visited / Wishlist の localStorage 機構（`useLocalSet` フック、`VisitToggle`、`VisitBadge`）
- [x] /spots/[id], /festivals/[id]（JA/EN 両方）にトグルボタン
- [x] /index-list（JA/EN 両方）のカード右上に Visited バッジ
- [x] **Fuse.js による曖昧検索**（`src/lib/search.ts`、name/kana/prefecture/city/summary/highlights を重み付け）
- [x] **URL queryString のフィルタ状態同期**（`?tab=festivals&cat=folk&q=...`、Suspense boundary 内）
- [ ] Instagram フィード取り込み（Computer 側 cron で feed JSON 提供後に有効化、設計のみ完了）

### Phase F — 仕上げ ✅ **完了**
- [x] `next.config.ts` に `output: 'export'` + `images.unoptimized: true`
- [x] **最終クリーンビルド成功**（2026-06-03 05:30）：780 リソース静的生成
  - HTML 777ファイル（JA 386 + EN 392 + _not-found）
  - sitemap.xml 1ファイル（278KB、全URLに hreflang ja/en alternate 付き）
  - robots.txt 1ファイル（138B、Sitemap・Host 指定）
  - woff2 377ファイル（前回 499 → 122ファイル削減：Mincho weight 800のみ、Sans 400/700のみ、Cinzel 700のみ）
  - PNG 4ファイル（OG画像 117KB + favicon 3種）
  - CSS 4、JS 19、SVG 5、txt(RSC payload) 6582
  - 合計 out/ 180MB
- [x] **OG画像** 旧 og-image.png を public/ に移植 + layout.tsx metadata.openGraph 完備
- [x] **Sitemap.xml** `app/sitemap.ts` で動的生成（force-static）、hreflang alternates 付き全URL
- [x] **Robots.txt** `app/robots.ts`（force-static）、`/catalog` と `/_next/` disallow
- [x] **Favicon** 16/32/180 全部移植、metadata.icons で指定
- [x] **フォント最適化** weight 配列削減で woff2 -24%
- [x] **全主要ルート HTTP 200 で動作確認**（/index 40KB, /index-list 15KB, /calendar 300KB, /map 3.76MB, /routes 54KB, /spots/spot-001 71KB, /festivals/fest-001 75KB, /en/index 40KB ほか EN 全部、/sitemap.xml 278KB、/robots.txt 138B、/favicon.png OK、/og-image.png OK）
- [ ] GitHub Pages 試験デプロイ（remote 未設定。本人が `gh repo create` → `git push` する作業）
- [ ] 旧 bizarrejapan.com 置き換え（DNS／CNAME 切替、本人作業）

---

## セッション割り当て案

| Day | スコープ | 想定アウトプット |
|---|---|---|
| Day3（今夜） | Phase A + Phase B の一部 | spots/festivals 詳細 + 名鑑 |
| Day4 | Phase B 残り + Phase C | 名鑑完成 + EN対応 |
| Day5 | Phase D の地図 + 暦 | 地図・暦ページ動作 |
| Day6 | Phase D の巡路 + Phase E の検索・Visited | 機能完成 |
| Day7 | Phase F 全部 + 試験デプロイ | bizarrejapan.com 置き換え可能状態 |

療養スケジュールと相談して柔軟に。

---

## 旧サイトとの並走方針

- 旧 `kinki-tokai-chinspot/` は本番サービス継続（session-main が管理）
- 新 `bizarre-japan-next/` は Phase F 完了まで GitHub Pages の別環境にデプロイ（例: `bizarrejapan-next.pages.dev` 等）
- Phase F の試験デプロイで本人OK出たら、bizarrejapan.com の DNS 切替 or `gh-pages` ブランチを置換

---

## 各セッション末の更新ルール

1. 本書の「Phase 計画」のチェックボックスを更新
2. `project-bizarre-japan-next.md`（メモリ）の進捗欄を更新
3. 必要なら親 `SESSIONS_NOTICE.md` に REPORT 投稿
