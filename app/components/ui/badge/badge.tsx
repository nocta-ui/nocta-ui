"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type React from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  [
    "inline-flex items-center justify-center rounded-full font-medium",
    "transition-all duration-200 ease-in-out",
    "whitespace-nowrap",
    "not-prose",
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-linear-to-b from-gradient-1 to-gradient-2",
          "text-foreground",
          "hover:contrast-110",
          "inset-shadow-[0_1px_rgb(255_255_255/0.15)]",
        ],
        secondary: [
          "bg-card",
          "text-foreground",
          "hover:opacity-80",
          "border border-none shadow-sm dark:border-solid border-border",
        ],
        destructive: [
          "bg-linear-to-b from-error/5 to-error/20",
          "text-error/90",
          "hover:opacity-80",
          "border border-none shadow-sm dark:border-solid  border-error/40",
        ],
        success: [
          "bg-linear-to-b from-success/5 to-success/20",
          "text-success/90",
          "hover:opacity-80",
          "border border-none shadow-sm dark:border-solid  border-success/40",
        ],
        warning: [
          "bg-linear-to-b from-warning/5 to-warning/20",
          "text-warning/90",
          "hover:opacity-80",
          "border border-none shadow-sm dark:border-solid  border-warning/40",
        ],
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-1 text-xs",
        lg: "px-3 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  size = "md",
  className = "",
  ...props
}) => {
  return (
    <span
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </span>
  );
};
