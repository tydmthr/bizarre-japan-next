"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "朝の襖へ" : "夜の和紙へ"}
      title={theme === "dark" ? "朝の襖（Light）" : "夜の和紙（Dark）"}
      className={cn(
        "inline-flex items-center justify-center",
        "h-9 w-9 rounded-sm border border-border text-ink-mute",
        "hover:text-gold hover:border-gold transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        className,
      )}
    >
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
