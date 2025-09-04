"use client";

import { cva, type VariantProps } from "class-variance-authority";
import React, {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";
import { cn } from "@/lib/utils";

const accordionVariants = cva("w-full not-prose", {
	variants: {
		variant: {
			default: "",
			card: "space-y-2",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

const accordionItemVariants = cva(
	"transition-all duration-200 ease-in-out not-prose",
	{
		variants: {
			variant: {
				default:
					"border-b border-nocta-300 dark:border-nocta-800/50 last:border-b-0",
				card: "rounded-lg",
			},
			isOpen: {
				true: "",
				false: "",
			},
		},
		compoundVariants: [
			{
				variant: "card",
				isOpen: true,
				class: "shadow-md dark:shadow-xl",
			},
		],
		defaultVariants: {
			variant: "default",
			isOpen: false,
		},
	},
);

const accordionTriggerVariants = cva(
	"w-full flex items-center justify-between text-left transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-2 focus-visible:ring-offset-nocta-50/50 dark:focus-visible:ring-offset-nocta-900/50 focus-visible:ring-nocta-900/50 dark:focus-visible:ring-nocta-100/50 not-prose",
	{
		variants: {
			variant: {
				default:
					"text-nocta-900 dark:text-nocta-100 hover:text-nocta-700 dark:hover:text-nocta-300",
				card: "text-nocta-900 dark:text-nocta-100 hover:bg-nocta-50 dark:hover:bg-nocta-900/50",
			},
			size: {
				sm: "text-xs",
				md: "text-sm",
				lg: "text-base",
			},
			disabled: {
				true: "opacity-50 cursor-not-allowed",
				false: "cursor-pointer",
			},
			isOpen: {
				true: "",
				false: "",
			},
		},
		compoundVariants: [
			{
				variant: "default",
				size: "sm",
				class: "py-2 px-0",
			},
			{
				variant: "default",
				size: "md",
				class: "py-3 px-0",
			},
			{
				variant: "default",
				size: "lg",
				class: "py-4 px-0",
			},
			{
				variant: "card",
				size: "sm",
				class: "px-4 py-2",
			},
			{
				variant: "card",
				size: "md",
				class: "px-5 py-3",
			},
			{
				variant: "card",
				size: "lg",
				class: "px-6 py-4",
			},
			{
				variant: "card",
				isOpen: true,
				class: "bg-nocta-50/50 dark:bg-nocta-900/30",
			},
		],
		defaultVariants: {
			variant: "default",
			size: "md",
			disabled: false,
			isOpen: false,
		},
	},
);

const accordionContentVariants = cva(
	"overflow-hidden transition-all duration-200 ease-out not-prose",
	{
		variants: {
			size: {
				sm: "text-xs",
				md: "text-sm",
				lg: "text-base",
			},
		},
		defaultVariants: {
			size: "md",
		},
	},
);

const accordionContentInnerVariants = cva(
	"text-nocta-600 dark:text-nocta-400 leading-relaxed",
	{
		variants: {
			variant: {
				default: "",
				card: "border-t border-nocta-100 dark:border-nocta-800/50",
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
				class: "pb-2",
			},
			{
				variant: "default",
				size: "md",
				class: "pb-3",
			},
			{
				variant: "default",
				size: "lg",
				class: "pb-4",
			},
			{
				variant: "card",
				size: "sm",
				class: "px-4 py-2",
			},
			{
				variant: "card",
				size: "md",
				class: "px-5 py-3",
			},
			{
				variant: "card",
				size: "lg",
				class: "px-6 py-4",
			},
		],
		defaultVariants: {
			variant: "default",
			size: "md",
		},
	},
);

export interface AccordionProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof accordionVariants> {
	children: React.ReactNode;
	type?: "single" | "multiple";
	size?: "sm" | "md" | "lg";
	className?: string;
	defaultValue?: string | string[];
	value?: string | string[];
	onValueChange?: (value: string | string[]) => void;
}

export interface AccordionItemProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof accordionItemVariants> {
	children: React.ReactNode;
	value: string;
	className?: string;
	disabled?: boolean;
}

export interface AccordionTriggerProps
	extends Omit<React.HTMLAttributes<HTMLButtonElement>, "disabled">,
		VariantProps<typeof accordionTriggerVariants> {
	children: React.ReactNode;
	className?: string;
	disabled?: boolean;
}

export interface AccordionContentProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof accordionContentVariants> {
	children: React.ReactNode;
	className?: string;
}

interface AccordionContextType {
	type: "single" | "multiple";
	variant: "default" | "card";
	size: "sm" | "md" | "lg";
	openItems: string[];
	toggleItem: (value: string) => void;
	isOpen: (value: string) => boolean;
}

const AccordionContext = createContext<AccordionContextType | undefined>(
	undefined,
);

const useAccordion = () => {
	const context = useContext(AccordionContext);
	if (!context) {
		throw new Error("Accordion components must be used within an Accordion");
	}
	return context;
};

interface AccordionItemContextType {
	value: string;
	isOpen: boolean;
	disabled: boolean;
}

const AccordionItemContext = createContext<
	AccordionItemContextType | undefined
>(undefined);

const useAccordionItem = () => {
	const context = useContext(AccordionItemContext);
	if (!context) {
		throw new Error(
			"AccordionTrigger and AccordionContent must be used within an AccordionItem",
		);
	}
	return context;
};

export const Accordion: React.FC<AccordionProps> = React.memo(
	({
		children,
		type = "single",
		variant = "default",
		size = "md",
		className,
		defaultValue,
		value: controlledValue,
		onValueChange,
		...props
	}) => {
		const [internalValue, setInternalValue] = useState<string[]>(() => {
			if (defaultValue) {
				return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
			}
			return [];
		});

		const openItems = useMemo(() => {
			return controlledValue
				? Array.isArray(controlledValue)
					? controlledValue
					: [controlledValue]
				: internalValue;
		}, [controlledValue, internalValue]);

		const toggleItem = useCallback(
			(itemValue: string) => {
				let newValue: string[];

				if (type === "single") {
					newValue = openItems.includes(itemValue) ? [] : [itemValue];
				} else {
					newValue = openItems.includes(itemValue)
						? openItems.filter((v) => v !== itemValue)
						: [...openItems, itemValue];
				}

				if (!controlledValue) {
					setInternalValue(newValue);
				}

				if (onValueChange) {
					onValueChange(type === "single" ? newValue[0] || "" : newValue);
				}
			},
			[type, openItems, controlledValue, onValueChange],
		);

		const isOpen = useCallback(
			(itemValue: string) => openItems.includes(itemValue),
			[openItems],
		);

		const contextValue = useMemo(
			() => ({
				type,
				variant: variant!,
				size: size!,
				openItems,
				toggleItem,
				isOpen,
			}),
			[type, variant, size, openItems, toggleItem, isOpen],
		);

		return (
			<AccordionContext.Provider value={contextValue}>
				<div
					className={cn(accordionVariants({ variant }), className)}
					{...props}
				>
					{children}
				</div>
			</AccordionContext.Provider>
		);
	},
);

Accordion.displayName = "Accordion";

export const AccordionItem: React.FC<AccordionItemProps> = React.memo(
	({ children, value, className, disabled = false, ...props }) => {
		const { variant, isOpen } = useAccordion();
		const itemIsOpen = isOpen(value);

		const contextValue = useMemo(
			() => ({
				value,
				isOpen: itemIsOpen,
				disabled,
			}),
			[value, itemIsOpen, disabled],
		);

		if (variant === "card") {
			return (
				<AccordionItemContext.Provider value={contextValue}>
					<div
						className={cn(
							accordionItemVariants({ variant, isOpen: itemIsOpen }),
							className,
						)}
						{...props}
					>
						<div className="relative bg-nocta-100 dark:bg-nocta-900 border rounded-lg shadow-lg overflow-hidden transition-all duration-200 ease-out not-prose">
							<span
								aria-hidden
								className="pointer-events-none absolute -inset-px rounded-xl bg-gradient-to-b to-transparent opacity-60"
								style={{
									maskImage:
										"radial-gradient(120% 100% at 50% 0%, black 30%, transparent 70%)",
									WebkitMaskImage:
										"radial-gradient(120% 100% at 50% 0%, black 30%, transparent 70%)",
								}}
							/>
							{children}
						</div>
					</div>
				</AccordionItemContext.Provider>
			);
		}

		return (
			<AccordionItemContext.Provider value={contextValue}>
				<div
					className={cn(
						accordionItemVariants({ variant, isOpen: itemIsOpen }),
						className,
					)}
					{...props}
				>
					{children}
				</div>
			</AccordionItemContext.Provider>
		);
	},
);

AccordionItem.displayName = "AccordionItem";

export const AccordionTrigger: React.FC<AccordionTriggerProps> = React.memo(
	({ children, className, ...props }) => {
		const { variant, size, toggleItem } = useAccordion();
		const { value, isOpen, disabled } = useAccordionItem();

		const handleClick = useCallback(() => {
			if (!disabled) {
				toggleItem(value);
			}
		}, [disabled, toggleItem, value]);

		const handleKeyDown = useCallback(
			(e: React.KeyboardEvent) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					handleClick();
				}
			},
			[handleClick],
		);

		const iconSize = useMemo(() => {
			return size === "sm" ? 14 : size === "md" ? 16 : 20;
		}, [size]);

		return (
			<button
				className={cn(
					accordionTriggerVariants({
						variant,
						size,
						disabled: disabled || false,
						isOpen,
					}),
					className,
				)}
				onClick={handleClick}
				onKeyDown={handleKeyDown}
				aria-expanded={isOpen}
				disabled={disabled}
				{...props}
			>
				<span className="font-medium">{children}</span>
				<svg
					width={iconSize}
					height={iconSize}
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth={2}
					strokeLinecap="round"
					strokeLinejoin="round"
					className={cn(
						"transition-transform duration-200 ease-in-out flex-shrink-0 ml-2 text-nocta-500 dark:text-nocta-400 will-change-transform",
						isOpen ? "rotate-180" : "rotate-0",
					)}
				>
					<path d="m6 9 6 6 6-6" />
				</svg>
			</button>
		);
	},
);

AccordionTrigger.displayName = "AccordionTrigger";

export const AccordionContent: React.FC<AccordionContentProps> = React.memo(
	({ children, className, ...props }) => {
		const { variant, size } = useAccordion();
		const { isOpen } = useAccordionItem();
		const contentRef = React.useRef<HTMLDivElement>(null);
		const innerRef = React.useRef<HTMLDivElement>(null);
		const [height, setHeight] = useState<number>(0);
		const rafRef = React.useRef<number | undefined>(undefined);

		const updateHeight = useCallback(() => {
			if (rafRef.current) {
				cancelAnimationFrame(rafRef.current);
			}

			rafRef.current = requestAnimationFrame(() => {
				if (innerRef.current) {
					const newHeight = innerRef.current.scrollHeight;
					setHeight(newHeight);
				}
			});
		}, []);

		React.useEffect(() => {
			if (!innerRef.current) return;

			const resizeObserver = new ResizeObserver(() => {
				updateHeight();
			});

			resizeObserver.observe(innerRef.current);
			updateHeight();

			return () => {
				resizeObserver.disconnect();
				if (rafRef.current) {
					cancelAnimationFrame(rafRef.current);
				}
			};
		}, [updateHeight]);

		React.useEffect(() => {
			updateHeight();
		}, [children, updateHeight]);

		const contentStyle = useMemo(
			() => ({
				height: isOpen ? `${height}px` : "0px",
				opacity: isOpen ? 1 : 0,
			}),
			[isOpen, height],
		);

		return (
			<div
				ref={contentRef}
				className={cn(accordionContentVariants({ size }), className)}
				style={contentStyle}
				{...props}
			>
				<div
					ref={innerRef}
					className={cn(accordionContentInnerVariants({ variant, size }))}
				>
					{children}
				</div>
			</div>
		);
	},
);

AccordionContent.displayName = "AccordionContent";
