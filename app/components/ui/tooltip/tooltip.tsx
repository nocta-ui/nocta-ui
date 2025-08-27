"use client";

import { cva, type VariantProps } from "class-variance-authority";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

const tooltipContentVariants = cva(
	`fixed z-50 px-3 py-2 text-sm
   border rounded-lg shadow-lg
   pointer-events-auto
   transition-opacity duration-200 ease-in-out
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
          bg-nocta-100 dark:bg-nocta-900
          text-nocta-900 dark:text-nocta-100
          border-nocta-200 dark:border-nocta-800
        `,
				dark: `
          bg-nocta-100 dark:bg-nocta-900
          text-nocta-900 dark:text-nocta-100
          border-nocta-200 dark:border-nocta-800
        `,
				light: `
          bg-nocta-100 dark:bg-nocta-900
          text-nocta-900 dark:text-nocta-100
          border-nocta-200 dark:border-nocta-800
        `,
			},
		},
		defaultVariants: {
			side: "top",
			align: "center",
			variant: "default",
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
		VariantProps<typeof tooltipContentVariants> {
	children: React.ReactNode;
	className?: string;
	sideOffset?: number;
	alignOffset?: number;

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

	onMouseEnter,
	onMouseLeave,
	...props
}) => {
	const { open, onOpenChange, triggerRef } = useTooltip();
	const contentRef = useRef<HTMLDivElement>(null);
	const [position, setPosition] = useState<{ x: number; y: number } | null>(
		null,
	);
	const [isVisible, setIsVisible] = useState(false);
	const [isMeasuring, setIsMeasuring] = useState(false);
	const [actualSide, setActualSide] = useState<
		"top" | "bottom" | "left" | "right"
	>(side || "top");

	useEffect(() => {
		if (!open) {
			setPosition(null);
			setIsVisible(false);
			setIsMeasuring(false);
			setActualSide(side || "top");
			return;
		}

		setIsMeasuring(true);
		setIsVisible(false);
	}, [open, side]);

	useEffect(() => {
		if (!isMeasuring || !contentRef.current || !triggerRef.current) return;

		const calculatePosition = () => {
			const triggerRect = triggerRef.current!.getBoundingClientRect();
			const contentRect = contentRef.current!.getBoundingClientRect();

			if (contentRect.width === 0 || contentRect.height === 0) {
				requestAnimationFrame(calculatePosition);
				return;
			}

			const viewportWidth = window.innerWidth;
			const viewportHeight = window.innerHeight;
			const margin = 8;

			const getPositionForSide = (
				targetSide: "top" | "bottom" | "left" | "right",
			) => {
				let x = 0;
				let y = 0;

				switch (targetSide) {
					case "top":
						x =
							triggerRect.left + triggerRect.width / 2 - contentRect.width / 2;
						y = triggerRect.top - contentRect.height - sideOffset;
						break;
					case "bottom":
						x =
							triggerRect.left + triggerRect.width / 2 - contentRect.width / 2;
						y = triggerRect.bottom + sideOffset;
						break;
					case "left":
						x = triggerRect.left - contentRect.width - sideOffset;
						y =
							triggerRect.top + triggerRect.height / 2 - contentRect.height / 2;
						break;
					case "right":
						x = triggerRect.right + sideOffset;
						y =
							triggerRect.top + triggerRect.height / 2 - contentRect.height / 2;
						break;
				}

				if (targetSide === "top" || targetSide === "bottom") {
					if (align === "start")
						x = triggerRect.right - contentRect.width + alignOffset;
					if (align === "end") x = triggerRect.left + alignOffset;
				} else {
					if (align === "start")
						y = triggerRect.bottom - contentRect.height + alignOffset;
					if (align === "end") y = triggerRect.top + alignOffset;
				}

				return { x, y };
			};

			const fitsInViewport = (x: number, y: number) => {
				return (
					x >= margin &&
					x + contentRect.width <= viewportWidth - margin &&
					y >= margin &&
					y + contentRect.height <= viewportHeight - margin
				);
			};

			const currentSide = side || "top";
			let bestSide = currentSide;
			let { x, y } = getPositionForSide(currentSide);

			if (!fitsInViewport(x, y)) {
				let oppositeSide: "top" | "bottom" | "left" | "right";

				switch (currentSide) {
					case "top":
						oppositeSide = "bottom";
						break;
					case "bottom":
						oppositeSide = "top";
						break;
					case "left":
						oppositeSide = "right";
						break;
					case "right":
						oppositeSide = "left";
						break;
				}

				const oppositePosition = getPositionForSide(oppositeSide);

				if (fitsInViewport(oppositePosition.x, oppositePosition.y)) {
					bestSide = oppositeSide;
					x = oppositePosition.x;
					y = oppositePosition.y;
				} else {
					const preferredSpaceAvailable =
						currentSide === "top"
							? triggerRect.top
							: currentSide === "bottom"
								? viewportHeight - triggerRect.bottom
								: currentSide === "left"
									? triggerRect.left
									: viewportWidth - triggerRect.right;

					const oppositeSpaceAvailable =
						oppositeSide === "top"
							? triggerRect.top
							: oppositeSide === "bottom"
								? viewportHeight - triggerRect.bottom
								: oppositeSide === "left"
									? triggerRect.left
									: viewportWidth - triggerRect.right;

					if (oppositeSpaceAvailable > preferredSpaceAvailable) {
						bestSide = oppositeSide;
						x = oppositePosition.x;
						y = oppositePosition.y;
					}
				}
			}

			x = Math.max(
				margin,
				Math.min(x, viewportWidth - contentRect.width - margin),
			);
			y = Math.max(
				margin,
				Math.min(y, viewportHeight - contentRect.height - margin),
			);

			setActualSide(bestSide);
			setPosition({ x, y });
			setIsMeasuring(false);

			requestAnimationFrame(() => {
				setIsVisible(true);
			});
		};

		requestAnimationFrame(calculatePosition);
	}, [isMeasuring, side, align, sideOffset, alignOffset, triggerRef]);

	const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
		onMouseEnter?.(e);
	};

	const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
		onOpenChange(false);
		onMouseLeave?.(e);
	};

	if (!open) return null;

	const tooltipContent = (
		<div
			ref={contentRef}
			id="tooltip"
			role="tooltip"
			className={cn(
				tooltipContentVariants({ side: actualSide, align, variant }),
				isMeasuring
					? "opacity-0 pointer-events-none"
					: isVisible && position
						? "opacity-100 scale-100"
						: "opacity-0 scale-95",
				className,
			)}
			style={{
				left: position ? `${position.x}px` : "0px",
				top: position ? `${position.y}px` : "0px",
			}}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			{...props}
		>
			{children}


		</div>
	);

	return createPortal(tooltipContent, document.body);
};
