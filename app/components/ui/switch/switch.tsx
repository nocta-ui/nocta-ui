"use client";

import * as Ariakit from "@ariakit/react";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const switchVariants = cva(
	[
		"relative inline-flex items-center rounded-full border-2 border-transparent",
		"transition-all duration-200 ease-in-out cursor-pointer",
		"peer-focus-visible:outline-none peer-focus-visible:ring-1",
		"peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-ring-offset/50",
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
				class: "bg-foreground-subtle peer-focus-visible:ring-ring/50",
			},
			{
				variant: "default",
				checked: false,
				class: "bg-background-elevated peer-focus-visible:ring-ring/50",
			},
			{
				variant: "success",
				checked: true,
				class:
					"bg-green-500 dark:bg-green-600/50 peer-focus-visible:ring-green-500/50",
			},
			{
				variant: "success",
				checked: false,
				class: "bg-background-elevated peer-focus-visible:ring-green-500/50",
			},
			{
				variant: "warning",
				checked: true,
				class:
					"bg-yellow-500 dark:bg-yellow-600/50 peer-focus-visible:ring-yellow-500/50",
			},
			{
				variant: "warning",
				checked: false,
				class: "bg-background-elevated peer-focus-visible:ring-yellow-500/50",
			},
			{
				variant: "destructive",
				checked: true,
				class:
					"bg-red-500 dark:bg-red-600/50 peer-focus-visible:ring-red-500/50",
			},
			{
				variant: "destructive",
				checked: false,
				class: "bg-background-elevated peer-focus-visible:ring-red-500/50",
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
		"inline-block rounded-full bg-background dark:bg-foreground",
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
			{ size: "sm", checked: true, class: "translate-x-4" },
			{ size: "sm", checked: false, class: "translate-x-1" },
			{ size: "md", checked: true, class: "translate-x-5" },
			{ size: "md", checked: false, class: "translate-x-1" },
			{ size: "lg", checked: true, class: "translate-x-5" },
			{ size: "lg", checked: false, class: "translate-x-1" },
		],
		defaultVariants: {
			size: "md",
			checked: false,
		},
	},
);

export interface SwitchProps
	extends Omit<React.ComponentPropsWithoutRef<typeof Ariakit.Checkbox>, "size">,
		Omit<VariantProps<typeof switchVariants>, "checked" | "disabled"> {
	size?: "sm" | "md" | "lg";
	variant?: "default" | "success" | "warning" | "destructive";
	disabled?: boolean;
	className?: string;
	onCheckedChange?: (checked: boolean) => void;
}

export const Switch: React.FC<SwitchProps> = ({
	size = "md",
	variant = "default",
	disabled = false,
	className,
	onCheckedChange,
	checked,
	defaultChecked,
	...props
}) => {
	const id = React.useId();
	const store = Ariakit.useCheckboxStore({
		value: checked,
		setValue: (val) => onCheckedChange?.(val === true),
		defaultValue: defaultChecked ?? false,
	});
	const value = Ariakit.useStoreState(store, "value");
	const isChecked = value === true;

	return (
		<>
			<Ariakit.Checkbox
				id={id}
				store={store}
				role="switch"
				disabled={disabled}
				className="sr-only peer"
				{...props}
			/>
			<label
				htmlFor={id}
				className={cn(
					switchVariants({ size, variant, checked: isChecked, disabled }),
					className,
				)}
			>
				<span className={thumbVariants({ size, checked: isChecked })} />
			</label>
		</>
	);
};
