# Bizarre Japan ／ Design Tokens

最終更新: 2026-06-02
ステータス: **初稿 v0.1（色路線A + タイポT2 確定）**
親文書: [design-system.md](./design-system.md)

このドキュメントは Tailwind CSS v4 の `@theme` ブロックにそのままコピペできる形式で全トークンを定義する。値の根拠は親文書を参照。

---

## 0. 採用路線（決定）

| 軸 | 採用 | 補足 |
|---|---|---|
| 色路線 | **A. 墨×朱×鈍金** | 旧サイトのDNAを継ぎつつ彩度を落とした「静かな考古学的アーカイブ」 |
| タイポ路線 | **T2. 明朝×ゴシック使い分け** | 見出し明朝（Shippori Mincho B1）／本文ゴシック（Noto Sans JP）／英文見出し Cinzel／英文本文 Inter |
| アクセント主役 | 朱 1色 | 金は装飾・ブランド・区切りのみ |
| 命名思想 | セマンティック優先 | コード側では `--shu-500` を直接使わず `--accent` を使う |

---

## 1. 色トークン（OKLCH）

### 1.1 原始トーン（プリミティブ）

色番号は 50（最も明）〜 950（最も暗）の 11 段階。Light/Dark 共通の素材として持つ。コード側では原則ここを直接呼ばず、後段のセマンティックトークン経由で使う。

```css
/* 墨（sumi）— 茶味のある黒。bg/ink 系のベース */
--sumi-50:  oklch(0.97 0.008 80);
--sumi-100: oklch(0.94 0.012 80);
--sumi-200: oklch(0.88 0.014 78);
--sumi-300: oklch(0.78 0.014 76);
--sumi-400: oklch(0.62 0.014 60);
--sumi-500: oklch(0.45 0.012 50);
--sumi-600: oklch(0.34 0.012 40);
--sumi-700: oklch(0.26 0.012 38);
--sumi-800: oklch(0.20 0.010 36);
--sumi-900: oklch(0.15 0.010 35);
--sumi-950: oklch(0.10 0.008 35);

/* 朱（shu）— 彩度を落とした朱印朱 */
--shu-50:  oklch(0.96 0.020 30);
--shu-100: oklch(0.92 0.045 30);
--shu-200: oklch(0.85 0.085 30);
--shu-300: oklch(0.75 0.130 30);
--shu-400: oklch(0.65 0.155 30);
--shu-500: oklch(0.55 0.170 28);   /* キーカラー（朱の基準） */
--shu-600: oklch(0.48 0.165 26);
--shu-700: oklch(0.40 0.150 24);
--shu-800: oklch(0.32 0.120 22);
--shu-900: oklch(0.24 0.090 22);
--shu-950: oklch(0.18 0.070 22);

/* 鈍金（kin）— 古びた金、燻し金 */
--kin-50:  oklch(0.97 0.015 82);
--kin-100: oklch(0.93 0.030 82);
--kin-200: oklch(0.88 0.055 82);
--kin-300: oklch(0.81 0.078 82);
--kin-400: oklch(0.74 0.092 82);
--kin-500: oklch(0.68 0.095 82);   /* キーカラー（鈍金の基準） */
--kin-600: oklch(0.58 0.090 80);
--kin-700: oklch(0.48 0.080 78);
--kin-800: oklch(0.38 0.065 76);
--kin-900: oklch(0.28 0.050 76);
--kin-950: oklch(0.20 0.038 76);
```

### 1.2 セマンティックトークン（実コードはここを使う）

#### Light モード（朝の襖）

```css
--bg:           var(--sumi-50);     /* 背景：古紙 */
--bg-raised:    var(--sumi-100);    /* 一段上がった面（カード等） */
--surface:      var(--sumi-100);
--surface-mute: var(--sumi-200);

--ink:          var(--sumi-900);    /* 本文 */
--ink-strong:   var(--sumi-950);    /* 見出し */
--ink-mute:     var(--sumi-600);    /* 補足・キャプション */
--ink-faint:    var(--sumi-400);    /* 区切り・無効状態 */

--accent:        var(--shu-500);    /* 朱・主CTA */
--accent-hover:  var(--shu-600);
--accent-mute:   var(--shu-200);    /* 朱のうすめ・帯背景 */
--on-accent:     var(--sumi-50);    /* 朱の上に置く文字色 */

--gold:          var(--kin-600);    /* 鈍金・ブランド/区切り */
--gold-mute:     var(--kin-300);    /* 鈍金のうすめ */

--border:        var(--sumi-300);
--border-strong: var(--sumi-500);
--ring:          var(--shu-400);    /* フォーカスリング */
--danger:        var(--shu-700);
```

#### Dark モード（夜の和紙）

```css
--bg:           var(--sumi-900);    /* 夜墨 */
--bg-raised:    var(--sumi-800);
--surface:      var(--sumi-800);
--surface-mute: var(--sumi-700);

--ink:          var(--sumi-100);
--ink-strong:   var(--sumi-50);
--ink-mute:     var(--sumi-300);
--ink-faint:    var(--sumi-500);

--accent:        var(--shu-400);    /* dark では一段明るく */
--accent-hover:  var(--shu-300);
--accent-mute:   var(--shu-900);
--on-accent:     var(--sumi-50);

--gold:          var(--kin-400);
--gold-mute:     var(--kin-700);

--border:        var(--sumi-700);
--border-strong: var(--sumi-500);
--ring:          var(--shu-300);
--danger:        var(--shu-400);
```

### 1.3 カテゴリトークン（spots/festivals 用、tone 軸と直結）

```css
--cat-folk:    var(--shu-500);      /* 土俗・奇祭：朱 */
--cat-bkyu:    oklch(0.50 0.080 145); /* B級：苔（ニュートラル寄り） */
--cat-horror:  oklch(0.40 0.060 250); /* 心霊・廃墟：藍 */
--cat-mystery: var(--kin-600);      /* 聖地・ミステリー：鈍金 */
```

---

## 2. タイポグラフィ

### 2.1 フォントファミリ

```css
--font-display: "Shippori Mincho B1", "Noto Serif JP", "Hiragino Mincho ProN", serif;
--font-sans:    "Noto Sans JP", "Hiragino Sans", system-ui, sans-serif;
--font-en-display: "Cinzel", "Shippori Mincho B1", serif;
--font-en-sans: "Inter", "Noto Sans JP", system-ui, sans-serif;
--font-mono:    "JetBrains Mono", "Noto Sans Mono", ui-monospace, monospace;
```

**配信**: `next/font/google` で local 化（外部 CDN 依存をやめる）。`display: swap`、`preload: true`。

### 2.2 スケール（rem ベース、本文 16px = 1rem）

| トークン | サイズ | 用途 |
|---|---|---|
| `text-xs` | 0.75rem (12px) | キャプション、帯記号、メタ |
| `text-sm` | 0.875rem (14px) | UI、補助テキスト |
| `text-base` | 1.0rem (16px) | 本文 |
| `text-lg` | 1.125rem (18px) | 強調本文、リード文 |
| `text-xl` | 1.25rem (20px) | 小見出し |
| `text-2xl` | 1.5rem (24px) | カード見出し |
| `text-3xl` | 1.875rem (30px) | セクション見出し |
| `text-4xl` | 2.25rem (36px) | ページ見出し |
| `text-5xl` | 3.0rem (48px) | ヒーロー中 |
| `text-6xl` | 3.75rem (60px) | ヒーロー大 |
| `text-display` | `clamp(2.5rem, 6vw, 5rem)` | ブランド大字（明朝） |

### 2.3 行間（leading）

| トークン | 値 | 用途 |
|---|---|---|
| `leading-tight` | 1.25 | 大見出し（明朝） |
| `leading-snug` | 1.4 | 中見出し |
| `leading-normal` | 1.6 | 短文 |
| `leading-relaxed` | 1.75 | UI 内文 |
| `leading-loose` | 1.9 | 本文長文（**標準**） |

### 2.4 字間（tracking）

| トークン | 値 | 用途 |
|---|---|---|
| `tracking-tight` | -0.01em | 英文大見出し |
| `tracking-normal` | 0 | 本文 |
| `tracking-wide` | 0.02em | UI |
| `tracking-wider` | 0.05em | 和文見出し（**標準**） |
| `tracking-widest` | 0.20em | 帯ラベル・eyebrow（明朝） |

### 2.5 用途別マッピング

```css
/* ヒーロー大字 */
.h-hero { font-family: var(--font-display); font-size: var(--text-display);
          line-height: 1.25; letter-spacing: 0.05em; font-weight: 800; }

/* セクション見出し */
.h-section { font-family: var(--font-display); font-size: 1.875rem;
             line-height: 1.3; letter-spacing: 0.05em; font-weight: 700; }

/* カード見出し */
.h-card { font-family: var(--font-display); font-size: 1.5rem;
          line-height: 1.4; letter-spacing: 0.03em; font-weight: 600; }

/* 本文 */
.body { font-family: var(--font-sans); font-size: 1rem;
        line-height: 1.9; letter-spacing: 0.02em; font-weight: 400; }

/* UI（ボタン・タブ） */
.ui { font-family: var(--font-sans); font-size: 0.875rem;
      line-height: 1.4; letter-spacing: 0.05em; font-weight: 500; }

/* eyebrow（明朝、帯、超wide） */
.eyebrow { font-family: var(--font-display); font-size: 0.75rem;
           line-height: 1.2; letter-spacing: 0.4em; font-weight: 600;
           text-transform: none; color: var(--gold); }
```

---

## 3. スペーシング

### 3.1 ベーススケール

Tailwind v4 デフォルト（4px 基準）を踏襲。`p-1`=4px、`p-2`=8px、`p-3`=12px、`p-4`=16px、`p-6`=24px、`p-8`=32px、`p-12`=48px、`p-16`=64px、`p-20`=80px、`p-24`=96px、`p-32`=128px。

### 3.2 用途別の標準

| 用途 | 推奨 | 備考 |
|---|---|---|
| セクション縦余白（標準） | `py-20`（80px） | デスクトップ |
| セクション縦余白（モバイル） | `py-12`（48px） | |
| セクション縦余白（密） | `py-12`〜`py-16` | FAQ 等 |
| ページ左右マージン（モバイル） | `px-4`（16px） | |
| ページ左右マージン（PC） | `px-8`（32px） or コンテナ幅制御 | |
| カード内パディング | `p-6`（24px） | |
| ボタン内パディング | `px-6 py-3`（横24 縦12） | size=md |
| 段落間（本文） | `mb-6` | 行間との合算で読みやすさ調整 |

### 3.3 コンテナ幅

```css
--container-prose: 65ch;   /* 本文・記事 */
--container-narrow: 720px; /* 単独LP のヒーロー周辺 */
--container-default: 1120px; /* 通常ページ */
--container-wide: 1280px;  /* 一覧グリッド・地図 */
```

---

## 4. 角丸 / 影 / ボーダー

### 4.1 角丸

| トークン | 値 | 用途 |
|---|---|---|
| `rounded-none` | 0 | 紙の縁、和の角 |
| `rounded-sm` | 4px | ボタン、タグ（**標準**） |
| `rounded-md` | 8px | 入力欄 |
| `rounded-lg` | 12px | カード（**標準**） |
| `rounded-xl` | 16px | ヒーロー画像枠 |
| `rounded-full` | 9999px | ピル状チップのみ |

「丸さは控えめに」。`rounded-2xl` 以上は原則使わない（SaaS 感が出る）。

### 4.2 影

| トークン | 値 | 用途 |
|---|---|---|
| `shadow-none` | none | 標準 |
| `shadow-paper` | `0 1px 2px oklch(0 0 0 / 0.06)` | 和紙が一枚浮く程度 |
| `shadow-card` | `0 2px 8px oklch(0 0 0 / 0.08)` | カード hover |
| `shadow-modal` | `0 12px 32px oklch(0 0 0 / 0.18)` | モーダルのみ |

大きな影は禁止。ガラスモーフィズム禁止。

### 4.3 ボーダー

```css
--border-width: 1px;
--border-color: var(--border);
--border-color-strong: var(--border-strong);
```

ボーダーは原則 1px。和紙の輪郭表現として薄い灰系（金混ぜ）を 1 トーン用意：

```css
--border-paper: oklch(0.82 0.020 80); /* 古紙の輪郭 */
```

---

## 5. ブレイクポイント

Tailwind v4 デフォルト準拠 + 1つ追加：

| 名前 | 幅 | 想定 |
|---|---|---|
| (base) | 0 | iPhone SE 想定 375px |
| `sm` | 640px | 大判スマホ |
| `md` | 768px | タブレット縦 |
| `lg` | 1024px | タブレット横 / 小型PC |
| `xl` | 1280px | デスクトップ |
| `2xl` | 1536px | 大画面 |

設計起点は **375px**。

---

## 6. モーション

```css
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);

--dur-instant: 80ms;
--dur-fast: 160ms;
--dur-base: 240ms;
--dur-slow: 400ms;
```

派手なアニメは禁止。fade / 微 translate / 微 scale のみ。

---

## 7. Tailwind v4 `@theme` 集約版（コピペ用）

実装時、`app/globals.css` に以下をそのまま貼って起点にする：

```css
@import "tailwindcss";

@theme {
  /* === 原始トーン === */
  --color-sumi-50:  oklch(0.97 0.008 80);
  --color-sumi-100: oklch(0.94 0.012 80);
  --color-sumi-200: oklch(0.88 0.014 78);
  --color-sumi-300: oklch(0.78 0.014 76);
  --color-sumi-400: oklch(0.62 0.014 60);
  --color-sumi-500: oklch(0.45 0.012 50);
  --color-sumi-600: oklch(0.34 0.012 40);
  --color-sumi-700: oklch(0.26 0.012 38);
  --color-sumi-800: oklch(0.20 0.010 36);
  --color-sumi-900: oklch(0.15 0.010 35);
  --color-sumi-950: oklch(0.10 0.008 35);

  --color-shu-50:  oklch(0.96 0.020 30);
  --color-shu-100: oklch(0.92 0.045 30);
  --color-shu-200: oklch(0.85 0.085 30);
  --color-shu-300: oklch(0.75 0.130 30);
  --color-shu-400: oklch(0.65 0.155 30);
  --color-shu-500: oklch(0.55 0.170 28);
  --color-shu-600: oklch(0.48 0.165 26);
  --color-shu-700: oklch(0.40 0.150 24);
  --color-shu-800: oklch(0.32 0.120 22);
  --color-shu-900: oklch(0.24 0.090 22);
  --color-shu-950: oklch(0.18 0.070 22);

  --color-kin-50:  oklch(0.97 0.015 82);
  --color-kin-100: oklch(0.93 0.030 82);
  --color-kin-200: oklch(0.88 0.055 82);
  --color-kin-300: oklch(0.81 0.078 82);
  --color-kin-400: oklch(0.74 0.092 82);
  --color-kin-500: oklch(0.68 0.095 82);
  --color-kin-600: oklch(0.58 0.090 80);
  --color-kin-700: oklch(0.48 0.080 78);
  --color-kin-800: oklch(0.38 0.065 76);
  --color-kin-900: oklch(0.28 0.050 76);
  --color-kin-950: oklch(0.20 0.038 76);

  /* === フォント === */
  --font-display: "Shippori Mincho B1", "Noto Serif JP", "Hiragino Mincho ProN", serif;
  --font-sans:    "Noto Sans JP", "Hiragino Sans", system-ui, sans-serif;
  --font-en-display: "Cinzel", "Shippori Mincho B1", serif;
  --font-en-sans: "Inter", "Noto Sans JP", system-ui, sans-serif;
  --font-mono:    "JetBrains Mono", "Noto Sans Mono", ui-monospace, monospace;

  /* === 影 === */
  --shadow-paper: 0 1px 2px oklch(0 0 0 / 0.06);
  --shadow-card:  0 2px 8px oklch(0 0 0 / 0.08);
  --shadow-modal: 0 12px 32px oklch(0 0 0 / 0.18);

  /* === モーション === */
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
}

/* === Light モード（朝の襖） === */
:root {
  --bg: var(--color-sumi-50);
  --bg-raised: var(--color-sumi-100);
  --surface: var(--color-sumi-100);
  --surface-mute: var(--color-sumi-200);
  --ink: var(--color-sumi-900);
  --ink-strong: var(--color-sumi-950);
  --ink-mute: var(--color-sumi-600);
  --ink-faint: var(--color-sumi-400);
  --accent: var(--color-shu-500);
  --accent-hover: var(--color-shu-600);
  --accent-mute: var(--color-shu-200);
  --on-accent: var(--color-sumi-50);
  --gold: var(--color-kin-600);
  --gold-mute: var(--color-kin-300);
  --border: var(--color-sumi-300);
  --border-strong: var(--color-sumi-500);
  --border-paper: oklch(0.82 0.020 80);
  --ring: var(--color-shu-400);
  --danger: var(--color-shu-700);
}

/* === Dark モード（夜の和紙） === */
[data-theme="dark"] {
  --bg: var(--color-sumi-900);
  --bg-raised: var(--color-sumi-800);
  --surface: var(--color-sumi-800);
  --surface-mute: var(--color-sumi-700);
  --ink: var(--color-sumi-100);
  --ink-strong: var(--color-sumi-50);
  --ink-mute: var(--color-sumi-300);
  --ink-faint: var(--color-sumi-500);
  --accent: var(--color-shu-400);
  --accent-hover: var(--color-shu-300);
  --accent-mute: var(--color-shu-900);
  --on-accent: var(--color-sumi-50);
  --gold: var(--color-kin-400);
  --gold-mute: var(--color-kin-700);
  --border: var(--color-sumi-700);
  --border-strong: var(--color-sumi-500);
  --border-paper: oklch(0.30 0.015 35);
  --ring: var(--color-shu-300);
  --danger: var(--color-shu-400);
}
```

---

## 8. 未確定（次回以降）

- [ ] `next/font/google` での Cinzel / DM Serif Display 比較サンプル（実装フェーズ Day1 で見比べる）
- [ ] B級カテゴリの苔色の最終値（ニュートラル寄せか、もう少し緑寄せか）
- [ ] 画像出力時の OG 用カラー（朱の彩度はそのままで OK か）
- [ ] Pencil MCP 連携用の JSON 形式トークン（同じ値を Design Token Community 標準形式でも提供）

