"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // base
  [
    "inline-flex items-center justify-center gap-2",
    "font-sans font-medium tracking-wide whitespace-nowrap",
    "rounded-sm border transition-colors duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
    "disabled:opacity-50 disabled:pointer-events-none",
    "ease-[var(--ease-out)]",
  ],
  {
    variants: {
      tone: {
        neutral: [
          "bg-surface text-ink border-border",
          "hover:bg-surface-mute hover:border-border-strong",
        ],
        shu: [
          "bg-accent text-on-accent border-accent",
          "hover:bg-accent-hover hover:border-accent-hover",
        ],
        kin: [
          "bg-transparent text-gold border-gold",
          "hover:bg-gold hover:text-bg",
        ],
        ghost: [
          "bg-transparent text-ink border-transparent",
          "hover:bg-surface-mute",
        ],
        link: [
          "bg-transparent text-accent border-transparent p-0 h-auto underline-offset-4",
          "hover:underline",
        ],
      },
      size: {
        sm: "text-xs h-8",
        md: "text-sm h-10",
        lg: "text-base h-12",
      },
      density: {
        compact: "px-3",
        default: "px-5",
        spacious: "px-8",
      },
    },
    compoundVariants: [
      // link は density を吸収しない
      { tone: "link", className: "px-0 h-auto" },
    ],
    defaultVariants: {
      tone: "neutral",
      size: "md",
      density: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, tone, size, density, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ tone, size, density, className }))}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
