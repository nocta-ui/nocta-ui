'use client';

import {
	Composite,
	CompositeItem,
	useCompositeStore,
	useStoreState,
} from '@ariakit/react';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '@/lib/utils';

const RESISTANCE = 0.3;
const MAX_VELOCITY = 30;
const easeOutCubic = (p: number) => (p - 1) ** 3 + 1;
const clamp = (value: number, min: number, max: number) =>
	Math.max(min, Math.min(value, max));

type Size = 'sm' | 'md' | 'lg';

const wheelPickerSizeConfig: Record<
	Size,
	{ itemHeight: number; widthClass: string }
> = {
	sm: { itemHeight: 20, widthClass: 'w-28' },
	md: { itemHeight: 24, widthClass: 'w-32' },
	lg: { itemHeight: 28, widthClass: 'w-36' },
};

const wheelPickerVariants = cva(
	[
		'not-prose relative isolate overflow-hidden rounded-md border border-border bg-card shadow-sm transition-colors ease-in-out duration-200',
	],
	{
		variants: {
			size: {
				sm: wheelPickerSizeConfig.sm.widthClass,
				md: wheelPickerSizeConfig.md.widthClass,
				lg: wheelPickerSizeConfig.lg.widthClass,
			},
			disabled: {
				true: 'pointer-events-none cursor-not-allowed opacity-50',
				false: '',
			},
		},
		defaultVariants: { size: 'md', disabled: false },
	},
);

const wheelPickerTrackText = cva(
	'flex w-full items-center justify-center px-3 text-center text-foreground/45 transition-colors duration-200 ease-in-out',
	{
		variants: {
			size: { sm: 'text-xs', md: 'text-sm', lg: 'text-base' },
		},
		defaultVariants: { size: 'md' },
	},
);

const wheelPickerHighlightText = cva(
	'flex w-full items-center justify-center px-3 text-center font-medium text-foreground',
	{
		variants: {
			size: { sm: 'text-sm', md: 'text-base', lg: 'text-lg' },
		},
		defaultVariants: { size: 'md' },
	},
);

const wheelPickerFocusRingClasses =
	'group-focus/wheelpicker:rounded-sm group-focus/wheelpicker:border-border group-focus/wheelpicker:ring-1 group-focus/wheelpicker:ring-ring/50 group-focus/wheelpicker:ring-offset-1 group-focus/wheelpicker:ring-offset-ring-offset/50 group-focus-visible/wheelpicker:rounded-sm group-focus-visible/wheelpicker:border-border group-focus-visible/wheelpicker:ring-1 group-focus-visible/wheelpicker:ring-ring/50 group-focus-visible/wheelpicker:ring-offset-1 group-focus-visible/wheelpicker:ring-offset-ring-offset/50 transition-all duration-200 ease-in-out';

const wheelPickerHighlightBand = cva(
	cn(
		'absolute left-1 right-1 top-1/2 flex -translate-y-1/2 items-center justify-center bg-card-muted rounded-sm border border-transparent transition-colors duration-200 pointer-events-none',
		wheelPickerFocusRingClasses,
	),
	{
		variants: {
			size: { sm: 'h-5', md: 'h-6', lg: 'h-7' },
		},
		defaultVariants: { size: 'md' },
	},
);

interface WheelPickerGroupContextValue {
	size: Size;
	disabled: boolean;
	itemHeight: number;
}

const WheelPickerGroupContext =
	React.createContext<WheelPickerGroupContextValue | null>(null);

export interface WheelPickerGroupProps
	extends React.HTMLAttributes<HTMLDivElement> {
	size?: Size;
	disabled?: boolean;
	contentClassName?: string;
	children?: React.ReactNode;
}

export const WheelPickerGroup: React.FC<WheelPickerGroupProps> = ({
	size = 'md',
	disabled = false,
	className,
	children,
	contentClassName,
	...props
}) => {
	const itemHeight = React.useMemo(
		() =>
			wheelPickerSizeConfig[size]?.itemHeight ??
			wheelPickerSizeConfig.md.itemHeight,
		[size],
	);

	const contextValue = React.useMemo<WheelPickerGroupContextValue>(
		() => ({ size, disabled, itemHeight }),
		[size, disabled, itemHeight],
	);

	return (
		<WheelPickerGroupContext.Provider value={contextValue}>
			<div
				{...props}
				className={cn(
					'not-prose relative isolate flex overflow-hidden rounded-md border border-border bg-card shadow-sm transition-colors duration-200',
					disabled ? 'pointer-events-none cursor-not-allowed opacity-50' : '',
					className,
				)}
				aria-disabled={disabled || undefined}
			>
				<div
					className="pointer-events-none absolute left-1 right-1 top-1/2 z-10 -translate-y-1/2 rounded-sm bg-card"
					style={{ height: itemHeight }}
					aria-hidden
				/>
				<div
					className={cn(wheelPickerHighlightBand({ size }), 'z-20')}
					style={{ height: itemHeight }}
					aria-hidden
				/>
				<div
					className={cn(
						'relative z-30 flex w-full flex-row gap-0',
						contentClassName,
					)}
				>
					{children}
				</div>
			</div>
		</WheelPickerGroupContext.Provider>
	);
};

export interface WheelPickerProps
	extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	disabled?: boolean;
	size?: Size;
	visibleCount?: number;
	infinite?: boolean;
	'aria-label'?: string;
	children?: React.ReactNode;
}

type OptionNode = { value: string; node: React.ReactNode };

export const WheelPicker: React.FC<WheelPickerProps> = ({
	value,
	defaultValue,
	onValueChange,
	disabled: disabledProp = false,
	size: sizeProp = 'md',
	visibleCount: countProp = 20,
	infinite = false,
	className = '',
	children,
	'aria-label': ariaLabel,
	...props
}) => {
	const groupContext = React.useContext(WheelPickerGroupContext);
	const grouped = Boolean(groupContext);
	const size = groupContext?.size ?? sizeProp;
	const disabled = Boolean(disabledProp || groupContext?.disabled);

	const itemHeight = React.useMemo(
		() =>
			wheelPickerSizeConfig[size]?.itemHeight ??
			wheelPickerSizeConfig.md.itemHeight,
		[size],
	);

	const options = React.useMemo<OptionNode[]>(() => {
		const acc: OptionNode[] = [];
		React.Children.forEach(children, (child) => {
			if (!React.isValidElement<WheelPickerItemProps>(child)) return;
			const val = child.props.value as string | undefined;
			if (val == null) return;
			const node = child.props.children ?? val;
			acc.push({ value: val, node });
		});
		return acc;
	}, [children]);

	const isControlled = value !== undefined;
	const [internalValue, setInternalValue] = React.useState<string | undefined>(
		defaultValue ?? options[0]?.value,
	);
	const selectedValue = isControlled ? value : internalValue;

	const uid = React.useId();
	const instancePrefix = React.useMemo(
		() => `wp-${uid.replace(/[:]/g, '')}`,
		[uid],
	);
	const composite = useCompositeStore({
		orientation: 'vertical',
		virtualFocus: true,
		focusLoop: infinite,
	});
	const [isDragging, setIsDragging] = React.useState(false);

	const radius = React.useMemo(() => {
		const itemAngle = 360 / countProp;
		return itemHeight / Math.tan((itemAngle * Math.PI) / 180);
	}, [countProp, itemHeight]);
	const containerHeight = React.useMemo(
		() => Math.round(radius * 2 + itemHeight * 0.25),
		[radius, itemHeight],
	);
	const quarterCount = React.useMemo(() => {
		const raw = countProp >> 2;
		if (!options.length) return Math.max(1, raw);
		const safeRaw = Math.max(1, raw);
		return Math.min(safeRaw, options.length);
	}, [countProp, options.length]);
	const itemAngle = React.useMemo(() => 360 / countProp, [countProp]);
	const halfItemHeight = itemHeight * 0.5;
	const baseDeceleration = 3 * 10;
	const snapBackDeceleration = 10;

	const containerRef = React.useRef<HTMLDivElement>(null);
	const wheelItemsRef = React.useRef<HTMLUListElement>(null);
	const highlightListRef = React.useRef<HTMLUListElement>(null);
	const highlightBandRef = React.useRef<HTMLDivElement>(null);

	const scrollRef = React.useRef(0);
	const moveId = React.useRef(0);
	const draggingRef = React.useRef(false);
	const hasActiveGestureRef = React.useRef(false);
	const lastWheelTimeRef = React.useRef(0);
	const touchDataRef = React.useRef<{
		startY: number;
		yList: [number, number][];
		touchScroll?: number;
		isClick?: boolean;
	}>({ startY: 0, yList: [], touchScroll: 0, isClick: true });
	const dragControllerRef = React.useRef<AbortController | null>(null);
	const selectedValueRef = React.useRef<string | undefined>(selectedValue);

	const normalizeScroll = React.useCallback(
		(scroll: number) =>
			((scroll % options.length) + options.length) % options.length,
		[options.length],
	);

	const scrollTo = React.useCallback(
		(scroll: number) => {
			const normalizedScroll = infinite ? normalizeScroll(scroll) : scroll;

			if (wheelItemsRef.current) {
				const transform = `translateZ(${-radius}px) rotateX(${itemAngle * normalizedScroll}deg)`;
				wheelItemsRef.current.style.transform = transform;
				wheelItemsRef.current.childNodes.forEach((node) => {
					const li = node as HTMLLIElement;
					const rawIndex = li.dataset?.['index'];
					if (rawIndex === undefined) return;
					const distance = Math.abs(Number(rawIndex) - normalizedScroll);
					const hideForDepth = distance > quarterCount;
					li.style.visibility = hideForDepth ? 'hidden' : 'visible';
				});
			}

			if (highlightListRef.current) {
				const transformValue = `translateY(${-normalizedScroll * itemHeight}px)`;
				highlightListRef.current.style.transform = transformValue;
			}

			return normalizedScroll;
		},
		[infinite, normalizeScroll, radius, itemAngle, quarterCount, itemHeight],
	);

	const cancelAnimation = React.useCallback(() => {
		cancelAnimationFrame(moveId.current);
	}, []);

	const animateScroll = React.useCallback(
		(
			startScroll: number,
			endScroll: number,
			duration: number,
			onComplete?: () => void,
		) => {
			if (duration <= 0 || startScroll === endScroll) {
				cancelAnimation();
				scrollRef.current = scrollTo(endScroll);
				onComplete?.();
				return;
			}
			const startTime = performance.now();
			const totalDistance = endScroll - startScroll;
			const tick = (currentTime: number) => {
				const elapsed = (currentTime - startTime) / 1000;
				if (elapsed < duration) {
					const progress = easeOutCubic(elapsed / duration);
					scrollRef.current = scrollTo(startScroll + progress * totalDistance);
					moveId.current = requestAnimationFrame(tick);
				} else {
					cancelAnimation();
					scrollRef.current = scrollTo(endScroll);
					onComplete?.();
				}
			};
			requestAnimationFrame(tick);
		},
		[scrollTo, cancelAnimation],
	);

	const setSelectedValue = React.useCallback(
		(next: string) => {
			if (!isControlled) setInternalValue(next);
			onValueChange?.(next);
		},
		[isControlled, onValueChange],
	);

	const selectByScroll = React.useCallback(
		(scroll: number) => {
			const normalizedFloat = infinite ? normalizeScroll(scroll) : scroll;
			const boundedScroll = infinite
				? Math.round(normalizedFloat)
				: clamp(
						Math.round(normalizedFloat),
						0,
						Math.max(0, options.length - 1),
					);
			scrollRef.current = scrollTo(boundedScroll);
			const selected = options[scrollRef.current];
			if (selected) {
				selectedValueRef.current = selected.value;
				setSelectedValue(selected.value);
				const nextActiveId = `${instancePrefix}-${selected.value}`;
				if (composite.getState().activeId !== nextActiveId)
					composite.setActiveId(nextActiveId);
			}
		},
		[
			infinite,
			normalizeScroll,
			options,
			scrollTo,
			setSelectedValue,
			composite,
			instancePrefix,
		],
	);

	const selectByValue = React.useCallback(
		(val: string) => {
			const index = options.findIndex((o) => o.value === val);
			if (index === -1) return;
			cancelAnimation();
			selectByScroll(index);
		},
		[options, cancelAnimation, selectByScroll],
	);

	const scrollByStep = React.useCallback(
		(step: number) => {
			const startScroll = scrollRef.current;
			let endScroll = startScroll + step;
			endScroll = infinite
				? Math.round(endScroll)
				: clamp(Math.round(endScroll), 0, Math.max(0, options.length - 1));
			const distance = Math.abs(endScroll - startScroll);
			if (distance === 0) return;
			const duration = Math.sqrt(distance / 5);
			cancelAnimation();
			animateScroll(startScroll, endScroll, duration, () =>
				selectByScroll(scrollRef.current),
			);
		},
		[infinite, options.length, cancelAnimation, animateScroll, selectByScroll],
	);

	const wheelSegmentPositions = React.useMemo(() => {
		const degToRad = Math.PI / 180;
		const segmentLengths: number[] = [];
		for (let i = quarterCount - 1; i >= -quarterCount + 1; --i) {
			const angle = i * itemAngle;
			segmentLengths.push(itemHeight * Math.cos(angle * degToRad));
		}
		const totalLength = segmentLengths.reduce(
			(acc, len) => acc + (len || 0),
			0,
		);
		const startOffset = Math.max(0, (containerHeight - totalLength) / 2);
		let positionAlongWheel = startOffset;
		const ranges: [number, number][] = [];
		for (const length of segmentLengths) {
			const start = positionAlongWheel;
			positionAlongWheel += length || 0;
			ranges.push([start, positionAlongWheel]);
		}
		if (!ranges.length) return ranges;
		const first = ranges[0];
		const last = ranges[ranges.length - 1];
		if (first) ranges[0] = [0, first[1]];
		if (last) ranges[ranges.length - 1] = [last[0], containerHeight];
		return ranges;
	}, [itemAngle, itemHeight, quarterCount, containerHeight]);

	const updateScrollDuringDrag = React.useCallback(
		(e: MouseEvent | TouchEvent) => {
			try {
				const currentY =
					(e instanceof MouseEvent ? e.clientY : e.touches?.[0]?.clientY) || 0;
				const touchData = touchDataRef.current;
				if (touchData.isClick) {
					const dragThreshold = 5;
					if (Math.abs(currentY - touchData.startY) > dragThreshold)
						touchData.isClick = false;
				}
				touchData.yList.push([currentY, Date.now()]);
				if (touchData.yList.length > 5) touchData.yList.shift();
				const dragDelta = (touchData.startY - currentY) / itemHeight;
				let nextScroll = scrollRef.current + dragDelta;
				if (infinite) {
					nextScroll = normalizeScroll(nextScroll);
				} else {
					const maxIndex = options.length;
					if (nextScroll < 0) nextScroll *= RESISTANCE;
					else if (nextScroll > maxIndex)
						nextScroll = maxIndex + (nextScroll - maxIndex) * RESISTANCE;
				}
				touchData.touchScroll = scrollTo(nextScroll);
			} catch {}
		},
		[itemHeight, infinite, options.length, normalizeScroll, scrollTo],
	);

	const handleDragMoveEvent = React.useCallback(
		(event: MouseEvent | TouchEvent) => {
			if (
				!draggingRef.current &&
				!containerRef.current?.contains(event.target as Node) &&
				event.target !== containerRef.current
			) {
				return;
			}
			draggingRef.current = true;
			updateScrollDuringDrag(event);
		},
		[updateScrollDuringDrag],
	);

	const initiateDragGesture = React.useCallback(
		(event: MouseEvent | TouchEvent) => {
			if (hasActiveGestureRef.current) return;
			cancelAnimation();
			const touchData = touchDataRef.current;
			const startY =
				event instanceof MouseEvent
					? event.clientY
					: event.touches?.[0]?.clientY || 0;
			touchData.startY = startY;
			touchData.yList = [];
			touchData.isClick = true;
			touchData.touchScroll = scrollRef.current;
			hasActiveGestureRef.current = true;
			draggingRef.current = true;
			setIsDragging(true);

			const passiveOpts = { passive: false } as const;
			const controller = new AbortController();
			dragControllerRef.current = controller;
			const onMouseMove = (e: MouseEvent) => handleDragMoveEvent(e);
			const onTouchMove = (e: TouchEvent) => handleDragMoveEvent(e);
			const onMouseLeave = () => controller.abort();
			const onTouchCancel = () => controller.abort();
			document.addEventListener('mousemove', onMouseMove, passiveOpts);
			document.addEventListener('touchmove', onTouchMove, passiveOpts);
			document.addEventListener('mouseleave', onMouseLeave, passiveOpts);
			document.addEventListener('touchcancel', onTouchCancel, passiveOpts);
			controller.signal.addEventListener('abort', () => {
				document.removeEventListener('mousemove', onMouseMove);
				document.removeEventListener('touchmove', onTouchMove);
				document.removeEventListener('mouseleave', onMouseLeave);
				document.removeEventListener('touchcancel', onTouchCancel);
				draggingRef.current = false;
				hasActiveGestureRef.current = false;
				setIsDragging(false);
			});
		},
		[cancelAnimation, handleDragMoveEvent],
	);

	const handleWheelItemClick = React.useCallback(
		(clientY: number) => {
			const container = containerRef.current;
			if (!container) return;
			const { top, height } = container.getBoundingClientRect();
			const clickOffsetY = clientY - top;
			const clickedSegmentIndex = wheelSegmentPositions.findIndex(
				([start, end]) => clickOffsetY >= start && clickOffsetY <= end,
			);
			if (clickedSegmentIndex !== -1) {
				const stepsToScroll = (quarterCount - clickedSegmentIndex - 1) * -1;
				scrollByStep(stepsToScroll);
				return;
			}
			const relativeOffset = clickOffsetY - height / 2;
			const approximateSteps = Math.round(relativeOffset / itemHeight);
			if (approximateSteps !== 0) scrollByStep(approximateSteps);
		},
		[wheelSegmentPositions, quarterCount, scrollByStep, itemHeight],
	);

	const decelerateAndAnimateScroll = React.useCallback(
		(initialVelocity: number) => {
			const currentScroll = scrollRef.current;
			let targetScroll = currentScroll;
			let deceleration =
				initialVelocity > 0 ? -baseDeceleration : baseDeceleration;
			let duration = 0;

			if (infinite) {
				duration = Math.abs(initialVelocity / deceleration);
				const scrollDistance =
					initialVelocity * duration + 0.5 * deceleration * duration * duration;
				targetScroll = Math.round(currentScroll + scrollDistance);
			} else if (currentScroll < 0 || currentScroll > options.length - 1) {
				const target = clamp(currentScroll, 0, Math.max(0, options.length - 1));
				const scrollDistance = currentScroll - target;
				deceleration = snapBackDeceleration;
				duration = Math.sqrt(Math.abs(scrollDistance / deceleration));
				initialVelocity = deceleration * duration;
				initialVelocity =
					currentScroll > 0 ? -initialVelocity : initialVelocity;
				targetScroll = target;
			} else {
				duration = Math.abs(initialVelocity / deceleration);
				const scrollDistance =
					initialVelocity * duration + 0.5 * deceleration * duration * duration;
				targetScroll = Math.round(currentScroll + scrollDistance);
				targetScroll = clamp(targetScroll, 0, Math.max(0, options.length - 1));
				const adjustedDistance = targetScroll - currentScroll;
				duration = Math.sqrt(Math.abs(adjustedDistance / deceleration));
			}

			animateScroll(currentScroll, targetScroll, duration, () => {
				selectByScroll(scrollRef.current);
			});
		},
		[infinite, options.length, animateScroll, selectByScroll],
	);

	const finalizeDragAndStartInertiaScroll = React.useCallback(() => {
		try {
			dragControllerRef.current?.abort();
			dragControllerRef.current = null;
			const touchData = touchDataRef.current;
			if (touchData.isClick) {
				handleWheelItemClick(touchData.startY);
				return;
			}
			const yList = touchData.yList;
			let velocity = 0;
			if (yList.length > 1) {
				const len = yList.length;
				const [startY, startTime] = yList[len - 2] ?? [0, 0];
				const [endY, endTime] = yList[len - 1] ?? [0, 0];
				const timeDiff = endTime - startTime;
				if (timeDiff > 0) {
					const distance = startY - endY;
					const velocityPerSecond = ((distance / itemHeight) * 1000) / timeDiff;
					const direction = velocityPerSecond > 0 ? 1 : -1;
					const absVelocity = Math.min(
						Math.abs(velocityPerSecond),
						MAX_VELOCITY,
					);
					velocity = absVelocity * direction;
				}
			}
			scrollRef.current = touchData.touchScroll ?? scrollRef.current;
			decelerateAndAnimateScroll(velocity);
		} finally {
			draggingRef.current = false;
			hasActiveGestureRef.current = false;
			setIsDragging(false);
		}
	}, [itemHeight, handleWheelItemClick, decelerateAndAnimateScroll]);

	const handleDragStartEvent = React.useCallback(
		(e: MouseEvent | TouchEvent) => {
			const isDragging = draggingRef.current;
			const isTargetValid =
				!!containerRef.current?.contains(e.target as Node) ||
				e.target === containerRef.current;
			if ((isDragging || isTargetValid) && e.cancelable) {
				e.preventDefault?.();
				if (options.length) initiateDragGesture(e);
			}
		},
		[initiateDragGesture, options.length],
	);

	const scrollByWheel = React.useCallback(
		(event: WheelEvent) => {
			event.preventDefault();
			const now = Date.now();
			if (now - lastWheelTimeRef.current < 100) return;
			const direction = Math.sign(event.deltaY);
			if (!direction) return;
			lastWheelTimeRef.current = now;
			scrollByStep(direction);
		},
		[scrollByStep],
	);

	const handleWheelEvent = React.useCallback(
		(event: WheelEvent) => {
			if (!options.length || !containerRef.current) return;
			const isDragging = draggingRef.current;
			const isTargetValid =
				containerRef.current.contains(event.target as Node) ||
				event.target === containerRef.current;
			if ((isDragging || isTargetValid) && event.cancelable) {
				event.preventDefault();
				scrollByWheel(event);
			}
		},
		[scrollByWheel, options.length],
	);

	React.useEffect(() => {
		const container = containerRef.current;
		if (!container) return;
		const opts = { passive: false } as const;
		const onTouchEnd = (e: Event) => {
			if (!hasActiveGestureRef.current) return;
			e.cancelable && e.preventDefault();
			finalizeDragAndStartInertiaScroll();
		};
		const onMouseUp = (e: Event) => {
			if (!hasActiveGestureRef.current) return;
			e.cancelable && e.preventDefault();
			finalizeDragAndStartInertiaScroll();
		};
		container.addEventListener(
			'touchstart',
			handleDragStartEvent as (e: Event) => void,
			opts,
		);
		container.addEventListener('touchend', onTouchEnd, opts);
		container.addEventListener(
			'wheel',
			handleWheelEvent as (e: Event) => void,
			opts,
		);
		document.addEventListener(
			'mousedown',
			handleDragStartEvent as (e: Event) => void,
			opts,
		);
		document.addEventListener('mouseup', onMouseUp, opts);
		return () => {
			container.removeEventListener(
				'touchstart',
				handleDragStartEvent as (e: Event) => void,
			);
			container.removeEventListener(
				'touchend',
				onTouchEnd as (e: Event) => void,
			);
			container.removeEventListener(
				'wheel',
				handleWheelEvent as (e: Event) => void,
			);
			document.removeEventListener(
				'mousedown',
				handleDragStartEvent as (e: Event) => void,
			);
			document.removeEventListener('mouseup', onMouseUp as (e: Event) => void);
		};
	}, [
		handleDragStartEvent,
		finalizeDragAndStartInertiaScroll,
		handleWheelEvent,
	]);

	React.useEffect(() => {
		if (!options.length) return;
		const val = selectedValue ?? options[0]?.value;
		if (val != null) selectByValue(val);
	}, [selectedValue, options, selectByValue]);

	const renderWheelItems = React.useMemo(() => {
		const items: React.ReactNode[] = [];
		const renderItem = (opt: OptionNode, idx: number, angle: number) => (
			<li
				key={idx}
				data-index={idx}
				className={wheelPickerTrackText({ size })}
				style={{
					position: 'absolute',
					top: -halfItemHeight,
					left: 0,
					width: '100%',
					height: itemHeight,
					WebkitFontSmoothing: 'subpixel-antialiased',
					willChange: 'visibility',
					transform: `rotateX(${angle}deg) translateZ(${radius}px)`,
					visibility: 'hidden',
				}}
				aria-hidden
			>
				{opt.node}
			</li>
		);

		for (let i = 0; i < options.length; i++) {
			const option = options[i];
			if (!option) continue;
			items.push(renderItem(option, i, -itemAngle * i));
		}

		if (infinite) {
			for (let i = 0; i < quarterCount; i++) {
				const prependIndex = -i - 1;
				const appendIndex = i + options.length;
				const prependOption = options[options.length - i - 1];
				const appendOption = options[i];
				if (prependOption) {
					items.unshift(
						renderItem(prependOption, prependIndex, itemAngle * (i + 1)),
					);
				}
				if (appendOption) {
					items.push(
						renderItem(appendOption, appendIndex, -itemAngle * appendIndex),
					);
				}
			}
		}
		return items;
	}, [
		options,
		itemAngle,
		itemHeight,
		halfItemHeight,
		radius,
		size,
		quarterCount,
		infinite,
	]);

	const renderHighlightItems = React.useMemo(() => {
		const items = options.map((opt) => (
			<CompositeItem
				store={composite}
				key={opt.value}
				id={`${instancePrefix}-${opt.value}`}
				className={wheelPickerHighlightText({ size })}
				style={{ height: itemHeight }}
			>
				{opt.node}
			</CompositeItem>
		));
		if (infinite && options.length) {
			items.unshift(
				<li
					key="infinite-start"
					className={wheelPickerHighlightText({ size })}
					style={{ height: itemHeight }}
				>
					{options[options.length - 1]?.node}
				</li>,
			);
			items.push(
				<li
					key="infinite-end"
					className={wheelPickerHighlightText({ size })}
					style={{ height: itemHeight }}
				>
					{options[0]?.node}
				</li>,
			);
		}
		return items;
	}, [options, infinite, size, itemHeight, instancePrefix, composite]);

	const rootClassName = grouped
		? cn(
				'not-prose relative isolate flex-none min-w-0 overflow-hidden bg-transparent shadow-none transition-colors duration-200',
				wheelPickerSizeConfig[size]?.widthClass,
				disabled && 'pointer-events-none cursor-not-allowed opacity-50',
				className,
			)
		: cn(wheelPickerVariants({ size, disabled }), className);

	const activeIndex = React.useMemo(
		() => options.findIndex((o) => o.value === selectedValue),
		[options, selectedValue],
	);
	const activeId =
		activeIndex >= 0 && options[activeIndex]
			? `${instancePrefix}-${options[activeIndex]!.value}`
			: undefined;

	React.useEffect(() => {
		if (!activeId) return;
		if (composite.getState().activeId !== activeId)
			composite.setActiveId(activeId);
	}, [activeId, composite]);

	const ariakitActiveId = useStoreState(composite, (s) => s.activeId);

	React.useEffect(() => {
		if (!ariakitActiveId) return;
		const idx = options.findIndex(
			(o) => `${instancePrefix}-${o.value}` === ariakitActiveId,
		);

		if (idx < 0) return;

		const start = scrollRef.current;
		let end = infinite ? idx : clamp(idx, 0, Math.max(0, options.length - 1));

		if (infinite && options.length) {
			const length = options.length;
			const diff = end - start;
			if (diff > length / 2) end -= length;
			else if (diff < -length / 2) end += length;
		}

		if (start === end) {
			scrollRef.current = scrollTo(end);
			selectByScroll(scrollRef.current);
			return;
		}

		const distance = Math.abs(end - start);
		const duration = Math.sqrt(distance / 5);

		cancelAnimation();
		animateScroll(start, end, duration, () =>
			selectByScroll(scrollRef.current),
		);
	}, [
		ariakitActiveId,
		options,
		instancePrefix,
		infinite,
		cancelAnimation,
		animateScroll,
		selectByScroll,
		scrollTo,
	]);

	return (
		<div
			{...props}
			className={rootClassName}
			aria-disabled={disabled || undefined}
		>
			<Composite
				ref={containerRef}
				store={composite}
				role="listbox"
				aria-label={ariaLabel}
				tabIndex={disabled ? -1 : 0}
				className={cn(
					'group/wheelpicker relative flex h-full w-full select-none outline-none focus-visible:outline-none',
					disabled
						? 'cursor-not-allowed'
						: isDragging
							? 'cursor-grabbing'
							: 'cursor-grab',
				)}
				style={{
					height: containerHeight,
					perspective: '2000px',
					userSelect: 'none',
					overflow: 'hidden',
					WebkitMaskImage:
						'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
					maskImage:
						'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
				}}
			>
				<ul
					ref={wheelItemsRef}
					style={{
						position: 'absolute',
						top: '50%',
						left: 0,
						display: 'block',
						width: '100%',
						height: 0,
						margin: '0 auto',
						WebkitFontSmoothing: 'subpixel-antialiased',
						willChange: 'transform',
						backfaceVisibility: 'hidden',
						transformStyle: 'preserve-3d',
					}}
					aria-hidden
				>
					{renderWheelItems}
				</ul>

				<div
					className={cn(
						'pointer-events-none absolute left-0 top-1/2 w-full -translate-y-1/2 rounded-none bg-card',
						grouped && 'rounded-none bg-transparent',
					)}
					style={{ height: itemHeight, borderRadius: grouped ? 0 : 'inherit' }}
					aria-hidden
				/>

				<div
					className={cn(
						wheelPickerHighlightBand({ size }),
						grouped && 'left-1 right-1 rounded-sm z-40',
					)}
					style={{
						overflow: 'clip',
						height: itemHeight,
					}}
					ref={highlightBandRef}
				>
					<ul
						ref={highlightListRef}
						className="m-0 w-full list-none p-0"
						style={{
							position: 'absolute',
							width: '100%',
							top: infinite ? -itemHeight - 1 : -1,
							left: 0,
							pointerEvents: 'none',
							overflow: 'visible',
							scrollMargin: '0px',
						}}
					>
						{renderHighlightItems}
					</ul>
				</div>
			</Composite>
		</div>
	);
};

export interface WheelPickerItemProps
	extends Omit<React.HTMLAttributes<HTMLDivElement>, 'value'> {
	value: string;
	children?: React.ReactNode;
}

export const WheelPickerItem: React.FC<WheelPickerItemProps> = () => null;

export type { VariantProps };
