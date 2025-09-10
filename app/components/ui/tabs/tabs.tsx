"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type React from "react";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const tabsListVariants = cva(
	"inline-flex items-center justify-center transition-all duration-200 ease-in-out not-prose",
	{
		variants: {
			orientation: {
				horizontal: "flex-row",
				vertical: "flex-col w-fit",
			},
			variant: {
				default: "rounded-lg bg-background",
				pills: "gap-1",
				underline: "border-b border-muted gap-0",
			},
			size: {
				sm: "",
				md: "",
				lg: "",
			},
		},
		compoundVariants: [
			{
				variant: "default",
				size: "sm",
				class: "p-0.5",
			},
			{
				variant: "default",
				size: "md",
				class: "p-1",
			},
			{
				variant: "default",
				size: "lg",
				class: "p-1.5",
			},
		],
		defaultVariants: {
			orientation: "horizontal",
			variant: "default",
			size: "md",
		},
	},
);

const tabsTriggerVariants = cva(
	`inline-flex items-center justify-center whitespace-nowrap
   font-medium transition-all duration-200 ease-in-out
   focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-2
  
   focus-visible:ring-ring
   disabled:pointer-events-none disabled:opacity-50 cursor-pointer
   not-prose`,
	{
		variants: {
			variant: {
				default: `
          w-full rounded-md
          text-foreground-muted
          hover:text-foreground
          data-[state=active]:bg-background-muted
          data-[state=active]:text-foreground
          data-[state=active]:shadow-sm
        `,
				pills: `
          rounded-lg
          text-foreground-muted
          hover:bg-background
          hover:text-foreground
          data-[state=active]:bg-foreground-muted
          data-[state=active]:text-primary-foreground
          data-[state=active]:shadow-sm
        `,
				underline: `
          border-b-2 border-transparent
          text-foreground-muted
          hover:text-foreground
          border-muted
          data-[state=active]:border-border
          data-[state=active]:text-foreground
        `,
			},
			size: {
				sm: "",
				md: "",
				lg: "",
			},
		},
		compoundVariants: [
			{
				variant: "default",
				size: "sm",
				class: "px-2 py-1 text-xs",
			},
			{
				variant: "default",
				size: "md",
				class: "px-3 py-1.5 text-sm",
			},
			{
				variant: "default",
				size: "lg",
				class: "px-4 py-2 text-base",
			},
			{
				variant: "pills",
				size: "sm",
				class: "px-3 py-1.5 text-xs",
			},
			{
				variant: "pills",
				size: "md",
				class: "px-4 py-2 text-sm",
			},
			{
				variant: "pills",
				size: "lg",
				class: "px-6 py-2.5 text-base",
			},
			{
				variant: "underline",
				size: "sm",
				class: "px-3 py-2 text-xs",
			},
			{
				variant: "underline",
				size: "md",
				class: "px-4 py-3 text-sm",
			},
			{
				variant: "underline",
				size: "lg",
				class: "px-6 py-4 text-base",
			},
		],
		defaultVariants: {
			variant: "default",
			size: "md",
		},
	},
);

interface TabsContextValue {
	value: string;
	onValueChange: (value: string) => void;
	orientation: "horizontal" | "vertical";
	variant: "default" | "pills" | "underline";
	size: "sm" | "md" | "lg";
	disabled?: boolean;
}

const TabsContext = createContext<TabsContextValue | null>(null);

const useTabsContext = () => {
	const context = useContext(TabsContext);
	if (!context) {
		throw new Error("useTabsContext must be used within a Tabs component");
	}
	return context;
};

export interface TabsProps {
	children: React.ReactNode;
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	orientation?: "horizontal" | "vertical";
	variant?: "default" | "pills" | "underline";
	size?: "sm" | "md" | "lg";
	className?: string;
	disabled?: boolean;
}

export interface TabsListProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof tabsListVariants> {
	children: React.ReactNode;
	className?: string;
}

export interface TabsTriggerProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof tabsTriggerVariants> {
	children: React.ReactNode;
	value: string;
	className?: string;
	disabled?: boolean;
}

export interface TabsContentProps {
	children: React.ReactNode;
	value: string;
	className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
	children,
	value: controlledValue,
	defaultValue,
	onValueChange,
	orientation = "horizontal",
	variant = "default",
	size = "md",
	className = "",
	disabled = false,
}) => {
	const [uncontrolledValue, setUncontrolledValue] = useState(
		defaultValue || "",
	);

	const value =
		controlledValue !== undefined ? controlledValue : uncontrolledValue;

	const handleValueChange = (newValue: string) => {
		if (disabled) return;

		if (controlledValue === undefined) {
			setUncontrolledValue(newValue);
		}
		onValueChange?.(newValue);
	};

	const contextValue: TabsContextValue = {
		value,
		onValueChange: handleValueChange,
		orientation,
		variant,
		size,
		disabled,
	};

	return (
		<TabsContext.Provider value={contextValue}>
			<div
				className={cn(
					"not-prose",
					orientation === "vertical" ? "flex gap-4" : "",
					className,
				)}
				data-orientation={orientation}
			>
				{children}
			</div>
		</TabsContext.Provider>
	);
};

export const TabsList: React.FC<TabsListProps> = ({
	children,
	className = "",
	orientation: propOrientation,
	variant: propVariant,
	size: propSize,
	...props
}) => {
	const {
		orientation: contextOrientation,
		variant: contextVariant,
		size: contextSize,
	} = useTabsContext();
	const listRef = useRef<HTMLDivElement>(null);

	const orientation = propOrientation || contextOrientation;
	const variant = propVariant || contextVariant;
	const size = propSize || contextSize;

	const handleKeyDown = (event: React.KeyboardEvent) => {
		const triggers = listRef.current?.querySelectorAll(
			'[role="tab"]:not([disabled])',
		) as NodeListOf<HTMLButtonElement>;
		if (!triggers || triggers.length === 0) return;

		const currentIndex = Array.from(triggers).findIndex(
			(trigger) => trigger === document.activeElement,
		);
		let nextIndex = currentIndex;

		switch (event.key) {
			case "ArrowLeft":
			case "ArrowUp":
				event.preventDefault();
				nextIndex = currentIndex <= 0 ? triggers.length - 1 : currentIndex - 1;
				break;
			case "ArrowRight":
			case "ArrowDown":
				event.preventDefault();
				nextIndex = currentIndex >= triggers.length - 1 ? 0 : currentIndex + 1;
				break;
			case "Home":
				event.preventDefault();
				nextIndex = 0;
				break;
			case "End":
				event.preventDefault();
				nextIndex = triggers.length - 1;
				break;
			default:
				return;
		}

		triggers[nextIndex]?.focus();
	};

	return (
		<div
			ref={listRef}
			role="tablist"
			aria-orientation={orientation}
			className={cn(
				tabsListVariants({ orientation, variant, size }),
				className,
			)}
			onKeyDown={handleKeyDown}
			{...props}
		>
			{children}
		</div>
	);
};

export const TabsTrigger: React.FC<TabsTriggerProps> = ({
	children,
	value,
	className = "",
	disabled = false,
	variant: propVariant,
	size: propSize,
	...props
}) => {
	const {
		value: selectedValue,
		onValueChange,
		variant: contextVariant,
		size: contextSize,
		disabled: contextDisabled,
	} = useTabsContext();
	const isSelected = selectedValue === value;
	const isDisabled = disabled || contextDisabled;

	const variant = propVariant || contextVariant;
	const size = propSize || contextSize;

	return (
		<button
			role="tab"
			type="button"
			aria-selected={isSelected}
			aria-controls={`tab-content-${value}`}
			data-state={isSelected ? "active" : "inactive"}
			disabled={isDisabled}
			className={cn(tabsTriggerVariants({ variant, size }), className)}
			onClick={() => onValueChange(value)}
			{...props}
		>
			{children}
		</button>
	);
};

export const TabsContent: React.FC<TabsContentProps> = ({
	children,
	value,
	className = "",
}) => {
	const { value: selectedValue } = useTabsContext();
	const isSelected = selectedValue === value;
	const [isMounted, setIsMounted] = useState(isSelected);

	useEffect(() => {
		if (isSelected) {
			setIsMounted(true);
		}
	}, [isSelected]);

	if (!isMounted && !isSelected) {
		return null;
	}

	return (
		<div
			role="tabpanel"
			id={`tab-content-${value}`}
			aria-labelledby={`tab-trigger-${value}`}
			data-state={isSelected ? "active" : "inactive"}
			className={cn(
				"focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-2 focus-visible:ring-ring not-prose",
				isSelected ? "block" : "hidden",
				className,
			)}
			tabIndex={0}
		>
			{children}
		</div>
	);
};
