import { cva, type VariantProps } from "class-variance-authority";
import type React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
	"inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-2 focus-visible:ring-offset-nocta-50/50 dark:focus-visible:ring-offset-nocta-900/50 disabled:opacity-50 disabled:cursor-not-allowed not-prose cursor-pointer",
	{
		variants: {
			variant: {
				primary:
					"bg-linear-to-b from-nocta-900 to-nocta-700 dark:from-nocta-50 dark:to-nocta-300 hover:contrast-125 text-nocta-50 dark:text-nocta-900 focus-visible:ring-nocta-900/50 dark:focus-visible:ring-nocta-100/50 shadow-sm",
				secondary:
					"bg-nocta-100 dark:bg-nocta-900 text-nocta-900 dark:text-nocta-100 hover:bg-nocta-200 dark:hover:bg-nocta-800 focus-visible:ring-nocta-500/50 dark:focus-visible:ring-nocta-400/50 border border-nocta-300 dark:border-nocta-600",
				ghost:
					"text-nocta-700 dark:text-nocta-300 hover:bg-nocta-200 dark:hover:bg-nocta-900 focus-visible:ring-nocta-500/50 dark:focus-visible:ring-nocta-400/50",
				icon: "text-nocta-700 dark:text-nocta-300 hover:bg-nocta-200 dark:hover:bg-nocta-900 focus-visible:ring-nocta-500/50 dark:focus-visible:ring-nocta-400/50",
			},
			size: {
				sm: "px-3 py-1.5 text-sm",
				md: "px-4 py-2 text-sm",
				lg: "px-6 py-3 text-base",
			},
			hasCustomBackground: {
				true: "",
				false: "",
			},
		},
		compoundVariants: [
			{
				variant: "icon",
				size: "sm",
				class: "w-8 h-8 p-0 text-sm",
			},
			{
				variant: "icon",
				size: "md",
				class: "w-10 h-10 p-0 text-sm",
			},
			{
				variant: "icon",
				size: "lg",
				class: "w-12 h-12 p-0 text-base",
			},
			{
				variant: "primary",
				hasCustomBackground: true,
				class: "bg-none hover:bg-nocta-900 dark:hover:bg-nocta-200",
			},
		],
		defaultVariants: {
			variant: "primary",
			size: "md",
			hasCustomBackground: false,
		},
	},
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	children: React.ReactNode;
	className?: string;
}

const hasBackgroundColor = (className: string = "") => {
	return /bg-(?!linear|gradient|none)\w+/.test(className);
};

export const Button: React.FC<ButtonProps> = ({
	children,
	variant = "primary",
	size = "md",
	className = "",
	...props
}) => {
	const shouldOverrideBackground = hasBackgroundColor(className);

	return (
		<button
			className={cn(
				buttonVariants({
					variant,
					size,
					hasCustomBackground: shouldOverrideBackground,
				}),
				className,
			)}
			{...props}
		>
			{children}
		</button>
	);
};
