# Bizarre Japan ／ Design System 設計書

最終更新: 2026-06-02
ステータス: **draft v0.1（方針合意済み、トークン値は未確定）**

---

## 0. このドキュメントの位置づけ

- 新スタック（Next.js + Tailwind v4 + shadcn/ui）で構築する Bizarre Japan の公式デザインシステムの根本方針。
- 値そのもの（OKLCH 色、フォントサイズ、スペーシング表）は別途 `tokens.md` に切り出す。本書は「何を守るか」「なぜそれを選ぶか」を残す。
- 既存サイト `kinki-tokai-chinspot/`（bizarrejapan.com 現行版）は別系統として温存。本プロジェクトは段階的に置き換える可能性を残しつつ、まずは「LP・特設ページ量産用の独立した基盤」として立ち上げる。

---

## 1. プロダクト位置づけ

| 項目 | 内容 |
|---|---|
| プロダクト名 | Bizarre Japan / 異界巡礼 |
| 目的 | 日本全国の珍スポット・奇祭を、観光案内ではなく**民俗・文化のアーカイブ**として記録・公開する |
| ターゲット読者 | 国内: 民俗・地域文化に関心のある旅好き、写真家、研究者 / 海外: 文化人類学的視点で日本の地方を探索する旅行者 |
| 既存資産 | `spots.json`（219件）/ `festivals.json`（172件相当）/ 写真メタ / アクセス情報 / 訪問記 / Instagram 運用 |
| 主言語 | 日本語（JA）・英語（EN）の二言語 |

---

## 2. スコープ（3フェーズ）

| フェーズ | 内容 | 今回のセッション |
|---|---|---|
| **A. 設計** | デザイントークン・コンポーネント定義・ディレクトリ構成・運用フロー | ◎ 着手 |
| **B. 実装** | Next.js プロジェクト初期化、Tailwind v4 + shadcn/ui 導入、CVA、Storybook 的なコンポーネント一覧ページ | 次回以降 |
| **C. LP 量産** | LP・特設ページ・記事レイアウトを Pencil MCP 経由で量産、A/B バリエーション展開 | フェーズBが終わってから |

---

## 3. 技術スタック決定事項

| 項目 | 採用 | 理由 |
|---|---|---|
| フレームワーク | Next.js（App Router、最新安定版） | LP/MPA/SPA すべて対応可。SSG が標準で強い |
| ビルド出力 | **Static Export（`output: 'export'`）** | 現行 bizarrejapan.com の GitHub Pages 運用を維持するため |
| CSS | Tailwind CSS v4 | `@theme` でトークン定義、OKLCH ネイティブ対応 |
| コンポーネント | shadcn/ui ライク（コピー型、自前管理） | ブラックボックス化を避け、和テイスト改造を前提に |
| Variant 管理 | CVA（class-variance-authority） | Button/Card/Section の variant を一元定義 |
| 言語 | TypeScript（strict） | データ型を spots/festivals まで通したい |
| アイコン | Lucide React 主軸、和系記号は SVG 自作 | Phosphor は重い、和の異字体は手で |
| フォント配信 | `next/font/google` で local 化 | Cinzel等の外部CDN依存をやめる |
| データ層 | 静的 JSON を `import` して SSG 時に展開 | spots/festivals は実質変更が緩いため |
| 国際化 | App Router の `/[lang]/` ルーティング | 既存 `/en/` 構造に整合 |
| デプロイ | GitHub Pages（既存 CNAME 維持）／将来 Cloudflare Pages 移行も視野 | 切替コスト低 |
| Pencil MCP | 未接続。実装フェーズ前に接続必須 | デザインシステム→Pencil 自動描画フローのため |

---

## 4. ディレクトリ構成（予定）

```
bizarre-japan-next/
├── docs/
│   ├── design-system.md        ← 本書
│   ├── tokens.md               ← 値の本体（後日）
│   ├── components.md           ← コンポーネント仕様（後日）
│   └── roadmap.md              ← 実装ロードマップ（後日）
├── app/
│   ├── (marketing)/            ← LP・特設ページ群
│   ├── [lang]/                 ← ja / en
│   │   ├── spots/[id]/
│   │   ├── festivals/[id]/
│   │   ├── map/
│   │   ├── calendar/
│   │   └── routes/
│   └── globals.css             ← Tailwind v4 @theme 宣言
├── components/
│   ├── ui/                     ← shadcn 流の汎用パーツ（Button, Card, Input...）
│   ├── marketing/              ← LP セクション（Hero, FeatureGrid, FAQ...）
│   ├── content/                ← spots/festivals 表示用（SpotCard, FestivalDate...）
│   └── wa/                     ← 和モチーフ専用（SeigaihaPattern, KanjiBackdrop...）
├── lib/
│   ├── data/                   ← spots.json / festivals.json を型付け読み込み
│   ├── cva/                    ← CVA variant 定義
│   └── pencil/                 ← Pencil MCP 連携ユーティリティ
├── public/
│   └── (画像・OG・favicon)
├── content/                    ← 既存 visits/, press-kit など Markdown 資産
└── tailwind.config.ts / next.config.js / tsconfig.json
```

**移植元との対応**:

| 既存 (`kinki-tokai-chinspot/`) | 新 (`bizarre-japan-next/`) |
|---|---|
| `spots.json`, `festivals.json`, `photos.json`, `access_info.json` | `lib/data/` 配下にコピー＋型定義 |
| `data.js`（ビルド成果物） | 廃止。Next.js のビルドプロセスで吸収 |
| `app.js`（1253行モノリス） | `components/` へ機能分解 |
| `style.css`（1928行） | `globals.css` + Tailwind + components スコープ |
| `index.html` / `en/index.html` | `app/[lang]/page.tsx` |
| `routes.js` | `app/[lang]/routes/` |

---

## 5. デザイン原則（5箇条）

### 原則1：和のニュートラルが主、アクセントは1〜2色まで

- ベース：墨・生成り・古紙の中間色階
- アクセント：朱（または藍）を1色 + 金（または銅）を1色 まで
- 「派手な配色＝SaaSの罠」と認識し、明度・彩度の上昇は文化的根拠（朱印・金箔・藍染）のあるところに限定する

### 原則2：静かなトーン、写真が主役

- UI が前に出すぎないこと
- 影・グラデーション・装飾は最小限。ガラスモーフィズム/ネオン禁止
- 写真・図版が貼られたときに UI が一歩引く設計

### 原則3：明朝の品格、ゴシックの可読性

- 大見出し・ブランド表現：和文明朝（Shippori Mincho B1 / Noto Serif JP）
- 本文・UI 表記：和文ゴシック（Noto Sans JP）
- 英文は控えめなセリフ・サンセリフを文脈で使い分け、装飾フォントは限定

### 原則4：モバイル前提、テキストは行間広め

- 設計起点は 375px から
- 本文 line-height は 1.8 を下回らない
- タップ可能要素は最小 44px

### 原則5：再利用可能性 ＞ 一発の派手さ

- LP 量産が前提なので「同じパーツの違う表情」で構成する
- variant は `tone`（neutral / shu / ai / kin）× `density`（compact / default / spacious）の二軸を基本に CVA で型付け
- 一発勝負のオリジナルセクションは増やさない

---

## 6. NG 事項（明文化）

| カテゴリ | NG | 理由 |
|---|---|---|
| 配色 | パープル〜ブルーの派手なグラデ | 典型的 SaaS テンプレ感が強い |
| エフェクト | ガラスモーフィズム、ネオン光、強い発光 | 文化アーカイブの落ち着いたトーンと衝突 |
| 構成 | 丸アイコン3つ並び＋"Easy / Fast / Smart" 系 | 汎用 LP テンプレそのもの |
| コピー | 英語圏 SaaS の直訳トーン（"Discover the magic of..."） | プロダクトの世界観を壊す |
| 画像 | 過剰彩度の強調レタッチ、横スライダー多用 | 静かなトーンと衝突 |
| 装飾 | ホラー寄りの血飛沫・呪文・髑髏モチーフ | 「文化・民俗」のラインを越える |
| タイポ | DotGothic16 等のレトロ装飾フォントの本文採用 | 可読性低下、テンプレ感を招く |

---

## 7. デザイントークン方針

### 色

- **OKLCH ネイティブで定義**。Tailwind v4 `@theme` ブロックに直接書き、CSS 変数として全体に配る。
- スケールは `50 / 100 / 200 / 300 / 400 / 500 / 600 / 700 / 800 / 900 / 950` の 11 段階。
- セマンティックトークンは：`--bg`, `--surface`, `--surface-raised`, `--ink`, `--ink-mute`, `--accent`, `--accent-mute`, `--gold`, `--border`, `--ring`, `--danger`。
- light / dark の二系統。dark を「夜の和紙」、light を「朝の襖」と仮称（呼び名は後で）。

### タイポ

- **和文見出し**: Shippori Mincho B1（weight 500 / 700 / 800）
- **和文本文**: Noto Sans JP（weight 400 / 500 / 700）
- **英文見出し**: Cinzel または DM Serif Display（候補2点を比較）
- **英文本文**: Inter（weight 400 / 500 / 600）
- **数字・タブ**: Noto Sans JP の `tabular-nums` を強制
- スケール（rem 基準、本文 16px = 1rem 基準）:
  - `text-xs` 0.75 / `text-sm` 0.875 / `text-base` 1.0 / `text-lg` 1.125 / `text-xl` 1.25 / `text-2xl` 1.5 / `text-3xl` 1.875 / `text-4xl` 2.25 / `text-5xl` 3.0 / `text-6xl` 3.75
- 行間: 本文 `leading-loose`（1.8）、見出し `leading-tight`（1.25）
- 字間: 和文見出しは `tracking-wider`（0.05em）を基本

### スペーシング

- Tailwind v4 デフォルト（4px 基準）を踏襲。
- セクション縦余白の標準は `py-20`（80px）／密度高めは `py-12`（48px）。
- グリッドのマージン：モバイル 16px、デスクトップ 32px。

### 角丸 / 影 / ボーダー

- 角丸は `rounded-sm`（4px）と `rounded-lg`（12px）を主に。`rounded-full` はピル状チップのみ。
- 影は `shadow-sm` まで。大きな影は禁止。
- ボーダーは 1px が基本、和紙の輪郭表現として薄い灰系（金混ぜ）を 1 トーン用意する。

---

## 8. コンポーネント方針

### shadcn/ui を「下地」として導入

- `npx shadcn@latest add` で取得したコンポーネントを `components/ui/` 配下に**コピーとして**置く。改造前提。
- 取得直後にプロジェクトのトークンに置き換える（Tailwind の色クラスを直接書かず、`bg-accent` 等のセマンティックトークン名で記述する）。

### CVA variant 命名規則

```ts
const buttonVariants = cva("base classes...", {
  variants: {
    tone: { neutral: "...", shu: "...", ai: "...", kin: "..." },
    size: { sm: "...", md: "...", lg: "..." },
    density: { compact: "...", default: "...", spacious: "..." },
  },
  defaultVariants: { tone: "neutral", size: "md", density: "default" },
});
```

- `tone` は意味、`size` は寸法、`density` は余白。3軸固定。
- 新しい variant を増やすときは「他の variant の組み合わせで代替できないか」を必ず確認。

### 最初に作るコンポーネント（フェーズB Day1 目標）

1. `Button`（tone × size × density）
2. `Card`（tone × density、画像スロット付き）
3. `Section`（hero / feature / split / quote / faq）
4. `Heading` / `BodyText`（タイポトークンを意味化したラッパ）
5. `Tag` / `Badge`（カテゴリ表示用、tone と連動）
6. `SiteHeader` / `SiteFooter`（既存サイトの構造を引き継ぐが、トーンを差し替え）

### 和モチーフコンポーネント（独立ディレクトリ）

- `components/wa/SeigaihaPattern.tsx` … 青海波パターン（既存 SVG defs を流用）
- `components/wa/KanjiBackdrop.tsx` … 大字背景（鬼神異怪祟祓呪霊祠荒 等）
- `components/wa/SealStamp.tsx` … 朱印風の角印
- これらは「主役」ではなく「効きどころに1個だけ」運用。

---

## 9. Pencil MCP 連携運用

**前提**: 現状 Pencil MCP は **未接続**。フェーズ B 着手前に接続が必要。

接続後の標準フロー：

1. **Design System → Pencil**: トークンとコンポーネント一覧を Pencil キャンバスへ自動展開（master キャンバス）
2. **画面設計 → Pencil**: 会長指示で LP/ページの画面案を Pencil 上で生成
3. **Pencil → React/Tailwind**: 確定した画面案を React + Tailwind コードに変換、`app/(marketing)/` か `components/marketing/` 配下に配置
4. **コード変更 → Pencil 同期**: 実装で起きた変更を Pencil 側へ反映（手動 or 自動）

会長から「LP1本作りたい」「このセクション直したい」と依頼があった場合の応答テンプレ：

```
1. デザインシステムでの該当パーツ確認（既存か新規か）
2. Pencil 上で画面案生成（必要に応じて2-3案）
3. 確定案を React + Tailwind コードへ変換
4. 既存ページに組込／新規ルートとして配置
```

---

## 10. 実装ロードマップ（暫定）

| Week | やること | 想定アウトプット |
|---|---|---|
| 今週（6/2 週） | 設計書ドラフト確定、トークン値（色・タイポ）確定 | `design-system.md` 確定版、`tokens.md` 初稿 |
| 翌週 | Next.js 初期化、Tailwind v4 セットアップ、shadcn/ui 導入、`@theme` で全トークン宣言 | 動くプロジェクト、空のルート |
| 翌々週 | コンポーネント Day1（Button / Card / Section / Heading / Tag） | コンポーネント一覧ページ |
| 月末 | LP 1本目（プロジェクト紹介 or 特定スポット deepdive 用テンプレ） | 公開可能な LP 1本 |

療養スケジュール（扁桃除去再入院予定）に応じて柔軟に調整する。

---

## 11. 用語集

| 用語 | 定義 |
|---|---|
| トークン | デザインの最小単位（色1つ、サイズ1つなど）。コードでは CSS 変数 or Tailwind クラス名として参照される |
| セマンティックトークン | 用途で命名されたトークン（例：`--bg`, `--accent`）。原始の色番号（`--shu-500`）を直接使わず、こちらを使う |
| variant | 同じコンポーネントの違う表情。CVA で型付け |
| tone | variant 軸の1つ。意味の色味（neutral / shu / ai / kin） |
| density | variant 軸の1つ。余白の量（compact / default / spacious） |
| 和モチーフコンポーネント | `components/wa/` 配下。装飾用、主役ではない |

---

## 本セッションでの決定（2026-06-02）

- [x] **色路線** → 案A「墨×朱×鈍金」採用。値は [`tokens.md §1`](./tokens.md) に確定済み。
- [x] **タイポ路線** → T2「明朝×ゴシック使い分け」採用。Shippori Mincho B1 / Noto Sans JP / Cinzel / Inter。値は [`tokens.md §2`](./tokens.md) に確定済み。
- [x] **light / dark の呼び名** → 「朝の襖（Light）／夜の和紙（Dark）」を正式採用。
- [x] **アクセント主役** → 朱1色＋金は装飾・ブランド・区切りに限定。
- [x] **スコープ確定** → 既存 `kinki-tokai-chinspot/` は温存、新規 `bizarre-japan-next/` を立てる。SSG 出力で `bizarrejapan.com` 既存運用を引き継ぐ。

## 次セッション以降のアクション

- [ ] **Pencil MCP 接続作業** — フェーズB前に必須（Claude.ai のカスタムコネクタ or CLI 設定での追加）
- [ ] **Cinzel / DM Serif Display の最終比較** — 実装フェーズ Day1 で `next/font/google` 経由のサンプルを並べて見る
- [ ] **B級カテゴリの苔色の最終値** — ニュートラル寄せか、もう少し緑寄せか
- [ ] **Next.js プロジェクト初期化** — Tailwind v4 セットアップ、shadcn/ui 導入、`@theme` で全トークン宣言
- [ ] **コンポーネント Day1** — Button / Card / Section / Heading / Tag を `components/ui/` に実装、Storybook 的なカタログページに集約
