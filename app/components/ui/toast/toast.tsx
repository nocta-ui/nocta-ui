"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { gsap } from "gsap";
import React, {
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { cn } from "@/lib/utils";

const BACKGROUND_COLOR_REGEX = /bg-(?!linear|gradient|none)\w+/;
const hasBackgroundColor = (className: string = "") => {
	return BACKGROUND_COLOR_REGEX.test(className);
};

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
	ENTER_DURATION: 0.4,
	EXIT_DURATION: 0.3,
	STACK_DURATION: 0.3,
	STACK_OFFSET: 16,
	SCALE_FACTOR: 0.04,
	MIN_SCALE: 0.92,
	MAX_VISIBLE_TOASTS: 3,
	Z_INDEX_BASE: 50,
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

		const shouldOverrideBackground = useMemo(
			() => hasBackgroundColor(className),
			[className],
		);

		const config = POSITION_CONFIGS[position as keyof typeof POSITION_CONFIGS];

		const getFocusableElements = useCallback(() => {
			if (!toastRef.current) return [];
			return Array.from(
				toastRef.current.querySelectorAll(FOCUSABLE_SELECTORS),
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
				duration: ANIMATION_CONFIG.EXIT_DURATION,
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

		useLayoutEffect(() => {
			if (!toastRef.current || isExiting.current) return;

			const element = toastRef.current;
			const isLatest = index === 0;
			const isTopPosition = position?.startsWith("top-");
			const offset = isTopPosition
				? index * ANIMATION_CONFIG.STACK_OFFSET
				: -(index * ANIMATION_CONFIG.STACK_OFFSET);
			const scale = Math.max(
				ANIMATION_CONFIG.MIN_SCALE,
				1 - index * ANIMATION_CONFIG.SCALE_FACTOR,
			);
			const zIndex = ANIMATION_CONFIG.Z_INDEX_BASE - index;

			if (animationRef.current) {
				animationRef.current.kill();
			}

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

				gsap.set(element, {
					x: config.animateIn.x,
					y: config.animateIn.y,
					opacity: 0,
					scale: 0.9,
					zIndex,
				});

				animationRef.current = gsap.to(element, {
					x: 0,
					y: offset,
					opacity: 1,
					scale: 1,
					duration: ANIMATION_CONFIG.ENTER_DURATION,
					ease: "power2.out",
					force3D: true,
					delay: 0.01,
					onComplete: setFocusToToast,
				});
			} else {
				gsap.set(element, { zIndex });

				animationRef.current = gsap.to(element, {
					x: 0,
					y: offset,
					scale: isLatest ? 1 : scale,
					opacity: index >= ANIMATION_CONFIG.MAX_VISIBLE_TOASTS ? 0 : 1,
					duration: ANIMATION_CONFIG.STACK_DURATION,
					ease: "power2.out",
					force3D: true,
					onComplete: () => {
						if (index >= ANIMATION_CONFIG.MAX_VISIBLE_TOASTS) {
							onRemove(id);
						} else if (isLatest && !hasAnimatedIn.current) {
							hasAnimatedIn.current = true;
							setFocusToToast();
						}
					},
				});
			}
		}, [
			index,
			position,
			config.animateIn.x,
			config.animateIn.y,
			id,
			onRemove,
			getFocusableElements,
		]);

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
						variant === "default" && !shouldOverrideBackground
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

		// Dodaj indeksy i total do każdej grupy
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
