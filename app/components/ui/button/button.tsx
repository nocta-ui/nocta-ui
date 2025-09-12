"use client";

import { Button as AriakitButton } from "@ariakit/react";
import { cva, type VariantProps } from "class-variance-authority";
import type React from "react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
	"relative inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-offset-ring-offset/50 disabled:opacity-50 disabled:cursor-not-allowed not-prose cursor-pointer",
	{
		variants: {
			variant: {
				primary:
					"bg-linear-to-b from-gradient-primary-start to-gradient-primary-end hover:contrast-115 text-primary-white focus-visible:ring-ring/50 focus-visible:border-border/10 shadow-sm",
				secondary:
					"bg-background text-foreground hover:bg-background-muted focus-visible:ring-ring/50 focus-visible:border-border/10 border border-border-muted dark:border-border-muted shadow-xs",
				ghost:
					"text-primary-muted hover:bg-background-muted focus-visible:ring-ring/50 focus-visible:border-border/10",
				icon: "text-primary-muted hover:bg-background-muted focus-visible:ring-ring/50 focus-visible:border-border/10",
			},
			size: {
				sm: "px-3 py-1.5 text-sm",
				md: "px-4 py-2 text-sm",
				lg: "px-6 py-3 text-base",
			}
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
			}
		],
		defaultVariants: {
			variant: "primary",
			size: "md",
		},
	},
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	children: React.ReactNode;
	className?: string;
}

export const Button: React.FC<ButtonProps> = ({
	children,
	variant = "primary",
	size = "md",
	className = "",
	type,
	...props
}) => {
	const isPrimary = variant === "primary";

	return (
		<AriakitButton
			className={cn(
				buttonVariants({
					variant,
					size,
				}),
				className,
			)}
			type={type ?? "button"}
			{...props}
		>
			{isPrimary && (
				<>
					<span
						aria-hidden
						className="pointer-events-none absolute -inset-px rounded-lg bg-gradient-to-b to-transparent opacity-60"
						style={{
							maskImage:
								"radial-gradient(120% 100% at 50% 0%, black 30%, transparent 70%)",
							WebkitMaskImage:
								"radial-gradient(120% 100% at 50% 0%, black 30%, transparent 70%)",
						}}
					/>

					<span
						aria-hidden
						className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-lg opacity-60"
						style={{
							background:
								"linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)",
						}}
					/>
				</>
			)}
			{children}
		</AriakitButton>
	);
};
