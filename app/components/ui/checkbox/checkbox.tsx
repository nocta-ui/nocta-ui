"use client";

import {
	Checkbox as AriakitCheckbox,
	useCheckboxStore,
	useStoreState,
} from "@ariakit/react";
import { cva, type VariantProps } from "class-variance-authority";
import type React from "react";
import { Icons } from "@/app/components/ui/icons/icons";
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
				checked: true,
				class:
					"bg-foreground-muted border-border has-[:focus-visible]:ring-ring/50",
			},
			{
				checked: false,
				class:
					"bg-background-muted border-border has-[:focus-visible]:ring-ring/50",
			},
		],
		defaultVariants: {
			size: "md",
			checked: false,
			disabled: false,
		},
	},
);

const iconVariants = cva(
	["transition-opacity duration-200 ease-in-out text-background"],
	{
		variants: {
			size: {
				sm: "h-3 w-3",
				md: "h-4 w-4",
				lg: "h-4.5 w-4.5",
			},
			checked: {
				true: "opacity-100",
				false: "opacity-0",
			},
		},
		defaultVariants: {
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
	defaultChecked?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({
	checked,
	onCheckedChange,
	defaultChecked,
	size = "md",
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
				checkboxVariants({ size, checked: isChecked, disabled }),
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
			<Icons.Check
				aria-hidden="true"
				className={iconVariants({ size, checked: isChecked })}
			/>
		</label>
	);
};
