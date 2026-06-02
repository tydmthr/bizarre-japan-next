import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const tagVariants = cva(
  [
    "inline-flex items-center gap-1.5",
    "font-sans font-medium tracking-wide whitespace-nowrap",
    "border rounded-full",
  ],
  {
    variants: {
      tone: {
        neutral: "bg-surface text-ink-mute border-border",
        shu: "bg-accent-mute text-accent border-accent/30",
        kin: "bg-transparent text-gold border-gold/50",
        folk: "bg-accent-mute text-accent border-accent/30",
        bkyu: "bg-transparent text-ink-mute border-border-strong",
        horror: "bg-transparent text-ink-mute border-border-strong",
        mystery: "bg-transparent text-gold border-gold/50",
        ghost: "bg-transparent text-ink-mute border-transparent",
      },
      size: {
        sm: "text-[10px] px-2 py-0.5 tracking-widest uppercase",
        md: "text-xs px-2.5 py-1 tracking-wider",
      },
    },
    defaultVariants: {
      tone: "neutral",
      size: "md",
    },
  },
);

export interface TagProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof tagVariants> {}

export function Tag({ tone, size, className, ...props }: TagProps) {
  return (
    <span
      className={cn(tagVariants({ tone, size, className }))}
      {...props}
    />
  );
}

export { tagVariants };

/** カテゴリslug → tone */
export const categoryTone = {
  folk: "folk",
  bkyu: "bkyu",
  horror: "horror",
  mystery: "mystery",
} as const;

/** カテゴリslug → 日本語ラベル */
export const categoryLabelJa = {
  folk: "土俗・奇祭",
  bkyu: "B級",
  horror: "心霊・廃墟",
  mystery: "聖地・ミステリー",
} as const;
