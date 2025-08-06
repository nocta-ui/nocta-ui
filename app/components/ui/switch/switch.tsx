"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type React from "react";
import { cn } from "@/lib/utils";

const switchVariants = cva(
	[
		"relative inline-flex items-center rounded-full border-2 border-transparent",
		"transition-all duration-200 ease-out cursor-pointer",
		"focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-2",
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
				sm: "h-5 w-9",
				md: "h-6 w-11",
				lg: "h-7 w-12",
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
					"bg-nocta-400 dark:bg-nocta-600 focus-visible:ring-nocta-900/50 dark:focus-visible:ring-nocta-100/50",
			},
			{
				variant: "default",
				checked: false,
				class: "bg-nocta-200 dark:bg-nocta-800 focus-visible:ring-nocta-500/50",
			},
			{
				variant: "success",
				checked: true,
				class:
					"bg-green-500 dark:bg-green-600/50 focus-visible:ring-green-500/50",
			},
			{
				variant: "success",
				checked: false,
				class: "bg-nocta-200 dark:bg-nocta-800 focus-visible:ring-green-500/50",
			},
			{
				variant: "warning",
				checked: true,
				class:
					"bg-yellow-500 dark:bg-yellow-600/50 focus-visible:ring-yellow-500/50",
			},
			{
				variant: "warning",
				checked: false,
				class:
					"bg-nocta-200 dark:bg-nocta-800 focus-visible:ring-yellow-500/50",
			},
			{
				variant: "destructive",
				checked: true,
				class: "bg-red-500 dark:bg-red-600/50 focus-visible:ring-red-500/50",
			},
			{
				variant: "destructive",
				checked: false,
				class: "bg-nocta-200 dark:bg-nocta-800 focus-visible:ring-red-500/50",
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

const thumbVariants = cva(
	[
		"inline-block rounded-full bg-nocta-50 dark:bg-nocta-50",
		"shadow-sm transform transition-transform duration-200 ease-in-out",
	],
	{
		variants: {
			size: {
				sm: "h-3 w-3",
				md: "h-4 w-4",
				lg: "h-5 w-5",
			},
			checked: {
				true: "",
				false: "",
			},
		},
		compoundVariants: [
			{
				size: "sm",
				checked: true,
				class: "translate-x-4",
			},
			{
				size: "sm",
				checked: false,
				class: "translate-x-1",
			},
			{
				size: "md",
				checked: true,
				class: "translate-x-5",
			},
			{
				size: "md",
				checked: false,
				class: "translate-x-1",
			},
			{
				size: "lg",
				checked: true,
				class: "translate-x-5",
			},
			{
				size: "lg",
				checked: false,
				class: "translate-x-1",
			},
		],
		defaultVariants: {
			size: "md",
			checked: false,
		},
	},
);

export interface SwitchProps
	extends Omit<
			React.InputHTMLAttributes<HTMLInputElement>,
			"size" | "disabled"
		>,
		Omit<VariantProps<typeof switchVariants>, "checked"> {
	checked?: boolean;
	onCheckedChange?: (checked: boolean) => void;
	disabled?: boolean;
	className?: string;
	id?: string;
}

export const Switch: React.FC<SwitchProps> = ({
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

	return (
		<label
			className={cn(
				switchVariants({ variant, size, checked, disabled }),
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
				role="switch"
				aria-checked={checked}
				{...props}
			/>
			<span className={thumbVariants({ size, checked })} />
		</label>
	);
};
