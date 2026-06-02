"use client";

import { useLocalSet } from "@/lib/local-set";
import { cn } from "@/lib/utils";

type Variant = "visited" | "wishlist";

const STORAGE_KEY: Record<Variant, string> = {
  visited: "bj-visited",
  wishlist: "bj-wishlist",
};

const LABEL_JA: Record<Variant, [string, string]> = {
  // [inactive, active]
  visited: ["行った", "行った ✓"],
  wishlist: ["気になる", "気になる ✓"],
};

const LABEL_EN: Record<Variant, [string, string]> = {
  visited: ["Visited", "Visited ✓"],
  wishlist: ["Wishlist", "Wishlist ✓"],
};

export function VisitToggle({
  id,
  variant,
  lang = "ja",
  className,
}: {
  id: string;
  variant: Variant;
  lang?: "ja" | "en";
  className?: string;
}) {
  const { has, toggle, hydrated } = useLocalSet(STORAGE_KEY[variant]);
  const active = hydrated && has(id);
  const labels = lang === "en" ? LABEL_EN[variant] : LABEL_JA[variant];

  return (
    <button
      type="button"
      onClick={() => toggle(id)}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-1.5 h-9 px-4 rounded-sm border",
        "font-sans text-xs tracking-wider transition-colors",
        active
          ? variant === "visited"
            ? "bg-gold text-ink border-gold"
            : "bg-accent text-on-accent border-accent"
          : "bg-transparent text-ink-mute border-border hover:border-ink-mute",
        className,
      )}
    >
      {active ? labels[1] : labels[0]}
    </button>
  );
}

export function VisitBadge({
  id,
  lang = "ja",
}: {
  id: string;
  lang?: "ja" | "en";
}) {
  const { has, hydrated } = useLocalSet(STORAGE_KEY.visited);
  if (!hydrated || !has(id)) return null;
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-sm bg-gold text-ink text-[10px] tracking-widest"
      aria-label={lang === "en" ? "Visited" : "行った"}
      title={lang === "en" ? "Visited" : "行った"}
    >
      ✓
    </span>
  );
}
