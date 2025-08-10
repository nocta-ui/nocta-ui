"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type React from "react";
import { cn } from "@/lib/utils";

const checkboxVariants = cva(
	[
		"relative inline-flex items-center justify-center rounded border-2",
		"transition-all duration-200 ease-in-out cursor-pointer",
		"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
		"focus-visible:ring-offset-nocta-50 dark:focus-visible:ring-offset-nocta-900",
		"not-prose",
	],
	{
		variants: {
			variant: {
				default: "",
				success: "",
				warning: "",
				destructive: "",
			},
			size: {
				sm: "h-4 w-4",
				md: "h-5 w-5",
				lg: "h-6 w-6",
			},
			checked: {
				true: "",
				false: "",
			},
			disabled: {
				true: "opacity-50 cursor-not-allowed",
				false: "",
			},
		},
		compoundVariants: [
			{
				variant: "default",
				checked: true,
				class:
					"bg-nocta-900 dark:bg-nocta-600 border-nocta-900 dark:border-nocta-100/50 focus-visible:ring-nocta-900/50 dark:focus-visible:ring-nocta-100/50",
			},
			{
				variant: "default",
				checked: false,
				class:
					"bg-nocta-200 dark:bg-nocta-800 border-nocta-300 dark:border-nocta-600 hover:border-nocta-400 dark:hover:border-nocta-500 focus-visible:ring-nocta-500/50",
			},
			{
				variant: "success",
				checked: true,
				class:
					"bg-green-600/30 dark:bg-green-600/50 border-green-500 dark:border-green-600/50 focus-visible:ring-green-500/50",
			},
			{
				variant: "success",
				checked: false,
				class:
					"bg-nocta-200 dark:bg-nocta-800 border-nocta-300 dark:border-nocta-600 hover:border-green-400 dark:hover:border-green-500 focus-visible:ring-green-500/50",
			},
			{
				variant: "warning",
				checked: true,
				class:
					"bg-yellow-600/30 dark:bg-yellow-600/50 border-yellow-500 dark:border-yellow-600/50 focus-visible:ring-yellow-500/50",
			},
			{
				variant: "warning",
				checked: false,
				class:
					"bg-nocta-200 dark:bg-nocta-800 border-nocta-300 dark:border-nocta-600 hover:border-yellow-400 dark:hover:border-yellow-500 focus-visible:ring-yellow-500/50",
			},
			{
				variant: "destructive",
				checked: true,
				class:
					"bg-red-600/30 dark:bg-red-600/50 border-red-500 dark:border-red-600/50 focus-visible:ring-red-500/50",
			},
			{
				variant: "destructive",
				checked: false,
				class:
					"bg-nocta-200 dark:bg-nocta-800 border-nocta-300 dark:border-nocta-600 hover:border-red-400 dark:hover:border-red-500 focus-visible:ring-red-500/50",
			},
		],
		defaultVariants: {
			variant: "default",
			size: "md",
			checked: false,
			disabled: false,
		},
	},
);

const iconVariants = cva(
	[
		"stroke-[3]",
		"transition-opacity duration-200",
	],
	{
		variants: {
			variant: {
				default: "text-nocta-50 dark:text-nocta-50",
				success: "text-green-500 dark:green-500",
				warning: "text-yellow-500 dark:yellow-500",
				destructive: "text-red-500 dark:red-500",
			},
			size: {
				sm: "h-2.5 w-2.5",
				md: "h-3 w-3",
				lg: "h-3.5 w-3.5",
			},
			checked: {
				true: "opacity-100",
				false: "opacity-0",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "md",
			checked: false,
		},
	},
);

export interface CheckboxProps
	extends Omit<
			React.InputHTMLAttributes<HTMLInputElement>,
			"size" | "disabled"
		>,
		Omit<VariantProps<typeof checkboxVariants>, "checked"> {
	checked?: boolean;
	onCheckedChange?: (checked: boolean) => void;
	disabled?: boolean;
	className?: string;
	id?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
	checked = false,
	onCheckedChange,
	size = "md",
	variant = "default",
	disabled = false,
	className = "",
	id,
	...props
}) => {
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (!disabled && onCheckedChange) {
			onCheckedChange(event.target.checked);
		}
	};

	const CheckIcon = () => (
		<svg
			className={iconVariants({ variant, size, checked })}
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<polyline points="20,6 9,17 4,12" />
		</svg>
	);

	return (
		<label
			className={cn(
				checkboxVariants({ variant, size, checked, disabled }),
				className,
			)}
			htmlFor={id}
		>
			<input
				type="checkbox"
				className="sr-only"
				checked={checked}
				onChange={handleChange}
				disabled={disabled}
				id={id}
				aria-checked={checked}
				{...props}
			/>
			<CheckIcon />
		</label>
	);
};