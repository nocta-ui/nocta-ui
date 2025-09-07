"use client";

import { cva, type VariantProps } from "class-variance-authority";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

type Side = "top" | "bottom" | "left" | "right";

const tooltipContentVariants = cva(
	`fixed z-50 px-3 py-2 text-sm
   border rounded-lg shadow-lg
   pointer-events-auto
   not-prose  overflow-hidden`,
	{
		variants: {
			side: {
				top: "",
				bottom: "",
				left: "",
				right: "",
			},
			align: {
				start: "",
				center: "",
				end: "",
			},
			variant: {
				default: `
          bg-nocta-200 dark:bg-nocta-800
          text-nocta-900 dark:text-nocta-100
          border-nocta-300 dark:border-nocta-50/5
        `
			},
		},
		defaultVariants: {
			side: "top",
			align: "center",
			variant: "default",
		},
	},
);

const tooltipAnimationVariants = cva(
	"transform duration-200 ease-in-out",
	{
		variants: {
			side: {
				top: "",
				bottom: "",
				left: "",
				right: "",
			},
			state: {
				measuring:
					"opacity-0 scale-95 pointer-events-none invisible transition-all",
				visible:
					"translate-y-0 opacity-100 scale-100 origin-center transition-[opacity,scale,transform]",
				hidden: "opacity-0 scale-95 transition-[opacity,translate,scale]",
			},
		},
		compoundVariants: [
			{ side: "top", state: "hidden", class: "translate-y-1 origin-top" },
			{ side: "bottom", state: "hidden", class: "-translate-y-1 origin-bottom" },
			{ side: "left", state: "hidden", class: "translate-x-1 origin-left" },
			{ side: "right", state: "hidden", class: "-translate-x-1 origin-right" },
			{ side: "top", state: "measuring", class: "translate-y-1 origin-top" },
			{ side: "bottom", state: "measuring", class: "-translate-y-1 origin-bottom" },
			{ side: "left", state: "measuring", class: "translate-x-1 origin-left" },
			{ side: "right", state: "measuring", class: "-translate-x-1 origin-right" },
		],
		defaultVariants: {
			side: "top",
			state: "hidden",
		},
	},
);

export interface TooltipProps {
	children: React.ReactNode;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	delayDuration?: number;
}

export interface TooltipTriggerProps extends React.HTMLAttributes<HTMLElement> {
	children: React.ReactNode;
	asChild?: boolean;
	className?: string;
}

export interface TooltipContentProps
	extends React.HTMLAttributes<HTMLDivElement>,
		Omit<VariantProps<typeof tooltipContentVariants>, 'side'> {
	children: React.ReactNode;
	className?: string;
	side?: Side;
	sideOffset?: number;
	alignOffset?: number;
	avoidCollisions?: boolean;
}

interface TooltipContextType {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	triggerRef: React.RefObject<HTMLElement | null>;
	delayDuration: number;
}

const TooltipContext = React.createContext<TooltipContextType | undefined>(
	undefined,
);

const useTooltip = () => {
	const context = React.useContext(TooltipContext);
	if (!context) {
		throw new Error("Tooltip components must be used within a Tooltip");
	}
	return context;
};

export const Tooltip: React.FC<TooltipProps> = ({
	children,
	open: controlledOpen,
	onOpenChange,
	delayDuration = 400,
}) => {
	const [internalOpen, setInternalOpen] = useState(false);
	const triggerRef = useRef<HTMLElement | null>(null);

	const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
	const setOpen = onOpenChange || setInternalOpen;

	return (
		<TooltipContext.Provider
			value={{
				open,
				onOpenChange: setOpen,
				triggerRef,
				delayDuration,
			}}
		>
			{children}
		</TooltipContext.Provider>
	);
};

export const TooltipTrigger: React.FC<TooltipTriggerProps> = ({
	children,
	className = "",
	asChild = false,
	onMouseEnter,
	onMouseLeave,
	onFocus,
	onBlur,
	...props
}) => {
	const { onOpenChange, triggerRef, delayDuration } = useTooltip();
	const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const leaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
		if (leaveTimeoutRef.current) {
			clearTimeout(leaveTimeoutRef.current);
		}
		hoverTimeoutRef.current = setTimeout(() => {
			onOpenChange(true);
		}, delayDuration);
		onMouseEnter?.(e);
	};

	const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
		if (hoverTimeoutRef.current) {
			clearTimeout(hoverTimeoutRef.current);
		}
		leaveTimeoutRef.current = setTimeout(() => {
			onOpenChange(false);
		}, 100);
		onMouseLeave?.(e);
	};

	const handleFocus = (e: React.FocusEvent<HTMLElement>) => {
		onOpenChange(true);
		onFocus?.(e);
	};

	const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
		onOpenChange(false);
		onBlur?.(e);
	};

	useEffect(() => {
		return () => {
			if (hoverTimeoutRef.current) {
				clearTimeout(hoverTimeoutRef.current);
			}
			if (leaveTimeoutRef.current) {
				clearTimeout(leaveTimeoutRef.current);
			}
		};
	}, []);

	if (asChild && React.isValidElement(children)) {
		type ChildProps = React.HTMLAttributes<HTMLElement> & {
			onMouseEnter?: React.MouseEventHandler<HTMLElement>;
			onMouseLeave?: React.MouseEventHandler<HTMLElement>;
			onFocus?: React.FocusEventHandler<HTMLElement>;
			onBlur?: React.FocusEventHandler<HTMLElement>;
		};

		const childElement = children as React.ReactElement<ChildProps>;

		type ElementWithRef = React.ReactElement & {
			ref?: React.Ref<HTMLElement> | undefined;
		};

		return React.cloneElement(childElement, {
			ref: (node: HTMLElement | null) => {
				if (triggerRef) {
					triggerRef.current = node;
				}
				const childWithRef = children as ElementWithRef;
				const childRef = childWithRef.ref;
				if (typeof childRef === "function") {
					childRef(node);
				} else if (
					childRef &&
					typeof childRef === "object" &&
					"current" in childRef
				) {
					(childRef as { current: HTMLElement | null }).current = node;
				}
			},
			onMouseEnter: handleMouseEnter,
			onMouseLeave: handleMouseLeave,
			onFocus: handleFocus,
			onBlur: handleBlur,
			"aria-describedby": "tooltip",
			...childElement.props,
		} as Partial<ChildProps> & { ref: React.Ref<HTMLElement> });
	}

	return (
		<span
			ref={triggerRef}
			className={cn("inline-block cursor-default not-prose", className)}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			onFocus={handleFocus}
			onBlur={handleBlur}
			aria-describedby="tooltip"
			{...props}
		>
			{children}
		</span>
	);
};

export const TooltipContent: React.FC<TooltipContentProps> = ({
	children,
	className = "",
	side = "top",
	align = "center",
	variant = "default",
	sideOffset = 8,
	alignOffset = 0,
	avoidCollisions = true,

	onMouseEnter,
	onMouseLeave,
	...props
}) => {
	const { open, onOpenChange, triggerRef } = useTooltip();
	const contentRef = useRef<HTMLDivElement>(null);
	const [position, setPosition] = useState<{ top: number; left: number } | null>(
		null,
	);
	const [actualSide, setActualSide] = useState<Side>(side);
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
		const contentWidth = contentRef.current.offsetWidth;
		const contentHeight = contentRef.current.offsetHeight;

		if (contentWidth === 0 || contentHeight === 0) {
			if (isMeasuring) {
				requestAnimationFrame(calculatePosition);
			}
			return;
		}

		const viewport = {
			width: window.innerWidth,
			height: window.innerHeight,
		};

		let finalSide: Side = side;
		let top = 0;
		let left = 0;

		switch (side) {
			case "top":
				top = triggerRect.top - contentHeight - sideOffset;
				break;
			case "bottom":
				top = triggerRect.bottom + sideOffset;
				break;
			case "left":
				left = triggerRect.left - contentWidth - sideOffset;
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
						contentWidth / 2 +
						alignOffset;
					break;
				case "end":
					left = triggerRect.right - contentWidth + alignOffset;
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
						contentHeight / 2 +
						alignOffset;
					break;
				case "end":
					top = triggerRect.bottom - contentHeight + alignOffset;
					break;
			}
		}

		if (avoidCollisions) {
			if (side === "top" && top < 0) {
				finalSide = "bottom";
				top = triggerRect.bottom + sideOffset;
			} else if (side === "bottom" && top + contentHeight > viewport.height) {
				finalSide = "top";
				top = triggerRect.top - contentHeight - sideOffset;
			} else if (side === "left" && left < 0) {
				finalSide = "right";
				left = triggerRect.right + sideOffset;
			} else if (side === "right" && left + contentWidth > viewport.width) {
				finalSide = "left";
				left = triggerRect.left - contentWidth - sideOffset;
			}

			if (side === "top" || side === "bottom") {
				left = Math.max(8, Math.min(left, viewport.width - contentWidth - 8));
			} else {
				top = Math.max(8, Math.min(top, viewport.height - contentHeight - 8));
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
	}, [side, align, sideOffset, alignOffset, avoidCollisions, isMeasuring, triggerRef]);

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

	const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
		onMouseEnter?.(e);
	};

	const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
		onOpenChange(false);
		onMouseLeave?.(e);
	};

	if (!shouldRender) return null;

	const animationState = isMeasuring
		? "measuring"
		: isVisible && position
			? "visible"
			: "hidden";

	const tooltipContent = (
		<div
			ref={contentRef}
			id="tooltip"
			role="tooltip"
			style={{
				position: "fixed",
				top: position ? `${position.top}px` : "-10000px",
				left: position ? `${position.left}px` : "-10000px",
				zIndex: 50,
			}}
			className={cn(
				tooltipContentVariants({ side: actualSide, align, variant }),
				tooltipAnimationVariants({ side: actualSide, state: animationState }),
				className,
			)}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			{...props}
		>
			{children}
		</div>
	);

	return createPortal(tooltipContent, document.body);
};
