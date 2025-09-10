import { cva, type VariantProps } from "class-variance-authority";
import type React from "react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
	"inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-offset-ring-offset/50 disabled:opacity-50 disabled:cursor-not-allowed not-prose cursor-pointer",
	{
		variants: {
			variant: {
				primary:
					"bg-linear-to-b from-gradient-primary-start to-gradient-primary-end dark:from-gradient-primary-start dark:to-gradient-primary-end/50 hover:contrast-115 text-primary-foreground dark:text-primary focus-visible:ring-ring/10 shadow-sm",
				secondary:
					"bg-background text-foreground hover:bg-background-muted focus-visible:ring-ring/10 border border-border-muted dark:border-border-muted/30 shadow-xs",
				ghost:
					"text-foreground-muted hover:bg-background-muted focus-visible:ring-ring/10",
				icon: "text-foreground-muted hover:bg-background-muted focus-visible:ring-ring/10",
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
				class: "bg-none",
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
	const isPrimary = variant === "primary";

	return (
		<button
			className={cn(
				buttonVariants({
					variant,
					size,
					hasCustomBackground: shouldOverrideBackground,
				}),
				isPrimary && "relative",
				className,
			)}
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
		</button>
	);
};
