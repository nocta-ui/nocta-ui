import { cva, type VariantProps } from "class-variance-authority";
import type React from "react";
import { cn } from "@/lib/utils";

const textareaVariants = cva(
	[
		"w-full rounded-lg border transition-all duration-200 ease-in-out",
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
				sm: "px-3 py-2 text-sm",
				md: "px-3 py-2.5 text-sm",
				lg: "px-4 py-3 text-base",
			},
			resize: {
				none: "resize-none",
				vertical: "resize-y",
				horizontal: "resize-x",
				both: "resize",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "md",
			resize: "vertical",
		},
	},
);

const messageVariants = cva("mt-1.5 text-sm", {
	variants: {
		type: {
			error: "text-red-600 dark:text-red-400",
			success: "text-green-600 dark:text-green-400",
			helper: "text-nocta-600 dark:text-nocta-400",
		},
	},
});

export interface TextareaProps
	extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size">,
		VariantProps<typeof textareaVariants> {
	label?: string;
	helperText?: string;
	errorMessage?: string;
	successMessage?: string;
	className?: string;
	containerClassName?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
	variant = "default",
	size = "md",
	resize = "vertical",
	label,
	helperText,
	errorMessage,
	successMessage,
	className = "",
	containerClassName = "",
	disabled,
	rows = 4,
	...props
}) => {
	const displayErrorMessage = variant === "error" && errorMessage;
	const displaySuccessMessage = variant === "success" && successMessage;

	return (
		<div className={cn("not-prose", containerClassName)}>
			{label && (
				<label className="block text-sm font-medium text-nocta-700 dark:text-nocta-300 mb-1.5">
					{label}
				</label>
			)}

			<textarea
				className={cn(textareaVariants({ variant, size, resize }), className)}
				disabled={disabled}
				rows={rows}
				{...props}
			/>

			{displayErrorMessage && (
				<p className={messageVariants({ type: "error" })}>{errorMessage}</p>
			)}

			{displaySuccessMessage && (
				<p className={messageVariants({ type: "success" })}>{successMessage}</p>
			)}

			{helperText && !displayErrorMessage && !displaySuccessMessage && (
				<p className={messageVariants({ type: "helper" })}>{helperText}</p>
			)}
		</div>
	);
};
