"use client";

import * as Ariakit from "@ariakit/react";
import { cva, type VariantProps } from "class-variance-authority";
import React from "react";
import { Icons } from "@/app/components/ui/icons/icons";
import { cn } from "@/lib/utils";

const selectTriggerVariants = cva(
	`flex w-fit items-center justify-between
   rounded-md border border-border
   bg-background
   placeholder:text-foreground-subtle
   focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-1 
   focus-visible:ring-offset-ring-offset/50 not-prose focus-visible:ring-ring/50 
   focus-visible:border-border
   disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer
   transition-all duration-200 ease-in-out
   hover:bg-background-muted/50
   shadow-xs not-prose`,
	{
		variants: {
			size: {
				sm: "h-8 px-2 text-xs",
				md: "h-10 px-3 text-sm",
				lg: "h-12 px-4 text-base",
			},
		},
		defaultVariants: {
			size: "md",
		},
	},
);

export interface SelectProps {
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	disabled?: boolean;
	children: React.ReactNode;
	size?: "sm" | "md" | "lg";
}

export interface SelectTriggerProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof selectTriggerVariants> {
	children: React.ReactNode;
	className?: string;
}

export interface SelectContentProps {
	children: React.ReactNode;
	className?: string;
	portal?: boolean;
	fixed?: boolean;
}

export interface SelectItemProps {
	value: string;
	children: React.ReactNode;
	className?: string;
	disabled?: boolean;
}

export interface SelectValueProps {
	placeholder?: string;
	className?: string;
}

type InternalCtx = {
	size: "sm" | "md" | "lg";
	disabled?: boolean;
};

const InternalContext = React.createContext<InternalCtx>({ size: "md" });

export const Select: React.FC<SelectProps> = ({
	value: controlledValue,
	defaultValue,
	onValueChange,
	disabled = false,
	children,
	size = "md",
}) => {
	const store = Ariakit.useSelectStore({
		value: controlledValue,
		defaultValue,
		setValue: (v) => onValueChange?.(String(v ?? "")),
		animated: true,
	});

	return (
		<Ariakit.SelectProvider store={store}>
			<InternalContext.Provider value={{ size, disabled }}>
				<div className="relative not-prose">{children}</div>
			</InternalContext.Provider>
		</Ariakit.SelectProvider>
	);
};

export const SelectTrigger: React.FC<SelectTriggerProps> = ({
	children,
	className = "",
	size: propSize,
	...props
}) => {
	const ctx = React.useContext(InternalContext);
	const select = Ariakit.useSelectContext();
	const isOpen = Ariakit.useStoreState(select, (s) => s?.open ?? false);
	const size = propSize || ctx.size || "md";

	return (
		<Ariakit.Select
			disabled={ctx.disabled}
			className={cn(selectTriggerVariants({ size }), className)}
			{...props}
		>
			{children}
			<Icons.ChevronDown
				aria-hidden="true"
				className={cn(
					"ml-2 h-4 w-4 shrink-0 opacity-50 transition-transform duration-200 ease-in-out",
					isOpen && "rotate-180",
				)}
			/>
		</Ariakit.Select>
	);
};

export const SelectContent: React.FC<SelectContentProps> = ({
	children,
	className = "",
	portal = true,
	fixed = false,
}) => {
	return (
		<Ariakit.SelectPopover
			sameWidth
			portal={portal}
			fixed={fixed}
			className={cn(
				"absolute z-[999] my-1 rounded-md border border-border bg-background shadow-sm overflow-hidden",
				"transform transition-all duration-200 ease-in-out origin-top -translate-y-1 opacity-0 scale-95 data-[enter]:translate-y-0 data-[enter]:opacity-100 data-[enter]:scale-100 data-[leave]:-translate-y-1 data-[leave]:opacity-0 data-[leave]:scale-95",
				"not-prose",
				className,
			)}
		>
			<div className="max-h-42 overflow-auto py-1 flex flex-col gap-1 z-50">
				{children}
			</div>
		</Ariakit.SelectPopover>
	);
};

export const SelectItem: React.FC<SelectItemProps> = ({
	value,
	children,
	className = "",
	disabled = false,
}) => {
	const select = Ariakit.useSelectContext();
	const isSelected = Ariakit.useStoreState(select, (s) => s?.value === value);

	return (
		<Ariakit.SelectItem
			value={value}
			disabled={disabled}
			className={cn(
				"relative flex cursor-pointer select-none items-center justify-between px-3 py-2 text-sm outline-none mx-1 rounded-sm text-primary-muted hover:text-primary hover:bg-background-muted focus-visible:bg-background-muted transition-colors duration-150",
				isSelected && "bg-background-muted text-primary font-medium",
				disabled && "opacity-50 cursor-not-allowed pointer-events-none",
				className,
			)}
		>
			<span className="flex-1">{children}</span>
			{isSelected && (
				<Icons.Check
					aria-hidden="true"
					className="ml-2 h-4 w-4 text-primary-muted"
				/>
			)}
		</Ariakit.SelectItem>
	);
};

export const SelectValue: React.FC<SelectValueProps> = ({
	placeholder = "Select an option...",
	className = "",
}) => {
	const select = Ariakit.useSelectContext();
	const currentValue = Ariakit.useStoreState(select, (s) => s?.value ?? "");
	const items = Ariakit.useStoreState(select, (s) => s?.items ?? []);
	const currentItem = items.find((item) => item.value === currentValue);

	return (
		<span
			className={cn(
				"block text-left text-primary truncate whitespace-pre-wrap",
				className,
			)}
		>
			{currentItem ? (
				currentItem.element?.textContent
			) : (
				<span className="text-foreground-subtle whitespace-pre-wrap">
					{placeholder}
				</span>
			)}
		</span>
	);
};
