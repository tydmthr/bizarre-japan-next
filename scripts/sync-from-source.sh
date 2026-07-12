#!/usr/bin/env bash
#
# sync-from-source.sh
# -------------------
# 旧リポ kinki-tokai-chinspot（データソース）から新サイト bizarre-japan-next
# にデータを取り込むスクリプト。
#
# 旧リポは 2026-06-07 から「データソース専用」になり、JSON / 写真 / 許諾フロー /
# IG feed の編集は引き続き旧リポで行う運用。表示は新リポ（このリポ）で行う。
#
# 使い方（bizarre-japan-next/ のルートで実行）:
#   ./scripts/sync-from-source.sh
#
# 前提:
#   - 親フォルダに kinki-tokai-chinspot/ がチェックアウトされていること
#     つまり ~/.../Bizarre Japan/kinki-tokai-chinspot/ と
#         ~/.../Bizarre Japan/bizarre-japan-next/ が並んでいる
#   - jq がインストールされていること
#
# 動作:
#   1. 旧リポを git pull --ff-only origin main で最新化
#   2. 主要 JSON 6種を src/data/ にコピー
#   4. git diff src/data/ を表示（最後にユーザーが確認・コミット）
#
# このスクリプトは何も commit しない。差分を見て手動で git add → commit してください。
#

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC_REPO="$(cd "$REPO_ROOT/.." && pwd)/kinki-tokai-chinspot"

if [ ! -d "$SRC_REPO" ]; then
  echo "ERROR: source repo not found at: $SRC_REPO" >&2
  echo "  Expected layout:" >&2
  echo "    $(dirname "$SRC_REPO")/kinki-tokai-chinspot/" >&2
  echo "    $(dirname "$SRC_REPO")/bizarre-japan-next/" >&2
  exit 1
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "ERROR: jq not installed. brew install jq" >&2
  exit 1
fi

echo "→ Pulling latest from source repo..."
(cd "$SRC_REPO" && git pull --ff-only origin main)

DEST="$REPO_ROOT/src/data"
mkdir -p "$DEST"

echo
echo "→ Copying main JSON files..."
for f in spots.json festivals.json spots_en.json festivals_en.json photos.json access_info.json; do
  if [ -f "$SRC_REPO/$f" ]; then
    cp "$SRC_REPO/$f" "$DEST/$f"
    echo "  ✓ $f"
  else
    echo "  ⚠ $f not found in source (skipped)"
  fi
done


echo
echo "→ Done. Review changes with:"
echo "    git -C \"$REPO_ROOT\" diff --stat src/data/"
echo
echo "→ Then commit (suggested):"
echo "    git -C \"$REPO_ROOT\" add src/data/"
echo "    git -C \"$REPO_ROOT\" commit -m \"chore(data): sync from kinki-tokai-chinspot\""
echo "    git -C \"$REPO_ROOT\" push origin main"
