# デプロイ手順書 — bizarre-japan-next → bizarrejapan.com

最終更新: 2026-06-03 05:30

このドキュメントは、ローカルで完成した `bizarre-japan-next/` を GitHub Pages にデプロイし、旧 `kinki-tokai-chinspot` (bizarrejapan.com) から差し替えるための手順書です。**会長作業**のコマンドコピペ集。

---

## 0. 前提

- `bizarre-japan-next/` で `npm run build` が成功している（778 ページ + sitemap + robots）
- `gh` CLI ログイン済み (`gh auth status` で確認)
- 既存リポ `tydmthr/kinki-tokai-chinspot` が bizarrejapan.com の Custom Domain として稼働中

---

## 1. GitHub に新規リポジトリを作成 → push

```bash
cd "/Users/toyodamotohiro/Documents/Claude/Projects/Bizarre Japan/bizarre-japan-next"

# リポジトリ名は任意。下は推奨例
gh repo create tydmthr/bizarre-japan-next --public --description "Bizarre Japan / 異界巡礼 - Next.js + Tailwind v4" --source=. --remote=origin

# 初回 push（main ブランチ）
git push -u origin main
```

push 完了で `.github/workflows/deploy.yml` が自動起動します。
進捗確認:

```bash
gh run watch
# もしくは ブラウザで
gh repo view --web
```

`Build → Deploy` 両ジョブが ✓ になるまで待つ（合計 3〜5 分）。

---

## 2. GitHub Pages 設定（リポジトリ Settings）

```bash
gh repo view --web   # ブラウザで開く
```

Settings → Pages を開き：

| 項目 | 値 |
|---|---|
| Source | **GitHub Actions** |
| Custom domain | （後で設定。先に build 通すまで空欄） |

最初のデプロイ完了後、`https://tydmthr.github.io/bizarre-japan-next/` に出ます。トップ・名鑑・地図・暦・スポット詳細を一通り目視確認してください。

⚠️ サブパス問題: `tydmthr.github.io/bizarre-japan-next/` だと相対パスが崩れます（`/spots/spot-001` が `/bizarre-japan-next/spots/spot-001` ではない）。これは Custom domain を設定すれば解決します（次ステップ）。確認だけなら気にしなくてOK。

---

## 3. 旧リポ kinki-tokai-chinspot の Custom Domain を外す

bizarrejapan.com は同時に 1リポにしか紐付かないので、旧リポから外す。

```bash
# 旧リポへ移動
cd "/Users/toyodamotohiro/Documents/Claude/Projects/Bizarre Japan/kinki-tokai-chinspot"

# CNAME ファイル削除（同名ドメインが衝突するため）
git rm CNAME
git commit -m "chore: remove CNAME to migrate bizarrejapan.com to bizarre-japan-next"
git push origin main

# GitHub の Pages 設定で Custom domain を外す（手動 or gh CLI）
gh api -X DELETE repos/tydmthr/kinki-tokai-chinspot/pages 2>/dev/null || true
# ↑ Pages 自体を消したくない場合は、ブラウザで Settings → Pages → Custom domain を空にする
```

---

## 4. 新リポに bizarrejapan.com を割り当て

```bash
cd "/Users/toyodamotohiro/Documents/Claude/Projects/Bizarre Japan/bizarre-japan-next"

# public/CNAME は既に bizarrejapan.com になっているので、Settings 側で指定するだけ
gh api -X POST repos/tydmthr/bizarre-japan-next/pages \
  -f source[branch]=main \
  -f source[path]=/ \
  -f cname=bizarrejapan.com 2>/dev/null || true

# もしくはブラウザで:
gh repo view --web
# Settings → Pages → Custom domain = bizarrejapan.com を入力 → Save
# "Enforce HTTPS" にチェック
```

数分〜数十分で DNS が伝播し、`https://bizarrejapan.com/` が新サイトに切り替わります。

---

## 5. 動作確認

```bash
# トップ
curl -sI https://bizarrejapan.com/ | head -5
curl -s https://bizarrejapan.com/ | grep -E "<title>"

# サンプル詳細
curl -sI https://bizarrejapan.com/spots/spot-001 | head -5
curl -sI https://bizarrejapan.com/en/festivals/fest-001 | head -5

# Sitemap
curl -s https://bizarrejapan.com/sitemap.xml | head -10

# Robots
curl -s https://bizarrejapan.com/robots.txt
```

ブラウザでも：
- https://bizarrejapan.com/
- https://bizarrejapan.com/index-list?cat=folk&q=性
- https://bizarrejapan.com/map
- https://bizarrejapan.com/calendar
- https://bizarrejapan.com/en

---

## 6. 旧リポの扱い

選択肢：

### A. 完全引退（推奨）
旧リポ `kinki-tokai-chinspot` を archive して読み取り専用に。

```bash
gh repo edit tydmthr/kinki-tokai-chinspot --archived
```

### B. データ更新用に残す
旧 `spots.json` / `festivals.json` の編集を引き続き旧リポで行い、新リポへは sync スクリプトで取り込む運用。
※ この場合は `bizarre-japan-next/scripts/sync-data.sh` を別途用意する必要あり（次回作業）。

---

## 7. Instagram フィードの有効化（オプション）

Computer 側で feed JSON を生成して `bizarre-japan-next/src/data/ig_feed.json` を上書きすれば、次回 build から HeroIkai 直下に IG ギャラリーが自動表示されます（空配列のときは hidden）。

期待する形式:

```json
[
  {
    "id": "C1234567890",
    "caption": "妙見の岩",
    "permalink": "https://www.instagram.com/p/C1234567890/",
    "media_type": "IMAGE",
    "media_url": "https://scontent.cdninstagram.com/.../image.jpg",
    "thumbnail_url": "https://scontent.cdninstagram.com/.../thumb.jpg",
    "timestamp": "2026-05-30T12:34:56Z"
  }
]
```

旧 `kinki-tokai-chinspot/scripts/fetch_instagram_feed.py` の出力先をこのファイルに向けるだけでOK。

---

## 8. トラブルシュート

### Pages デプロイが失敗する
- Actions タブで該当ワークフローのログ確認: `gh run view --log`
- `npm ci` でロックファイル不整合の場合: `package-lock.json` を commit したか確認

### Custom domain で DNS エラー
- お名前.com 等の DNS 管理画面で、bizarrejapan.com の A レコードが GitHub Pages の IP に向いているか確認:
  ```
  185.199.108.153
  185.199.109.153
  185.199.110.153
  185.199.111.153
  ```
- 既存設定ならそのままでOK（旧リポ kinki-tokai-chinspot で動いていた DNS をそのまま使う）

### "Enforce HTTPS" が押せない
- DNS 伝播後 24h ほどで Let's Encrypt 証明書が自動発行され、押せるようになる
- それまでは HTTP でアクセス可能（自動 redirect されない）

---

## 9. 完了チェックリスト

- [ ] 新リポ `tydmthr/bizarre-japan-next` 作成済み
- [ ] `git push origin main` 完了
- [ ] Actions の Build/Deploy が ✓
- [ ] `tydmthr.github.io/bizarre-japan-next/` で動作確認
- [ ] 旧 `kinki-tokai-chinspot` の CNAME 削除 + push
- [ ] 新リポに Custom domain = bizarrejapan.com 設定
- [ ] DNS 伝播後、`https://bizarrejapan.com/` で新サイト表示
- [ ] "Enforce HTTPS" チェック
- [ ] 旧リポ archived
- [ ] （オプション）Computer 側で ig_feed.json 更新フロー再設定
