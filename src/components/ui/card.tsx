import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva(
  [
    "block border rounded-lg transition-colors",
    "shadow-paper",
  ],
  {
    variants: {
      tone: {
        neutral: "bg-bg text-ink border-border",
        surface: "bg-surface text-ink border-border",
        shu: "bg-bg text-ink border-accent/40 [&_h3]:text-accent",
        kin: "bg-bg text-ink border-gold/40 [&_h3]:text-gold",
      },
      density: {
        compact: "p-4",
        default: "p-6",
        spacious: "p-8",
      },
      interactive: {
        true: "hover:border-border-strong hover:shadow-card cursor-pointer",
        false: "",
      },
    },
    defaultVariants: {
      tone: "neutral",
      density: "default",
      interactive: false,
    },
  },
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export function Card({
  tone,
  density,
  interactive,
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(cardVariants({ tone, density, interactive, className }))}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-3", className)} {...props} />;
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("h-card text-ink-strong", className)}
      {...props}
    />
  );
}

export function CardEyebrow({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("eyebrow mb-2", className)} {...props} />;
}

export function CardBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("text-ink-mute text-sm leading-relaxed", className)}
      {...props}
    />
  );
}

export function CardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mt-4 pt-4 border-t border-border", className)}
      {...props}
    />
  );
}

export { cardVariants };
