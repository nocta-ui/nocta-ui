import { cva, type VariantProps } from "class-variance-authority";
import React from "react";
import { cn } from "@/lib/utils";

const inputVariants = cva(
	[
		"w-fit flex rounded-lg border transition-all duration-200 ease-in-out",
		"focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-1",
		"focus-visible:ring-offset-ring-offset/50",
		"disabled:opacity-50 disabled:cursor-not-allowed",
		"placeholder:text-foreground-subtle",
		"not-prose shadow-xs",
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
					"border-error/40",
					"bg-background",
					"text-foreground",
					"focus-visible:border-error/50",
					"focus-visible:ring-error/50 dark:focus-visible:ring-error/50",
				],
				success: [
					"border-success/40",
					"bg-background",
					"text-foreground",
					"focus-visible:border-success/50",
					"focus-visible:ring-success/50 dark:focus-visible:ring-success/50",
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
	["absolute top-1/2 transform -translate-y-1/2", "text-foreground-subtle"],
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
			default: "text-foreground-muted",
			error: "text-foreground-muted",
			success: "text-foreground-muted",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

const messageVariants = cva("mt-1.5 text-sm", {
	variants: {
		type: {
			error: "text-error/90",
			success: "text-success/90",
			helper: "text-foreground-muted",
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

	const autoId = React.useId();
	const inputId = props.id ?? autoId;
	const describedBy: string[] = [];

	return (
		<div className={`not-prose ${containerClassName}`}>
			{label && (
				<label htmlFor={inputId} className={labelVariants({ variant })}>
					{label}
				</label>
			)}

			<div className="relative">
				{leftIcon && (
					<div
						className={cn(
							iconVariants({
								position: "left",
								size,
								disabled: !!disabled,
							}),
							"[&>svg]:w-full [&>svg]:h-full",
						)}
					>
						{leftIcon}
					</div>
				)}

				<input
					className={cn(
						inputVariants({ variant, size, hasLeftIcon, hasRightIcon }),
						className,
					)}
					id={inputId}
					disabled={disabled}
					aria-invalid={displayErrorMessage ? true : undefined}
					aria-describedby={(() => {
						if (displayErrorMessage) describedBy.push(`${inputId}-error`);
						else if (successMessage) describedBy.push(`${inputId}-success`);
						if (helperText) describedBy.push(`${inputId}-helper`);
						return describedBy.length ? describedBy.join(" ") : undefined;
					})()}
					{...props}
				/>

				{rightIcon && (
					<div
						className={cn(
							iconVariants({
								position: "right",
								size,
								disabled: !!disabled,
							}),
							"[&>svg]:w-full [&>svg]:h-full",
						)}
					>
						{rightIcon}
					</div>
				)}
			</div>

			{displayErrorMessage && (
				<p
					id={`${inputId}-error`}
					className={messageVariants({ type: "error" })}
				>
					{errorMessage}
				</p>
			)}

			{!displayErrorMessage && successMessage && (
				<p
					id={`${inputId}-success`}
					className={messageVariants({ type: "success" })}
				>
					{successMessage}
				</p>
			)}

			{helperText && (
				<p
					id={`${inputId}-helper`}
					className={messageVariants({ type: "helper" })}
				>
					{helperText}
				</p>
			)}
		</div>
	);
};
