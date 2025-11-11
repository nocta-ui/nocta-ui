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
	scrollAreaRef: React.RefObject<HTMLDivElement | null>;
	viewportRef: React.RefObject<HTMLDivElement | null>;
	type: ScrollAreaType;
	scrollHideDelay: number;
	scrollbarThumbClassName: string | undefined;
}

const ScrollAreaContext = React.createContext<ScrollAreaContextValue | null>(
	null,
);

const scrollAreaBaseClass =
	'group/scroll-area not-prose relative overflow-hidden';

const scrollViewportBaseClass =
	'relative size-full overflow-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden';

const scrollBarVariants = cva(
	'pointer-events-none absolute z-20 select-none rounded-full bg-transparent opacity-0 transition-opacity duration-150 ease-basic overflow-hidden',
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

	const size = Math.min(Math.max(viewport / total, 0), 1);
	const maxScroll = total - viewport;
	const progress = maxScroll > 0 ? Math.min(Math.max(offset / maxScroll, 0), 1) : 0;

	return {
		size,
		progress,
		scrollable: true,
	};
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
	scrollbarThumbClassName?: string;
	scrollHideDelay?: number;
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
			scrollbarThumbClassName,
			scrollHideDelay = 600,
			...props
		},
		ref,
	) => {
		const scrollAreaRef = React.useRef<HTMLDivElement | null>(null);
		const viewportRef = React.useRef<HTMLDivElement | null>(null);

		const composedRef = React.useMemo(
			() => composeRefs(ref, scrollAreaRef),
			[ref],
		);

		const contextValue = React.useMemo<ScrollAreaContextValue>(
			() => ({
				scrollAreaRef,
				viewportRef,
				type,
				scrollHideDelay,
				scrollbarThumbClassName,
			}),
			[type, scrollHideDelay, scrollbarThumbClassName],
		);

		const showVerticalScrollBar =
			direction === 'vertical' || direction === 'both';
		const showHorizontalScrollBar =
			direction === 'horizontal' || direction === 'both';
		const resolvedHorizontalSize = horizontalScrollbarSize ?? scrollbarSize;

		return (
			<ScrollAreaContext.Provider value={contextValue}>
				<div
					ref={composedRef}
					className={cn(scrollAreaBaseClass, className)}
					{...props}
				>
					<ScrollViewport onScroll={onViewportScroll}>
						{children}
					</ScrollViewport>
					{showVerticalScrollBar && (
						<ScrollBar orientation="vertical" size={scrollbarSize} />
					)}
					{showHorizontalScrollBar && (
						<ScrollBar orientation="horizontal" size={resolvedHorizontalSize} />
					)}
				</div>
			</ScrollAreaContext.Provider>
		);
	},
);
ScrollArea.displayName = 'ScrollArea';

interface ScrollViewportProps extends React.HTMLAttributes<HTMLDivElement> {}

const ScrollViewport = React.forwardRef<HTMLDivElement, ScrollViewportProps>(
	({ className, onScroll, children, ...props }, ref) => {
		const { viewportRef } = useScrollAreaContext('ScrollViewport');

		const composedRef = React.useMemo(
			() => composeRefs(ref, viewportRef),
			[ref, viewportRef],
		);

		return (
			<div
				ref={composedRef}
				onScroll={onScroll}
				className={cn(scrollViewportBaseClass, className)}
				{...props}
			>
				{children}
			</div>
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
		const {
			viewportRef,
			scrollAreaRef,
			type,
			scrollHideDelay,
			scrollbarThumbClassName,
		} = useScrollAreaContext('ScrollBar');

		const scrollbarRef = React.useRef<HTMLDivElement | null>(null);
		const thumbRef = React.useRef<HTMLSpanElement | null>(null);
		const isScrollableRef = React.useRef(false);

		const composedRef = React.useMemo(
			() => composeRefs(ref, scrollbarRef),
			[ref],
		);

		const updateThumbPosition = React.useCallback(() => {
			const viewport = viewportRef.current;
			const thumb = thumbRef.current;
			const scrollbar = scrollbarRef.current;
			if (!viewport || !thumb || !scrollbar) return;

			const metrics = calculateAxisMetrics(
				orientation === 'vertical'
					? viewport.scrollHeight
					: viewport.scrollWidth,
				orientation === 'vertical'
					? viewport.clientHeight
					: viewport.clientWidth,
				orientation === 'vertical' ? viewport.scrollTop : viewport.scrollLeft,
			);

			const wasScrollable = isScrollableRef.current;
			isScrollableRef.current = metrics.scrollable;

			if (metrics.scrollable && !wasScrollable) {
				scrollbar.style.display = '';
			} else if (!metrics.scrollable && wasScrollable) {
				scrollbar.style.display = 'none';
			}

			if (metrics.scrollable) {
				const thumbFraction = Math.max(metrics.size, MIN_THUMB_RATIO);
				const thumbSizePercent = thumbFraction * 100;
				const maxOffset = Math.max(0, 100 - thumbSizePercent);
				const offsetPercent = metrics.progress * maxOffset;

				if (orientation === 'vertical') {
					thumb.style.height = `${thumbSizePercent}%`;
					thumb.style.top = `${offsetPercent}%`;
				} else {
					thumb.style.width = `${thumbSizePercent}%`;
					thumb.style.left = `${offsetPercent}%`;
				}
			}
		}, [orientation, viewportRef]);

		React.useEffect(() => {
			const scrollbar = scrollbarRef.current;
			if (!scrollbar) return;

			if (type === 'always') {
				scrollbar.style.opacity = '1';
			}
		}, [type]);

		React.useEffect(() => {
			if (type !== 'hover') return;

			const scrollArea = scrollAreaRef.current;
			const scrollbar = scrollbarRef.current;
			if (!scrollArea || !scrollbar) return;

			let hideTimer: number | undefined;

			const show = () => {
				if (hideTimer !== undefined) {
					window.clearTimeout(hideTimer);
				}
				scrollbar.style.opacity = '1';
			};

			const hide = () => {
				hideTimer = window.setTimeout(() => {
					scrollbar.style.opacity = '0';
				}, scrollHideDelay);
			};

			scrollArea.addEventListener('pointerenter', show);
			scrollArea.addEventListener('pointerleave', hide);

			return () => {
				if (hideTimer !== undefined) {
					window.clearTimeout(hideTimer);
				}
				scrollArea.removeEventListener('pointerenter', show);
				scrollArea.removeEventListener('pointerleave', hide);
			};
		}, [type, scrollHideDelay, scrollAreaRef]);

		React.useEffect(() => {
			if (type !== 'scroll') return;

			const viewport = viewportRef.current;
			const scrollbar = scrollbarRef.current;
			if (!viewport || !scrollbar) return;

			let hideTimer: number | undefined;

			const handleScroll = () => {
				scrollbar.style.opacity = '1';

				if (hideTimer !== undefined) {
					window.clearTimeout(hideTimer);
				}

				hideTimer = window.setTimeout(() => {
					scrollbar.style.opacity = '0';
				}, scrollHideDelay);

				requestAnimationFrame(updateThumbPosition);
			};

			viewport.addEventListener('scroll', handleScroll, { passive: true });

			return () => {
				if (hideTimer !== undefined) {
					window.clearTimeout(hideTimer);
				}
				viewport.removeEventListener('scroll', handleScroll);
			};
		}, [type, scrollHideDelay, viewportRef, updateThumbPosition]);

		React.useEffect(() => {
			const viewport = viewportRef.current;
			if (!viewport) return;

			updateThumbPosition();

			const handleScroll = () => {
				requestAnimationFrame(updateThumbPosition);
			};

			viewport.addEventListener('scroll', handleScroll, { passive: true });

			const resizeObserver = new ResizeObserver(() => {
				requestAnimationFrame(updateThumbPosition);
			});
			resizeObserver.observe(viewport);

			return () => {
				viewport.removeEventListener('scroll', handleScroll);
				resizeObserver.disconnect();
			};
		}, [viewportRef, updateThumbPosition]);

		const viewport = viewportRef.current;
		const hasBoth =
			viewport &&
			viewport.scrollHeight > viewport.clientHeight &&
			viewport.scrollWidth > viewport.clientWidth;

		const trackStyle =
			hasBoth && orientation === 'vertical'
				? { bottom: `calc(0.25rem + ${CORNER_GAP}px)` }
				: hasBoth && orientation === 'horizontal'
					? { right: `calc(0.25rem + ${CORNER_GAP}px)` }
					: undefined;

		return (
			<div
				ref={composedRef}
				aria-hidden="true"
				data-orientation={orientation}
				className={cn(scrollBarVariants({ orientation, size }), className)}
				style={{
					display: 'none',
					...(trackStyle ? trackStyle : {}),
					...style,
				}}
				{...props}
			>
				<span
					ref={thumbRef}
					aria-hidden="true"
					className={cn(
						'pointer-events-none absolute block rounded-full',
						scrollbarThumbClassName ?? 'bg-foreground/45',
						orientation === 'horizontal' ? 'h-full top-0' : 'w-full left-0',
					)}
				/>
			</div>
		);
	},
);
ScrollBar.displayName = 'ScrollBar';
