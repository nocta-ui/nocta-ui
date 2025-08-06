"use client";

import { cva, type VariantProps } from "class-variance-authority";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

const sheetContentVariants = cva(
	"fixed flex flex-col bg-nocta-100 dark:bg-nocta-900 border-nocta-300 dark:border-nocta-800/50 overflow-hidden shadow-xl dark:shadow-2xl border transform transition-transform duration-300 ease-in-out",
	{
		variants: {
			side: {
				left: "left-0 top-0 h-full rounded-r-2xl",
				right: "right-0 top-0 h-full rounded-l-2xl",
				top: "top-0 left-0 w-full rounded-b-2xl",
				bottom: "bottom-0 left-0 w-full rounded-t-2xl",
			},
			size: {
				sm: "",
				md: "",
				lg: "",
				xl: "",
				full: "",
			},
		},
		compoundVariants: [
			{
				side: "left",
				size: "sm",
				class: "w-[70vw] sm:w-80",
			},
			{
				side: "left",
				size: "md",
				class: "w-[80vw] sm:w-96",
			},
			{
				side: "left",
				size: "lg",
				class: "w-[90vw] sm:w-[28rem]",
			},
			{
				side: "left",
				size: "xl",
				class: "w-[95vw] sm:w-[32rem]",
			},
			{
				side: "left",
				size: "full",
				class: "w-full",
			},
			{
				side: "right",
				size: "sm",
				class: "w-[70vw] sm:w-80",
			},
			{
				side: "right",
				size: "md",
				class: "w-[80vw] sm:w-96",
			},
			{
				side: "right",
				size: "lg",
				class: "w-[90vw] sm:w-[28rem]",
			},
			{
				side: "right",
				size: "xl",
				class: "w-[95vw] sm:w-[32rem]",
			},
			{
				side: "right",
				size: "full",
				class: "w-full",
			},
			{
				side: "top",
				size: "sm",
				class: "h-[40vh] sm:h-80",
			},
			{
				side: "top",
				size: "md",
				class: "h-[55vh] sm:h-96",
			},
			{
				side: "top",
				size: "lg",
				class: "h-[70vh] sm:h-[28rem]",
			},
			{
				side: "top",
				size: "xl",
				class: "h-[85vh] sm:h-[32rem]",
			},
			{
				side: "top",
				size: "full",
				class: "h-full",
			},
			{
				side: "bottom",
				size: "sm",
				class: "h-[40vh] sm:h-80",
			},
			{
				side: "bottom",
				size: "md",
				class: "h-[55vh] sm:h-96",
			},
			{
				side: "bottom",
				size: "lg",
				class: "h-[70vh] sm:h-[28rem]",
			},
			{
				side: "bottom",
				size: "xl",
				class: "h-[85vh] sm:h-[32rem]",
			},
			{
				side: "bottom",
				size: "full",
				class: "h-full",
			},
		],
		defaultVariants: {
			side: "right",
			size: "md",
		},
	},
);

const sheetAnimationVariants = cva("", {
	variants: {
		side: {
			left: "",
			right: "",
			top: "",
			bottom: "",
		},
		isVisible: {
			true: "",
			false: "",
		},
	},
	compoundVariants: [
		{
			side: "left",
			isVisible: true,
			class: "translate-x-0",
		},
		{
			side: "left",
			isVisible: false,
			class: "-translate-x-full",
		},
		{
			side: "right",
			isVisible: true,
			class: "translate-x-0",
		},
		{
			side: "right",
			isVisible: false,
			class: "translate-x-full",
		},
		{
			side: "top",
			isVisible: true,
			class: "translate-y-0",
		},
		{
			side: "top",
			isVisible: false,
			class: "-translate-y-full",
		},
		{
			side: "bottom",
			isVisible: true,
			class: "translate-y-0",
		},
		{
			side: "bottom",
			isVisible: false,
			class: "translate-y-full",
		},
	],
	defaultVariants: {
		side: "right",
		isVisible: false,
	},
});

export interface SheetProps {
	children: React.ReactNode;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export interface SheetTriggerProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode;
	asChild?: boolean;
	className?: string;
}

export interface SheetContentProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof sheetContentVariants> {
	children: React.ReactNode;
	className?: string;
	showClose?: boolean;
}

export interface SheetHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
	className?: string;
}

export interface SheetTitleProps
	extends React.HTMLAttributes<HTMLHeadingElement> {
	children: React.ReactNode;
	className?: string;
	as?: React.ElementType;
}

export interface SheetDescriptionProps
	extends React.HTMLAttributes<HTMLParagraphElement> {
	children: React.ReactNode;
	className?: string;
}

export interface SheetFooterProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
	className?: string;
}

export interface SheetCloseProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children?: React.ReactNode;
	className?: string;
	asChild?: boolean;
}

interface SheetContextType {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

const SheetContext = React.createContext<SheetContextType | undefined>(
	undefined,
);

const useSheet = () => {
	const context = React.useContext(SheetContext);
	if (!context) {
		throw new Error("Sheet components must be used within a Sheet");
	}
	return context;
};

export const Sheet: React.FC<SheetProps> = ({
	children,
	open: controlledOpen,
	onOpenChange,
}) => {
	const [internalOpen, setInternalOpen] = useState(false);

	const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
	const setOpen = onOpenChange || setInternalOpen;

	return (
		<SheetContext.Provider value={{ open, onOpenChange: setOpen }}>
			{children}
		</SheetContext.Provider>
	);
};

export const SheetTrigger: React.FC<SheetTriggerProps> = ({
	children,
	className = "",
	asChild = false,
	onClick,
	...props
}) => {
	const { onOpenChange } = useSheet();

	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		onOpenChange(true);
		onClick?.(e);
	};

	if (asChild && React.isValidElement(children)) {
		return React.cloneElement(
			children as React.ReactElement<
				React.ButtonHTMLAttributes<HTMLButtonElement>
			>,
			{
				onClick: handleClick,
				...(children.props || {}),
			},
		);
	}

	return (
		<button
			className={cn(
				"inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-2 focus-visible:ring-offset-nocta-50/50 dark:focus-visible:ring-offset-nocta-900/50 focus-visible:ring-nocta-900/50 dark:focus-visible:ring-nocta-100/50 not-prose cursor-pointer",
				className,
			)}
			onClick={handleClick}
			{...props}
		>
			{children}
		</button>
	);
};

export const SheetContent: React.FC<SheetContentProps> = ({
	children,
	className = "",
	side = "right",
	size = "md",
	showClose = true,
	...props
}) => {
	const { open, onOpenChange } = useSheet();
	const contentRef = useRef<HTMLDivElement>(null);
	const [isVisible, setIsVisible] = useState(false);
	const [shouldRender, setShouldRender] = useState(false);
	const previousActiveElementRef = useRef<HTMLElement | null>(null);

	const getFocusableElements = () => {
		if (!contentRef.current) return [];

		const focusableSelectors = [
			"button:not([disabled])",
			"input:not([disabled])",
			"textarea:not([disabled])",
			"select:not([disabled])",
			"a[href]",
			'[tabindex]:not([tabindex="-1"])',
		].join(", ");

		return Array.from(
			contentRef.current.querySelectorAll(focusableSelectors),
		) as HTMLElement[];
	};

	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			if (e.key === "Escape") {
				onOpenChange(false);
				return;
			}

			if (e.key === "Tab") {
				const focusableElements = getFocusableElements();
				if (focusableElements.length === 0) return;

				const firstElement = focusableElements[0];
				const lastElement = focusableElements[focusableElements.length - 1];
				const activeElement = document.activeElement as HTMLElement;

				if (e.shiftKey) {
					if (
						activeElement === firstElement ||
						!contentRef.current?.contains(activeElement)
					) {
						e.preventDefault();
						lastElement.focus();
					}
				} else {
					if (
						activeElement === lastElement ||
						!contentRef.current?.contains(activeElement)
					) {
						e.preventDefault();
						firstElement.focus();
					}
				}
			}
		},
		[onOpenChange],
	);

	useEffect(() => {
		if (open) {
			previousActiveElementRef.current = document.activeElement as HTMLElement;

			setShouldRender(true);
			const timer = setTimeout(() => {
				setIsVisible(true);
				const focusableElements = getFocusableElements();
				if (focusableElements.length > 0) {
					focusableElements[0].focus();
				} else {
					contentRef.current?.focus();
				}
			}, 10);

			return () => clearTimeout(timer);
		} else {
			setIsVisible(false);
			const timer = setTimeout(() => {
				setShouldRender(false);
				if (previousActiveElementRef.current) {
					previousActiveElementRef.current.focus();
				}
			}, 300);

			return () => clearTimeout(timer);
		}
	}, [open]);

	useEffect(() => {
		if (!open) return;

		const handleClickOutside = (e: MouseEvent) => {
			if (
				contentRef.current &&
				!contentRef.current.contains(e.target as Node)
			) {
				onOpenChange(false);
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		document.addEventListener("mousedown", handleClickOutside);

		document.body.style.overflow = "hidden";

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			document.removeEventListener("mousedown", handleClickOutside);
			document.body.style.overflow = "";
		};
	}, [open, handleKeyDown, onOpenChange]);

	if (typeof window === "undefined" || !shouldRender) {
		return null;
	}

	return createPortal(
		<div className="fixed inset-0 z-50">
			<div
				className={cn(
					"fixed inset-0 bg-nocta-950/50 dark:bg-nocta-950/70 backdrop-blur-sm transition-opacity duration-300 ease-in-out",
					isVisible ? "opacity-100" : "opacity-0",
				)}
				aria-hidden="true"
			/>

			<div
				ref={contentRef}
				className={cn(
					sheetContentVariants({ side, size }),
					sheetAnimationVariants({ side, isVisible }),
					className,
				)}
				role="dialog"
				aria-modal="true"
				tabIndex={-1}
				{...props}
			>
				{showClose && (
					<button
						onClick={() => onOpenChange(false)}
						className="absolute top-4 right-4 p-1 rounded-md text-nocta-500 dark:text-nocta-400 hover:text-nocta-700 dark:hover:text-nocta-200 hover:bg-nocta-100 dark:hover:bg-nocta-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-nocta-500/50 transition-colors duration-200 ease-in-out z-10 cursor-pointer"
						aria-label="Close sheet"
					>
						<svg
							className="w-4 h-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				)}

				{children}
			</div>
		</div>,
		document.body,
	);
};

export const SheetHeader: React.FC<SheetHeaderProps> = ({
	children,
	className = "",
	...props
}) => {
	return (
		<div
			className={cn(
				"px-6 py-5 border-b border-nocta-200 dark:border-nocta-800/50 not-prose",
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
};

export const SheetTitle: React.FC<SheetTitleProps> = ({
	children,
	className = "",
	as: Component = "h2",
	...props
}) => {
	return React.createElement(
		Component,
		{
			className: cn(
				"text-lg font-semibold text-nocta-900 dark:text-nocta-100 tracking-tight leading-tight not-prose",
				className,
			),
			...props,
		},
		children,
	);
};

export const SheetDescription: React.FC<SheetDescriptionProps> = ({
	children,
	className = "",
	...props
}) => {
	return (
		<p
			className={cn(
				"text-sm text-nocta-600 dark:text-nocta-400 leading-relaxed mt-1 not-prose",
				className,
			)}
			{...props}
		>
			{children}
		</p>
	);
};

export const SheetFooter: React.FC<SheetFooterProps> = ({
	children,
	className = "",
	...props
}) => {
	return (
		<div
			className={cn(
				"px-6 py-4 mt-auto bg-nocta-200/50 dark:bg-nocta-800/50 border-t border-nocta-200 dark:border-nocta-800/50 flex items-center justify-end gap-3 not-prose",
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
};

export const SheetClose: React.FC<SheetCloseProps> = ({
	children,
	className = "",
	asChild = false,
	onClick,
	...props
}) => {
	const { onOpenChange } = useSheet();

	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		onOpenChange(false);
		onClick?.(e);
	};

	if (asChild && React.isValidElement(children)) {
		return React.cloneElement(
			children as React.ReactElement<
				React.ButtonHTMLAttributes<HTMLButtonElement>
			>,
			{
				onClick: handleClick,
				...(children.props || {}),
			},
		);
	}

	return (
		<button
			className={cn(
				"inline-flex items-center justify-center rounded-lg font-medium px-4 py-2 text-sm bg-transparent text-nocta-900 dark:text-nocta-100 hover:bg-nocta-200 dark:hover:bg-nocta-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-2 cursor-pointer",
				className,
			)}
			onClick={handleClick}
			{...props}
		>
			{children || "Close"}
		</button>
	);
};
