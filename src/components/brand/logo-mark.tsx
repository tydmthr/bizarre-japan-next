/**
 * Bizarre Japan ロゴマーク（非対称富士）
 * 正本 `04_asym-fuji_full_color_2048.png` を輪郭トレースしてSVG化（IoU 98.5%）。
 * 山＝テーマ連動（light:墨 / dark:白抜き）、三角＝朱固定。
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="124 141 288 233"
      className={className}
      aria-label="Bizarre Japan ロゴマーク"
      role="img"
    >
      <path
        d="M 208 145 L 408 370 L 128 370 L 178 220 L 192 230 L 211 205 L 230 230 L 256 217 Z"
        fill="var(--ink-strong)"
      />
      <path
        d="M 307 257 L 344 332 L 269 332 Z"
        fill="var(--color-shu-500)"
      />
    </svg>
  );
}
