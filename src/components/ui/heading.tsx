import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const headingVariants = cva("", {
  variants: {
    variant: {
      hero: "h-hero",
      section: "h-section",
      card: "h-card",
      eyebrow: "eyebrow",
    },
    tone: {
      default: "text-ink-strong",
      mute: "text-ink-mute",
      gold: "text-gold",
      shu: "text-accent",
    },
  },
  defaultVariants: {
    variant: "section",
    tone: "default",
  },
});

type AsTag = "h1" | "h2" | "h3" | "h4" | "p" | "span";

type HeadingProps = React.HTMLAttributes<HTMLElement> &
  VariantProps<typeof headingVariants> & {
    as?: AsTag;
  };

export function Heading({
  as,
  variant,
  tone,
  className,
  ...props
}: HeadingProps) {
  const fallback: Record<NonNullable<HeadingProps["variant"]>, AsTag> = {
    hero: "h1",
    section: "h2",
    card: "h3",
    eyebrow: "p",
  };
  const Tag = (as ?? fallback[variant ?? "section"]) as AsTag;
  return React.createElement(Tag, {
    ...props,
    className: cn(headingVariants({ variant, tone }), className),
  });
}
