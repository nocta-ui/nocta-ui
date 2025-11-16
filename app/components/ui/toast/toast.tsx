'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import React, {
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { Icons } from '@/app/components/ui/icons/icons';
import { cn } from '@/lib/utils';

const POSITION_CONFIGS = {
	'top-left': {
		animateIn: { x: -100, y: -20 },
		animateOut: { x: -100, y: -20 },
	},
	'top-center': {
		animateIn: { x: 0, y: -100 },
		animateOut: { x: 0, y: -100 },
	},
	'top-right': {
		animateIn: { x: 100, y: -20 },
		animateOut: { x: 100, y: -20 },
	},
	'bottom-left': {
		animateIn: { x: -100, y: 20 },
		animateOut: { x: -100, y: 100 },
	},
	'bottom-center': {
		animateIn: { x: 0, y: 100 },
		animateOut: { x: 0, y: 100 },
	},
	'bottom-right': {
		animateIn: { x: 100, y: 20 },
		animateOut: { x: 100, y: 100 },
	},
} as const;

const FOCUSABLE_SELECTORS = [
	'button:not([disabled])',
	'input:not([disabled])',
	'textarea:not([disabled])',
	'select:not([disabled])',
	'a[href]',
	'[tabindex]:not([tabindex="-1"])',
].join(', ');

const ANIMATION_CONFIG = {
	ENTER_DURATION: 0.75,
	EXIT_DURATION: 0.75,
	STACK_DURATION: 0.75,
	STACK_OFFSET: 16,
	EXPANDED_GAP: 12,
	SCALE_FACTOR: 0.04,
	MIN_SCALE: 0.92,
	MAX_VISIBLE_TOASTS: 3,
	Z_INDEX_BASE: 50,
	EASING_DEFAULT: 'var(--ease-smooth)',
	EASING_EXIT: 'var(--ease-smooth)',
} as const;

const SWIPE_DISMISS_THRESHOLD = 45;
const SWIPE_DISMISS_VELOCITY = 0.11;
const SWIPE_EXIT_DISTANCE = 600;

type SwipeDirection = 'top' | 'bottom' | 'left' | 'right';
type SwipeAxis = 'x' | 'y';

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
		this.subscribers.forEach((callback) => {
			callback([...this.toasts]);
		});
	}

	private generateId(): string {
		return `toast-${Date.now()}-${++this.idCounter}`;
	}

	add(data: Omit<ToastData, 'id'>): string {
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
	'pointer-events-auto fixed rounded-lg border shadow-2xl shadow-card will-change-transform border-border bg-popover',
	{
		variants: {
			position: {
				'top-left': 'top-4 left-4 w-full max-w-sm',
				'top-center':
					'top-4 left-1/2 w-full max-w-sm -translate-x-1/2 transform',
				'top-right': 'top-4 right-4 w-full max-w-sm',
				'bottom-left': 'bottom-4 left-4 w-full max-w-sm',
				'bottom-center':
					'bottom-4 left-1/2 w-full max-w-sm -translate-x-1/2 transform',
				'bottom-right': 'right-4 bottom-4 w-full max-w-sm',
			},
			variant: {
				default: 'text-foreground',
				success: 'text-success/90',
				warning: 'text-warning/90',
				destructive: 'text-destructive/90',
			},
		},
		defaultVariants: {
			position: 'bottom-center',
			variant: 'default',
		},
	},
);

const toastContentVariants = cva('relative overflow-hidden rounded-lg', {
	variants: {
		variant: {
			default: '',
			success: '',
			warning: '',
			destructive: '',
		},
	},
	defaultVariants: {
		variant: 'default',
	},
});

export type ToastPosition =
	| 'top-left'
	| 'top-center'
	| 'top-right'
	| 'bottom-left'
	| 'bottom-center'
	| 'bottom-right';

const getDefaultSwipeDirections = (
	position?: ToastPosition | null,
): SwipeDirection[] => {
	if (!position) {
		return ['top', 'bottom', 'left', 'right'];
	}

	const [vertical, horizontal] = position.split('-') as [
		string,
		string | undefined,
	];
	const directions: SwipeDirection[] = [];

	if (vertical === 'top' || vertical === 'bottom') {
		directions.push(vertical);
	}

	if (horizontal === 'left' || horizontal === 'right') {
		directions.push(horizontal);
	}

	if (directions.length === 0) {
		directions.push('top', 'bottom');
	}

	return directions;
};

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
	isLeaving?: boolean;
}

export const toast = (data: Omit<ToastData, 'id'> | string): string => {
	if (typeof data === 'string') {
		return toastState.add({ description: data });
	}
	return toastState.add(data);
};

toast.success = (data: Omit<ToastData, 'id' | 'variant'> | string): string => {
	if (typeof data === 'string') {
		return toastState.add({ description: data, variant: 'success' });
	}
	return toastState.add({ ...data, variant: 'success' });
};

toast.warning = (data: Omit<ToastData, 'id' | 'variant'> | string): string => {
	if (typeof data === 'string') {
		return toastState.add({ description: data, variant: 'warning' });
	}
	return toastState.add({ ...data, variant: 'warning' });
};

toast.error = (data: Omit<ToastData, 'id' | 'variant'> | string): string => {
	if (typeof data === 'string') {
		return toastState.add({ description: data, variant: 'destructive' });
	}
	return toastState.add({ ...data, variant: 'destructive' });
};

toast.dismiss = (id: string): void => {
	toastState.update(id, { shouldClose: true });
};

toast.dismissAll = (): void => {
	toastState.dismissAll();
};

type PositionedToast = ToastData & {
	index: number;
	renderIndex: number;
	total: number;
};

interface ToastItemProps {
	toast: PositionedToast;
	onRemove: (id: string) => void;
	isGroupHovered?: boolean;
	expandedOffset?: number;
	expandedGap?: number;
	collapsedOffset?: number;
	hiddenCollapsedOffset?: number;
	onHeightChange?: (id: string, height: number) => void;
	onGroupHoverEnter?: () => void;
}

const ToastItem: React.FC<ToastItemProps> = React.memo(
	({
		toast,
		onRemove,
		isGroupHovered = false,
		expandedOffset = 0,
		expandedGap = ANIMATION_CONFIG.EXPANDED_GAP,
		collapsedOffset,
		hiddenCollapsedOffset,
		onHeightChange,
		onGroupHoverEnter,
	}) => {
		const toastRef = useRef<HTMLDivElement>(null);
		const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
		const timerStartRef = useRef<number | null>(null);
		const remainingRef = useRef<number>(Number.NaN);
		const enterAnimationRef = useRef<number | null>(null);
		const isExiting = useRef(false);
		const exitAnimationCompleteRef = useRef(false);
		const hasAnimatedIn = useRef(false);
		const pointerStartRef = useRef<{ x: number; y: number } | null>(null);
		const dragStartTimeRef = useRef<number | null>(null);
		const swipeAxisRef = useRef<SwipeAxis | null>(null);
		const lastSwipeRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
		const [isItemHovered, setIsItemHovered] = useState(false);
		const [isSwiping, setIsSwiping] = useState(false);
		const [swipeDismissDirection, setSwipeDismissDirection] =
			useState<SwipeDirection | null>(null);
		const [animationState, setAnimationState] = useState<
			'entering' | 'entered' | 'exiting' | 'stacking'
		>('entering');

		const {
			id,
			title,
			description,
			variant = 'default',
			duration = 5000,
			action,
			index,
			renderIndex,
			shouldClose,
			position = 'bottom-center',
			className = '',
			onClose,
		} = toast;

		const titleId = title ? `${id}-title` : undefined;
		const descriptionId = description ? `${id}-desc` : undefined;
		const liveRole = variant === 'destructive' ? 'alert' : 'status';
		const livePoliteness = variant === 'destructive' ? 'assertive' : 'polite';

		const config = POSITION_CONFIGS[position as keyof typeof POSITION_CONFIGS];

		const swipeDirections = useMemo(
			() => getDefaultSwipeDirections(position),
			[position],
		);

		const clearSwipeRefs = useCallback(() => {
			pointerStartRef.current = null;
			dragStartTimeRef.current = null;
			swipeAxisRef.current = null;
			lastSwipeRef.current = { x: 0, y: 0 };
		}, []);

		useLayoutEffect(() => {
			if (!toastRef.current) return;
			const el = toastRef.current;
			const notify = () => {
				if (!onHeightChange) return;
				onHeightChange(id, el.offsetHeight);
			};
			notify();
			const ro = new ResizeObserver(() => notify());
			ro.observe(el);
			return () => ro.disconnect();
		}, [id, onHeightChange]);

		const getFocusableElements = useCallback(() => {
			if (!toastRef.current) return [];
			return Array.from(
				toastRef.current.querySelectorAll(FOCUSABLE_SELECTORS),
			) as HTMLElement[];
		}, []);

		const handleTransitionEnd = useCallback(
			(e: React.TransitionEvent) => {
				if (e.target !== toastRef.current) return;
				if (e.propertyName !== 'opacity' && e.propertyName !== 'transform')
					return;
				if (animationState !== 'exiting') return;
				if (exitAnimationCompleteRef.current) return;

				exitAnimationCompleteRef.current = true;
				onClose?.();
				onRemove(id);
			},
			[animationState, id, onRemove, onClose],
		);

		const handleClose = useCallback(() => {
			if (!toastRef.current || isExiting.current) return;

			isExiting.current = true;
			exitAnimationCompleteRef.current = false;

			toastState.update(id, { shouldClose: true });

			if (enterAnimationRef.current) {
				cancelAnimationFrame(enterAnimationRef.current);
				enterAnimationRef.current = null;
			}

			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
				timeoutRef.current = null;
			}

			setAnimationState('exiting');
			toastState.update(id, { shouldClose: true, isLeaving: true });
		}, [id]);

		useEffect(() => {
			if (shouldClose) {
				handleClose();
			}
		}, [shouldClose, handleClose]);

		const stackHidden = index >= ANIMATION_CONFIG.MAX_VISIBLE_TOASTS;
		const hiddenByStacking = stackHidden && animationState !== 'exiting';
		const isStackLeader = index === 0;
		const isLatest = isStackLeader && !shouldClose;

		useEffect(() => {
			if (isSwiping) return;
			if (swipeDismissDirection) return;
			const node = toastRef.current;
			if (!node) return;
			node.style.setProperty('--swipe-translate-x', '0px');
			node.style.setProperty('--swipe-translate-y', '0px');
		}, [isSwiping, swipeDismissDirection]);

		useLayoutEffect(() => {
			if (!toastRef.current || isExiting.current) return;

			const element = toastRef.current;

			const setFocusToToast = () => {
				if (!isLatest) return;
				const focusableElements = getFocusableElements();
				const firstFocusable = focusableElements[0];
				if (firstFocusable) {
					firstFocusable.focus();
					return;
				}
				element.focus();
			};

			if (!hasAnimatedIn.current && isLatest) {
				hasAnimatedIn.current = true;
				setAnimationState('entering');

				enterAnimationRef.current = requestAnimationFrame(() => {
					enterAnimationRef.current = requestAnimationFrame(() => {
						setAnimationState('entered');
						if (action) {
							setTimeout(
								setFocusToToast,
								ANIMATION_CONFIG.ENTER_DURATION * 1000,
							);
						}
					});
				});
			} else if (hasAnimatedIn.current) {
				if (animationState !== 'stacking' || index > 0) {
					setAnimationState('stacking');
				}
			} else {
				setAnimationState('stacking');
			}
		}, [index, getFocusableElements, animationState, action, isLatest]);

		useEffect(() => {
			if (shouldClose || !hasAnimatedIn.current) return;
			if (duration <= 0) return;

			if (remainingRef.current == null || Number.isNaN(remainingRef.current)) {
				remainingRef.current = duration;
			}

			const isPaused =
				isGroupHovered || isItemHovered || isSwiping || hiddenByStacking;
			if (isPaused) {
				if (timeoutRef.current) {
					clearTimeout(timeoutRef.current);
					timeoutRef.current = null;
				}
				if (timerStartRef.current !== null) {
					const elapsed = Date.now() - timerStartRef.current;
					remainingRef.current = Math.max(0, remainingRef.current - elapsed);
					timerStartRef.current = null;
				}
				return;
			}

			if (!timeoutRef.current) {
				const ms = Math.max(0, remainingRef.current ?? duration);
				if (ms === 0) {
					handleClose();
					return;
				}
				timerStartRef.current = Date.now();
				timeoutRef.current = setTimeout(() => {
					handleClose();
				}, ms);
			}

			return () => {
				if (timeoutRef.current) {
					clearTimeout(timeoutRef.current);
					if (timerStartRef.current !== null) {
						const elapsed = Date.now() - timerStartRef.current;
						remainingRef.current = Math.max(0, remainingRef.current - elapsed);
					}
					timeoutRef.current = null;
					timerStartRef.current = null;
				}
			};
		}, [
			duration,
			shouldClose,
			handleClose,
			isGroupHovered,
			isItemHovered,
			isSwiping,
			hiddenByStacking,
		]);

		useEffect(() => {
			remainingRef.current = duration;
		}, [duration]);

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

		const isTopPosition = position?.startsWith('top-');
		const maxVisibleIndex = Math.max(
			0,
			ANIMATION_CONFIG.MAX_VISIBLE_TOASTS - 1,
		);
		const visibleIndex = Math.min(index, maxVisibleIndex);
		const defaultCollapsedOffset = isTopPosition
			? index * ANIMATION_CONFIG.STACK_OFFSET
			: -(index * ANIMATION_CONFIG.STACK_OFFSET);
		const resolvedCollapsedOffset =
			typeof collapsedOffset === 'number' && Number.isFinite(collapsedOffset)
				? collapsedOffset
				: defaultCollapsedOffset;
		const resolvedHiddenCollapsedOffset =
			typeof hiddenCollapsedOffset === 'number' &&
			Number.isFinite(hiddenCollapsedOffset)
				? hiddenCollapsedOffset
				: resolvedCollapsedOffset;
		const scale = Math.max(
			ANIMATION_CONFIG.MIN_SCALE,
			1 - index * ANIMATION_CONFIG.SCALE_FACTOR,
		);
		const visibleScale = Math.max(
			ANIMATION_CONFIG.MIN_SCALE,
			1 - visibleIndex * ANIMATION_CONFIG.SCALE_FACTOR,
		);
		const zIndex = ANIMATION_CONFIG.Z_INDEX_BASE - renderIndex;

		const transformStyle = useMemo(() => {
			const baseOffsetY = stackHidden
				? resolvedHiddenCollapsedOffset
				: resolvedCollapsedOffset;
			const promotionOffset =
				typeof expandedGap === 'number'
					? expandedGap
					: ANIMATION_CONFIG.EXPANDED_GAP;
			const expandedTranslateY = isTopPosition
				? expandedOffset
				: -expandedOffset;
			const hiddenExpandedTranslateY = expandedTranslateY - promotionOffset;

			let translateX = 0;
			let translateY = baseOffsetY;
			let scaleValue = stackHidden
				? visibleIndex === 0
					? 1
					: visibleScale
				: isStackLeader
					? 1
					: scale;
			let opacityValue = stackHidden ? 0 : 1;

			if (stackHidden) {
				if (isGroupHovered && animationState !== 'exiting') {
					translateX = 0;
					translateY = hiddenExpandedTranslateY;
					scaleValue = 1;
				}
			} else if (isGroupHovered && animationState !== 'exiting') {
				translateX = 0;
				translateY = expandedTranslateY;
				scaleValue = 1;
				opacityValue = 1;
			} else {
				switch (animationState) {
					case 'entering':
						translateX = config.animateIn.x;
						translateY = config.animateIn.y;
						scaleValue = 1;
						opacityValue = 0;
						break;
					case 'entered':
						translateX = 0;
						translateY = baseOffsetY;
						scaleValue = 1;
						opacityValue = 1;
						break;
					case 'exiting': {
						scaleValue = 1;
						opacityValue = 0;
						if (swipeDismissDirection) {
							switch (swipeDismissDirection) {
								case 'left':
									translateX = -SWIPE_EXIT_DISTANCE;
									translateY = 0;
									break;
								case 'right':
									translateX = SWIPE_EXIT_DISTANCE;
									translateY = 0;
									break;
								case 'top':
									translateX = 0;
									translateY = -SWIPE_EXIT_DISTANCE;
									break;
								case 'bottom':
									translateX = 0;
									translateY = SWIPE_EXIT_DISTANCE;
									break;
								default:
									translateX = config.animateOut.x;
									translateY = config.animateOut.y;
									break;
							}
						} else {
							translateX = config.animateOut.x;
							translateY = config.animateOut.y;
						}
						break;
					}
					default:
						translateX = 0;
						translateY = baseOffsetY;
						scaleValue = isStackLeader ? 1 : scale;
						opacityValue = stackHidden ? 0 : 1;
						break;
				}
			}

			const transform = `translate(calc(${translateX}px + var(--swipe-translate-x, 0px)), calc(${translateY}px + var(--swipe-translate-y, 0px))) scale(${scaleValue})`;

			return {
				transform,
				opacity: opacityValue,
			};
		}, [
			animationState,
			config.animateIn.x,
			config.animateIn.y,
			config.animateOut.x,
			config.animateOut.y,
			expandedOffset,
			isGroupHovered,
			isStackLeader,
			isTopPosition,
			visibleIndex,
			visibleScale,
			stackHidden,
			resolvedCollapsedOffset,
			resolvedHiddenCollapsedOffset,
			expandedGap,
			scale,
			swipeDismissDirection,
		]);

		const transitionDuration = useMemo(() => {
			switch (animationState) {
				case 'entering':
				case 'entered':
					return `${ANIMATION_CONFIG.ENTER_DURATION}s`;
				case 'exiting':
					return `${ANIMATION_CONFIG.EXIT_DURATION}s`;
				default:
					return `${ANIMATION_CONFIG.STACK_DURATION}s`;
			}
		}, [animationState]);

		const transitionTimingFunction = useMemo(() => {
			return animationState === 'exiting'
				? ANIMATION_CONFIG.EASING_EXIT
				: ANIMATION_CONFIG.EASING_DEFAULT;
		}, [animationState]);

		const canSwipe = swipeDirections.length > 0;
		const swipeCursorClass = canSwipe
			? isSwiping
				? 'cursor-grabbing'
				: 'cursor-grab'
			: undefined;

		const handlePointerDown = useCallback(
			(event: React.PointerEvent<HTMLDivElement>) => {
				if (event.pointerType === 'mouse' && event.button !== 0) return;
				if (event.button === 2) return;
				if (isExiting.current) return;

				const target = event.target as HTMLElement;
				if (target.closest('button, a, input, textarea, select')) {
					return;
				}

				clearSwipeRefs();
				pointerStartRef.current = { x: event.clientX, y: event.clientY };
				dragStartTimeRef.current = Date.now();
				const node = toastRef.current;
				if (node) {
					node.style.setProperty('--swipe-translate-x', '0px');
					node.style.setProperty('--swipe-translate-y', '0px');
				}
				setSwipeDismissDirection(null);
				setIsSwiping(true);
				event.currentTarget.setPointerCapture(event.pointerId);
			},
			[clearSwipeRefs],
		);

		const handlePointerMove = useCallback(
			(event: React.PointerEvent<HTMLDivElement>) => {
				if (!pointerStartRef.current) return;
				if (isExiting.current) return;

				if (event.pointerType === 'touch') {
					event.preventDefault();
				}

				const xDelta = event.clientX - pointerStartRef.current.x;
				const yDelta = event.clientY - pointerStartRef.current.y;

				let axis = swipeAxisRef.current;
				if (!axis) {
					if (Math.abs(xDelta) > 1 || Math.abs(yDelta) > 1) {
						axis = Math.abs(xDelta) > Math.abs(yDelta) ? 'x' : 'y';
						swipeAxisRef.current = axis;
					} else {
						return;
					}
				}

				const dampen = (delta: number) => {
					const factor = Math.abs(delta) / 20;
					return delta * (1 / (1.5 + factor));
				};

				let nextX = 0;
				let nextY = 0;

				if (axis === 'x') {
					const allowLeft = swipeDirections.includes('left');
					const allowRight = swipeDirections.includes('right');
					if (!allowLeft && !allowRight) {
						swipeAxisRef.current = 'y';
						axis = 'y';
					} else if ((allowLeft && xDelta < 0) || (allowRight && xDelta > 0)) {
						nextX = xDelta;
					} else {
						nextX = dampen(xDelta);
					}
				}

				if (axis === 'y') {
					const allowTop = swipeDirections.includes('top');
					const allowBottom = swipeDirections.includes('bottom');
					if (!allowTop && !allowBottom) {
						swipeAxisRef.current = 'x';
						axis = 'x';
					} else if ((allowTop && yDelta < 0) || (allowBottom && yDelta > 0)) {
						nextY = yDelta;
					} else {
						nextY = dampen(yDelta);
					}
				}

				lastSwipeRef.current = { x: nextX, y: nextY };
				const node = toastRef.current;
				if (node) {
					node.style.setProperty('--swipe-translate-x', `${nextX}px`);
					node.style.setProperty('--swipe-translate-y', `${nextY}px`);
				}
			},
			[swipeDirections],
		);

		const handlePointerUp = useCallback(
			(event: React.PointerEvent<HTMLDivElement>) => {
				if (event.currentTarget.hasPointerCapture(event.pointerId)) {
					event.currentTarget.releasePointerCapture(event.pointerId);
				}

				if (!pointerStartRef.current) {
					setSwipeDismissDirection(null);
					setIsSwiping(false);
					clearSwipeRefs();
					return;
				}

				const elapsed = dragStartTimeRef.current
					? Date.now() - dragStartTimeRef.current
					: 0;

				const axis = swipeAxisRef.current;
				const { x, y } = lastSwipeRef.current;
				let dismissed = false;

				if (axis) {
					const distance = axis === 'x' ? x : y;
					const velocity = elapsed > 0 ? Math.abs(distance) / elapsed : 0;
					const meetsThreshold =
						Math.abs(distance) >= SWIPE_DISMISS_THRESHOLD ||
						velocity > SWIPE_DISMISS_VELOCITY;

					if (meetsThreshold && Math.abs(distance) > 0) {
						let direction: SwipeDirection;
						if (axis === 'x') {
							direction = distance > 0 ? 'right' : 'left';
						} else {
							direction = distance > 0 ? 'bottom' : 'top';
						}

						if (swipeDirections.includes(direction)) {
							setSwipeDismissDirection(direction);
							dismissed = true;
							handleClose();
						}
					}
				}

				if (!dismissed) {
					setSwipeDismissDirection(null);
				}

				setIsSwiping(false);
				clearSwipeRefs();
			},
			[clearSwipeRefs, handleClose, swipeDirections],
		);

		const handlePointerCancel = useCallback(
			(event: React.PointerEvent<HTMLDivElement>) => {
				if (event.currentTarget.hasPointerCapture(event.pointerId)) {
					event.currentTarget.releasePointerCapture(event.pointerId);
				}
				setSwipeDismissDirection(null);
				setIsSwiping(false);
				clearSwipeRefs();
			},
			[clearSwipeRefs],
		);

		return (
			<div
				ref={toastRef}
				className={cn(
					toastContainerVariants({ position, variant }),
					className,
					swipeCursorClass,
					stackHidden && 'pointer-events-none',
				)}
				style={{
					transformOrigin: position?.startsWith('top-')
						? 'center top'
						: 'center bottom',
					zIndex,
					transition: isSwiping
						? `transform 0s linear, opacity ${transitionDuration} ${transitionTimingFunction}`
						: `transform ${transitionDuration} ${transitionTimingFunction}, opacity ${transitionDuration} ${transitionTimingFunction}`,
					...transformStyle,
				}}
				role={stackHidden ? undefined : liveRole}
				aria-live={stackHidden ? undefined : livePoliteness}
				aria-atomic={stackHidden ? undefined : 'true'}
				aria-describedby={stackHidden ? undefined : descriptionId}
				aria-hidden={stackHidden ? true : undefined}
				tabIndex={-1}
				onTransitionEnd={handleTransitionEnd}
				data-toast-id={id}
			>
				<div
					role="alert"
					className={cn(swipeCursorClass)}
					onPointerDown={handlePointerDown}
					onPointerMove={handlePointerMove}
					onPointerUp={handlePointerUp}
					onPointerCancel={handlePointerCancel}
					onMouseEnter={() => {
						setIsItemHovered(true);
						onGroupHoverEnter?.();
					}}
					onMouseLeave={() => setIsItemHovered(false)}
					onFocusCapture={() => setIsItemHovered(true)}
					onBlurCapture={(e) => {
						const current = toastRef.current;
						const next = e.relatedTarget as Node | null;
						if (!current || !next || !current.contains(next)) {
							setIsItemHovered(false);
						}
					}}
				>
					<div className={cn(toastContentVariants({ variant }))}>
						<button
							type="button"
							onClick={handleClose}
							className={cn(
								'absolute top-2 right-2 cursor-pointer rounded-sm p-1 text-foreground/45 hover:bg-popover-muted hover:text-foreground/70 transition-[background-color,color,box-shadow] ease-out-quad duration-100 focus-visible:ring-1 focus-visible:ring-ring/50 focus-visible:outline-none',
							)}
							aria-label="Close toast"
						>
							<Icons.X aria-hidden="true" className="h-4 w-4" />
						</button>

						<div className="p-4 pr-8">
							{title && (
								<div
									id={titleId}
									className="mb-1 text-sm leading-none font-medium select-none"
								>
									{title}
								</div>
							)}
							{description && (
								<div
									id={descriptionId}
									className="text-sm leading-snug text-foreground/70 select-none"
								>
									{description}
								</div>
							)}
							{action && (
								<div className="mt-3">
									<button
										type="button"
										onClick={() => {
											action.onClick();
											handleClose();
										}}
										className="relative inline-flex cursor-pointer items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium bg-linear-to-b from-gradient-from to-gradient-to hover:contrast-90 transition-[background-color,color,box-shadow,filter] ease-out-quad duration-100 shadow-[inset_0_1px_0_0_rgb(255_255_255/.32),0px_1px_1px_-0.5px_rgba(9,9,11,0.05),0px_3px_3px_-1.5px_rgba(9,9,11,0.05),0px_6px_6px_-3px_rgba(9,9,11,0.05)] dark:shadow-[inset_0_1px_0_0_rgb(255_255_255/.12),0px_1px_1px_-0.5px_rgba(9,9,11,0.05),0px_3px_3px_-1.5px_rgba(9,9,11,0.05),0px_6px_6px_-3px_rgba(9,9,11,0.05)] text-card-muted dark:text-foreground focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-offset-ring-offset/50 focus-visible:outline-none focus-visible:ring-ring/50"
									>
										{action.label}
									</button>
								</div>
							)}
						</div>
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
			prevProps.toast.renderIndex === nextProps.toast.renderIndex &&
			prevProps.toast.total === nextProps.toast.total &&
			prevProps.isGroupHovered === nextProps.isGroupHovered &&
			prevProps.expandedOffset === nextProps.expandedOffset &&
			prevProps.expandedGap === nextProps.expandedGap &&
			prevProps.collapsedOffset === nextProps.collapsedOffset &&
			prevProps.hiddenCollapsedOffset === nextProps.hiddenCollapsedOffset
		);
	},
);

ToastItem.displayName = 'ToastItem';

const ToastManager: React.FC<{
	toasts: ToastData[];
	onRemove: (id: string) => void;
	expandedGap?: number;
}> = React.memo(
	({ toasts, onRemove, expandedGap = ANIMATION_CONFIG.EXPANDED_GAP }) => {
		const [heights, setHeights] = useState<Record<string, number>>({});
		const [hovered, setHovered] = useState<Record<ToastPosition, boolean>>({
			'top-left': false,
			'top-center': false,
			'top-right': false,
			'bottom-left': false,
			'bottom-center': false,
			'bottom-right': false,
		});
		const previousStackIndexRef = useRef<Record<string, number>>({});
		const previousCollapsedOffsetsRef = useRef<Record<string, number>>({});
		const previousExpandedOffsetsRef = useRef<Record<string, number>>({});

		const toastsByPosition = useMemo(() => {
			const grouped = toasts.reduce(
				(acc, toast) => {
					const pos = toast.position || 'bottom-center';
					if (!acc[pos]) acc[pos] = [];
					acc[pos].push(toast);
					return acc;
				},
				{} as Record<ToastPosition, ToastData[]>,
			);

			const nextStackIndices: Record<string, number> = {};

			Object.keys(grouped).forEach((position) => {
				const positionKey = position as ToastPosition;
				const list = grouped[positionKey];
				const activeToasts = list.filter(
					(toast) => !toast.isLeaving && !toast.shouldClose,
				);
				const activeIndexMap = new Map<string, number>();

				activeToasts.forEach((toast, activeIndex) => {
					activeIndexMap.set(toast.id, activeIndex);
				});

				grouped[positionKey] = list.map((toast, orderIndex) => {
					let stackIndex =
						activeIndexMap.get(toast.id) ??
						previousStackIndexRef.current[toast.id];

					if (stackIndex == null || Number.isNaN(stackIndex)) {
						stackIndex = orderIndex;
					}

					nextStackIndices[toast.id] = stackIndex;

					return {
						...toast,
						index: stackIndex,
						renderIndex: orderIndex,
						total: list.length,
					};
				}) as PositionedToast[];
			});

			previousStackIndexRef.current = nextStackIndices;

			return grouped as Record<ToastPosition, PositionedToast[]>;
		}, [toasts]);

		useEffect(() => {
			setHovered((prev) => {
				let changed = false;
				const next = { ...prev };
				const positions = Object.keys(prev) as ToastPosition[];
				for (const pos of positions) {
					const hasToast = (toastsByPosition[pos]?.length ?? 0) > 0;
					if (!hasToast && next[pos]) {
						next[pos] = false;
						changed = true;
					}
				}
				return changed ? next : prev;
			});
		}, [toastsByPosition]);

		const positionEntries = useMemo(
			() => Object.entries(toastsByPosition),
			[toastsByPosition],
		);

		const collapsedOffsetData = useMemo(() => {
			const byPosition: Record<ToastPosition, number[]> = {
				'top-left': [],
				'top-center': [],
				'top-right': [],
				'bottom-left': [],
				'bottom-center': [],
				'bottom-right': [],
			};
			const byId: Record<string, number> = {};

			for (const [pos, group] of positionEntries as [
				ToastPosition,
				PositionedToast[],
			][]) {
				const isTopPosition = pos.startsWith('top-');
				const activeToasts = group.filter((toast) => !toast.shouldClose);
				const offsetsForActive: number[] = [];

				for (let i = 0; i < activeToasts.length; i++) {
					if (i === 0) {
						offsetsForActive.push(0);
						continue;
					}

					const prevToast = activeToasts[i - 1];
					const currentToast = activeToasts[i];
					const prevOffset = offsetsForActive[i - 1] ?? 0;
					if (!prevToast || !currentToast) {
						offsetsForActive.push(prevOffset);
						continue;
					}
					const prevHeight = heights[prevToast.id];
					const currentHeight = heights[currentToast.id];
					const fallbackOffset =
						prevOffset +
						(isTopPosition ? 1 : -1) * ANIMATION_CONFIG.STACK_OFFSET;

					if (
						prevHeight == null ||
						currentHeight == null ||
						Number.isNaN(prevHeight) ||
						Number.isNaN(currentHeight)
					) {
						offsetsForActive.push(fallbackOffset);
						continue;
					}

					if (isTopPosition) {
						offsetsForActive.push(
							prevOffset +
								(prevHeight - currentHeight + ANIMATION_CONFIG.STACK_OFFSET),
						);
					} else {
						offsetsForActive.push(
							prevOffset +
								(currentHeight - prevHeight - ANIMATION_CONFIG.STACK_OFFSET),
						);
					}
				}

				for (let i = 0; i < activeToasts.length; i++) {
					const toast = activeToasts[i];
					if (!toast) continue;
					byId[toast.id] = offsetsForActive[i] ?? 0;
				}

				for (const toast of group) {
					if (byId[toast.id] != null) continue;

					const previousOffset = previousCollapsedOffsetsRef.current[toast.id];
					if (typeof previousOffset === 'number') {
						byId[toast.id] = previousOffset;
						continue;
					}

					const defaultOffset = isTopPosition
						? toast.index * ANIMATION_CONFIG.STACK_OFFSET
						: -(toast.index * ANIMATION_CONFIG.STACK_OFFSET);
					byId[toast.id] = defaultOffset;
				}

				byPosition[pos] = group.map((toast) => byId[toast.id] ?? 0);
			}

			return { byPosition, byId };
		}, [positionEntries, heights]);

		const expandedOffsetData = useMemo(() => {
			const byPosition: Record<ToastPosition, number[]> = {
				'top-left': [],
				'top-center': [],
				'top-right': [],
				'bottom-left': [],
				'bottom-center': [],
				'bottom-right': [],
			};
			const byId: Record<string, number> = {};

			for (const [pos, group] of positionEntries as [
				ToastPosition,
				PositionedToast[],
			][]) {
				const offsets: number[] = [];
				const activeToasts = group.filter((toast) => !toast.shouldClose);
				let acc = 0;

				for (let i = 0; i < activeToasts.length; i++) {
					if (i === 0) {
						offsets.push(0);
						continue;
					}
					const prevToast = activeToasts[i - 1];
					const prevHeight = prevToast ? (heights[prevToast.id] ?? 0) : 0;
					acc += prevHeight + expandedGap;
					offsets.push(acc);
				}

				for (let i = 0; i < activeToasts.length; i++) {
					const toast = activeToasts[i];
					if (!toast) continue;
					byId[toast.id] = offsets[i] ?? 0;
				}

				for (const toast of group) {
					if (byId[toast.id] != null) continue;

					const previousOffset = previousExpandedOffsetsRef.current[toast.id];
					if (typeof previousOffset === 'number') {
						byId[toast.id] = previousOffset;
						continue;
					}

					let fallback = 0;
					for (const candidate of group) {
						if (candidate.id === toast.id) break;
						const height = heights[candidate.id] ?? 0;
						fallback += height + expandedGap;
					}
					byId[toast.id] = fallback;
				}

				byPosition[pos] = group.map((toast) => byId[toast.id] ?? 0);
			}

			return { byPosition, byId };
		}, [positionEntries, heights, expandedGap]);

		useEffect(() => {
			previousCollapsedOffsetsRef.current = collapsedOffsetData.byId;
		}, [collapsedOffsetData]);

		useEffect(() => {
			previousExpandedOffsetsRef.current = expandedOffsetData.byId;
		}, [expandedOffsetData]);

		const collapsedOffsetsByPosition = collapsedOffsetData.byPosition;
		const expandedOffsetsByPosition = expandedOffsetData.byPosition;

		useEffect(() => {
			if (positionEntries.length === 0) return;

			const handler = (e: MouseEvent) => {
				const { clientX: x, clientY: y } = e;
				const next: Record<ToastPosition, boolean> = { ...hovered } as Record<
					ToastPosition,
					boolean
				>;
				for (const [pos, group] of positionEntries as [
					ToastPosition,
					PositionedToast[],
				][]) {
					let top = Number.POSITIVE_INFINITY;
					let left = Number.POSITIVE_INFINITY;
					let right = Number.NEGATIVE_INFINITY;
					let bottom = Number.NEGATIVE_INFINITY;
					let any = false;
					for (const t of group) {
						if (t.index >= ANIMATION_CONFIG.MAX_VISIBLE_TOASTS) continue;
						const el = document.querySelector(
							`[data-toast-id="${t.id}"]`,
						) as HTMLElement | null;
						if (!el) continue;
						const r = el.getBoundingClientRect();
						top = Math.min(top, r.top);
						left = Math.min(left, r.left);
						right = Math.max(right, r.right);
						bottom = Math.max(bottom, r.bottom);
						any = true;
					}

					if (!any) {
						next[pos] = false;
						continue;
					}

					const inside = x >= left && x <= right && y >= top && y <= bottom;
					next[pos] = inside;
				}
				const changed = Object.keys(next as Record<string, boolean>).some(
					(k) =>
						(next as Record<string, boolean>)[k] !==
						(hovered as Record<string, boolean>)[k],
				);
				if (changed) setHovered(next);
			};

			document.addEventListener('mousemove', handler);
			return () => document.removeEventListener('mousemove', handler);
		}, [hovered, positionEntries]);

		useEffect(() => {
			if (positionEntries.length === 0) return;

			const handleKeyDown = (e: KeyboardEvent) => {
				for (const [, group] of positionEntries) {
					const latest = group?.[0];
					if (!latest) continue;

					const container = document.querySelector(
						`[data-toast-id="${latest.id}"]`,
					) as HTMLElement | null;
					if (!container) continue;

					if (e.key === 'Escape') {
						const active = document.activeElement as HTMLElement | null;
						if (active && container.contains(active)) {
							const closeBtn = container.querySelector(
								'[aria-label="Close toast"]',
							) as HTMLButtonElement | null;
							if (closeBtn) {
								e.preventDefault();
								closeBtn.click();
							}
						}
					}
				}
			};

			document.addEventListener('keydown', handleKeyDown);
			return () => document.removeEventListener('keydown', handleKeyDown);
		}, [positionEntries]);

		if (toasts.length === 0) return null;

		return (
			<div className="pointer-events-none fixed inset-0 z-50">
				{positionEntries.map(([position, positionToasts]) => {
					const pos = position as ToastPosition;
					const expandedOffsets = expandedOffsetsByPosition[pos];
					const collapsedOffsets = collapsedOffsetsByPosition[pos];
					const isHovered = hovered[pos];
					const activeToasts = positionToasts.filter(
						(toast) => !toast.shouldClose,
					);
					const visibleStackLimit = Math.max(
						ANIMATION_CONFIG.MAX_VISIBLE_TOASTS - 1,
						0,
					);
					const maxVisibleStackIndex = Math.min(
						Math.max(activeToasts.length - 1, 0),
						visibleStackLimit,
					);
					const lastVisibleToastId = activeToasts[maxVisibleStackIndex]?.id;
					const lastVisibleRenderIndex =
						lastVisibleToastId != null
							? positionToasts.findIndex(
									(candidate) => candidate.id === lastVisibleToastId,
								)
							: -1;
					const sharedHiddenCollapsedOffset =
						lastVisibleRenderIndex >= 0
							? collapsedOffsets?.[lastVisibleRenderIndex]
							: undefined;
					return (
						<React.Fragment key={position}>
							{positionToasts.map((toast, idx) => {
								const toastIsHidden =
									toast.index >= ANIMATION_CONFIG.MAX_VISIBLE_TOASTS;
								const hiddenCollapsedOffset = toastIsHidden
									? (sharedHiddenCollapsedOffset ?? collapsedOffsets?.[idx])
									: collapsedOffsets?.[idx];
								const collapsedOffsetValue = collapsedOffsets?.[idx];
								const itemProps: ToastItemProps = {
									toast,
									onRemove,
									isGroupHovered: isHovered,
									expandedOffset: expandedOffsets?.[idx] ?? 0,
									expandedGap,
									onHeightChange: (id, h) =>
										setHeights((prev) =>
											prev[id] === h ? prev : { ...prev, [id]: h },
										),
									onGroupHoverEnter: () =>
										setHovered((prev) => ({ ...prev, [pos]: true })),
								};
								if (collapsedOffsetValue !== undefined) {
									itemProps.collapsedOffset = collapsedOffsetValue;
								}
								if (hiddenCollapsedOffset !== undefined) {
									itemProps.hiddenCollapsedOffset = hiddenCollapsedOffset;
								}
								return <ToastItem key={toast.id} {...itemProps} />;
							})}
						</React.Fragment>
					);
				})}
			</div>
		);
	},
);

ToastManager.displayName = 'ToastManager';

export const Toaster: React.FC<{ expandedGap?: number }> = ({
	expandedGap,
}) => {
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

	const managerProps = expandedGap === undefined ? {} : { expandedGap };
	return (
		<ToastManager toasts={toasts} onRemove={handleRemove} {...managerProps} />
	);
};
