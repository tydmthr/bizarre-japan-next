"use client";

import { usePathname } from "next/navigation";
import { Mail, Instagram, ClipboardList } from "@/components/icons";
import { getLangFromPath } from "@/lib/i18n";

const relatedLinks = [
  { href: "https://www.tokyobs.jp/", label: "東京別視点ガイド" },
  { href: "https://omatsurijapan.com/", label: "オマツリジャパン" },
  { href: "https://www.atlasobscura.com/", label: "Atlas Obscura" },
  { href: "https://commons.wikimedia.org/", label: "Wikimedia Commons" },
];

export function SiteFooter() {
  const pathname = usePathname() ?? "/";
  const lang = getLangFromPath(pathname);
  const en = lang === "en";

  return (
    <footer className="border-t border-border bg-surface mt-20">
      <div className="mx-auto max-w-[1120px] px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <p className="eyebrow mb-3">A B O U T</p>
          <h4 className="font-display text-base font-bold text-ink-strong mb-3">
            {en ? "About this site" : "このサイトについて"}
          </h4>
          <p className="text-sm text-ink-mute leading-relaxed">
            {en
              ? "Bizarre Japan is an independent travel guide curating strange spots and wild festivals across Japan as a folk and cultural archive."
              : "異界巡礼は、日本全国の珍スポット・奇祭を、観光案内ではなく民俗・文化のアーカイブとして記録する個人運営のガイドです。"}
          </p>
        </div>

        <div>
          <p className="eyebrow mb-3">S U B M I T</p>
          <h4 className="font-display text-base font-bold text-ink-strong mb-3">
            {en ? "Submit · Contribute" : "情報提供・寄稿"}
          </h4>
          <p className="text-sm text-ink-mute leading-relaxed mb-4">
            {en
              ? "Know a strange place we missed? Witnessed an unforgettable festival? Share your discovery."
              : "あなたの知る奇異な場所、参加した奇祭の体験談を募集しています。"}
          </p>
          <div className="flex flex-col gap-2">
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSeJ-SgIJIZik2GW25T-ChfB95_bdH1LuAzoXqe_5kvGTxKWbg/viewform"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 text-sm text-accent hover:text-accent-hover"
            >
              <ClipboardList size={14} />
              <span>{en ? "Submit via form" : "フォームで送る"}</span>
            </a>
            <a
              href="mailto:bizarrejapan.jp@gmail.com"
              className="inline-flex items-center gap-2 text-sm text-ink-mute hover:text-ink"
            >
              <Mail size={14} />
              <span>bizarrejapan.jp@gmail.com</span>
            </a>
            <a
              href="https://www.instagram.com/bizarre_japan/"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 text-sm text-ink-mute hover:text-ink"
            >
              <Instagram size={14} />
              <span>@bizarre_japan</span>
            </a>
          </div>
        </div>

        <div>
          <p className="eyebrow mb-3">R E L A T E D</p>
          <h4 className="font-display text-base font-bold text-ink-strong mb-3">
            {en ? "Related sites" : "関連サイト"}
          </h4>
          <ul className="space-y-2 text-sm">
            {relatedLinks.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener"
                  className="text-ink-mute hover:text-gold"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto max-w-[1120px] px-6 py-6 text-xs text-ink-mute">
          <p>
            {en
              ? "Bizarre Japan / 異界巡礼 © 2026"
              : "異界巡礼 / Bizarre Japan © 2026"}
            <br />
            <span className="text-ink-faint">
              {en
                ? "Some sites are private property — please respect access restrictions. Do not trespass."
                : "※ 私有地への侵入・心霊スポット夜間立入は厳に慎まれたし。"}
              <br />
              {en
                ? "Image credits: Wikimedia Commons and individual sources noted per item."
                : "画像出典：Wikimedia Commons ほか各クレジット表記参照。"}
            </span>
          </p>
        </div>
      </div>

      {/* モバイルボトムタブ分の逃げ（fixed バーにコピーライトが隠れないように） */}
      <div
        aria-hidden
        className="h-[calc(3.5rem+env(safe-area-inset-bottom))] md:hidden"
      />
    </footer>
  );
}
