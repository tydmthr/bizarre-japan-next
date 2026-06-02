import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const sectionVariants = cva("relative", {
  variants: {
    tone: {
      bg: "bg-bg text-ink",
      surface: "bg-surface text-ink",
      raised: "bg-bg-raised text-ink",
      ink: "bg-ink text-bg",
    },
    density: {
      compact: "py-12 md:py-12",
      default: "py-12 md:py-20",
      spacious: "py-16 md:py-28",
    },
    bleed: {
      true: "",
      false: "",
    },
  },
  defaultVariants: {
    tone: "bg",
    density: "default",
    bleed: false,
  },
});

const containerVariants = cva("mx-auto px-6 md:px-8", {
  variants: {
    width: {
      prose: "max-w-[65ch]",
      narrow: "max-w-[720px]",
      default: "max-w-[1120px]",
      wide: "max-w-[1280px]",
      full: "max-w-none",
    },
  },
  defaultVariants: {
    width: "default",
  },
});

export interface SectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {
  width?: VariantProps<typeof containerVariants>["width"];
}

export function Section({
  tone,
  density,
  bleed,
  width,
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(sectionVariants({ tone, density, bleed }), className)}
      {...props}
    >
      <div className={containerVariants({ width })}>{children}</div>
    </section>
  );
}

export { sectionVariants, containerVariants };
