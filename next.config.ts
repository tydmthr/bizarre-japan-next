import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // bizarrejapan.com は GitHub Pages 静的ホスティング前提。
  // SSG (Static Export) で out/ にHTMLを書き出す。
  output: "export",

  // SSG では next/image のデフォルトloaderが使えない。
  // 現状 next/image は未使用、すべて <img> 直書きだが、念のため。
  images: {
    unoptimized: true,
  },

  // 末尾スラッシュ：旧サイト bizarrejapan.com は無し運用なので false。
  trailingSlash: false,
};

export default nextConfig;
