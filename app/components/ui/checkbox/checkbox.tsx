"use client";

import {
	Checkbox as AriakitCheckbox,
	useCheckboxStore,
	useStoreState,
} from "@ariakit/react";
import { cva, type VariantProps } from "class-variance-authority";
import type React from "react";
import { cn } from "@/lib/utils";

const checkboxVariants = cva(
	[
		"relative inline-flex items-center justify-center rounded border",
		"transition-colors duration-200 ease-in-out cursor-pointer",
		"has-[:focus-visible]:outline-none has-[:focus-visible]:ring-1 has-[:focus-visible]:ring-offset-1",
		"has-[:focus-visible]:ring-offset-ring-offset/50",
		"shadow-xs not-prose",
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
					"bg-foreground-muted border-border has-[:focus-visible]:ring-ring/50",
			},
			{
				variant: "default",
				checked: false,
				class:
					"bg-background-muted border-border has-[:focus-visible]:ring-ring/50",
			},
			{
				variant: "success",
				checked: true,
				class:
					"bg-green-600/30 dark:bg-green-600/50 border-green-500 dark:border-green-600/50 has-[:focus-visible]:ring-green-500/50",
			},
			{
				variant: "success",
				checked: false,
				class:
					"bg-background-muted border-border has-[:focus-visible]:ring-green-500/50",
			},
			{
				variant: "warning",
				checked: true,
				class:
					"bg-yellow-600/30 dark:bg-yellow-600/50 border-yellow-500 dark:border-yellow-600/50 has-[:focus-visible]:ring-yellow-500/50",
			},
			{
				variant: "warning",
				checked: false,
				class:
					"bg-background-muted border-border has-[:focus-visible]:ring-yellow-500/50",
			},
			{
				variant: "destructive",
				checked: true,
				class:
					"bg-red-600/30 dark:bg-red-600/50 border-red-500 dark:border-red-600/50 has-[:focus-visible]:ring-red-500/50",
			},
			{
				variant: "destructive",
				checked: false,
				class:
					"bg-background-muted border-border has-[:focus-visible]:ring-red-500/50",
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
	["stroke-[3]", "transition-opacity duration-200 ease-in-out"],
	{
		variants: {
			variant: {
				default: "text-primary-foreground",
				success: "text-green-500 dark:text-green-500",
				warning: "text-yellow-500 dark:text-yellow-500",
				destructive: "text-red-500 dark:text-red-500",
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

interface CheckIconProps {
	variant?: VariantProps<typeof iconVariants>["variant"];
	size?: VariantProps<typeof iconVariants>["size"];
	checked: boolean;
}

const CheckIcon: React.FC<CheckIconProps> = ({ variant, size, checked }) => (
	<svg
		aria-hidden="true"
		focusable="false"
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
	defaultChecked?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({
	checked,
	onCheckedChange,
	defaultChecked,
	size = "md",
	variant = "default",
	disabled = false,
	className = "",
	id,
	...props
}) => {
	let propsForStore: Parameters<typeof useCheckboxStore<boolean>>[0];
	if (typeof checked !== "undefined") {
		propsForStore = {
			value: checked,
			setValue: onCheckedChange
				? (value) => {
						const bool = Array.isArray(value)
							? value.length > 0
							: Boolean(value);
						onCheckedChange(bool);
					}
				: undefined,
		};
	} else {
		propsForStore = { defaultValue: Boolean(defaultChecked) };
	}
	const store = useCheckboxStore<boolean>(propsForStore);

	const isChecked = useStoreState(store, "value");

	return (
		<label
			className={cn(
				checkboxVariants({ variant, size, checked: isChecked, disabled }),
				className,
			)}
			htmlFor={id}
		>
			<AriakitCheckbox
				store={store}
				className="sr-only"
				disabled={disabled}
				id={id}
				{...props}
			/>
			<CheckIcon variant={variant} size={size} checked={isChecked} />
		</label>
	);
};
