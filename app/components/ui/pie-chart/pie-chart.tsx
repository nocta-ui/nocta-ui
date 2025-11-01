'use client';

import type { PieArcDatum } from 'd3-shape';
import { arc, pie } from 'd3-shape';
import * as React from 'react';
import { cn } from '@/lib/utils';

type ChartDatum = Record<string, unknown>;

const DEFAULT_HEIGHT = 280;
const DEFAULT_COLORS = [
	'var(--color-chart-1)',
	'var(--color-chart-2)',
	'var(--color-chart-3)',
	'var(--color-chart-4)',
	'var(--color-chart-5)',
] as const;

export type PieChartSlice<TData extends ChartDatum = ChartDatum> = {
	id: string;
	datum: TData;
	value: number;
	label: string;
	color: string;
	index: number;
	percentage: number;
};

interface PieChartContextValue<TData extends ChartDatum> {
	slices: PieChartSlice<TData>[];
	total: number;
	formatLabel: (slice: PieChartSlice<TData>) => React.ReactNode;
	formatValue: (slice: PieChartSlice<TData>) => React.ReactNode;
	valueLabel: string;
	activeSliceId: string | null;
	setActiveSliceId: (id: string | null) => void;
}

const PieChartContext =
	React.createContext<PieChartContextValue<ChartDatum> | null>(null);

const PIE_CHART_ACTIONS_MARKER = Symbol('PieChartActions');
const PIE_CHART_TITLE_MARKER = Symbol('PieChartTitle');
const PIE_CHART_DESCRIPTION_MARKER = Symbol('PieChartDescription');

export function usePieChartContext<TData extends ChartDatum = ChartDatum>() {
	const context = React.useContext(
		PieChartContext,
	) as PieChartContextValue<TData> | null;

	if (!context) {
		throw new Error(
			'usePieChartContext must be used within a <PieChart> component.',
		);
	}

	return context;
}

function getNumericValue(input: unknown): number {
	if (typeof input === 'number' && Number.isFinite(input)) {
		return input;
	}
	if (typeof input === 'string') {
		const parsed = Number.parseFloat(input);
		if (Number.isFinite(parsed)) {
			return parsed;
		}
	}
	return 0;
}

function resolveRadius(
	value: number | string | undefined,
	base: number,
	defaultValue: number,
): number {
	if (typeof value === 'number' && Number.isFinite(value)) {
		return Math.max(0, value);
	}
	if (typeof value === 'string') {
		const trimmed = value.trim();
		if (trimmed.endsWith('%')) {
			const percentage = Number.parseFloat(trimmed.slice(0, -1));
			if (Number.isFinite(percentage)) {
				return Math.max(0, (percentage / 100) * base);
			}
		}
		const numeric = Number.parseFloat(trimmed);
		if (Number.isFinite(numeric)) {
			return Math.max(0, numeric);
		}
	}
	return defaultValue;
}

function resolveSliceColor(palette: readonly string[], index: number): string {
	if (palette.length === 0) {
		const fallbackIndex =
			DEFAULT_COLORS.length > 0 ? index % DEFAULT_COLORS.length : 0;
		const color = DEFAULT_COLORS[fallbackIndex];
		if (color == null) {
			throw new Error(
				`No fallback color found for fallbackIndex=${fallbackIndex}`,
			);
		}
		return color;
	}
	const paletteIndex = palette.length > 0 ? index % palette.length : 0;
	const fallbackIndex =
		DEFAULT_COLORS.length > 0 ? index % DEFAULT_COLORS.length : 0;
	const color = palette[paletteIndex] ?? DEFAULT_COLORS[fallbackIndex];
	if (color == null) {
		throw new Error(
			`No color found for paletteIndex=${paletteIndex}, fallbackIndex=${fallbackIndex}`,
		);
	}
	return color;
}

function toKeyLabel(key: string): string {
	const words = key
		.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
		.replace(/[_-]+/g, ' ')
		.split(' ')
		.map((part) => part.trim())
		.filter(Boolean)
		.map((part) => part.slice(0, 1).toUpperCase() + part.slice(1));
	return words.length ? words.join(' ') : key;
}

export interface PieChartProps<TData extends ChartDatum = ChartDatum>
	extends React.HTMLAttributes<HTMLDivElement> {
	data: TData[];
	valueKey: Extract<keyof TData, string>;
	nameKey?: Extract<keyof TData, string>;
	colors?: readonly string[];
	sortSlices?: boolean | ((a: TData, b: TData) => number);
	valueFormatter?: (
		slice: PieChartSlice<TData>,
		meta: { total: number; percentage: number },
	) => React.ReactNode;
	labelFormatter?: (slice: PieChartSlice<TData>) => React.ReactNode;
	children?: React.ReactNode;
}

function PieChartRootInner<TData extends ChartDatum>(
	{
		data,
		valueKey,
		nameKey,
		colors = DEFAULT_COLORS,
		sortSlices = false,
		valueFormatter,
		labelFormatter,
		className,
		children,
		...rest
	}: PieChartProps<TData>,
	ref: React.ForwardedRef<HTMLDivElement>,
) {
	const [activeSliceId, setActiveSliceId] = React.useState<string | null>(null);

	const valueLabel = React.useMemo(() => toKeyLabel(valueKey), [valueKey]);

	const { slices, total } = React.useMemo(() => {
		const palette = colors.length ? colors : DEFAULT_COLORS;

		const mapped = data.reduce<PieChartSlice<TData>[]>((acc, datum, index) => {
			const numericValue = Math.max(0, getNumericValue(datum[valueKey]));
			if (numericValue <= 0) return acc;

			const rawLabel =
				nameKey && datum[nameKey] != null
					? String(datum[nameKey])
					: `Slice ${index + 1}`;

			const color = resolveSliceColor(palette, index);

			acc.push({
				id: `${rawLabel}-${index}`,
				datum,
				value: numericValue,
				label: rawLabel,
				color,
				index,
				percentage: 0,
			});

			return acc;
		}, []);

		const sorted = (() => {
			if (typeof sortSlices === 'function') {
				return [...mapped].sort((a, b) => sortSlices(a.datum, b.datum));
			}
			if (sortSlices) {
				return [...mapped].sort((a, b) => b.value - a.value);
			}
			return mapped;
		})();

		const totalValue = sorted.reduce((sum, slice) => sum + slice.value, 0);

		const withPercentages = sorted.map<PieChartSlice<TData>>((slice) => ({
			...slice,
			percentage: totalValue > 0 ? slice.value / totalValue : 0,
		}));

		return {
			slices: withPercentages,
			total: totalValue,
		};
	}, [colors, data, nameKey, sortSlices, valueKey]);

	React.useEffect(() => {
		if (!activeSliceId) return;
		if (!slices.some((slice) => slice.id === activeSliceId)) {
			setActiveSliceId(null);
		}
	}, [activeSliceId, slices]);

	const formatLabel = React.useCallback(
		(slice: PieChartSlice<TData>) => {
			if (labelFormatter) return labelFormatter(slice);
			return slice.label;
		},
		[labelFormatter],
	);

	const formatValue = React.useCallback(
		(slice: PieChartSlice<TData>) => {
			if (valueFormatter) {
				return valueFormatter(slice, {
					total,
					percentage: slice.percentage,
				});
			}
			return slice.value.toLocaleString();
		},
		[valueFormatter, total],
	);

	const contextValue = React.useMemo<PieChartContextValue<TData>>(
		() => ({
			slices,
			total,
			formatLabel,
			formatValue,
			valueLabel,
			activeSliceId,
			setActiveSliceId,
		}),
		[activeSliceId, formatLabel, formatValue, slices, total, valueLabel],
	);

	return (
		<PieChartContext.Provider
			value={contextValue as PieChartContextValue<ChartDatum>}
		>
			<div
				ref={ref}
				className={cn(
					'not-prose relative flex flex-col rounded-lg border border-border bg-card shadow-md overflow-hidden',
					className,
				)}
				{...rest}
			>
				{children}
			</div>
		</PieChartContext.Provider>
	);
}

type PieChartComponent = <TData extends ChartDatum = ChartDatum>(
	props: PieChartProps<TData> & { ref?: React.Ref<HTMLDivElement> },
) => React.ReactElement | null;

const PieChartRoot = React.forwardRef(PieChartRootInner) as PieChartComponent;

export interface PieChartTitleProps {
	children: React.ReactNode;
	className?: string;
	as?: React.ElementType;
}

type PieChartTitleComponent = React.FC<PieChartTitleProps> & {
	[PIE_CHART_TITLE_MARKER]: true;
};

export const PieChartTitle = (({
	children,
	className = '',
	as: Component = 'h3',
	...props
}: PieChartTitleProps) => {
	return React.createElement(
		Component,
		{
			className: cn(
				'not-prose text-base font-medium leading-tight text-foreground',
				className,
			),
			...props,
		},
		children,
	);
}) as PieChartTitleComponent;
PieChartTitle.displayName = 'PieChartTitle';
PieChartTitle[PIE_CHART_TITLE_MARKER] = true;

export interface PieChartDescriptionProps
	extends React.HTMLAttributes<HTMLParagraphElement> {
	children: React.ReactNode;
	className?: string;
}

type PieChartDescriptionComponent = React.FC<PieChartDescriptionProps> & {
	[PIE_CHART_DESCRIPTION_MARKER]: true;
};

export const PieChartDescription = (({
	children,
	className = '',
	...props
}: PieChartDescriptionProps) => {
	return (
		<p
			className={cn(
				'not-prose text-sm leading-relaxed text-foreground/70',
				className,
			)}
			{...props}
		>
			{children}
		</p>
	);
}) as PieChartDescriptionComponent;
PieChartDescription.displayName = 'PieChartDescription';
PieChartDescription[PIE_CHART_DESCRIPTION_MARKER] = true;

export interface PieChartActionsProps
	extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
	className?: string;
}

type PieChartActionsComponent = React.FC<PieChartActionsProps> & {
	[PIE_CHART_ACTIONS_MARKER]: true;
};

export const PieChartActions = (({ children, className = '', ...props }) => {
	return (
		<div
			className={cn(
				'not-prose flex items-center gap-2 self-start sm:self-auto',
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
}) as PieChartActionsComponent;
PieChartActions.displayName = 'PieChartActions';
PieChartActions[PIE_CHART_ACTIONS_MARKER] = true;

function hasPieChartMarker(
	target: unknown,
	marker: symbol,
): target is { [key: symbol]: unknown } {
	if (!target) return false;
	if (
		(typeof target === 'function' || typeof target === 'object') &&
		target !== null &&
		Reflect.get(target, marker)
	) {
		return true;
	}
	if (
		typeof target === 'object' &&
		target !== null &&
		'type' in target &&
		(target as { type?: unknown }).type
	) {
		return hasPieChartMarker((target as { type?: unknown }).type, marker);
	}
	return false;
}

function cloneElementWithClassName<TProps extends { className?: string }>(
	element: React.ReactElement<TProps>,
	additionalClassName?: string,
) {
	if (!additionalClassName) {
		return element;
	}
	const mergedClassName = cn(element.props.className, additionalClassName);
	return React.cloneElement(element, {
		className: mergedClassName,
	} as Partial<TProps> & React.Attributes);
}

function isPieChartActionsElement(
	child: React.ReactNode,
): child is React.ReactElement {
	if (!React.isValidElement(child)) return false;
	const { type } = child;
	if (type === PieChartActions) return true;
	if (hasPieChartMarker(type, PIE_CHART_ACTIONS_MARKER)) return true;
	const displayName =
		typeof type === 'function' || (typeof type === 'object' && type !== null)
			? (type as { displayName?: string }).displayName
			: undefined;
	return displayName === PieChartActions.displayName;
}

function isPieChartTitleElement(
	child: React.ReactNode,
): child is React.ReactElement<PieChartTitleProps> {
	if (!React.isValidElement(child)) return false;
	const { type } = child;
	if (type === PieChartTitle) return true;
	if (hasPieChartMarker(type, PIE_CHART_TITLE_MARKER)) return true;
	const displayName =
		typeof type === 'function' || (typeof type === 'object' && type !== null)
			? (type as { displayName?: string }).displayName
			: undefined;
	return displayName === PieChartTitle.displayName;
}

function isPieChartDescriptionElement(
	child: React.ReactNode,
): child is React.ReactElement<PieChartDescriptionProps> {
	if (!React.isValidElement(child)) return false;
	const { type } = child;
	if (type === PieChartDescription) return true;
	if (hasPieChartMarker(type, PIE_CHART_DESCRIPTION_MARKER)) return true;
	const displayName =
		typeof type === 'function' || (typeof type === 'object' && type !== null)
			? (type as { displayName?: string }).displayName
			: undefined;
	return displayName === PieChartDescription.displayName;
}

export interface PieChartHeaderProps
	extends React.HTMLAttributes<HTMLDivElement> {
	contentClassName?: string;
	titleClassName?: string;
	descriptionClassName?: string;
	actionsClassName?: string;
}

export const PieChartHeader = React.forwardRef<
	HTMLDivElement,
	PieChartHeaderProps
>(
	(
		{
			className = '',
			children,
			contentClassName,
			titleClassName,
			descriptionClassName,
			actionsClassName,
			...props
		},
		ref,
	) => {
		const childrenArray = React.Children.toArray(children);
		const mainChildren: React.ReactNode[] = [];
		const actionChildren: React.ReactNode[] = [];

		childrenArray.forEach((child) => {
			if (isPieChartActionsElement(child)) {
				actionChildren.push(child);
			} else if (child !== null) {
				mainChildren.push(child);
			}
		});

		const enhancedMainChildren = mainChildren.map((child) => {
			if (isPieChartTitleElement(child)) {
				return cloneElementWithClassName(
					child as React.ReactElement<{ className?: string }>,
					titleClassName,
				);
			}
			if (isPieChartDescriptionElement(child)) {
				return cloneElementWithClassName(
					child as React.ReactElement<{ className?: string }>,
					descriptionClassName,
				);
			}
			return child;
		});

		const enhancedActionChildren = actionChildren.map((child) => {
			if (isPieChartActionsElement(child)) {
				return cloneElementWithClassName(
					child as React.ReactElement<{ className?: string }>,
					actionsClassName,
				);
			}
			return child;
		});

		return (
			<div
				ref={ref}
				className={cn(
					'not-prose flex flex-col gap-3 px-4 pt-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4',
					className,
				)}
				{...props}
			>
				{enhancedMainChildren.length ? (
					<div className={cn('space-y-1 sm:flex-1', contentClassName)}>
						{enhancedMainChildren}
					</div>
				) : null}
				{enhancedActionChildren.length ? enhancedActionChildren : null}
			</div>
		);
	},
);
PieChartHeader.displayName = 'PieChartHeader';

export interface PieChartTooltipInfo<TData extends ChartDatum = ChartDatum> {
	slice: PieChartSlice<TData>;
	value: number;
	percentage: number;
}

export interface PieChartGraphProps<TData extends ChartDatum = ChartDatum>
	extends React.HTMLAttributes<HTMLDivElement> {
	height?: number | string;
	innerRadius?: number | string;
	outerRadius?: number | string;
	padAngle?: number;
	cornerRadius?: number;
	startAngle?: number;
	endAngle?: number;
	showTooltip?: boolean;
	tooltipRender?: (info: PieChartTooltipInfo<TData>) => React.ReactNode;
	loading?: boolean;
	loadingState?: React.ReactNode;
	emptyState?: React.ReactNode;
	error?: React.ReactNode;
	ariaLabel?: string;
	children?: React.ReactNode;
}

function PieChartState({
	label,
	description,
}: {
	label: string;
	description?: React.ReactNode;
}) {
	return (
		<div className="flex h-full w-full items-center justify-center rounded-md border border-dashed border-border/60 bg-card-muted/30 px-4 py-10 text-center">
			<div className="space-y-2">
				<p className="text-sm font-medium text-foreground">{label}</p>
				{description ? (
					<p className="text-sm text-foreground/70">{description}</p>
				) : null}
			</div>
		</div>
	);
}

const PieChartGraphBase = React.forwardRef<
	HTMLDivElement,
	PieChartGraphProps<ChartDatum>
>(function PieChartGraphInner(
	{
		height,
		innerRadius,
		outerRadius,
		padAngle = 0,
		cornerRadius = 0,
		startAngle,
		endAngle,
		showTooltip = true,
		tooltipRender,
		loading = false,
		loadingState,
		emptyState,
		error,
		ariaLabel,
		children,
		className,
		style,
		...rest
	}: PieChartGraphProps<ChartDatum>,
	ref,
) {
	const {
		slices,
		formatLabel,
		formatValue,
		valueLabel,
		activeSliceId,
		setActiveSliceId,
	} = usePieChartContext();

	const chartAreaRef = React.useRef<HTMLDivElement | null>(null);
	const svgRef = React.useRef<SVGSVGElement | null>(null);
	const pathElementsRef = React.useRef<Map<string, SVGPathElement>>(new Map());
	const registerPathElement = React.useCallback(
		(id: string, element: SVGPathElement | null) => {
			const map = pathElementsRef.current;
			if (element) {
				map.set(id, element);
			} else {
				map.delete(id);
			}
		},
		[],
	);
	const setOuterContainerRef = React.useCallback(
		(node: HTMLDivElement | null) => {
			if (typeof ref === 'function') {
				ref(node);
			} else if (ref) {
				(ref as React.RefObject<HTMLDivElement | null>).current = node;
			}
		},
		[ref],
	);

	const resolvedHeight =
		typeof height === 'number'
			? `${height}px`
			: (height ?? `${DEFAULT_HEIGHT}px`);

	const svgTitleId = React.useId();
	const trimmedAriaLabel = ariaLabel?.trim();
	const svgTitle =
		trimmedAriaLabel && trimmedAriaLabel.length > 0
			? trimmedAriaLabel
			: 'Pie chart visualization';

	const viewBoxSize = 320;
	const maxRadius = viewBoxSize / 2 - 8;

	const resolvedOuterRadius = Math.min(
		resolveRadius(outerRadius, maxRadius, maxRadius),
		maxRadius,
	);
	const resolvedInnerRadius = Math.min(
		resolveRadius(innerRadius, maxRadius, 0),
		resolvedOuterRadius,
	);

	const sanitizedPadAngle =
		typeof padAngle === 'number' && Number.isFinite(padAngle)
			? Math.max(padAngle, 0)
			: 0;
	const padAngleRad = (sanitizedPadAngle * Math.PI) / 180;
	const sanitizedCornerRadius =
		typeof cornerRadius === 'number' && Number.isFinite(cornerRadius)
			? Math.max(cornerRadius, 0)
			: 0;
	const startAngleRad =
		startAngle !== undefined ? (startAngle * Math.PI) / 180 : undefined;
	const endAngleRad =
		endAngle !== undefined ? (endAngle * Math.PI) / 180 : undefined;

	const arcGenerator = React.useMemo(
		() =>
			arc<PieArcDatum<PieChartSlice>>()
				.innerRadius(resolvedInnerRadius)
				.outerRadius(resolvedOuterRadius)
				.cornerRadius(sanitizedCornerRadius),
		[resolvedInnerRadius, resolvedOuterRadius, sanitizedCornerRadius],
	);

	const arcs = React.useMemo(() => {
		const generator = pie<PieChartSlice>()
			.value((slice) => slice.value)
			.sort(null)
			.padAngle(padAngleRad);

		if (startAngleRad !== undefined) generator.startAngle(startAngleRad);
		if (endAngleRad !== undefined) generator.endAngle(endAngleRad);

		return generator(slices);
	}, [endAngleRad, padAngleRad, slices, startAngleRad]);

	const defaultTooltipRender = React.useCallback(
		(info: PieChartTooltipInfo) => (
			<div className="space-y-1">
				<div className="flex items-center gap-2">
					<span
						className="inline-flex h-2.5 w-2.5 shrink-0 rounded-full"
						style={{ backgroundColor: info.slice.color }}
					/>
					<span className="text-xs font-medium text-foreground">
						{formatLabel(info.slice)}
					</span>
				</div>
				<div className="flex items-center gap-2">
					<span className="text-xs text-foreground/70">
						{formatValue(info.slice)} {valueLabel}
					</span>
					<span className="text-xs text-foreground/45">
						{(info.percentage * 100).toFixed(1)}%
					</span>
				</div>
			</div>
		),
		[formatLabel, formatValue, valueLabel],
	);

	const tooltipRenderer = tooltipRender ?? defaultTooltipRender;

	const tooltipRef = React.useRef<HTMLDivElement | null>(null);
	const [tooltipDimensions, setTooltipDimensions] = React.useState<{
		width: number;
		height: number;
	}>({ width: 0, height: 0 });
	const [tooltip, setTooltip] = React.useState<{
		info: PieChartTooltipInfo;
		sliceId: string;
		x: number;
		y: number;
		horizontal: 'left' | 'right';
		vertical: 'top' | 'bottom';
		visible: boolean;
		entering: boolean;
	} | null>(null);

	const hideTooltipTimeoutRef = React.useRef<number | null>(null);

	const cancelScheduledTooltipHide = React.useCallback(() => {
		if (hideTooltipTimeoutRef.current !== null) {
			window.clearTimeout(hideTooltipTimeoutRef.current);
			hideTooltipTimeoutRef.current = null;
		}
	}, []);

	const clearTooltip = React.useCallback(() => {
		cancelScheduledTooltipHide();
		setTooltip((previous) =>
			previous ? { ...previous, visible: false, entering: false } : null,
		);
		setActiveSliceId(null);
	}, [cancelScheduledTooltipHide, setActiveSliceId]);

	const scheduleTooltipHide = React.useCallback(() => {
		cancelScheduledTooltipHide();
		hideTooltipTimeoutRef.current = window.setTimeout(() => {
			clearTooltip();
		}, 140);
	}, [cancelScheduledTooltipHide, clearTooltip]);

	const renderTooltip =
		showTooltip && tooltip ? tooltipRenderer(tooltip.info) : null;

	const showChart = !loading && !error && slices.length > 0;

	React.useEffect(() => {
		if (!showChart) {
			setTooltip(null);
		}
	}, [showChart]);

	React.useEffect(() => {
		if (!tooltip || tooltip.visible || tooltip.entering) return;
		const timeoutId = window.setTimeout(() => {
			setTooltip(null);
		}, 200);
		return () => window.clearTimeout(timeoutId);
	}, [tooltip]);

	React.useLayoutEffect(() => {
		if (
			!tooltipRef.current ||
			!tooltip ||
			typeof ResizeObserver === 'undefined'
		) {
			return;
		}
		const observer = new ResizeObserver(([entry]) => {
			if (!entry) return;
			const { width, height } = entry.contentRect;
			setTooltipDimensions({ width, height });
		});
		observer.observe(tooltipRef.current);
		return () => observer.disconnect();
	}, [tooltip]);

	React.useLayoutEffect(() => {
		if (!tooltip || !tooltip.entering) {
			return;
		}
		const frameId = window?.requestAnimationFrame(() => {
			setTooltip((previous) =>
				previous?.entering
					? { ...previous, visible: true, entering: false }
					: previous,
			);
		});
		return () => window.cancelAnimationFrame(frameId);
	}, [tooltip]);

	React.useEffect(
		() => () => {
			cancelScheduledTooltipHide();
		},
		[cancelScheduledTooltipHide],
	);

	const calculateTooltipPosition = React.useCallback(
		(arcDatum: PieArcDatum<PieChartSlice>, element?: SVGPathElement | null) => {
			if (!chartAreaRef.current) return null;

			const containerRect = chartAreaRef.current.getBoundingClientRect();

			const [centroidX, centroidY] = arcGenerator.centroid(arcDatum);
			const center = viewBoxSize / 2;

			const directionX = centroidX;
			const directionY = centroidY;
			const directionLength = Math.hypot(directionX, directionY) || 1;
			const angle = Math.atan2(directionY, directionX);

			const tooltipPadding = 12;
			const estimatedWidth = tooltipDimensions.width || 220;
			const estimatedHeight = tooltipDimensions.height || 96;

			let anchorPointX: number | null = null;
			let anchorPointY: number | null = null;

			if (element) {
				const elementRect = element.getBoundingClientRect();
				const localLeft = elementRect.left - containerRect.left;
				const localTop = elementRect.top - containerRect.top;
				anchorPointX = localLeft + elementRect.width / 2;
				anchorPointY = localTop + elementRect.height / 2;
			} else if (svgRef.current) {
				const svgRect = svgRef.current.getBoundingClientRect();
				const scale = Math.min(
					svgRect.width / viewBoxSize,
					svgRect.height / viewBoxSize,
				);
				if (!Number.isFinite(scale) || scale <= 0) {
					return null;
				}

				const offsetX =
					svgRect.left -
					containerRect.left +
					(svgRect.width - viewBoxSize * scale) / 2;
				const offsetY =
					svgRect.top -
					containerRect.top +
					(svgRect.height - viewBoxSize * scale) / 2;

				const preferredRadius =
					resolvedInnerRadius +
					(resolvedOuterRadius - resolvedInnerRadius) * 0.6;
				const safeOuterRadius = Math.max(0, resolvedOuterRadius - 12);
				const safeInnerRadius = Math.min(
					safeOuterRadius,
					resolvedInnerRadius + 12,
				);
				const targetRadius = Math.min(
					safeOuterRadius,
					Math.max(safeInnerRadius, preferredRadius),
				);

				const offsetDistance = 18;
				const targetX =
					(directionX / directionLength) * targetRadius +
					Math.cos(angle) * offsetDistance;
				const targetY =
					(directionY / directionLength) * targetRadius +
					Math.sin(angle) * offsetDistance;

				anchorPointX = offsetX + (targetX + center) * scale;
				anchorPointY = offsetY + (targetY + center) * scale;
			}

			if (anchorPointX === null || anchorPointY === null) {
				return null;
			}

			const anchorOffset = 0;
			const offsetX = Math.cos(angle) * anchorOffset;
			const offsetY = Math.sin(angle) * anchorOffset;

			const centeredX = anchorPointX + offsetX;
			const centeredY = anchorPointY + offsetY;

			const minX = tooltipPadding;
			const maxX = containerRect.width - estimatedWidth - tooltipPadding;
			const minY = tooltipPadding;
			const maxY = containerRect.height - estimatedHeight - tooltipPadding;

			let x = centeredX - estimatedWidth / 2;
			let y = centeredY - estimatedHeight / 2;

			x = Math.min(Math.max(x, minX), maxX);
			y = Math.min(Math.max(y, minY), maxY);

			let horizontal: 'left' | 'right' =
				Math.cos(angle) >= 0 ? 'right' : 'left';
			let vertical: 'top' | 'bottom' = Math.sin(angle) >= 0 ? 'bottom' : 'top';

			if (x <= minX + 1) {
				horizontal = 'right';
			} else if (x >= maxX - 1) {
				horizontal = 'left';
			}

			if (y <= minY + 1) {
				vertical = 'bottom';
			} else if (y >= maxY - 1) {
				vertical = 'top';
			}

			return { x, y, horizontal, vertical };
		},
		[arcGenerator, resolvedInnerRadius, resolvedOuterRadius, tooltipDimensions],
	);

	const updateTooltipForSlice = React.useCallback(
		(arcDatum: PieArcDatum<PieChartSlice>, element?: SVGPathElement | null) => {
			cancelScheduledTooltipHide();
			setActiveSliceId(arcDatum.data.id);

			if (!showTooltip) return;

			const targetElement =
				element ?? pathElementsRef.current.get(arcDatum.data.id) ?? null;

			const position = calculateTooltipPosition(arcDatum, targetElement);
			if (!position) return;

			setTooltip((previous) => {
				const shouldAnimateIn =
					!previous ||
					previous.sliceId !== arcDatum.data.id ||
					!previous.visible;

				const next = {
					info: {
						slice: arcDatum.data,
						value: arcDatum.data.value,
						percentage: arcDatum.data.percentage,
					},
					sliceId: arcDatum.data.id,
					x: position.x,
					y: position.y,
					horizontal: position.horizontal,
					vertical: position.vertical,
					visible: !shouldAnimateIn,
					entering: shouldAnimateIn,
				};

				if (
					previous &&
					previous.sliceId === arcDatum.data.id &&
					Math.abs(previous.x - next.x) < 0.5 &&
					Math.abs(previous.y - next.y) < 0.5 &&
					previous.horizontal === next.horizontal &&
					previous.vertical === next.vertical
				) {
					if (shouldAnimateIn) {
						return next;
					}
					if (!previous.visible) {
						return { ...previous, visible: true, entering: false };
					}
					return previous;
				}

				return next;
			});
		},
		[
			cancelScheduledTooltipHide,
			calculateTooltipPosition,
			setActiveSliceId,
			showTooltip,
		],
	);

	React.useEffect(() => {
		if (!tooltip || !tooltip.visible) return;

		const arcDatum = arcs.find(
			(candidate) => candidate.data.id === tooltip.sliceId,
		);
		if (!arcDatum) return;

		const element = pathElementsRef.current.get(arcDatum.data.id) ?? null;

		const position = calculateTooltipPosition(arcDatum, element);
		if (!position) return;

		if (
			Math.abs(tooltip.x - position.x) < 0.5 &&
			Math.abs(tooltip.y - position.y) < 0.5 &&
			tooltip.horizontal === position.horizontal &&
			tooltip.vertical === position.vertical
		) {
			return;
		}

		setTooltip((previous) =>
			previous
				? {
						...previous,
						x: position.x,
						y: position.y,
						horizontal: position.horizontal,
						vertical: position.vertical,
					}
				: previous,
		);
	}, [arcs, calculateTooltipPosition, tooltip]);

	let body: React.ReactNode = null;

	if (error) {
		body =
			typeof error === 'string' ? (
				<PieChartState
					label="There was a problem rendering the chart."
					description={error}
				/>
			) : (
				error
			);
	} else if (loading) {
		body = loadingState ?? (
			<PieChartState label="Loading chart data…" description={undefined} />
		);
	} else if (!slices.length) {
		body = emptyState ?? (
			<PieChartState
				label="No data to display yet."
				description="Provide a dataset or adjust your filters."
			/>
		);
	} else {
		body = (
			/* biome-ignore lint/a11y/noSvgWithoutTitle: handled via aria-label */
			<svg
				ref={svgRef}
				className="h-full w-full"
				viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
				aria-label={svgTitle}
				preserveAspectRatio="xMidYMid meet"
				shapeRendering="geometricPrecision"
				onPointerLeave={clearTooltip}
				{...(trimmedAriaLabel
					? { role: 'img', 'aria-labelledby': svgTitleId }
					: { role: 'img', 'aria-hidden': true })}
			>
				<g transform={`translate(${viewBoxSize / 2}, ${viewBoxSize / 2})`}>
					{arcs.map((arcDatum) => {
						const path = arcGenerator(arcDatum);
						if (!path) return null;

						const isActive = activeSliceId === arcDatum.data.id;
						const isDimmed =
							Boolean(activeSliceId) && activeSliceId !== arcDatum.data.id;
						const labelNode = formatLabel(arcDatum.data);
						const valueNode = formatValue(arcDatum.data);
						const labelText =
							typeof labelNode === 'string'
								? labelNode
								: typeof labelNode === 'number'
									? labelNode.toString()
									: arcDatum.data.label;
						const valueText =
							typeof valueNode === 'string'
								? valueNode
								: typeof valueNode === 'number'
									? valueNode.toLocaleString()
									: arcDatum.data.value.toLocaleString();

						return (
							// biome-ignore lint/a11y/useSemanticElements: A <path> cannot be replaced with <button> inside SVG, so we provide button semantics via role.
							<path
								key={arcDatum.data.id}
								ref={(node) => {
									registerPathElement(arcDatum.data.id, node);
								}}
								d={path}
								fill={arcDatum.data.color}
								stroke={arcDatum.data.color}
								strokeWidth={0.25}
								tabIndex={0}
								role="button"
								aria-pressed={isActive}
								aria-label={`${labelText}: ${valueText} (${(
									arcDatum.data.percentage * 100
								).toFixed(1)}%)`}
								className="outline-none transition-[transform,opacity] duration-300 ease-out"
								style={{
									opacity: isDimmed ? 0.5 : 1,
									filter: `
                    ${isActive ? 'brightness(0.8) saturate(1.5)' : 'brightness(1) saturate(1)'}
                  `,
									transform: isActive ? 'scale(1.03)' : undefined,
									willChange: 'transform, opacity, filter',
									transition: 'all 0.3s ease-out',
								}}
								onPointerEnter={(event) => {
									updateTooltipForSlice(arcDatum, event.currentTarget);
								}}
								onPointerLeave={() => {
									scheduleTooltipHide();
								}}
								onClick={(event) => {
									updateTooltipForSlice(arcDatum, event.currentTarget);
								}}
								onFocus={(event) => {
									updateTooltipForSlice(arcDatum, event.currentTarget);
								}}
								onBlur={clearTooltip}
								onKeyDown={(event) => {
									if (event.key === 'Enter' || event.key === ' ') {
										event.preventDefault();
										updateTooltipForSlice(arcDatum, event.currentTarget);
									}
									if (event.key === 'Escape') {
										clearTooltip();
									}
								}}
							/>
						);
					})}
				</g>
			</svg>
		);
	}

	return (
		<div
			ref={setOuterContainerRef}
			className={cn('not-prose relative w-full p-4', className)}
			style={{ ...style, height: resolvedHeight }}
			{...rest}
		>
			<div ref={chartAreaRef} className="relative h-full w-full">
				{body}
				{showChart && children ? (
					<div className="pointer-events-none absolute inset-0 flex items-center justify-center">
						{children}
					</div>
				) : null}
				{showTooltip && tooltip && renderTooltip ? (
					<div
						ref={tooltipRef}
						data-visible={tooltip.visible ? '' : undefined}
						className="pointer-events-none absolute left-0 top-0 z-50 min-w-32 max-w-xs rounded-md border border-border bg-card-muted p-2 text-xs text-foreground shadow-md"
						style={{
							transformOrigin: `${tooltip.horizontal} ${tooltip.vertical}`,
							transform: `translate3d(${tooltip.x}px, ${tooltip.y}px, 0) scale(${
								tooltip.visible ? 1 : 0.95
							})`,
							opacity: tooltip.visible ? 1 : 0,
							transition:
								'transform 300ms cubic-bezier(0, 0, 0.2, 1), opacity 150ms ease-out',
							willChange: 'transform, opacity',
						}}
					>
						{renderTooltip}
					</div>
				) : null}
			</div>
		</div>
	);
});
PieChartGraphBase.displayName = 'PieChartGraph';

type PieChartGraphComponent = <TData extends ChartDatum = ChartDatum>(
	props: PieChartGraphProps<TData> & { ref?: React.Ref<HTMLDivElement> },
) => React.ReactElement | null;

export const PieChartGraph = PieChartGraphBase as PieChartGraphComponent;

export interface PieChartLegendProps
	extends React.HTMLAttributes<HTMLDivElement> {}

export const PieChartLegend = React.forwardRef<
	HTMLDivElement,
	PieChartLegendProps
>(({ className, ...props }, ref) => {
	const { slices, formatLabel } = usePieChartContext();

	if (!slices.length) {
		return null;
	}

	return (
		<div
			ref={ref}
			className={cn(
				'not-prose flex flex-wrap items-center gap-3 px-4 pb-4 pt-2 text-xs text-foreground/70',
				className,
			)}
			{...props}
		>
			{slices.map((slice) => (
				<div key={slice.id} className="flex items-center gap-2">
					<span
						className="inline-flex h-2.5 w-2.5 shrink-0 rounded-full"
						style={{ backgroundColor: slice.color }}
					/>
					<span className="text-xs font-normal">{formatLabel(slice)}</span>
				</div>
			))}
		</div>
	);
});
PieChartLegend.displayName = 'PieChartLegend';

export interface PieChartDataTableProps
	extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
	className?: string;
}

export const PieChartDataTable = React.forwardRef<
	HTMLDivElement,
	PieChartDataTableProps
>(({ className = '', children, ...props }, ref) => {
	return (
		<div
			ref={ref}
			className={cn(
				'not-prose bg-card-muted/30 space-y-2 border-t border-border/60 p-4 text-xs text-foreground/70',
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
});
PieChartDataTable.displayName = 'PieChartDataTable';

export interface PieChartDataTableContentProps<
	TData extends ChartDatum = ChartDatum,
> {
	className?: string;
	rowClassName?: string;
	labelClassName?: string;
	valueClassName?: string;
	percentageClassName?: string;
	showPercentages?: boolean;
	showTotalRow?: boolean;
	totalLabel?: React.ReactNode;
	totalFormatter?: (total: number) => React.ReactNode;
	percentageFormatter?: (
		percentage: number,
		slice: PieChartSlice<TData>,
	) => React.ReactNode;
}

export function PieChartDataTableContent<
	TData extends ChartDatum = ChartDatum,
>({
	className = '',
	rowClassName,
	labelClassName,
	valueClassName,
	percentageClassName,
	showPercentages = true,
	showTotalRow = true,
	totalLabel = 'Total',
	totalFormatter,
	percentageFormatter,
}: PieChartDataTableContentProps<TData>) {
	const { slices, total, formatLabel, formatValue } =
		usePieChartContext<TData>();

	if (!slices.length) {
		return null;
	}

	const baseRowClass = showPercentages
		? 'grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3'
		: 'grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3';

	const totalRowBaseClass = showPercentages
		? 'grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 border-t border-border/60 pt-3 text-sm font-medium text-foreground'
		: 'grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-t border-border/60 pt-3 text-sm font-medium text-foreground';

	const renderPercentage = (slice: PieChartSlice<TData>) => {
		if (!showPercentages) return null;

		const content =
			percentageFormatter?.(slice.percentage, slice) ??
			`${(slice.percentage * 100).toFixed(1)}%`;

		return (
			<span
				className={cn(
					'text-right text-xs uppercase tracking-wide text-foreground/45',
					percentageClassName,
				)}
			>
				{content}
			</span>
		);
	};

	const resolvedTotal = totalFormatter?.(total) ?? total.toLocaleString();

	return (
		<div className={cn('space-y-2', className)}>
			{slices.map((slice) => (
				<div key={slice.id} className={cn(baseRowClass, rowClassName)}>
					<div
						className={cn(
							'flex items-center gap-2 text-foreground/70',
							labelClassName,
						)}
					>
						<span
							className="inline-flex h-2.5 w-2.5 shrink-0 rounded-full"
							style={{ backgroundColor: slice.color }}
						/>
						<span className="truncate text-sm font-medium">
							{formatLabel(slice)}
						</span>
					</div>
					<span
						className={cn(
							'text-right text-sm font-medium text-foreground/70',
							valueClassName,
						)}
					>
						{formatValue(slice)}
					</span>
					{renderPercentage(slice)}
				</div>
			))}
			{showTotalRow ? (
				<div className={cn(totalRowBaseClass, rowClassName)}>
					<span>{totalLabel}</span>
					<span className={cn('text-right', valueClassName)}>
						{resolvedTotal}
					</span>
					{showPercentages ? (
						<span
							className={cn(
								'text-right text-xs uppercase tracking-wide text-foreground/55',
								percentageClassName,
							)}
						>
							100%
						</span>
					) : null}
				</div>
			) : null}
		</div>
	);
}

export const PieChart = PieChartRoot;
