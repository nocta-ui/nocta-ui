import { cva, type VariantProps } from "class-variance-authority";
import type React from "react";
import { cn } from "@/lib/utils";

const inputVariants = cva(
	[
		"w-fit rounded-lg border transition-all duration-200 ease-in-out",
		"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
		"focus-visible:ring-offset-nocta-50/50 dark:focus-visible:ring-offset-nocta-900/50",
		"disabled:opacity-50 disabled:cursor-not-allowed",
		"placeholder:text-nocta-400 dark:placeholder:text-nocta-500",
		"not-prose",
	],
	{
		variants: {
			variant: {
				default: [
					"border-nocta-300 dark:border-nocta-800/50",
					"bg-nocta-50 dark:bg-nocta-950",
					"text-nocta-900 dark:text-nocta-100",
					"hover:border-nocta-300/50 dark:hover:border-nocta-600/50",
					"focus-visible:border-nocta-900/50 dark:focus-visible:border-nocta-100/50",
					"focus-visible:ring-nocta-900/50 dark:focus-visible:ring-nocta-100/50",
				],
				error: [
					"border-red-300 dark:border-red-700/50",
					"bg-nocta-50 dark:bg-nocta-950",
					"text-nocta-900 dark:text-nocta-100",
					"hover:border-red-400/50 dark:hover:border-red-600/50",
					"focus-visible:border-red-500/50 dark:focus-visible:border-red-500/50",
					"focus-visible:ring-red-500/50 dark:focus-visible:ring-red-500/50",
				],
				success: [
					"border-green-300 dark:border-green-700/50",
					"bg-nocta-50 dark:bg-nocta-950",
					"text-nocta-900 dark:text-nocta-100",
					"hover:border-green-400/50 dark:hover:border-green-600/50",
					"focus-visible:border-green-500/50 dark:focus-visible:border-green-500/50",
					"focus-visible:ring-green-500/50 dark:focus-visible:ring-green-500/50",
				],
			},
			size: {
				sm: "px-3 py-1.5 text-sm",
				md: "px-3 py-2 text-sm",
				lg: "px-4 py-3 text-base",
			},
			hasLeftIcon: {
				true: "pl-10",
				false: "",
			},
			hasRightIcon: {
				true: "pr-10",
				false: "",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "md",
			hasLeftIcon: false,
			hasRightIcon: false,
		},
	},
);

const iconVariants = cva(
	[
		"absolute top-1/2 transform -translate-y-1/2",
		"text-nocta-400 dark:text-nocta-500",
	],
	{
		variants: {
			position: {
				left: "left-3",
				right: "right-3",
			},
			size: {
				sm: "w-4 h-4",
				md: "w-4 h-4",
				lg: "w-5 h-5",
			},
			disabled: {
				true: "opacity-50",
				false: "",
			},
		},
		defaultVariants: {
			size: "md",
			disabled: false,
		},
	},
);

const labelVariants = cva("block text-sm font-medium mb-1.5", {
	variants: {
		variant: {
			default: "text-nocta-700 dark:text-nocta-300",
			error: "text-nocta-700 dark:text-nocta-300",
			success: "text-nocta-700 dark:text-nocta-300",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

const messageVariants = cva("mt-1.5 text-sm", {
	variants: {
		type: {
			error: "text-red-600 dark:text-red-400",
			success: "text-green-600 dark:text-green-400",
			helper: "text-nocta-600 dark:text-nocta-400",
		},
	},
});

export interface InputProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
		VariantProps<typeof inputVariants> {
	label?: string;
	helperText?: string;
	successMessage?: string;
	errorMessage?: string;
	leftIcon?: React.ReactNode;
	rightIcon?: React.ReactNode;
	className?: string;
	containerClassName?: string;
}

export const Input: React.FC<InputProps> = ({
	variant = "default",
	size = "md",
	label,
	helperText,
	successMessage,
	errorMessage,
	leftIcon,
	rightIcon,
	className = "",
	containerClassName = "",
	disabled,
	...props
}) => {
	const hasLeftIcon = !!leftIcon;
	const hasRightIcon = !!rightIcon;
	const displayErrorMessage = variant === "error" && errorMessage;

	return (
		<div className={`not-prose ${containerClassName}`}>
			{label && <label className={labelVariants({ variant })}>{label}</label>}

			<div className="relative">
				{leftIcon && (
					<div
						className={iconVariants({
							position: "left",
							size,
							disabled: !!disabled,
						})}
					>
						{leftIcon}
					</div>
				)}

				<input
					className={cn(
						inputVariants({ variant, size, hasLeftIcon, hasRightIcon }),
						className,
					)}
					disabled={disabled}
					{...props}
				/>

				{rightIcon && (
					<div
						className={iconVariants({
							position: "right",
							size,
							disabled: !!disabled,
						})}
					>
						{rightIcon}
					</div>
				)}
			</div>

			{displayErrorMessage && (
				<p className={messageVariants({ type: "error" })}>{errorMessage}</p>
			)}

			{!displayErrorMessage && successMessage && (
				<p className={messageVariants({ type: "success" })}>{successMessage}</p>
			)}

			{helperText && (
				<p className={messageVariants({ type: "helper" })}>{helperText}</p>
			)}
		</div>
	);
};
