"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type React from "react";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

const contextMenuContentVariants = cva(
	`z-50 min-w-[10rem] overflow-hidden rounded-md border
   bg-nocta-50 dark:bg-nocta-950 border-nocta-300 dark:border-nocta-800
   p-1 text-nocta-950 dark:text-nocta-50 shadow-lg
   not-prose`,
	{
		variants: {
			side: {
				top: "",
				right: "",
				bottom: "",
				left: "",
			},
			align: {
				start: "",
				center: "",
				end: "",
			},
		},
		defaultVariants: {
			side: "bottom",
			align: "start",
		},
	},
);

export interface ContextMenuProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
	className?: string;
}

export interface ContextMenuTriggerProps
	extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
	className?: string;
	disabled?: boolean;
}

export interface ContextMenuContentProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof contextMenuContentVariants> {
	children: React.ReactNode;
	className?: string;
	sideOffset?: number;
	alignOffset?: number;
	avoidCollisions?: boolean;
	onEscapeKeyDown?: (event: KeyboardEvent) => void;
	onPointerDownOutside?: (event: PointerEvent) => void;
}

export interface ContextMenuItemProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode;
	className?: string;
	disabled?: boolean;
	inset?: boolean;
}

export interface ContextMenuSeparatorProps
	extends React.HTMLAttributes<HTMLDivElement> {
	className?: string;
}

export interface ContextMenuSubProps
	extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export interface ContextMenuSubTriggerProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode;
	className?: string;
	disabled?: boolean;
	inset?: boolean;
}

export interface ContextMenuSubContentProps
	extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
	className?: string;
}

interface ContextMenuContextType {
	open: boolean;
	setOpen: (open: boolean) => void;
	triggerRef: React.RefObject<HTMLDivElement | null>;
	contentRef: React.RefObject<HTMLDivElement | null>;
	position: { x: number; y: number };
	setPosition: (position: { x: number; y: number }) => void;
}

const ContextMenuContext = createContext<ContextMenuContextType | undefined>(
	undefined,
);

const useContextMenu = () => {
	const context = useContext(ContextMenuContext);
	if (!context) {
		throw new Error("ContextMenu components must be used within a ContextMenu");
	}
	return context;
};

interface ContextMenuSubContextType {
	open: boolean;
	setOpen: (open: boolean) => void;
	triggerRef: React.RefObject<HTMLButtonElement | null>;
	contentRef: React.RefObject<HTMLDivElement | null>;
	hoverTimeoutRef: React.RefObject<NodeJS.Timeout | null>;
}

const ContextMenuSubContext = createContext<
	ContextMenuSubContextType | undefined
>(undefined);

const useContextMenuSub = () => {
	const context = useContext(ContextMenuSubContext);
	if (!context) {
		throw new Error(
			"ContextMenuSub components must be used within a ContextMenuSub",
		);
	}
	return context;
};

export const ContextMenu: React.FC<ContextMenuProps> = ({
	children,
	className = "",
	...props
}) => {
	const [open, setOpen] = useState(false);
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const triggerRef = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);

	return (
		<ContextMenuContext.Provider
			value={{
				open,
				setOpen,
				triggerRef,
				contentRef,
				position,
				setPosition,
			}}
		>
			<div className={cn("not-prose", className)} {...props}>
				{children}
			</div>
		</ContextMenuContext.Provider>
	);
};

export const ContextMenuTrigger: React.FC<ContextMenuTriggerProps> = ({
	children,
	className = "",
	disabled = false,
	...props
}) => {
	const { setOpen, setPosition, triggerRef } = useContextMenu();

	const handleContextMenu = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (disabled) return;

		setPosition({ x: e.clientX, y: e.clientY });
		setOpen(true);
	};

	return (
		<div
			ref={triggerRef}
			className={cn(
				className,
				disabled ? "pointer-events-none opacity-50" : "",
			)}
			onContextMenu={handleContextMenu}
			{...props}
		>
			{children}
		</div>
	);
};

export const ContextMenuContent: React.FC<ContextMenuContentProps> = ({
	children,
	className = "",
	side = "bottom",
	align = "start",
	sideOffset = 4,
	alignOffset = 0,
	avoidCollisions = true,
	onEscapeKeyDown,
	onPointerDownOutside,
	...props
}) => {
	const { open, setOpen, contentRef, position } = useContextMenu();
	const [calculatedPosition, setCalculatedPosition] = useState<{
		top: number;
		left: number;
	} | null>(null);
	const [isVisible, setIsVisible] = useState(false);
	const [shouldRender, setShouldRender] = useState(false);
	const [isMeasuring, setIsMeasuring] = useState(false);
	const positionRef = useRef(position);

	useEffect(() => {
		positionRef.current = position;
	}, [position]);

	useEffect(() => {
		if (open) {
			setShouldRender(true);
			setIsMeasuring(true);
			setIsVisible(false);
			setCalculatedPosition(null);
		} else {
			setIsVisible(false);
			setIsMeasuring(false);
			const timer = setTimeout(() => {
				setShouldRender(false);
				setCalculatedPosition(null);
			}, 200);
			return () => clearTimeout(timer);
		}
	}, [open]);

	const calculateMenuPosition = useCallback(() => {
		if (!contentRef.current || !open || !isMeasuring) return;

		const contentRect = contentRef.current.getBoundingClientRect();

		if (contentRect.width === 0 || contentRect.height === 0) {
			requestAnimationFrame(calculateMenuPosition);
			return;
		}

		const viewport = {
			width: window.innerWidth,
			height: window.innerHeight,
		};

		const currentPosition = positionRef.current;
		let top = currentPosition.y;
		let left = currentPosition.x;

		switch (side) {
			case "top":
				top = currentPosition.y - contentRect.height - sideOffset;
				break;
			case "bottom":
				top = currentPosition.y + sideOffset;
				break;
			case "left":
				left = currentPosition.x - contentRect.width - sideOffset;
				break;
			case "right":
				left = currentPosition.x + sideOffset;
				break;
		}

		if (side === "top" || side === "bottom") {
			switch (align) {
				case "center":
					left = currentPosition.x - contentRect.width / 2 + alignOffset;
					break;
				case "end":
					left = currentPosition.x - contentRect.width + alignOffset;
					break;
				default:
					left = currentPosition.x + alignOffset;
			}
		} else {
			switch (align) {
				case "center":
					top = currentPosition.y - contentRect.height / 2 + alignOffset;
					break;
				case "end":
					top = currentPosition.y - contentRect.height + alignOffset;
					break;
				default:
					top = currentPosition.y + alignOffset;
			}
		}

		if (avoidCollisions) {
			if (left + contentRect.width > viewport.width) {
				left = viewport.width - contentRect.width - 8;
			}
			if (left < 8) {
				left = 8;
			}
			if (top + contentRect.height > viewport.height) {
				top = viewport.height - contentRect.height - 8;
			}
			if (top < 8) {
				top = 8;
			}
		}

		setCalculatedPosition({ top, left });
		setIsMeasuring(false);

		requestAnimationFrame(() => {
			setIsVisible(true);
		});
	}, [
		open,
		isMeasuring,
		side,
		align,
		sideOffset,
		alignOffset,
		avoidCollisions,
		contentRef,
	]);

	useEffect(() => {
		if (!isMeasuring) return;

		requestAnimationFrame(calculateMenuPosition);
	}, [isMeasuring, calculateMenuPosition]);

	const getFocusableElements = useCallback(() => {
		if (!contentRef.current) return [];

		const focusableSelectors = [
			'[role="menuitem"]:not([disabled])',
			'[role="menuitemcheckbox"]:not([disabled])',
			'[role="menuitemradio"]:not([disabled])',
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
	}, [contentRef]);

	useEffect(() => {
		if (!open) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				e.preventDefault();
				onEscapeKeyDown?.(e);
				setOpen(false);
				return;
			}

			if (!contentRef.current) return;

			const focusableElements = getFocusableElements();

			if (focusableElements.length === 0) return;

			if (e.key === "Tab") {
				const firstElement = focusableElements[0];
				const lastElement = focusableElements[focusableElements.length - 1];
				const activeElement = document.activeElement as HTMLElement;

				if (e.shiftKey) {
					if (
						activeElement === firstElement ||
						!contentRef.current?.contains(activeElement)
					) {
						e.preventDefault();
						lastElement.focus({ preventScroll: true });
					}
				} else {
					if (
						activeElement === lastElement ||
						!contentRef.current?.contains(activeElement)
					) {
						e.preventDefault();
						firstElement.focus({ preventScroll: true });
					}
				}
				return;
			}

			const activeElement = document.activeElement as HTMLElement;
			const isInSubmenu = activeElement?.closest('[data-submenu="true"]');

			if (isInSubmenu) return;

			const currentIndex = focusableElements.indexOf(activeElement);

			switch (e.key) {
				case "ArrowDown": {
					e.preventDefault();
					const nextIndex =
						currentIndex < focusableElements.length - 1 ? currentIndex + 1 : 0;
					focusableElements[nextIndex]?.focus({ preventScroll: true });
					break;
				}
				case "ArrowUp": {
					e.preventDefault();
					const prevIndex =
						currentIndex > 0 ? currentIndex - 1 : focusableElements.length - 1;
					focusableElements[prevIndex]?.focus({ preventScroll: true });
					break;
				}
				case "ArrowRight":
					e.preventDefault();
					if (activeElement?.getAttribute("aria-haspopup") === "menu") {
						activeElement.click();
					}
					break;
				case "Home":
					e.preventDefault();
					focusableElements[0]?.focus({ preventScroll: true });
					break;
				case "End":
					e.preventDefault();
					focusableElements[focusableElements.length - 1]?.focus({
						preventScroll: true,
					});
					break;
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [open, onEscapeKeyDown, setOpen, getFocusableElements, contentRef]);

	useEffect(() => {
		if (!open) return;

		const handlePointerDown = (e: PointerEvent) => {
			const target = e.target as Node;
			if (contentRef.current && !contentRef.current.contains(target)) {
				onPointerDownOutside?.(e);
				setOpen(false);
			}
		};

		document.addEventListener("pointerdown", handlePointerDown);

		document.body.style.overflow = "hidden";

		return () => {
			document.removeEventListener("pointerdown", handlePointerDown);
			document.body.style.overflow = "";
		};
	}, [open, onPointerDownOutside, setOpen, contentRef]);

	useEffect(() => {
		if (open && isVisible && contentRef.current) {
			const firstFocusable = contentRef.current.querySelector(
				'[role="menuitem"]:not([disabled])',
			) as HTMLElement;
			if (firstFocusable) {
				firstFocusable.focus({ preventScroll: true });
			}
		}
	}, [open, isVisible, contentRef]);

	if (!shouldRender || typeof window === "undefined") {
		return null;
	}

	const animationStyles = `
    transition-opacity transition-scale transition-transform duration-200 ease-out
    ${
			isMeasuring
				? "opacity-0 pointer-events-none"
				: isVisible && calculatedPosition
					? "opacity-100 scale-100"
					: "opacity-0 scale-95"
		}
  `;

	return createPortal(
		<div
			ref={contentRef}
			className={cn(
				contextMenuContentVariants({ side, align }),
				animationStyles,
				className,
			)}
			style={{
				position: "fixed",
				top: calculatedPosition ? `${calculatedPosition.top}px` : "0px",
				left: calculatedPosition ? `${calculatedPosition.left}px` : "0px",
			}}
			role="menu"
			aria-orientation="vertical"
			data-state={open ? "open" : "closed"}
			data-side={side}
			{...props}
		>
			<div className="flex flex-col gap-1">{children}</div>
		</div>,
		document.body,
	);
};

export const ContextMenuItem: React.FC<ContextMenuItemProps> = ({
	children,
	className = "",
	disabled = false,
	inset = false,
	onClick,
	...props
}) => {
	const { setOpen } = useContextMenu();

	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		if (disabled) return;
		onClick?.(e);
		setOpen(false);
	};

	const baseStyles = `
    w-full relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm
    outline-none transition-colors focus-visible:bg-nocta-100 dark:focus-visible:bg-nocta-800
    focus-visible:text-nocta-900 dark:focus-visible:text-nocta-50 data-[disabled]:pointer-events-none
    data-[disabled]:opacity-50 hover:bg-nocta-100 dark:hover:bg-nocta-900
    hover:text-nocta-900 dark:hover:text-nocta-50
  `;

	return (
		<button
			className={cn(baseStyles, inset ? "pl-8" : "", className)}
			role="menuitem"
			disabled={disabled}
			data-disabled={disabled ? "" : undefined}
			onClick={handleClick}
			{...props}
		>
			{children}
		</button>
	);
};

export const ContextMenuSeparator: React.FC<ContextMenuSeparatorProps> = ({
	className = "",
	...props
}) => {
	return (
		<div
			className={`-mx-1 my-1 h-px bg-nocta-200 dark:bg-nocta-900 ${className}`}
			role="separator"
			{...props}
		/>
	);
};

export const ContextMenuSub: React.FC<ContextMenuSubProps> = ({
	children,
	open: controlledOpen,
	onOpenChange,
	...props
}) => {
	const [internalOpen, setInternalOpen] = useState(false);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);
	const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
	const setOpen = onOpenChange || setInternalOpen;

	useEffect(() => {
		const timeoutRef = hoverTimeoutRef.current;
		return () => {
			if (timeoutRef) {
				clearTimeout(timeoutRef);
			}
		};
	}, []);

	return (
		<ContextMenuSubContext.Provider
			value={{
				open,
				setOpen,
				triggerRef,
				contentRef,
				hoverTimeoutRef,
			}}
		>
			<div {...props}>{children}</div>
		</ContextMenuSubContext.Provider>
	);
};

export const ContextMenuSubTrigger: React.FC<ContextMenuSubTriggerProps> = ({
	children,
	className = "",
	disabled = false,
	inset = false,
	onClick,
	...props
}) => {
	const { open, setOpen, triggerRef, hoverTimeoutRef } = useContextMenuSub();

	const handleMouseEnter = () => {
		if (disabled) return;

		if (hoverTimeoutRef.current) {
			clearTimeout(hoverTimeoutRef.current);
			hoverTimeoutRef.current = null;
		}
		setOpen(true);
	};

	const handleMouseLeave = () => {
		if (disabled) return;

		hoverTimeoutRef.current = setTimeout(() => {
			setOpen(false);
		}, 150);
	};

	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		if (disabled) return;

		e.preventDefault();
		e.stopPropagation();
		setOpen(!open);
		onClick?.(e);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
		if (disabled) return;

		if (e.key === "ArrowRight" || e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			setOpen(true);

			setTimeout(() => {
				const submenu = document.querySelector(
					'[role="menu"][data-submenu="true"]',
				);
				const firstItem = submenu?.querySelector(
					'[role="menuitem"]:not([disabled])',
				) as HTMLElement;
				firstItem?.focus({ preventScroll: true });
			}, 0);
		}
	};

	const baseStyles = `
    w-full relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm
    outline-none transition-colors focus-visible:bg-nocta-100 dark:focus-visible:bg-nocta-800
    focus-visible:text-nocta-900 dark:focus-visible:text-nocta-50 data-[disabled]:pointer-events-none
    data-[disabled]:opacity-50 hover:bg-nocta-100 dark:hover:bg-nocta-900
    hover:text-nocta-900 dark:hover:text-nocta-50
  `;

	return (
		<button
			ref={triggerRef}
			className={cn(baseStyles, inset ? "pl-8" : "", className)}
			role="menuitem"
			aria-haspopup="menu"
			aria-expanded={open}
			disabled={disabled}
			data-disabled={disabled ? "" : undefined}
			onClick={handleClick}
			onKeyDown={handleKeyDown}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			{...props}
		>
			<span className="flex-1 flex justify-start items-center">{children}</span>
			<svg
				className="w-4 h-4 ml-2"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				aria-hidden="true"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					d="M9 5l7 7-7 7"
				/>
			</svg>
		</button>
	);
};

export const ContextMenuSubContent: React.FC<ContextMenuSubContentProps> = ({
	children,
	className = "",
	...props
}) => {
	const { open, setOpen, triggerRef, contentRef, hoverTimeoutRef } =
		useContextMenuSub();
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		if (open && triggerRef.current && contentRef.current) {
			const triggerRect = triggerRef.current.getBoundingClientRect();
			const contentRect = contentRef.current.getBoundingClientRect();

			let left = triggerRect.right + 4;
			let top = triggerRect.top;

			const viewport = {
				width: window.innerWidth,
				height: window.innerHeight,
			};

			if (left + contentRect.width > viewport.width) {
				left = triggerRect.left - contentRect.width - 4;
			}
			if (top + contentRect.height > viewport.height) {
				top = viewport.height - contentRect.height - 8;
			}
			if (top < 8) {
				top = 8;
			}

			setPosition({ x: left, y: top });
			setIsVisible(true);
		} else {
			setIsVisible(false);
		}
	}, [open, contentRef, triggerRef]);

	const handleMouseEnter = () => {
		if (hoverTimeoutRef.current) {
			clearTimeout(hoverTimeoutRef.current);
			hoverTimeoutRef.current = null;
		}
		setOpen(true);
	};

	const handleMouseLeave = () => {
		hoverTimeoutRef.current = setTimeout(() => {
			setOpen(false);
		}, 150);
	};

	useEffect(() => {
		if (!open || !contentRef.current) return;

		const getFocusableElements = () => {
			if (!contentRef.current) return [];

			const focusableSelectors = [
				'[role="menuitem"]:not([disabled])',
				'[role="menuitemcheckbox"]:not([disabled])',
				'[role="menuitemradio"]:not([disabled])',
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

		const handleKeyDown = (e: KeyboardEvent) => {
			if (!contentRef.current?.contains(e.target as Node)) return;

			const focusableElements = getFocusableElements();
			if (focusableElements.length === 0) return;

			const activeElement = document.activeElement as HTMLElement;
			const currentIndex = focusableElements.indexOf(activeElement);

			switch (e.key) {
				case "ArrowDown": {
					e.preventDefault();
					const nextIndex =
						currentIndex < focusableElements.length - 1 ? currentIndex + 1 : 0;
					focusableElements[nextIndex]?.focus({ preventScroll: true });
					break;
				}
				case "ArrowUp": {
					e.preventDefault();
					const prevIndex =
						currentIndex > 0 ? currentIndex - 1 : focusableElements.length - 1;
					focusableElements[prevIndex]?.focus({ preventScroll: true });
					break;
				}
				case "ArrowLeft":
					e.preventDefault();
					setOpen(false);
					triggerRef.current?.focus({ preventScroll: true });
					break;
				case "Escape":
					e.preventDefault();
					setOpen(false);
					triggerRef.current?.focus({ preventScroll: true });
					break;
				case "Home":
					e.preventDefault();
					focusableElements[0]?.focus({ preventScroll: true });
					break;
				case "End":
					e.preventDefault();
					focusableElements[focusableElements.length - 1]?.focus({
						preventScroll: true,
					});
					break;
				case "Tab": {
					const firstElement = focusableElements[0];
					const lastElement = focusableElements[focusableElements.length - 1];

					if (e.shiftKey) {
						if (
							activeElement === firstElement ||
							!contentRef.current?.contains(activeElement)
						) {
							e.preventDefault();
							lastElement.focus({ preventScroll: true });
						}
					} else {
						if (
							activeElement === lastElement ||
							!contentRef.current?.contains(activeElement)
						) {
							e.preventDefault();
							firstElement.focus({ preventScroll: true });
						}
					}
					break;
				}
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [open, setOpen, contentRef, triggerRef]);

	if (!open || typeof window === "undefined") {
		return null;
	}

	const baseStyles = `
    z-50 min-w-[8rem] overflow-hidden rounded-md border
    bg-nocta-50 dark:bg-nocta-950 border-nocta-300 dark:border-nocta-800
    p-1 text-nocta-950 dark:text-nocta-50 shadow-lg
    transition-opacity transition-transform duration-200 not-prose
    ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}
  `;

	return createPortal(
		<div
			ref={contentRef}
			className={cn(baseStyles, className)}
			style={{
				position: "fixed",
				left: `${position.x}px`,
				top: `${position.y}px`,
			}}
			role="menu"
			aria-orientation="vertical"
			data-submenu="true"
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			{...props}
		>
			<div className="flex flex-col gap-1">{children}</div>
		</div>,
		document.body,
	);
};
