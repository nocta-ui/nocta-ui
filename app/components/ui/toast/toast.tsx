"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { gsap } from "gsap";
import React from "react";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { cn } from "@/lib/utils";

const hasBackgroundColor = (className: string = "") => {
	return /bg-(?!linear|gradient|none)\w+/.test(className);
};

const toastContainerVariants = cva(
	"fixed p-[1px] rounded-lg shadow-lg dark:shadow-xl not-prose pointer-events-auto will-change-transform",
	{
		variants: {
			position: {
				"top-left": "top-4 left-4 max-w-sm w-full",
				"top-center":
					"top-4 left-1/2 transform -translate-x-1/2 max-w-sm w-full",
				"top-right": "top-4 right-4 max-w-sm w-full",
				"bottom-left": "bottom-4 left-4 max-w-sm w-full",
				"bottom-center":
					"bottom-4 left-1/2 transform -translate-x-1/2 max-w-sm w-full",
				"bottom-right": "bottom-4 right-4 max-w-sm w-full",
			},
			variant: {
				default:
					"bg-linear-to-b from-nocta-300 dark:from-nocta-100/20 to-transparent",
				success:
					"bg-linear-to-b from-green-200 dark:from-green-600/50 to-transparent",
				warning:
					"bg-linear-to-b from-yellow-200 dark:from-yellow-600/50 to-transparent",
				destructive:
					"bg-linear-to-b from-red-200 dark:from-red-600/50 to-transparent",
			},
		},
		defaultVariants: {
			position: "bottom-center",
			variant: "default",
		},
	},
);

const toastContentVariants = cva(
	"rounded-lg backdrop-blur-sm overflow-hidden",
	{
		variants: {
			variant: {
				default: "",
				success:
					"bg-green-50 dark:bg-green-950 text-green-900 dark:text-green-100",
				warning:
					"bg-yellow-50 dark:bg-yellow-950 text-yellow-900 dark:text-yellow-100",
				destructive: "bg-red-50 dark:bg-red-950 text-red-900 dark:text-red-100",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

export type ToastPosition =
	| "top-left"
	| "top-center"
	| "top-right"
	| "bottom-left"
	| "bottom-center"
	| "bottom-right";

export interface ToastData extends VariantProps<typeof toastContainerVariants> {
	id: string;
	title?: string;
	description?: string;
	className?: string;
	duration?: number;
	action?: {
		label: string;
		onClick: () => void;
	};
	onClose?: () => void;
	shouldClose?: boolean;
}

interface ToastContextValue {
	toast: (data: Omit<ToastData, "id">) => string;
	dismiss: (id: string) => void;
	dismissAll: () => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

/**
 * Hook to use toast functionality
 *
 * @example
 * const { toast } = useToast();
 *
 * toast({
 *   title: "Success",
 *   description: "Your action was completed",
 *   variant: "success",
 *   position: "top-right", // Optional: defaults to "bottom-center"
 *   duration: 5000, // Optional: defaults to 5000ms
 *   action: { // Optional
 *     label: "Undo",
 *     onClick: () => console.log("Undo clicked")
 *   }
 * });
 */
export const useToast = () => {
	const context = useContext(ToastContext);
	if (!context) {
		throw new Error("useToast must be used within a ToastProvider");
	}
	return context;
};

interface ToastItemProps {
	toast: ToastData & { index: number; total: number };
	onRemove: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = React.memo(({ toast, onRemove }) => {
ToastItem.displayName = 'ToastItem';
	const toastRef = useRef<HTMLDivElement>(null);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);
	const isExiting = useRef(false);
	const hasAnimatedIn = useRef(false);
	const animationRef = useRef<gsap.core.Tween | null>(null);

	const {
		id,
		title,
		description,
		variant = "default",
		duration = 5000,
		action,
		index,
		shouldClose,
		position = "bottom-center",
		className = "",
	} = toast;

	const shouldOverrrideBackground = hasBackgroundColor(className);

	const positionConfig = useMemo(() => ({
		"top-left": {
			animateIn: { x: -100, y: -20 },
			animateOut: { x: -100, y: -20 },
		},
		"top-center": {
			animateIn: { x: 0, y: -100 },
			animateOut: { x: 0, y: -100 },
		},
		"top-right": {
			animateIn: { x: 100, y: -20 },
			animateOut: { x: 100, y: -20 },
		},
		"bottom-left": {
			animateIn: { x: -100, y: 20 },
			animateOut: { x: -100, y: 100 },
		},
		"bottom-center": {
			animateIn: { x: 0, y: 100 },
			animateOut: { x: 0, y: 100 },
		},
		"bottom-right": {
			animateIn: { x: 100, y: 20 },
			animateOut: { x: 100, y: 100 },
		},
	}), []);

	const config = positionConfig[position as keyof typeof positionConfig];

	const getFocusableElements = useCallback(() => {
		if (!toastRef.current) return [];

		const focusableSelectors = [
			"button:not([disabled])",
			"input:not([disabled])",
			"textarea:not([disabled])",
			"select:not([disabled])",
			"a[href]",
			'[tabindex]:not([tabindex="-1"])',
		].join(", ");

		return Array.from(
			toastRef.current.querySelectorAll(focusableSelectors),
		) as HTMLElement[];
	}, []);

	const handleClose = useCallback(() => {
		if (!toastRef.current || isExiting.current) return;

		isExiting.current = true;

		if (animationRef.current) {
			animationRef.current.kill();
		}

		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}

		animationRef.current = gsap.to(toastRef.current, {
			x: config.animateOut.x,
			y: config.animateOut.y,
			opacity: 0,
			scale: 0.9,
			duration: 0.3,
			ease: "power2.in",
			onComplete: () => {
				onRemove(id);
			},
		});
	}, [id, onRemove, config.animateOut]);

	useEffect(() => {
		if (shouldClose) {
			handleClose();
		}
	}, [shouldClose, handleClose]);

	useEffect(() => {
		if (!toastRef.current || isExiting.current) return;

		const element = toastRef.current;
		const isLatest = index === 0;
		const isTopPosition = position?.startsWith("top-");
		const offset = isTopPosition ? index * 8 : -(index * 8);
		const scale = Math.max(0.92, 1 - index * 0.04);

		if (animationRef.current) {
			animationRef.current.kill();
		}

		if (!hasAnimatedIn.current && isLatest) {
			hasAnimatedIn.current = true;

			gsap.set(element, {
				x: config.animateIn.x,
				y: config.animateIn.y,
				opacity: 0,
				scale: 0.9,
				zIndex: 50 - index,
			});

			animationRef.current = gsap.to(element, {
				x: 0,
				y: offset,
				opacity: 1,
				scale: 1,
				duration: 0.4,
				ease: "power2.out",
				force3D: true,
				delay: 0.01,
				onComplete: () => {
					if (isLatest) {
						const focusableElements = getFocusableElements();
						if (focusableElements.length > 0) {
							focusableElements[0].focus();
						} else {
							element.focus();
						}
					}
				},
			});
		} else {
			gsap.set(element, { zIndex: 50 - index });

			animationRef.current = gsap.to(element, {
				x: 0,
				y: offset,
				scale: isLatest ? 1 : scale,
				opacity: index >= 3 ? 0 : 1,
				duration: 0.3,
				ease: "power2.out",
				force3D: true,
				onComplete: () => {
					if (index >= 3) {
						onRemove(id);
					} else if (isLatest && !hasAnimatedIn.current) {
						hasAnimatedIn.current = true;
						const focusableElements = getFocusableElements();
						if (focusableElements.length > 0) {
							focusableElements[0].focus();
						} else {
							element.focus();
						}
					}
				},
			});
		}
	}, [index, position, config.animateIn.x, config.animateIn.y, id, onRemove]);

	useEffect(() => {
		if (shouldClose || !hasAnimatedIn.current) return;

		if (duration > 0) {
			timeoutRef.current = setTimeout(() => {
				handleClose();
			}, duration);
		}

		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
				timeoutRef.current = null;
			}
		};
	}, [duration, shouldClose, handleClose]);

	useEffect(() => {
		return () => {
			if (animationRef.current) {
				animationRef.current.kill();
			}
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			const isLatest = index === 0;

			if (e.key === "Escape" && isLatest) {
				handleClose();
				return;
			}

			if (e.key === "Tab" && isLatest) {
				const focusableElements = getFocusableElements();
				if (focusableElements.length === 0) return;

				const firstElement = focusableElements[0];
				const lastElement = focusableElements[focusableElements.length - 1];
				const activeElement = document.activeElement as HTMLElement;

				if (e.shiftKey) {
					if (
						activeElement === firstElement ||
						!toastRef.current?.contains(activeElement)
					) {
						e.preventDefault();
						lastElement.focus();
					}
				} else {
					if (
						activeElement === lastElement ||
						!toastRef.current?.contains(activeElement)
					) {
						e.preventDefault();
						firstElement.focus();
					}
				}
			}
		};

		if (index === 0) {
			document.addEventListener("keydown", handleKeyDown);
			return () => document.removeEventListener("keydown", handleKeyDown);
		}
	}, [handleClose, index]);

	return (
		<div
			ref={toastRef}
			className={cn(toastContainerVariants({ position, variant }), className)}
			style={{
				zIndex: 50 - index,
				transformOrigin: position?.startsWith("top-")
					? "center top"
					: "center bottom",
			}}
			role="alert"
			aria-live="polite"
			tabIndex={-1}
		>
			<div
				className={cn(
					toastContentVariants({ variant }),
					variant === "default" && !shouldOverrrideBackground
						? "bg-nocta-100 dark:bg-nocta-900"
						: "",
				)}
			>
				<button
					onClick={handleClose}
					className="
          absolute top-2 right-2 p-1 rounded-md
          text-nocta-400 dark:text-nocta-500
          hover:text-nocta-600 dark:hover:text-nocta-300
          hover:bg-nocta-100/50 dark:hover:bg-nocta-800/50
          transition-colors duration-200
          focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-nocta-500/50
        "
					aria-label="Close toast"
				>
					<svg
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
					>
						<path d="M18 6L6 18M6 6l12 12" />
					</svg>
				</button>

				<div className="p-4 pr-8">
					{title && (
						<div className="font-semibold text-sm mb-1 leading-tight">
							{title}
						</div>
					)}
					{description && (
						<div className="text-sm opacity-90 leading-relaxed">
							{description}
						</div>
					)}
					{action && (
						<div className="mt-3">
							<button
								onClick={() => {
									action.onClick();
									handleClose();
								}}
								className="
                inline-flex items-center justify-center rounded-md
                px-3 py-1.5 text-sm font-medium
                bg-linear-to-b from-nocta-900 to-nocta-700 dark:from-nocta-50 dark:to-nocta-300
                text-nocta-50 dark:text-nocta-900
                hover:bg-nocta-900 dark:hover:bg-nocta-200
                focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-nocta-500/50
                transition-colors duration-200 cursor-pointer
              "
							>
								{action.label}
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}, (prevProps, nextProps) => {
	return (
		prevProps.toast.id === nextProps.toast.id &&
		prevProps.toast.index === nextProps.toast.index &&
		prevProps.toast.shouldClose === nextProps.toast.shouldClose &&
		prevProps.toast.total === nextProps.toast.total
	);
});

ToastItem.displayName = 'ToastItem';


const ToastManager: React.FC<{
	toasts: (ToastData & { index: number; total: number })[];
	onRemove: (id: string) => void;
}> = ({ toasts, onRemove }) => {
	if (toasts.length === 0) return null;

	const toastsByPosition = toasts.reduce(
		(acc, toast) => {
			const pos = toast.position || "bottom-center";
			if (!acc[pos]) acc[pos] = [];
			acc[pos].push(toast);
			return acc;
		},
		{} as Record<
			ToastPosition,
			(ToastData & { index: number; total: number })[]
		>,
	);

	Object.keys(toastsByPosition).forEach((position) => {
		toastsByPosition[position as ToastPosition] = toastsByPosition[
			position as ToastPosition
		].map((toast, index) => ({
			...toast,
			index,
			total: toastsByPosition[position as ToastPosition].length,
		}));
	});

	return (
		<div className="fixed inset-0 pointer-events-none z-50">
			{Object.entries(toastsByPosition).map(([position, positionToasts]) => (
				<div key={position}>
					{positionToasts.map((toast) => (
						<ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
					))}
				</div>
			))}
		</div>
	);
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [toasts, setToasts] = useState<ToastData[]>([]);

	const toast = useCallback((data: Omit<ToastData, "id">) => {
		const id = Math.random().toString(36).substring(2, 11);
		const newToast: ToastData = { ...data, id };

		setToasts((prev) => [newToast, ...prev]);
		return id;
	}, []);

	const dismiss = useCallback((id: string) => {
		setToasts((prev) => prev.filter((t) => t.id !== id));
	}, []);

	const dismissAll = useCallback(() => {
		setToasts((prev) => {
			prev.forEach((toast) => {
				setTimeout(() => {
					setToasts((current) =>
						current.map((t) =>
							t.id === toast.id ? { ...t, shouldClose: true, duration: 0 } : t,
						),
					);
				});
			});

			return prev;
		});
	}, []);

	const toastsWithIndex = toasts.map((toast, index) => ({
		...toast,
		index,
		total: toasts.length,
	}));

	return (
		<ToastContext.Provider value={{ toast, dismiss, dismissAll }}>
			{children}
			<ToastManager toasts={toastsWithIndex} onRemove={dismiss} />
		</ToastContext.Provider>
	);
};
