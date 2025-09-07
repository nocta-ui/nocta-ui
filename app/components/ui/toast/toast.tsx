"use client";

import { cva, type VariantProps } from "class-variance-authority";
import React, {
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { cn } from "@/lib/utils";

const POSITION_CONFIGS = {
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
} as const;

const FOCUSABLE_SELECTORS = [
	"button:not([disabled])",
	"input:not([disabled])",
	"textarea:not([disabled])",
	"select:not([disabled])",
	"a[href]",
	'[tabindex]:not([tabindex="-1"])',
].join(", ");

const ANIMATION_CONFIG = {
	ENTER_DURATION: 2.0,
	EXIT_DURATION: 0.45,
	STACK_DURATION: 0.5,
	STACK_OFFSET: 16,
	SCALE_FACTOR: 0.04,
	MIN_SCALE: 0.92,
	MAX_VISIBLE_TOASTS: 3,
	Z_INDEX_BASE: 50,
	EASING_DEFAULT: "cubic-bezier(0.25, 0.1, 0.25, 1)",
	EASING_EXIT: "cubic-bezier(0.25, 0.1, 0.25, 1)",
} as const;

// Observer Pattern - ToastState
type ToastSubscriber = (toasts: ToastData[]) => void;

class ToastState {
	private toasts: ToastData[] = [];
	private subscribers: Set<ToastSubscriber> = new Set();
	private idCounter = 0;

	subscribe(callback: ToastSubscriber): () => void {
		this.subscribers.add(callback);
		return () => {
			this.subscribers.delete(callback);
		};
	}

	private notify(): void {
		this.subscribers.forEach((callback) => callback([...this.toasts]));
	}

	private generateId(): string {
		return `toast-${Date.now()}-${++this.idCounter}`;
	}

	add(data: Omit<ToastData, "id">): string {
		const id = this.generateId();
		const newToast: ToastData = { ...data, id };
		this.toasts = [newToast, ...this.toasts];
		this.notify();
		return id;
	}

	remove(id: string): void {
		this.toasts = this.toasts.filter((toast) => toast.id !== id);
		this.notify();
	}

	update(id: string, data: Partial<ToastData>): void {
		this.toasts = this.toasts.map((toast) =>
			toast.id === id ? { ...toast, ...data } : toast,
		);
		this.notify();
	}

	dismissAll(): void {
		this.toasts = this.toasts.map((toast) => ({
			...toast,
			shouldClose: true,
			duration: 0,
		}));
		this.notify();
	}

	getToasts(): ToastData[] {
		return [...this.toasts];
	}
}

const toastState = new ToastState();

// Single instance management for Toaster
class ToasterInstanceManager {
	private activeInstanceId: string | null = null;
	private instanceCounter = 0;

	registerInstance(): string {
		const instanceId = `toaster-${++this.instanceCounter}`;
		if (!this.activeInstanceId) {
			this.activeInstanceId = instanceId;
		}
		return instanceId;
	}

	unregisterInstance(instanceId: string): void {
		if (this.activeInstanceId === instanceId) {
			this.activeInstanceId = null;
		}
	}

	isActiveInstance(instanceId: string): boolean {
		return this.activeInstanceId === instanceId;
	}
}

const toasterInstanceManager = new ToasterInstanceManager();

const toastContainerVariants = cva(
	"fixed rounded-lg border shadow-lg dark:shadow-xl not-prose pointer-events-auto will-change-transform transition-all duration-200 ease-in-out",
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
					"border-nocta-200 dark:border-nocta-50/5 bg-nocta-100 dark:bg-nocta-900 text-nocta-900 dark:text-nocta-100 overflow-hidden",
				success:
					"border-green-200 dark:border-green-800/50 bg-green-50 dark:bg-green-950 text-green-900 dark:text-green-100",
				warning:
					"border-yellow-200 dark:border-yellow-800/50 bg-yellow-50 dark:bg-yellow-950 text-yellow-900 dark:text-yellow-100",
				destructive:
					"border-red-200 dark:border-red-800/50 bg-red-50 dark:bg-red-950 text-red-900 dark:text-red-100",
			},
		},
		defaultVariants: {
			position: "bottom-center",
			variant: "default",
		},
	},
);

const toastContentVariants = cva("relative rounded-lg overflow-hidden", {
	variants: {
		variant: {
			default: "",
			success: "",
			warning: "",
			destructive: "",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

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

export const toast = (data: Omit<ToastData, "id"> | string): string => {
	if (typeof data === "string") {
		return toastState.add({ description: data });
	}
	return toastState.add(data);
};

toast.success = (data: Omit<ToastData, "id" | "variant"> | string): string => {
	if (typeof data === "string") {
		return toastState.add({ description: data, variant: "success" });
	}
	return toastState.add({ ...data, variant: "success" });
};

toast.warning = (data: Omit<ToastData, "id" | "variant"> | string): string => {
	if (typeof data === "string") {
		return toastState.add({ description: data, variant: "warning" });
	}
	return toastState.add({ ...data, variant: "warning" });
};

toast.error = (data: Omit<ToastData, "id" | "variant"> | string): string => {
	if (typeof data === "string") {
		return toastState.add({ description: data, variant: "destructive" });
	}
	return toastState.add({ ...data, variant: "destructive" });
};

toast.dismiss = (id: string): void => {
	toastState.update(id, { shouldClose: true });
};

toast.dismissAll = (): void => {
	toastState.dismissAll();
};

interface ToastItemProps {
	toast: ToastData & { index: number; total: number };
	onRemove: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = React.memo(
	({ toast, onRemove }) => {
		const toastRef = useRef<HTMLDivElement>(null);
		const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
		const enterAnimationRef = useRef<number | null>(null);
		const isExiting = useRef(false);
		const hasAnimatedIn = useRef(false);
		const [animationState, setAnimationState] = useState<
			"entering" | "entered" | "exiting" | "stacking"
		>("entering");

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
			onClose,
		} = toast;

		const config = POSITION_CONFIGS[position as keyof typeof POSITION_CONFIGS];

		const getFocusableElements = useCallback(() => {
			if (!toastRef.current) return [];
			return Array.from(
				toastRef.current.querySelectorAll(FOCUSABLE_SELECTORS),
			) as HTMLElement[];
		}, []);

		const handleTransitionEnd = useCallback(
			(e: React.TransitionEvent) => {
				if (e.target !== toastRef.current) return;
				if (e.propertyName !== "opacity") return;

				if (animationState === "exiting") {
					onClose?.();
					onRemove(id);
				}
			},
			[animationState, id, onRemove, onClose],
		);

		const handleClose = useCallback(() => {
			if (!toastRef.current || isExiting.current) return;

			isExiting.current = true;

			if (enterAnimationRef.current) {
				cancelAnimationFrame(enterAnimationRef.current);
				enterAnimationRef.current = null;
			}

			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
				timeoutRef.current = null;
			}

			setAnimationState("exiting");
		}, []);

		useEffect(() => {
			if (shouldClose) {
				handleClose();
			}
		}, [shouldClose, handleClose]);

		useLayoutEffect(() => {
			if (!toastRef.current || isExiting.current) return;

			const element = toastRef.current;
			const isLatest = index === 0;

			const setFocusToToast = () => {
				if (!isLatest) return;
				const focusableElements = getFocusableElements();
				if (focusableElements.length > 0) {
					focusableElements[0].focus();
				} else {
					element.focus();
				}
			};

			if (!hasAnimatedIn.current && isLatest) {
				hasAnimatedIn.current = true;
				setAnimationState("entering");

				enterAnimationRef.current = requestAnimationFrame(() => {
					enterAnimationRef.current = requestAnimationFrame(() => {
						setAnimationState("entered");
						setTimeout(setFocusToToast, ANIMATION_CONFIG.ENTER_DURATION * 1000);
					});
				});
			} else if (hasAnimatedIn.current) {
				if (animationState !== "stacking" || index > 0) {
					setAnimationState("stacking");
				}

				if (index >= ANIMATION_CONFIG.MAX_VISIBLE_TOASTS) {
					setTimeout(
						() => onRemove(id),
						ANIMATION_CONFIG.STACK_DURATION * 1000,
					);
				}
			} else {
				setAnimationState("stacking");

				if (index >= ANIMATION_CONFIG.MAX_VISIBLE_TOASTS) {
					setTimeout(
						() => onRemove(id),
						ANIMATION_CONFIG.STACK_DURATION * 1000,
					);
				}
			}
		}, [index, position, id, onRemove, getFocusableElements, animationState]);

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
				if (enterAnimationRef.current) {
					cancelAnimationFrame(enterAnimationRef.current);
				}
				if (timeoutRef.current) {
					clearTimeout(timeoutRef.current);
				}
			};
		}, []);

		const isTopPosition = position?.startsWith("top-");
		const offset = isTopPosition
			? index * ANIMATION_CONFIG.STACK_OFFSET
			: -(index * ANIMATION_CONFIG.STACK_OFFSET);
		const scale = Math.max(
			ANIMATION_CONFIG.MIN_SCALE,
			1 - index * ANIMATION_CONFIG.SCALE_FACTOR,
		);
		const zIndex = ANIMATION_CONFIG.Z_INDEX_BASE - index;
		const isLatest = index === 0;

		const transformStyle = useMemo(() => {
			switch (animationState) {
				case "entering":
					return {
						transform: `translate(${config.animateIn.x}px, ${config.animateIn.y}px)`,
						opacity: 0,
					};
				case "entered":
					return {
						transform: `translate(0px, ${offset}px)`,
						opacity: 1,
					};
				case "exiting":
					return {
						transform: `translate(${config.animateOut.x}px, ${config.animateOut.y}px)`,
						opacity: 0,
					};
				case "stacking":
					return {
						transform: `translate(0px, ${offset}px) scale(${isLatest ? 1 : scale})`,
						opacity: index >= ANIMATION_CONFIG.MAX_VISIBLE_TOASTS ? 0 : 1,
					};
			}
		}, [
			animationState,
			config.animateIn.x,
			config.animateIn.y,
			config.animateOut.x,
			config.animateOut.y,
			offset,
			isLatest,
			scale,
			index,
		]);

		const transitionDuration = useMemo(() => {
			switch (animationState) {
				case "entering":
				case "entered":
					return `${ANIMATION_CONFIG.ENTER_DURATION}s`;
				case "exiting":
					return `${ANIMATION_CONFIG.EXIT_DURATION}s`;
				case "stacking":
				default:
					return `${ANIMATION_CONFIG.STACK_DURATION}s`;
			}
		}, [animationState]);

		const transitionTimingFunction = useMemo(() => {
			return animationState === "exiting"
				? ANIMATION_CONFIG.EASING_EXIT
				: ANIMATION_CONFIG.EASING_DEFAULT;
		}, [animationState]);

		return (
			<div
				ref={toastRef}
				className={cn(toastContainerVariants({ position, variant }), className)}
				style={{
					transformOrigin: position?.startsWith("top-")
						? "center top"
						: "center bottom",
					zIndex,
					transition: `transform ${transitionDuration} ${transitionTimingFunction}, opacity ${transitionDuration} ${transitionTimingFunction}`,
					...transformStyle,
				}}
				role="alert"
				aria-live="polite"
				tabIndex={-1}
				onTransitionEnd={handleTransitionEnd}
				data-toast-id={id}
			>
				{variant === "default" && (
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
				)}
				<div className={cn(toastContentVariants({ variant }))}>
					<button
						onClick={handleClose}
						className="absolute top-2 right-2 p-1 rounded-md text-nocta-400 dark:text-nocta-500 hover:text-nocta-600 dark:hover:text-nocta-300 hover:bg-nocta-100/50 dark:hover:bg-nocta-800/50 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-nocta-500/50"
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
									className="inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium bg-gradient-to-b from-nocta-900 to-nocta-700 dark:from-nocta-50 dark:to-nocta-300 text-nocta-50 dark:text-nocta-900 hover:bg-nocta-900 dark:hover:bg-nocta-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-nocta-500/50 transition-colors duration-200 cursor-pointer"
								>
									{action.label}
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
		);
	},
	(prevProps, nextProps) => {
		return (
			prevProps.toast.id === nextProps.toast.id &&
			prevProps.toast.index === nextProps.toast.index &&
			prevProps.toast.shouldClose === nextProps.toast.shouldClose &&
			prevProps.toast.total === nextProps.toast.total
		);
	},
);

ToastItem.displayName = "ToastItem";

const ToastManager: React.FC<{
	toasts: ToastData[];
	onRemove: (id: string) => void;
}> = React.memo(({ toasts, onRemove }) => {
	const toastsByPosition = useMemo(() => {
		const grouped = toasts.reduce(
			(acc, toast) => {
				const pos = toast.position || "bottom-center";
				if (!acc[pos]) acc[pos] = [];
				acc[pos].push(toast);
				return acc;
			},
			{} as Record<ToastPosition, ToastData[]>,
		);

		Object.keys(grouped).forEach((position) => {
			const positionKey = position as ToastPosition;
			grouped[positionKey] = grouped[positionKey].map((toast, index) => ({
				...toast,
				index,
				total: grouped[positionKey].length,
			})) as (ToastData & { index: number; total: number })[];
		});

		return grouped as Record<
			ToastPosition,
			(ToastData & { index: number; total: number })[]
		>;
	}, [toasts]);

	const positionEntries = useMemo(
		() => Object.entries(toastsByPosition),
		[toastsByPosition],
	);

	// Global keyboard handling for latest toast in each position
	useEffect(() => {
		if (positionEntries.length === 0) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			// Operate on the latest toast (index 0) per position
			for (const [, group] of positionEntries) {
				const latest = group?.[0];
				if (!latest) continue;

				const container = document.querySelector(
					`[data-toast-id="${latest.id}"]`,
				) as HTMLElement | null;
				if (!container) continue;

				if (e.key === "Escape") {
					const closeBtn = container.querySelector(
						'[aria-label="Close toast"]',
					) as HTMLButtonElement | null;
					if (closeBtn) {
						e.preventDefault();
						closeBtn.click();
					}
					return;
				}

				if (e.key === "Tab") {
					const focusable = Array.from(
						container.querySelectorAll(FOCUSABLE_SELECTORS),
					) as HTMLElement[];
					if (focusable.length === 0) continue;

					const first = focusable[0];
					const last = focusable[focusable.length - 1];
					const active = document.activeElement as HTMLElement | null;

					if (e.shiftKey) {
						if (active === first || (active && !container.contains(active))) {
							e.preventDefault();
							last.focus();
						}
					} else {
						if (active === last || (active && !container.contains(active))) {
							e.preventDefault();
							first.focus();
						}
					}
				}
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [positionEntries]);

	if (toasts.length === 0) return null;

	return (
		<div className="fixed inset-0 pointer-events-none z-50">
			{positionEntries.map(([position, positionToasts]) => (
				<div key={position}>
					{positionToasts.map((toast) => (
						<ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
					))}
				</div>
			))}
		</div>
	);
});

ToastManager.displayName = "ToastManager";

export const Toaster: React.FC = () => {
	const [toasts, setToasts] = useState<ToastData[]>([]);
	const [instanceId] = useState(() =>
		toasterInstanceManager.registerInstance(),
	);

	useEffect(() => {
		const unsubscribe = toastState.subscribe(setToasts);
		return () => {
			unsubscribe();
			toasterInstanceManager.unregisterInstance(instanceId);
		};
	}, [instanceId]);

	const handleRemove = useCallback((id: string) => {
		toastState.remove(id);
	}, []);

	if (!toasterInstanceManager.isActiveInstance(instanceId)) {
		return null;
	}

	return <ToastManager toasts={toasts} onRemove={handleRemove} />;
};
