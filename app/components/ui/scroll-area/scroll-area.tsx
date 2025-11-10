'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '@/lib/utils';

type ScrollAreaType = 'hover' | 'scroll' | 'always';
type ScrollAxis = 'vertical' | 'horizontal';
type ScrollDirection = ScrollAxis | 'both';

interface ScrollMetrics {
	size: number;
	progress: number;
	scrollable: boolean;
}

interface ScrollAreaContextValue {
	registerViewport: (node: HTMLDivElement | null) => void;
	getViewport: () => HTMLDivElement | null;
	updateMetrics: () => void;
	handleScroll: () => void;
	metrics: Record<ScrollAxis, ScrollMetrics>;
	type: ScrollAreaType;
	isHovered: boolean;
	isScrolling: boolean;
	scrollbarThumbClassName?: string | undefined;
}

const ScrollAreaContext = React.createContext<ScrollAreaContextValue | null>(
	null,
);

const defaultMetrics: Record<ScrollAxis, ScrollMetrics> = {
	vertical: { size: 1, progress: 0, scrollable: false },
	horizontal: { size: 1, progress: 0, scrollable: false },
};

const scrollAreaBaseClass =
	'group/scroll-area not-prose relative overflow-hidden';

const scrollViewportBaseClass =
	'relative size-full overflow-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden';

const scrollBarVariants = cva(
	'pointer-events-none absolute z-20 select-none rounded-full bg-transparent opacity-0 transition-opacity duration-300 ease-smooth data-[visible=true]:opacity-100 overflow-hidden',
	{
		variants: {
			orientation: {
				vertical: 'right-1 top-1 bottom-1',
				horizontal: 'left-1 right-1 bottom-1',
			},
			size: {
				sm: '',
				md: '',
				lg: '',
			},
		},
		compoundVariants: [
			{ orientation: 'vertical', size: 'sm', class: 'w-1' },
			{ orientation: 'vertical', size: 'md', class: 'w-1.5' },
			{ orientation: 'vertical', size: 'lg', class: 'w-2' },
			{ orientation: 'horizontal', size: 'sm', class: 'h-1' },
			{ orientation: 'horizontal', size: 'md', class: 'h-1.5' },
			{ orientation: 'horizontal', size: 'lg', class: 'h-2' },
		],
		defaultVariants: {
			orientation: 'vertical',
			size: 'md',
		},
	},
);

const MIN_THUMB_RATIO = 0.08;
const CORNER_GAP = 8;

function useScrollAreaContext(component: string) {
	const context = React.useContext(ScrollAreaContext);
	if (!context) {
		throw new Error(`${component} must be used within <ScrollArea>`);
	}
	return context;
}

function calculateAxisMetrics(
	total: number,
	viewport: number,
	offset: number,
): ScrollMetrics {
	if (total <= viewport || total === 0) {
		return { size: 1, progress: 0, scrollable: false };
	}

	const size = clamp(viewport / total, 0, 1);
	const maxScroll = total - viewport;
	const progress = maxScroll > 0 ? clamp(offset / maxScroll, 0, 1) : 0;

	return {
		size,
		progress,
		scrollable: true,
	};
}

function clamp(value: number, min = 0, max = 1) {
	return Math.min(Math.max(value, min), max);
}

function metricsAreEqual(a: ScrollMetrics, b: ScrollMetrics) {
	return (
		Math.abs(a.size - b.size) < 0.001 &&
		Math.abs(a.progress - b.progress) < 0.001 &&
		a.scrollable === b.scrollable
	);
}

function composeRefs<T>(
	...refs: Array<React.Ref<T> | undefined>
): React.RefCallback<T> {
	return (node) => {
		for (const ref of refs) {
			if (!ref) continue;
			if (typeof ref === 'function') {
				ref(node);
			} else {
				(ref as React.RefObject<T | null>).current = node;
			}
		}
	};
}

export interface ScrollAreaProps
	extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
	children: React.ReactNode;
	type?: ScrollAreaType;
	direction?: ScrollDirection;
	onViewportScroll?: React.UIEventHandler<HTMLDivElement>;
	scrollbarSize?: VariantProps<typeof scrollBarVariants>['size'];
	horizontalScrollbarSize?: VariantProps<typeof scrollBarVariants>['size'];
	scrollbarThumbClassName?: string | undefined;
}

export const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
	(
		{
			children,
			className,
			type = 'hover',
			direction = 'vertical',
			onViewportScroll,
			scrollbarSize = 'md',
			horizontalScrollbarSize,
			onPointerEnter,
			onPointerLeave,
			scrollbarThumbClassName,
			...props
		},
		ref,
	) => {
		const viewportRef = React.useRef<HTMLDivElement | null>(null);
		const [metrics, setMetrics] =
			React.useState<Record<ScrollAxis, ScrollMetrics>>(defaultMetrics);
		const [isHovered, setIsHovered] = React.useState(false);
		const [isScrolling, setIsScrolling] = React.useState(false);
		const scrollTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(
			null,
		);

		const updateMetrics = React.useCallback(() => {
			const viewport = viewportRef.current;
			if (!viewport) return;
			const nextVertical = calculateAxisMetrics(
				viewport.scrollHeight,
				viewport.clientHeight,
				viewport.scrollTop,
			);
			const nextHorizontal = calculateAxisMetrics(
				viewport.scrollWidth,
				viewport.clientWidth,
				viewport.scrollLeft,
			);

			setMetrics((current) => {
				if (
					metricsAreEqual(current.vertical, nextVertical) &&
					metricsAreEqual(current.horizontal, nextHorizontal)
				) {
					return current;
				}

				return {
					vertical: nextVertical,
					horizontal: nextHorizontal,
				};
			});
		}, []);

		const registerViewport = React.useCallback(
			(node: HTMLDivElement | null) => {
				if (viewportRef.current === node) return;
				viewportRef.current = node;
				if (node) {
					updateMetrics();
				}
			},
			[updateMetrics],
		);

		const getViewport = React.useCallback(() => viewportRef.current, []);

		const handleScroll = React.useCallback(() => {
			updateMetrics();
			setIsScrolling(true);
			if (scrollTimeoutRef.current) {
				clearTimeout(scrollTimeoutRef.current);
			}
			scrollTimeoutRef.current = setTimeout(() => setIsScrolling(false), 450);
		}, [updateMetrics]);

		React.useEffect(() => {
			return () => {
				if (scrollTimeoutRef.current) {
					clearTimeout(scrollTimeoutRef.current);
				}
			};
		}, []);

		const onEnter = React.useCallback(
			(event: React.PointerEvent<HTMLDivElement>) => {
				setIsHovered(true);
				onPointerEnter?.(event);
			},
			[onPointerEnter],
		);

		const onLeave = React.useCallback(
			(event: React.PointerEvent<HTMLDivElement>) => {
				setIsHovered(false);
				onPointerLeave?.(event);
			},
			[onPointerLeave],
		);

		const contextValue = React.useMemo(
			() => ({
				registerViewport,
				getViewport,
				updateMetrics,
				handleScroll,
				metrics,
				type,
				isHovered,
				isScrolling,
				scrollbarThumbClassName,
			}),
			[
				registerViewport,
				getViewport,
				updateMetrics,
				handleScroll,
				metrics,
				type,
				isHovered,
				isScrolling,
				scrollbarThumbClassName,
			],
		);

		const showVerticalScrollBar =
			direction === 'vertical' || direction === 'both';
		const showHorizontalScrollBar =
			direction === 'horizontal' || direction === 'both';
		const resolvedHorizontalSize = horizontalScrollbarSize ?? scrollbarSize;

		return (
			<ScrollAreaContext.Provider value={contextValue}>
				<div
					ref={ref}
					className={cn(scrollAreaBaseClass, className)}
					onPointerEnter={onEnter}
					onPointerLeave={onLeave}
					{...props}
				>
					<ScrollViewport onScroll={onViewportScroll}>
						{children}
					</ScrollViewport>
					{showVerticalScrollBar ? (
						<ScrollBar orientation="vertical" size={scrollbarSize} />
					) : null}
					{showHorizontalScrollBar ? (
						<ScrollBar orientation="horizontal" size={resolvedHorizontalSize} />
					) : null}
				</div>
			</ScrollAreaContext.Provider>
		);
	},
);
ScrollArea.displayName = 'ScrollArea';

interface ScrollViewportProps extends React.HTMLAttributes<HTMLDivElement> {}

const ScrollViewport = React.forwardRef<HTMLDivElement, ScrollViewportProps>(
	({ className, onScroll, ...props }, ref) => {
		const { registerViewport, handleScroll, updateMetrics, getViewport } =
			useScrollAreaContext('ScrollViewport');
		const composedRef = composeRefs(ref, registerViewport);

		React.useEffect(() => {
			return () => registerViewport(null);
		}, [registerViewport]);

		React.useEffect(() => {
			if (typeof window === 'undefined') return;
			const viewport = getViewport();
			if (!viewport) return;

			const runUpdate = () => updateMetrics();
			runUpdate();

			if (typeof ResizeObserver === 'undefined') {
				return;
			}

			const resizeObserver = new ResizeObserver(runUpdate);
			resizeObserver.observe(viewport);

			const observeChildren = () => {
				for (const child of Array.from(viewport.children)) {
					if (child instanceof Element) {
						resizeObserver.observe(child);
					}
				}
			};

			observeChildren();

			const mutationObserver = new MutationObserver(() => {
				observeChildren();
				runUpdate();
			});

			mutationObserver.observe(viewport, {
				childList: true,
				subtree: true,
			});

			return () => {
				resizeObserver.disconnect();
				mutationObserver.disconnect();
			};
		}, [getViewport, updateMetrics]);

		return (
			<div
				ref={composedRef}
				onScroll={(event) => {
					handleScroll();
					onScroll?.(event);
				}}
				className={cn(scrollViewportBaseClass, className)}
				{...props}
			/>
		);
	},
);
ScrollViewport.displayName = 'ScrollViewport';

export interface ScrollBarProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof scrollBarVariants> {
	orientation?: ScrollAxis;
}

const ScrollBar = React.forwardRef<HTMLDivElement, ScrollBarProps>(
	(
		{ className, orientation = 'vertical', size = 'md', style, ...props },
		ref,
	) => {
		const { metrics, type, isHovered, isScrolling, scrollbarThumbClassName } =
			useScrollAreaContext('ScrollBar');
		const axis = metrics[orientation];
		const hasBoth =
			metrics.vertical.scrollable && metrics.horizontal.scrollable;

		if (!axis.scrollable) {
			return null;
		}

		const thumbFraction = Math.max(axis.size, MIN_THUMB_RATIO);
		const thumbSizePercent = thumbFraction * 100;
		const maxOffset = Math.max(0, 100 - thumbSizePercent);
		const offsetPercent = axis.progress * maxOffset;

		const shouldShow =
			type === 'always' ||
			(type === 'hover' && isHovered) ||
			(type === 'scroll' && isScrolling);

		const trackStyle =
			hasBoth && (orientation === 'vertical' || orientation === 'horizontal')
				? orientation === 'vertical'
					? { bottom: `calc(0.25rem + ${CORNER_GAP}px)` }
					: { right: `calc(0.25rem + ${CORNER_GAP}px)` }
				: undefined;

		return (
			<div
				ref={ref}
				aria-hidden="true"
				data-visible={shouldShow ? 'true' : 'false'}
				className={cn(scrollBarVariants({ orientation, size }), className)}
				style={
					trackStyle
						? {
								...style,
								...trackStyle,
							}
						: style
				}
				{...props}
			>
				<span
					aria-hidden="true"
					className={cn(
						'pointer-events-none absolute block rounded-full',
						scrollbarThumbClassName ?? 'bg-foreground/45',
						orientation === 'horizontal' ? 'h-full top-0' : 'w-full left-0',
					)}
					style={
						orientation === 'vertical'
							? {
									height: `${thumbSizePercent}%`,
									top: `${offsetPercent}%`,
								}
							: {
									width: `${thumbSizePercent}%`,
									left: `${offsetPercent}%`,
								}
					}
				/>
			</div>
		);
	},
);
ScrollBar.displayName = 'ScrollBar';
