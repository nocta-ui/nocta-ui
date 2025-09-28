import { cva, type VariantProps } from "class-variance-authority";
import type React from "react";
import { cn } from "@/lib/utils";

const spinnerVariants = cva(
  [
    "inline-block rounded-full border-solid border-current border-r-transparent",
    "not-prose animate-spin",
  ],
  {
    variants: {
      variant: {
        default: "text-foreground/70",
      },
      size: {
        sm: "h-4 w-4 border-2",
        md: "h-6 w-6 border-2",
        lg: "h-8 w-8 border-[3px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  variant = "default",
  className = "",
  ...props
}) => {
  return (
    <div
      aria-live="polite"
      aria-busy="true"
      className={cn(spinnerVariants({ variant, size }), className)}
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};
