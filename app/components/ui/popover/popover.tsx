"use client";

import { cva, type VariantProps } from "class-variance-authority";
import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const popoverTriggerVariants = cva(
	"inline-flex items-center justify-center rounded-lg border focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-2 focus-visible:ring-nocta-500/50 dark:focus-visible:ring-nocta-400/50 focus-visible:ring-offset-nocta-50/50 dark:focus-visible:ring-offset-nocta-900/50 transition-colors duration-200 not-prose cursor-pointer",
	{
		variants: {
			variant: {
				default:
					"border-nocta-200 dark:border-nocta-50/5 bg-nocta-100 dark:bg-neutral-900 text-nocta-900 dark:text-nocta-100 hover:bg-nocta-50 dark:hover:bg-nocta-900",
			},
			size: {
				sm: "px-2 py-1 text-xs",
				md: "px-3 py-2 text-sm",
				lg: "px-4 py-3 text-base",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "md",
		},
	},
);

const popoverContentVariants = cva(
	"w-fit min-w-[8rem] max-w-[var(--popover-content-available-width,_theme(spacing.80))] rounded-lg bg-nocta-100 dark:bg-nocta-900 p-4 shadow-lg dark:shadow-xl not-prose relative overflow-hidden border border-nocta-200 dark:border-nocta-800",
	{
		variants: {
			size: {
				sm: "p-2 text-sm",
				md: "p-4 text-sm",
				lg: "p-6 text-base",
			},
		},
		defaultVariants: {
			size: "md",
		},
	},
);

const popoverAnimationVariants = cva(
	"transform transition-opacity transition-scale transition-transform duration-200 ease-out",
	{
		variants: {
			side: {
				top: "",
				bottom: "",
				left: "",
				right: "",
			},
			state: {
				measuring: "opacity-0 pointer-events-none",
				visible: "translate-y-0 opacity-100 scale-100",
				hidden: "opacity-0 scale-95",
			},
		},
		compoundVariants: [
			{
				side: "top",
				state: "hidden",
				class: "translate-y-1",
			},
			{
				side: "bottom",
				state: "hidden",
				class: "-translate-y-1",
			},
			{
				side: "left",
				state: "hidden",
				class: "translate-x-1",
			},
			{
				side: "right",
				state: "hidden",
				class: "-translate-x-1",
			},
		],
		defaultVariants: {
			side: "bottom",
			state: "hidden",
		},
	},
);



export interface PopoverProps {
	children: React.ReactNode;
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export interface PopoverTriggerProps
	extends VariantProps<typeof popoverTriggerVariants> {
	children: React.ReactNode;
	asChild?: boolean;
	className?: string;
}

export interface PopoverContentProps
	extends VariantProps<typeof popoverContentVariants> {
	children: React.ReactNode;
	className?: string;
	side?: "top" | "right" | "bottom" | "left";
	align?: "start" | "center" | "end";
	sideOffset?: number;
	alignOffset?: number;
	avoidCollisions?: boolean;
	onEscapeKeyDown?: (event: KeyboardEvent) => void;
	onPointerDownOutside?: (event: PointerEvent) => void;
}



const PopoverContext = React.createContext<{
	open: boolean;
	setOpen: (open: boolean) => void;
	triggerRef: React.RefObject<HTMLElement | null>;
	contentId: string;
}>({
	open: false,
	setOpen: () => {},
	triggerRef: { current: null },
	contentId: "",
});

export const Popover: React.FC<PopoverProps> = ({
	children,
	open: controlledOpen,
	defaultOpen = false,
	onOpenChange,
}) => {
	const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
	const triggerRef = useRef<HTMLElement>(null);
	const contentId = useId();

	const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;

	const setOpen = (newOpen: boolean) => {
		if (controlledOpen === undefined) {
			setUncontrolledOpen(newOpen);
		}
		onOpenChange?.(newOpen);
	};

	return (
		<PopoverContext.Provider
			value={{
				open,
				setOpen,
				triggerRef,
				contentId,
			}}
		>
			<div className="relative not-prose">{children}</div>
		</PopoverContext.Provider>
	);
};

export const PopoverTrigger: React.FC<PopoverTriggerProps> = ({
	children,
	asChild = false,
	className = "",
	variant = "default",
	size = "md",
}) => {
	const { open, setOpen, triggerRef, contentId } =
		React.useContext(PopoverContext);

	const handleClick = () => {
		setOpen(!open);
	};

	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			setOpen(!open);
		}
	};

	if (asChild && React.isValidElement(children)) {
		const childProps = children.props as Record<string, unknown>;
		return React.cloneElement(
			children as React.ReactElement<Record<string, unknown>>,
			{
				ref: triggerRef,
				"aria-expanded": open,
				"aria-controls": contentId,
				"aria-haspopup": "dialog",
				onClick: handleClick,
				onKeyDown: handleKeyDown,
				className:
					`${(childProps.className as string) || ""} ${className}`.trim(),
			},
		);
	}

	return (
		<button
			ref={triggerRef as React.RefObject<HTMLButtonElement>}
			type="button"
			aria-expanded={open}
			aria-controls={contentId}
			aria-haspopup="dialog"
			onClick={handleClick}
			onKeyDown={handleKeyDown}
			className={cn(
				popoverTriggerVariants({ variant, size }),
				"font-medium",
				className,
			)}
		>
			{children}
		</button>
	);
};

export const PopoverContent: React.FC<PopoverContentProps> = ({
	children,
	className = "",
	side = "bottom",
	align = "center",
	sideOffset = 8,
	alignOffset = 0,
	avoidCollisions = true,
	onEscapeKeyDown,
	onPointerDownOutside,
	size = "md",
}) => {
	const { open, setOpen, triggerRef, contentId } =
		React.useContext(PopoverContext);
	const contentRef = useRef<HTMLDivElement>(null);
	const [position, setPosition] = useState<{
		top: number;
		left: number;
	} | null>(null);
	const [actualSide, setActualSide] = useState(side);
	const [isVisible, setIsVisible] = useState(false);
	const [shouldRender, setShouldRender] = useState(false);
	const [isMeasuring, setIsMeasuring] = useState(false);

	useEffect(() => {
		if (open) {
			setShouldRender(true);
			setIsMeasuring(true);
			setIsVisible(false);
			setPosition(null);
		} else {
			setIsVisible(false);
			setIsMeasuring(false);
			const timer = setTimeout(() => {
				setShouldRender(false);
				setPosition(null);
			}, 200);
			return () => clearTimeout(timer);
		}
	}, [open]);

	const calculatePosition = useCallback(() => {
		if (!contentRef.current || !triggerRef.current) return;

		const triggerRect = triggerRef.current.getBoundingClientRect();
		const contentRect = contentRef.current.getBoundingClientRect();

		if (contentRect.width === 0 || contentRect.height === 0) {
			if (isMeasuring) {
				requestAnimationFrame(calculatePosition);
			}
			return;
		}

		const viewport = {
			width: window.innerWidth,
			height: window.innerHeight,
		};

		let finalSide = side;
		let top = 0;
		let left = 0;

		switch (side) {
			case "top":
				top = triggerRect.top - contentRect.height - sideOffset;
				break;
			case "bottom":
				top = triggerRect.bottom + sideOffset;
				break;
			case "left":
				left = triggerRect.left - contentRect.width - sideOffset;
				break;
			case "right":
				left = triggerRect.right + sideOffset;
				break;
		}

		if (side === "top" || side === "bottom") {
			switch (align) {
				case "start":
					left = triggerRect.left + alignOffset;
					break;
				case "center":
					left =
						triggerRect.left +
						triggerRect.width / 2 -
						contentRect.width / 2 +
						alignOffset;
					break;
				case "end":
					left = triggerRect.right - contentRect.width + alignOffset;
					break;
			}
		} else {
			switch (align) {
				case "start":
					top = triggerRect.top + alignOffset;
					break;
				case "center":
					top =
						triggerRect.top +
						triggerRect.height / 2 -
						contentRect.height / 2 +
						alignOffset;
					break;
				case "end":
					top = triggerRect.bottom - contentRect.height + alignOffset;
					break;
			}
		}

		if (avoidCollisions) {
			if (side === "top" && top < 0) {
				finalSide = "bottom";
				top = triggerRect.bottom + sideOffset;
			} else if (
				side === "bottom" &&
				top + contentRect.height > viewport.height
			) {
				finalSide = "top";
				top = triggerRect.top - contentRect.height - sideOffset;
			} else if (side === "left" && left < 0) {
				finalSide = "right";
				left = triggerRect.right + sideOffset;
			} else if (
				side === "right" &&
				left + contentRect.width > viewport.width
			) {
				finalSide = "left";
				left = triggerRect.left - contentRect.width - sideOffset;
			}

			if (side === "top" || side === "bottom") {
				left = Math.max(
					8,
					Math.min(left, viewport.width - contentRect.width - 8),
				);
			} else {
				top = Math.max(
					8,
					Math.min(top, viewport.height - contentRect.height - 8),
				);
			}
		}

		setPosition({ top, left });
		setActualSide(finalSide);

		if (isMeasuring) {
			setIsMeasuring(false);
			requestAnimationFrame(() => {
				setIsVisible(true);
			});
		}
	}, [
		side,
		align,
		sideOffset,
		alignOffset,
		avoidCollisions,
		isMeasuring,
		triggerRef,
	]);

	useEffect(() => {
		if (!isMeasuring) return;

		requestAnimationFrame(calculatePosition);
	}, [isMeasuring, calculatePosition]);

	useEffect(() => {
		if (!open || isMeasuring) return;

		window.addEventListener("scroll", calculatePosition, true);
		window.addEventListener("resize", calculatePosition);

		return () => {
			window.removeEventListener("scroll", calculatePosition, true);
			window.removeEventListener("resize", calculatePosition);
		};
	}, [open, isMeasuring, calculatePosition]);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				onEscapeKeyDown?.(event);
				if (!event.defaultPrevented) {
					setOpen(false);
				}
			}
		};

		const handlePointerDown = (event: PointerEvent) => {
			const target = event.target as Node;
			const isClickInContent = contentRef.current?.contains(target);
			const isClickInTrigger = triggerRef.current?.contains(target);

			if (!isClickInContent && !isClickInTrigger) {
				onPointerDownOutside?.(event);
				if (!event.defaultPrevented) {
					setOpen(false);
				}
			}
		};

		if (open) {
			document.addEventListener("keydown", handleKeyDown);
			document.addEventListener("pointerdown", handlePointerDown);
		}

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			document.removeEventListener("pointerdown", handlePointerDown);
		};
	}, [open, onEscapeKeyDown, onPointerDownOutside, setOpen, triggerRef]);

	if (!shouldRender) return null;

	const animationState = isMeasuring
		? "measuring"
		: isVisible && position
			? "visible"
			: "hidden";

	return (
		<div
			ref={contentRef}
			id={contentId}
			role="dialog"
			aria-modal="false"
			style={{
				position: "fixed",
				top: position ? `${position.top}px` : "0px",
				left: position ? `${position.left}px` : "0px",
				zIndex: 50,
			}}
			className={cn(
				popoverContentVariants({ size }),
				popoverAnimationVariants({ side: actualSide, state: animationState }),
				className,
			)}
		>
			<span
				aria-hidden
				className="pointer-events-none absolute -inset-px rounded-lg bg-gradient-to-b to-transparent opacity-60"
				style={{
					maskImage:
						"radial-gradient(120% 100% at 50% 0%, black 30%, transparent 70%)",
					WebkitMaskImage:
						"radial-gradient(120% 100% at 50% 0%, black 30%, transparent 70%)",
				}}
			/>
			{children}
		</div>
	);
};
