"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type React from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
	[
		"inline-flex items-center justify-center rounded-full font-medium",
		"transition-all duration-200 ease-in-out",
		"whitespace-nowrap",
		"not-prose border shadow-sm",
	],
	{
		variants: {
			variant: {
				default: ["bg-foreground", "hover:opacity-80", "text-background"],
				secondary: [
					"bg-background",
					"text-foreground",
					"hover:opacity-80",
					"border-border",
				],
				destructive: [
					"bg-error/10",
					"text-error/90",
					"hover:opacity-80",
					"border-error/40",
				],
				success: [
					"bg-success/10",
					"text-success/90",
					"hover:opacity-80",
					"border-success/40",
				],
				warning: [
					"bg-warning/10",
					"text-warning/90",
					"hover:opacity-80",
					"border-warning/40",
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
