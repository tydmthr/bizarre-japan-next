"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Languages,
  Map,
  Calendar,
  ListMagnifyingGlass,
  House,
  Path,
} from "@/components/icons";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";
import { getLangFromPath, langPrefix, altLangHref, dict } from "@/lib/i18n";

export function SiteHeader() {
  const pathname = usePathname() ?? "/";
  const lang = getLangFromPath(pathname);
  const t = dict(lang);
  const prefix = langPrefix(lang);

  const tabs = [
    { href: `${prefix}/`, label: t.nav.home, icon: House },
    { href: `${prefix}/map`, label: t.nav.map, icon: Map },
    { href: `${prefix}/calendar`, label: t.nav.calendar, icon: Calendar },
    {
      href: `${prefix}/index-list`,
      label: t.nav.list,
      icon: ListMagnifyingGlass,
    },
    { href: `${prefix}/routes`, label: t.nav.routes, icon: Path },
  ].map((tab) => ({
    ...tab,
    // normalize trailing-slash homepage
    href: tab.href === "" ? "/" : tab.href,
  }));

  const homePath = lang === "en" ? "/en" : "/";

  return (
    <header className="sticky top-0 z-40 h-16 bg-bg/85 backdrop-blur-md border-b border-border">
      <div className="mx-auto max-w-[1280px] h-full px-6 flex items-center gap-6">
        {/* Brand */}
        <Link
          href={homePath}
          className="flex items-center gap-3 text-gold shrink-0"
        >
          <svg
            viewBox="0 0 60 60"
            className="w-9 h-9"
            aria-label="異界巡礼ロゴ"
          >
            <circle cx="30" cy="30" r="27" fill="none" stroke="currentColor" strokeWidth="1.2" />
            <circle cx="30" cy="30" r="20" fill="none" stroke="currentColor" strokeWidth="0.8" />
            <path d="M 30 8 L 30 52 M 8 30 L 52 30" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
            <text
              x="30"
              y="38"
              textAnchor="middle"
              fontFamily="var(--font-display)"
              fontSize="20"
              fontWeight="800"
              fill="currentColor"
            >
              鬼
            </text>
          </svg>
          <div className="leading-tight">
            <p className="font-display text-[15px] font-bold tracking-[0.15em] text-ink-strong">
              {lang === "en" ? "Bizarre Japan" : "異界巡礼"}
            </p>
            <p className="text-[9px] tracking-[0.2em] text-gold/85">
              {t.brandSub}
            </p>
          </div>
        </Link>

        {/* Tabs */}
        <nav
          className="ml-auto hidden md:flex items-center gap-1"
          role="tablist"
        >
          {tabs.map(({ href, label, icon: Icon }) => {
            const normalized =
              href === `${prefix}/` ? (lang === "en" ? "/en" : "/") : href;
            const active =
              normalized === "/" || normalized === "/en"
                ? pathname === normalized
                : pathname === normalized || pathname.startsWith(normalized);
            return (
              <Link
                key={href}
                href={normalized}
                role="tab"
                aria-selected={active}
                className={cn(
                  "inline-flex items-center gap-1.5",
                  "h-9 px-3 rounded-sm font-display text-[13px] font-semibold tracking-[0.15em]",
                  "transition-colors",
                  active
                    ? "bg-gold text-ink"
                    : "text-ink-mute hover:text-gold",
                )}
              >
                <Icon size={15} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 ml-auto md:ml-0">
          <Link
            href={altLangHref(lang, pathname)}
            aria-label={t.langSwitchTitle}
            title={t.langSwitchTitle}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-sm border border-border text-ink-mute hover:text-gold hover:border-gold text-xs tracking-widest transition-colors"
          >
            <Languages size={14} />
            <span>{t.langSwitchLabel}</span>
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
