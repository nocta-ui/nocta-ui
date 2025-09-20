import { cva, type VariantProps } from "class-variance-authority";
import type React from "react";
import { cn } from "@/lib/utils";

const textareaVariants = cva(
	[
		"w-full flex rounded-lg border transition-all duration-200 ease-in-out",
		"focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-1",
		"focus-visible:ring-offset-ring-offset/50",
		"disabled:opacity-50 disabled:cursor-not-allowed",
		"placeholder:text-foreground-subtle",
		"shadow-xs not-prose",
	],
	{
		variants: {
			variant: {
				default: [
					"border-border",
					"bg-background",
					"text-foreground",
					"focus-visible:border-border",
					"focus-visible:ring-ring/50",
				],
				error: [
					"border-red-300 dark:border-red-700/50",
					"bg-background",
					"text-foreground",
					"focus-visible:border-red-500/50 dark:focus-visible:border-red-500/50",
					"focus-visible:ring-red-500/50 dark:focus-visible:ring-red-500/50",
				],
				success: [
					"border-green-300 dark:border-green-700/50",
					"bg-background",
					"text-foreground",
					"focus-visible:border-green-500/50 dark:focus-visible:border-green-500/50",
					"focus-visible:ring-green-500/50 dark:focus-visible:ring-green-500/50",
				],
			},
			size: {
				sm: "px-3 py-2 text-sm",
				md: "px-3 py-2 text-sm",
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
			helper: "text-foreground-subtle",
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

let textareaIdCounter = 0;
const generateTextareaId = () => `textarea-${++textareaIdCounter}`;

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
	id,
	...props
}) => {
	const displayErrorMessage = variant === "error" && errorMessage;
	const displaySuccessMessage = variant === "success" && successMessage;
	const textareaId = id ?? generateTextareaId();

	const helperId = helperText ? `${textareaId}-helper` : undefined;
	const errorId = displayErrorMessage ? `${textareaId}-error` : undefined;
	const successId = displaySuccessMessage ? `${textareaId}-success` : undefined;
	const describedBy =
		[helperId, errorId, successId].filter(Boolean).join(" ") || undefined;

	return (
		<div className={cn("not-prose", containerClassName)}>
			{label && (
				<label
					htmlFor={textareaId}
					className="block text-sm font-medium text-primary-muted mb-1.5"
				>
					{label}
				</label>
			)}

			<textarea
				className={cn(textareaVariants({ variant, size, resize }), className)}
				disabled={disabled}
				rows={rows}
				id={textareaId}
				aria-describedby={describedBy}
				aria-invalid={variant === "error" ? true : undefined}
				{...props}
			/>

			{displayErrorMessage && (
				<p
					id={errorId}
					className={messageVariants({ type: "error" })}
					aria-live="polite"
				>
					{errorMessage}
				</p>
			)}

			{displaySuccessMessage && (
				<p
					id={successId}
					className={messageVariants({ type: "success" })}
					aria-live="polite"
				>
					{successMessage}
				</p>
			)}

			{helperText && !displayErrorMessage && !displaySuccessMessage && (
				<p id={helperId} className={messageVariants({ type: "helper" })}>
					{helperText}
				</p>
			)}
		</div>
	);
};
