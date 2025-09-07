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
				default: [
					"bg-linear-to-b from-nocta-900 to-nocta-700 dark:from-nocta-700 dark:to-nocta-700/50",
					"hover:contrast-115 border-none",
					"text-nocta-100 dark:text-nocta-100",
				],
				secondary: [
					"bg-nocta-100 dark:bg-nocta-900",
					"text-nocta-900 dark:text-nocta-100",
					"hover:bg-nocta-200 dark:hover:bg-nocta-800",
					"border-nocta-200 dark:border-nocta-50/5",
				],
				destructive: [
					"bg-red-50 dark:bg-red-950/50",
					"text-red-900 dark:text-red-100",
					"hover:bg-red-100 dark:hover:bg-red-900/50",
					"border-red-200 dark:border-red-800/50",
				],
				success: [
					"bg-green-50 dark:bg-green-950/50",
					"text-green-900 dark:text-green-100",
					"hover:bg-green-100 dark:hover:bg-green-900/50",
					"border-green-200 dark:border-green-800/50",
				],
				warning: [
					"bg-yellow-50 dark:bg-yellow-950/50",
					"text-yellow-900 dark:text-yellow-100",
					"hover:bg-yellow-100 dark:hover:bg-yellow-900/50",
					"border-yellow-200 dark:border-yellow-800/50",
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
		<span className={cn(badgeVariants({ variant, size }), className)} {...props}>
			{children}
		</span>
	);
};
