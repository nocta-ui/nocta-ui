'use client';

import {
	area,
	curveLinear,
	curveMonotoneX,
	curveNatural,
	curveStep,
	line,
} from 'd3-shape';
import * as React from 'react';
import { cn } from '@/lib/utils';

type ChartDatum = Record<string, unknown>;

const DEFAULT_HEIGHT = 220;
const DEFAULT_COLORS = [
	'var(--color-chart-1)',
	'var(--color-chart-2)',
	'var(--color-chart-3)',
	'var(--color-chart-4)',
	'var(--color-chart-5)',
] as const;

const CHART_PADDING = { top: 16, right: 16, bottom: 24, left: 16 } as const;
const Y_AXIS_CHART_GAP = 8;
const FALLBACK_CHART_DIMENSIONS = { width: 360, height: 240 } as const;
const DEFAULT_Y_TICK_TARGET = 5;

const CURVE_FACTORIES = {
	linear: curveLinear,
	monotone: curveMonotoneX,
	natural: curveNatural,
	step: curveStep,
} as const;

export type AreaChartCurve = keyof typeof CURVE_FACTORIES;

export type AreaChartPoint<TData extends ChartDatum = ChartDatum> = {
	id: string;
	seriesId: string;
	seriesIndex: number;
	datum: TData;
	index: number;
	x: number;
	xRaw: unknown;
	y: number;
	label: string;
	value: number;
};

export interface AreaChartAdditionalSeries<
	TData extends ChartDatum = ChartDatum,
> {
	id?: string;
	data?: TData[];
	xKey?: Extract<keyof TData, string>;
	yKey: Extract<keyof TData, string>;
	nameKey?: Extract<keyof TData, string>;
	color?: string;
	seriesLabel?: string;
	sortPoints?: boolean | ((a: TData, b: TData) => number);
	yFormatter?: (
		point: AreaChartPoint<TData>,
		meta: { total: number; domain: [number, number] },
	) => React.ReactNode;
	valueFormatter?: (
		point: AreaChartPoint<TData>,
		meta: { total: number; domain: [number, number] },
	) => React.ReactNode;
}

interface AreaChartSeriesState<TData extends ChartDatum> {
	id: string;
	seriesIndex: number;
	points: AreaChartPoint<TData>[];
	total: number;
	seriesLabel: string;
	valueLabel: string;
	color: string;
	formatY: (point: AreaChartPoint<TData>) => React.ReactNode;
}

interface AreaChartSeriesComputation<TData extends ChartDatum>
	extends Omit<AreaChartSeriesState<TData>, 'formatY'> {
	yFormatter?: (
		point: AreaChartPoint<TData>,
		meta: { total: number; domain: [number, number] },
	) => React.ReactNode;
	valueFormatter?: (
		point: AreaChartPoint<TData>,
		meta: { total: number; domain: [number, number] },
	) => React.ReactNode;
}

interface AreaChartContextValue<TData extends ChartDatum> {
	series: AreaChartSeriesState<TData>[];
	points: AreaChartPoint<TData>[];
	total: number;
	seriesLabel: string;
	color: string;
	xDomain: [number, number];
	yDomain: [number, number];
	formatX: (point: AreaChartPoint<TData>) => React.ReactNode;
	formatY: (point: AreaChartPoint<TData>) => React.ReactNode;
	formatYForSeries: (
		seriesId: string,
		point: AreaChartPoint<TData>,
	) => React.ReactNode;
	valueLabel: string;
	xLabel: string;
	activePointId: string | null;
	setActivePointId: (id: string | null) => void;
	activePointX: number | null;
	setActivePointX: (value: number | null) => void;
}

const AreaChartContext =
	React.createContext<AreaChartContextValue<ChartDatum> | null>(null);

export function useAreaChartContext<TData extends ChartDatum = ChartDatum>() {
	const context = React.useContext(
		AreaChartContext,
	) as AreaChartContextValue<TData> | null;

	if (!context) {
		throw new Error(
			'useAreaChartContext must be used within an <AreaChart> component.',
		);
	}

	return context;
}

function getNumericValue(input: unknown): number | null {
	if (typeof input === 'number' && Number.isFinite(input)) {
		return input;
	}
	if (typeof input === 'string') {
		const parsed = Number.parseFloat(input);
		if (Number.isFinite(parsed)) {
			return parsed;
		}
	}
	return null;
}

function getTemporalValue(input: unknown): number | null {
	if (input instanceof Date && Number.isFinite(input.valueOf())) {
		return input.getTime();
	}
	if (typeof input === 'number' && Number.isFinite(input)) {
		return input;
	}
	if (typeof input === 'string') {
		const numeric = Number.parseFloat(input);
		if (Number.isFinite(numeric)) {
			return numeric;
		}
		const parsedDate = new Date(input);
		if (!Number.isNaN(parsedDate.valueOf())) {
			return parsedDate.getTime();
		}
	}
	return null;
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

function resolveColor(color: string | undefined, index: number): string {
	if (color && color.trim().length > 0) return color;
	const fallbackIndex =
		DEFAULT_COLORS.length > 0 ? index % DEFAULT_COLORS.length : 0;
	const fallback = DEFAULT_COLORS[fallbackIndex];
	if (!fallback) {
		throw new Error('Unable to resolve fallback color for AreaChart.');
	}
	return fallback;
}

function createLinearScale(
	domain: [number, number],
	range: [number, number],
): (value: number) => number {
	const [d0, d1] = domain;
	const [r0, r1] = range;
	if (!Number.isFinite(d0) || !Number.isFinite(d1)) {
		return () => r0;
	}
	if (d0 === d1) {
		return () => (r0 + r1) / 2;
	}
	const scale = (value: number) => {
		const ratio = (value - d0) / (d1 - d0);
		return r0 + ratio * (r1 - r0);
	};
	return scale;
}

function clamp(value: number, min: number, max: number) {
	return Math.min(Math.max(value, min), max);
}

function toPlainText(value: React.ReactNode, fallback: string): string {
	if (typeof value === 'string') return value;
	if (typeof value === 'number' && Number.isFinite(value)) {
		return value.toString();
	}
	return fallback;
}

function getPointLabelText(point: AreaChartPoint) {
	return point.label ?? String(point.xRaw ?? '');
}

function getPointValueText(point: AreaChartPoint) {
	if (Number.isFinite(point.value)) {
		return point.value.toLocaleString();
	}
	return String(point.value);
}

function niceNumber(range: number, round: boolean) {
	if (range === 0) return 0;
	const exponent = Math.floor(Math.log10(Math.abs(range)));
	const fraction = Math.abs(range) / 10 ** exponent;
	let niceFraction: number;

	if (round) {
		if (fraction < 1.5) {
			niceFraction = 1;
		} else if (fraction < 3) {
			niceFraction = 2;
		} else if (fraction < 7) {
			niceFraction = 5;
		} else {
			niceFraction = 10;
		}
	} else {
		if (fraction <= 1) {
			niceFraction = 1;
		} else if (fraction <= 2) {
			niceFraction = 2;
		} else if (fraction <= 5) {
			niceFraction = 5;
		} else {
			niceFraction = 10;
		}
	}

	return Math.sign(range) * niceFraction * 10 ** exponent;
}

function generateLinearTicks(
	[min, max]: [number, number],
	desiredCount: number,
) {
	const safeCount = Number.isFinite(desiredCount)
		? Math.max(desiredCount, 2)
		: 2;
	if (!Number.isFinite(min) || !Number.isFinite(max)) return [];
	if (min === max) return [min];

	const range = max - min;
	const niceRange = niceNumber(range, false);
	const step = niceNumber(niceRange / (safeCount - 1), true);
	const niceMin = Math.floor(min / step) * step;
	const niceMax = Math.ceil(max / step) * step;

	const ticks: number[] = [];
	for (let value = niceMin; value <= niceMax + step / 2; value += step) {
		const rounded = Number.parseFloat(value.toFixed(12));
		ticks.push(rounded);
	}
	const domainWithPadding = step * 0.5;
	const withinDomain = ticks.filter(
		(value) =>
			value >= min - domainWithPadding && value <= max + domainWithPadding,
	);
	return withinDomain.length ? withinDomain : [min, max];
}

function alignDomainToNiceValues(
	[min, max]: [number, number],
	targetCount: number = DEFAULT_Y_TICK_TARGET,
): [number, number] {
	if (!Number.isFinite(min) || !Number.isFinite(max)) {
		return [min, max];
	}

	if (min === max) {
		const padding = Math.max(Math.abs(min) * 0.5, 1);
		return [min - padding, max + padding];
	}

	const safeCount = Number.isFinite(targetCount)
		? Math.max(Math.floor(targetCount), 2)
		: DEFAULT_Y_TICK_TARGET;
	const range = max - min;
	const rawStep = range / (safeCount - 1);
	const step = niceNumber(rawStep, true);

	if (!Number.isFinite(step) || step <= 0) {
		return [min, max];
	}

	let niceMin = Math.floor(min / step) * step;
	let niceMax = Math.ceil(max / step) * step;

	const minimumPadding = step * 0.1;
	const paddingAbove = niceMax - max;
	const paddingBelow = min - niceMin;

	if (min >= 0) {
		niceMin = 0;
	} else if (paddingBelow < minimumPadding) {
		niceMin -= step;
	}
	if (max <= 0) {
		niceMax = 0;
	} else if (paddingAbove < minimumPadding) {
		niceMax += step;
	}

	if (niceMin === niceMax) {
		return [niceMin - step, niceMax + step];
	}

	return [niceMin, niceMax];
}

function selectPointsForTicks(points: AreaChartPoint[], desiredCount: number) {
	if (!points.length) return [];
	const uniquePoints: AreaChartPoint[] = [];
	const seen = new Set<number>();
	for (const point of points) {
		if (seen.has(point.x)) continue;
		seen.add(point.x);
		uniquePoints.push(point);
	}
	const safeCount = Math.max(2, Math.min(desiredCount, uniquePoints.length));
	if (uniquePoints.length <= safeCount) {
		return uniquePoints;
	}

	const lastIndex = uniquePoints.length - 1;
	const step = lastIndex / (safeCount - 1);
	const selectedIndices = new Set<number>();

	for (let i = 0; i < safeCount; i++) {
		const rawIndex = Math.round(i * step);
		const clampedIndex = clamp(rawIndex, 0, lastIndex);
		selectedIndices.add(clampedIndex);
	}

	selectedIndices.add(0);
	selectedIndices.add(lastIndex);

	const sortedIndices = Array.from(selectedIndices).sort((a, b) => a - b);

	if (sortedIndices.length < safeCount) {
		for (
			let index = 0;
			index <= lastIndex && sortedIndices.length < safeCount;
			index++
		) {
			if (!selectedIndices.has(index)) {
				sortedIndices.push(index);
			}
		}
		sortedIndices.sort((a, b) => a - b);
	}

	return sortedIndices
		.map((index) => uniquePoints[index])
		.filter((p): p is NonNullable<typeof p> => p !== undefined);
}

export interface AreaChartProps<TData extends ChartDatum = ChartDatum>
	extends React.HTMLAttributes<HTMLDivElement> {
	data: TData[];
	xKey: Extract<keyof TData, string>;
	yKey: Extract<keyof TData, string>;
	nameKey?: Extract<keyof TData, string>;
	color?: string;
	seriesLabel?: string;
	sortPoints?: boolean | ((a: TData, b: TData) => number);
	xFormatter?: (point: AreaChartPoint<TData>) => React.ReactNode;
	yFormatter?: (
		point: AreaChartPoint<TData>,
		meta: { total: number; domain: [number, number] },
	) => React.ReactNode;
	valueFormatter?: (
		point: AreaChartPoint<TData>,
		meta: { total: number; domain: [number, number] },
	) => React.ReactNode;
	additionalSeries?: AreaChartAdditionalSeries<TData>[];
	children?: React.ReactNode;
}

function AreaChartRootInner<TData extends ChartDatum>(
	{
		data,
		xKey,
		yKey,
		nameKey,
		color,
		seriesLabel,
		sortPoints = true,
		xFormatter,
		yFormatter,
		valueFormatter,
		additionalSeries = [],
		className,
		children,
		...rest
	}: AreaChartProps<TData>,
	ref: React.ForwardedRef<HTMLDivElement>,
) {
	const [activePointId, setActivePointId] = React.useState<string | null>(null);
	const [activePointX, setActivePointX] = React.useState<number | null>(null);

	const xLabel = React.useMemo(() => toKeyLabel(String(xKey)), [xKey]);

	const { seriesCollection, xDomain, yDomain } = React.useMemo(() => {
		const buildSeries = (source: {
			id: string;
			seriesIndex: number;
			data: TData[];
			xKey: Extract<keyof TData, string>;
			yKey: Extract<keyof TData, string>;
			nameKey?: Extract<keyof TData, string>;
			color?: string;
			seriesLabel?: string;
			sortPoints: boolean | ((a: TData, b: TData) => number);
			yFormatter?: (
				point: AreaChartPoint<TData>,
				meta: { total: number; domain: [number, number] },
			) => React.ReactNode;
			valueFormatter?: (
				point: AreaChartPoint<TData>,
				meta: { total: number; domain: [number, number] },
			) => React.ReactNode;
		}): AreaChartSeriesComputation<TData> => {
			const resolvedXLabel = toKeyLabel(String(source.xKey));
			const resolvedPoints = source.data
				.map<AreaChartPoint<TData> | null>((datum, index) => {
					const numericValue = getNumericValue(datum[source.yKey]);
					if (numericValue === null) return null;
					const rawX = datum[source.xKey];
					const temporal = getTemporalValue(rawX);
					const resolvedX = temporal ?? index;
					const label =
						source.nameKey && datum[source.nameKey] != null
							? String(datum[source.nameKey])
							: typeof rawX === 'string' || typeof rawX === 'number'
								? String(rawX)
								: `${resolvedXLabel} ${index + 1}`;
					return {
						id: `${source.id}-${resolvedX}-${index}`,
						seriesId: source.id,
						seriesIndex: source.seriesIndex,
						datum,
						index,
						x: resolvedX,
						xRaw: rawX,
						y: numericValue,
						label,
						value: numericValue,
					};
				})
				.filter((point): point is AreaChartPoint<TData> => Boolean(point));

			const sortedPoints = (() => {
				if (typeof source.sortPoints === 'function') {
					const sortFn = source.sortPoints;
					return [...resolvedPoints].sort((a, b) => sortFn(a.datum, b.datum));
				}
				if (source.sortPoints) {
					return [...resolvedPoints].sort((a, b) => a.x - b.x);
				}
				return resolvedPoints;
			})();

			const totalValue = sortedPoints.reduce(
				(sum, point) => sum + (Number.isFinite(point.value) ? point.value : 0),
				0,
			);

			const resolvedSeriesLabel = source.seriesLabel?.trim().length
				? source.seriesLabel
				: source.nameKey
					? toKeyLabel(String(source.nameKey))
					: toKeyLabel(String(source.yKey));

			return {
				id: source.id,
				seriesIndex: source.seriesIndex,
				points: sortedPoints,
				total: totalValue,
				seriesLabel: resolvedSeriesLabel,
				valueLabel: toKeyLabel(String(source.yKey)),
				color: resolveColor(source.color, source.seriesIndex),
				...(source.yFormatter ? { yFormatter: source.yFormatter } : {}),
				...(source.valueFormatter
					? { valueFormatter: source.valueFormatter }
					: {}),
			};
		};

		const provisionalSeries: AreaChartSeriesComputation<TData>[] = [
			buildSeries({
				id: 'series-0',
				seriesIndex: 0,
				data,
				xKey,
				yKey,
				sortPoints,
				...(nameKey !== undefined ? { nameKey } : {}),
				...(color !== undefined ? { color } : {}),
				...(seriesLabel !== undefined ? { seriesLabel } : {}),
				...(yFormatter ? { yFormatter } : {}),
				...(valueFormatter ? { valueFormatter } : {}),
			}),
			...additionalSeries.map((config, index) => {
				const resolvedNameKey = config.nameKey ?? nameKey;
				return buildSeries({
					id: config.id ?? `series-${index + 1}`,
					seriesIndex: index + 1,
					data: config.data ?? data,
					xKey: config.xKey ?? xKey,
					yKey: config.yKey,
					sortPoints: config.sortPoints ?? sortPoints,
					...(resolvedNameKey !== undefined
						? { nameKey: resolvedNameKey }
						: {}),
					...(config.color !== undefined ? { color: config.color } : {}),
					...(config.seriesLabel !== undefined
						? { seriesLabel: config.seriesLabel }
						: {}),
					...(config.yFormatter ? { yFormatter: config.yFormatter } : {}),
					...(config.valueFormatter
						? { valueFormatter: config.valueFormatter }
						: {}),
				});
			}),
		];

		const allPoints = provisionalSeries.flatMap((series) => series.points);
		const xValues = allPoints.map((point) => point.x);
		const yValues = allPoints.map((point) => point.value);

		const minX = xValues.length ? Math.min(...xValues) : 0;
		const maxX = xValues.length ? Math.max(...xValues) : 1;
		const minY = yValues.length ? Math.min(...yValues, 0) : 0;
		const maxY = yValues.length ? Math.max(...yValues, 0) : 1;

		const resolvedXDomain: [number, number] =
			minX === maxX ? [minX - 1, maxX + 1] : [minX, maxX];

		const rawYRange = maxY - minY;
		const magnitudeFallback = Math.max(Math.abs(maxY), Math.abs(minY), 1);
		const yPadding =
			Number.isFinite(rawYRange) && rawYRange > 0
				? rawYRange * 0.1
				: magnitudeFallback * 0.1;

		const paddedMaxY = Number.isFinite(maxY) ? maxY + yPadding : maxY;
		let paddedMinY = Number.isFinite(minY) ? minY : 0;

		if (minY < 0) {
			paddedMinY -= yPadding;
		} else {
			paddedMinY = Math.min(minY, 0);
		}

		const paddedYDomain: [number, number] =
			minY === maxY
				? [minY - magnitudeFallback, maxY + magnitudeFallback]
				: [paddedMinY, paddedMaxY];

		const resolvedYDomain = alignDomainToNiceValues(
			paddedYDomain,
			DEFAULT_Y_TICK_TARGET,
		);

		const seriesCollection = provisionalSeries.map(
			({
				yFormatter: seriesYFormatter,
				valueFormatter: seriesValueFormatter,
				...rest
			}) => ({
				...rest,
				formatY: (point: AreaChartPoint<TData>) => {
					if (seriesValueFormatter) {
						return seriesValueFormatter(point, {
							total: rest.total,
							domain: resolvedYDomain,
						});
					}
					if (seriesYFormatter) {
						return seriesYFormatter(point, {
							total: rest.total,
							domain: resolvedYDomain,
						});
					}
					return point.value.toLocaleString();
				},
			}),
		);

		return {
			seriesCollection,
			xDomain: resolvedXDomain,
			yDomain: resolvedYDomain,
		};
	}, [
		additionalSeries,
		color,
		data,
		nameKey,
		seriesLabel,
		sortPoints,
		valueFormatter,
		xKey,
		yFormatter,
		yKey,
	]);

	React.useEffect(() => {
		if (activePointId) {
			const matches = seriesCollection.some((series) =>
				series.points.some((point) => point.id === activePointId),
			);
			if (!matches) {
				setActivePointId(null);
				setActivePointX(null);
			}
		}
		if (activePointX !== null) {
			const hasX = seriesCollection.some((series) =>
				series.points.some((point) => point.x === activePointX),
			);
			if (!hasX) {
				setActivePointX(null);
			}
		}
	}, [activePointId, activePointX, seriesCollection]);

	const primarySeries = React.useMemo<AreaChartSeriesState<TData>>(() => {
		const firstSeries = seriesCollection[0];
		if (firstSeries) {
			return firstSeries;
		}
		const fallbackLabel = seriesLabel?.trim().length
			? seriesLabel
			: nameKey
				? toKeyLabel(String(nameKey))
				: toKeyLabel(String(yKey));

		return {
			id: 'series-0',
			seriesIndex: 0,
			points: [],
			total: 0,
			seriesLabel: fallbackLabel,
			valueLabel: toKeyLabel(String(yKey)),
			color: resolveColor(color, 0),
			formatY: () => '0',
		} satisfies AreaChartSeriesState<TData>;
	}, [seriesCollection, color, nameKey, seriesLabel, yKey]);

	const seriesById = React.useMemo(() => {
		const map = new Map<string, AreaChartSeriesState<TData>>();
		for (const series of seriesCollection) {
			map.set(series.id, series);
		}
		return map;
	}, [seriesCollection]);

	const formatX = React.useCallback(
		(point: AreaChartPoint<TData>) =>
			xFormatter ? xFormatter(point) : getPointLabelText(point),
		[xFormatter],
	);

	const formatY = React.useCallback(
		(point: AreaChartPoint<TData>) => primarySeries.formatY(point),
		[primarySeries],
	);

	const formatYForSeries = React.useCallback(
		(seriesId: string, point: AreaChartPoint<TData>) => {
			const target = seriesById.get(seriesId) ?? primarySeries;
			return target.formatY(point);
		},
		[seriesById, primarySeries],
	);

	const contextValue = React.useMemo<AreaChartContextValue<TData>>(
		() => ({
			series: seriesCollection,
			points: primarySeries.points,
			total: primarySeries.total,
			seriesLabel: primarySeries.seriesLabel,
			color: primarySeries.color,
			xDomain,
			yDomain,
			formatX,
			formatY,
			formatYForSeries,
			valueLabel: primarySeries.valueLabel,
			xLabel,
			activePointId,
			setActivePointId,
			activePointX,
			setActivePointX,
		}),
		[
			activePointId,
			formatX,
			formatY,
			formatYForSeries,
			primarySeries,
			seriesCollection,
			xDomain,
			xLabel,
			yDomain,
			activePointX,
		],
	);

	return (
		<AreaChartContext.Provider
			value={contextValue as AreaChartContextValue<ChartDatum>}
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
		</AreaChartContext.Provider>
	);
}

type AreaChartComponent = <TData extends ChartDatum = ChartDatum>(
	props: AreaChartProps<TData> & { ref?: React.Ref<HTMLDivElement> },
) => React.ReactElement | null;

const AreaChartRoot = React.forwardRef(
	AreaChartRootInner,
) as AreaChartComponent;

const AREA_CHART_ACTIONS_MARKER = Symbol('AreaChartActions');
const AREA_CHART_TITLE_MARKER = Symbol('AreaChartTitle');
const AREA_CHART_DESCRIPTION_MARKER = Symbol('AreaChartDescription');

export interface AreaChartTitleProps {
	children: React.ReactNode;
	className?: string;
	as?: React.ElementType;
}

type AreaChartTitleComponent = React.FC<AreaChartTitleProps> & {
	[AREA_CHART_TITLE_MARKER]: true;
};

export const AreaChartTitle = (({
	children,
	className = '',
	as: Component = 'h3',
	...props
}: AreaChartTitleProps) => {
	return React.createElement(
		Component,
		{
			className: cn(
				'not-prose text-base font-medium leading-none text-foreground',
				className,
			),
			...props,
		},
		children,
	);
}) as AreaChartTitleComponent;
AreaChartTitle.displayName = 'AreaChartTitle';
AreaChartTitle[AREA_CHART_TITLE_MARKER] = true;

export interface AreaChartDescriptionProps
	extends React.HTMLAttributes<HTMLParagraphElement> {
	children: React.ReactNode;
	className?: string;
}

type AreaChartDescriptionComponent = React.FC<AreaChartDescriptionProps> & {
	[AREA_CHART_DESCRIPTION_MARKER]: true;
};

export const AreaChartDescription = (({
	children,
	className = '',
	...props
}: AreaChartDescriptionProps) => {
	return (
		<p
			className={cn(
				'not-prose text-sm leading-snug text-foreground/70',
				className,
			)}
			{...props}
		>
			{children}
		</p>
	);
}) as AreaChartDescriptionComponent;
AreaChartDescription.displayName = 'AreaChartDescription';
AreaChartDescription[AREA_CHART_DESCRIPTION_MARKER] = true;

export interface AreaChartActionsProps
	extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
	className?: string;
}

type AreaChartActionsComponent = React.FC<AreaChartActionsProps> & {
	[AREA_CHART_ACTIONS_MARKER]: true;
};

export const AreaChartActions = (({ children, className = '', ...props }) => {
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
}) as AreaChartActionsComponent;
AreaChartActions.displayName = 'AreaChartActions';
AreaChartActions[AREA_CHART_ACTIONS_MARKER] = true;

function hasAreaChartMarker(
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
		return hasAreaChartMarker((target as { type?: unknown }).type, marker);
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

function isAreaChartActionsElement(
	child: React.ReactNode,
): child is React.ReactElement {
	if (!React.isValidElement(child)) return false;
	const { type } = child;
	if (type === AreaChartActions) return true;
	if (hasAreaChartMarker(type, AREA_CHART_ACTIONS_MARKER)) return true;
	const displayName =
		typeof type === 'function' || (typeof type === 'object' && type !== null)
			? (type as { displayName?: string }).displayName
			: undefined;
	return displayName === AreaChartActions.displayName;
}

function isAreaChartTitleElement(
	child: React.ReactNode,
): child is React.ReactElement<AreaChartTitleProps> {
	if (!React.isValidElement(child)) return false;
	const { type } = child;
	if (type === AreaChartTitle) return true;
	if (hasAreaChartMarker(type, AREA_CHART_TITLE_MARKER)) return true;
	const displayName =
		typeof type === 'function' || (typeof type === 'object' && type !== null)
			? (type as { displayName?: string }).displayName
			: undefined;
	return displayName === AreaChartTitle.displayName;
}

function isAreaChartDescriptionElement(
	child: React.ReactNode,
): child is React.ReactElement<AreaChartDescriptionProps> {
	if (!React.isValidElement(child)) return false;
	const { type } = child;
	if (type === AreaChartDescription) return true;
	if (hasAreaChartMarker(type, AREA_CHART_DESCRIPTION_MARKER)) return true;
	const displayName =
		typeof type === 'function' || (typeof type === 'object' && type !== null)
			? (type as { displayName?: string }).displayName
			: undefined;
	return displayName === AreaChartDescription.displayName;
}

export interface AreaChartHeaderProps
	extends React.HTMLAttributes<HTMLDivElement> {
	contentClassName?: string;
	titleClassName?: string;
	descriptionClassName?: string;
	actionsClassName?: string;
}

export const AreaChartHeader = React.forwardRef<
	HTMLDivElement,
	AreaChartHeaderProps
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
			if (isAreaChartActionsElement(child)) {
				actionChildren.push(child);
			} else if (child !== null) {
				mainChildren.push(child);
			}
		});

		const enhancedMainChildren = mainChildren.map((child) => {
			if (isAreaChartTitleElement(child)) {
				return cloneElementWithClassName(
					child as React.ReactElement<{ className?: string }>,
					titleClassName,
				);
			}
			if (isAreaChartDescriptionElement(child)) {
				return cloneElementWithClassName(
					child as React.ReactElement<{ className?: string }>,
					descriptionClassName,
				);
			}
			return child;
		});

		const enhancedActionChildren = actionChildren.map((child) => {
			if (isAreaChartActionsElement(child)) {
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
AreaChartHeader.displayName = 'AreaChartHeader';

export interface AreaChartTooltipSeriesEntry<
	TData extends ChartDatum = ChartDatum,
> {
	seriesId: string;
	seriesLabel: string;
	seriesColor: string;
	valueLabel: string;
	point: AreaChartPoint<TData>;
	value: number;
	formattedValue: React.ReactNode;
	formattedValueText: string;
}

export interface AreaChartTooltipInfo<TData extends ChartDatum = ChartDatum> {
	point: AreaChartPoint<TData>;
	value: number;
	seriesId: string;
	seriesLabel: string;
	seriesColor: string;
	valueLabel: string;
	formattedX: React.ReactNode;
	formattedY: React.ReactNode;
	formattedXText: string;
	formattedYText: string;
	seriesEntries: AreaChartTooltipSeriesEntry<TData>[];
}

export interface AreaChartGraphProps<TData extends ChartDatum = ChartDatum>
	extends React.HTMLAttributes<HTMLDivElement> {
	height?: number | string;
	curve?: AreaChartCurve;
	showTooltip?: boolean;
	tooltipRender?: (info: AreaChartTooltipInfo<TData>) => React.ReactNode;
	showDots?: boolean;
	loading?: boolean;
	loadingState?: React.ReactNode;
	emptyState?: React.ReactNode;
	error?: React.ReactNode;
	ariaLabel?: string;
	showGrid?: boolean;
	showXAxisValues?: boolean;
	showYAxisValues?: boolean;
	xTickCount?: number;
	yTickCount?: number;
	children?: React.ReactNode;
}

function AreaChartState({
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

export const AreaChartGraphBase = React.forwardRef<
	HTMLDivElement,
	AreaChartGraphProps<ChartDatum>
>(function AreaChartGraphInner(
	{
		height,
		curve = 'monotone',
		showTooltip = true,
		tooltipRender,
		showDots = true,
		loading = false,
		loadingState,
		emptyState,
		error,
		ariaLabel,
		showGrid = true,
		showXAxisValues = true,
		showYAxisValues = true,
		xTickCount = 4,
		yTickCount = DEFAULT_Y_TICK_TARGET,
		children,
		className,
		style,
		...rest
	}: AreaChartGraphProps<ChartDatum>,
	ref,
) {
	const {
		series,
		formatX,
		formatYForSeries,
		xDomain,
		yDomain,
		activePointId,
		setActivePointId,
		activePointX,
		setActivePointX,
	} = useAreaChartContext();

	const svgRef = React.useRef<SVGSVGElement | null>(null);
	const outerRef = React.useRef<HTMLDivElement | null>(null);
	const chartContainerRef = React.useRef<HTMLDivElement | null>(null);
	const [chartDimensions, setChartDimensions] = React.useState({
		width: 0,
		height: 0,
	});
	const combinedRef = React.useCallback(
		(node: HTMLDivElement | null) => {
			outerRef.current = node;
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

	React.useLayoutEffect(() => {
		const node = chartContainerRef.current;
		if (!node) {
			return;
		}
		const rect = node.getBoundingClientRect();
		setChartDimensions((previous) => {
			if (
				Math.abs(previous.width - rect.width) < 0.5 &&
				Math.abs(previous.height - rect.height) < 0.5
			) {
				return previous;
			}
			return {
				width: rect.width || FALLBACK_CHART_DIMENSIONS.width,
				height: rect.height || FALLBACK_CHART_DIMENSIONS.height,
			};
		});

		if (typeof ResizeObserver === 'undefined') {
			return;
		}
		const observer = new ResizeObserver(([entry]) => {
			if (!entry) return;
			const { width, height: observedHeight } = entry.contentRect;
			setChartDimensions((previous) => {
				if (
					Math.abs(previous.width - width) < 0.5 &&
					Math.abs(previous.height - observedHeight) < 0.5
				) {
					return previous;
				}
				return { width, height: observedHeight };
			});
		});
		observer.observe(node);
		return () => observer.disconnect();
	}, []);

	const trimmedAriaLabel = ariaLabel?.trim();
	const svgTitleId = React.useId();
	const svgTitle =
		trimmedAriaLabel && trimmedAriaLabel.length > 0
			? trimmedAriaLabel
			: 'Area chart visualization';

	const measuredWidth =
		chartDimensions.width || FALLBACK_CHART_DIMENSIONS.width;
	const measuredHeight =
		chartDimensions.height || FALLBACK_CHART_DIMENSIONS.height;

	const axisTickLength = 0;
	const showXAxisLabels = showXAxisValues;
	const showYAxisLabels = showYAxisValues;
	const chartHorizontalGap = showYAxisLabels ? Y_AXIS_CHART_GAP : 0;
	const [yAxisLabelWidth, setYAxisLabelWidth] = React.useState(0);
	const padding = React.useMemo(
		() => ({
			...CHART_PADDING,
			left: Math.max(
				CHART_PADDING.left,
				Math.ceil(yAxisLabelWidth) + axisTickLength + 6,
			),
		}),
		[yAxisLabelWidth],
	);

	const viewBoxWidth = Math.max(
		measuredWidth,
		padding.left + padding.right + 1,
	);
	const viewBoxHeight = Math.max(
		measuredHeight,
		padding.top + padding.bottom + 1,
	);

	const availableChartWidth = Math.max(
		1,
		viewBoxWidth - padding.left - padding.right,
	);
	const chartWidth = Math.max(1, availableChartWidth - chartHorizontalGap);
	const chartStartX = padding.left + chartHorizontalGap;
	const chartHeight = Math.max(1, viewBoxHeight - padding.top - padding.bottom);
	const chartRight = chartStartX + chartWidth;
	const chartBottom = padding.top + chartHeight;
	const yTickLabelX = Math.max(
		chartStartX - chartHorizontalGap - axisTickLength - 4,
		4,
	);

	const scaleX = React.useMemo(
		() => createLinearScale(xDomain, [0, chartWidth]),
		[chartWidth, xDomain],
	);
	const scaleY = React.useMemo(
		() => createLinearScale(yDomain, [chartHeight, 0]),
		[chartHeight, yDomain],
	);

	const zeroYCoordinate = scaleY(0);

	const curveFactory = CURVE_FACTORIES[curve] ?? curveMonotoneX;

	type PositionedSeries = AreaChartSeriesState<ChartDatum> & {
		gradientId: string;
		positionedPoints: Array<{
			point: AreaChartPoint;
			x: number;
			y: number;
		}>;
		areaPath?: string;
		linePath?: string;
	};

	const gradientBaseId = React.useId();

	const computedSeries = React.useMemo<PositionedSeries[]>(() => {
		return series.map((seriesItem, index) => {
			const positionedPoints = seriesItem.points.map((point) => ({
				point,
				x: chartStartX + scaleX(point.x),
				y: padding.top + scaleY(point.y),
			}));

			let areaPath: string | undefined;
			let linePath: string | undefined;

			if (seriesItem.points.length > 1) {
				const areaGenerator = area<AreaChartPoint>()
					.x((point: AreaChartPoint) => chartStartX + scaleX(point.x))
					.y0(padding.top + clamp(zeroYCoordinate, 0, chartHeight))
					.y1((point: AreaChartPoint) => padding.top + scaleY(point.y))
					.curve(curveFactory);
				const lineGenerator = line<AreaChartPoint>()
					.x((point: AreaChartPoint) => chartStartX + scaleX(point.x))
					.y((point: AreaChartPoint) => padding.top + scaleY(point.y))
					.curve(curveFactory);
				areaPath = areaGenerator(seriesItem.points) ?? undefined;
				linePath = lineGenerator(seriesItem.points) ?? undefined;
			}

			return {
				...seriesItem,
				gradientId: `${gradientBaseId}-${index}`,
				positionedPoints,
				...(areaPath ? { areaPath } : {}),
				...(linePath ? { linePath } : {}),
			};
		});
	}, [
		chartHeight,
		chartStartX,
		curveFactory,
		series,
		padding.top,
		scaleX,
		scaleY,
		zeroYCoordinate,
		gradientBaseId,
	]);

	const hasEnoughPoints = computedSeries.some(
		(seriesItem) => seriesItem.points.length > 1,
	);
	const showChart = !loading && !error && hasEnoughPoints;

	const positionedPointsAll = React.useMemo(
		() =>
			computedSeries.flatMap((seriesItem) =>
				seriesItem.positionedPoints.map((entry) => ({
					series: seriesItem,
					...entry,
				})),
			),
		[computedSeries],
	);
	const shouldComputeXTicks = showXAxisLabels;
	const shouldComputeYTicks = showGrid || showYAxisLabels;

	const xAxisTicks = React.useMemo(() => {
		const basePoints = series[0]?.points ?? [];
		if (!shouldComputeXTicks || basePoints.length === 0) return [];
		const selected = selectPointsForTicks(basePoints, xTickCount);
		return selected.map((point) => {
			const label = toPlainText(formatX(point), getPointLabelText(point));
			return {
				id: point.id,
				position: chartStartX + scaleX(point.x),
				label,
			};
		});
	}, [chartStartX, formatX, scaleX, series, shouldComputeXTicks, xTickCount]);

	const yAxisTicks = React.useMemo(() => {
		if (!shouldComputeYTicks) return [];
		const ticks = generateLinearTicks(yDomain, yTickCount);
		return ticks.map((value) => {
			const relativePosition = clamp(scaleY(value), 0, chartHeight);
			return {
				value,
				position: padding.top + relativePosition,
				label: Number.isFinite(value)
					? value.toLocaleString(undefined, {
							maximumFractionDigits: Math.abs(value) >= 100 ? 0 : 2,
						})
					: String(value),
			};
		});
	}, [
		chartHeight,
		padding.top,
		scaleY,
		shouldComputeYTicks,
		yDomain,
		yTickCount,
	]);

	React.useLayoutEffect(() => {
		if (!showYAxisLabels) {
			setYAxisLabelWidth((previous) => (previous === 0 ? previous : 0));
			return;
		}

		if (!svgRef.current) {
			return;
		}

		const labelNodes = svgRef.current.querySelectorAll<SVGTextElement>(
			'[data-area-chart-y-label]',
		);
		let maxWidth = 0;
		labelNodes.forEach((node) => {
			const box = node.getBBox();
			if (Number.isFinite(box.width)) {
				maxWidth = Math.max(maxWidth, box.width);
			}
		});

		setYAxisLabelWidth((previous) =>
			Math.abs(previous - maxWidth) > 0.5 ? maxWidth : previous,
		);
	}, [showYAxisLabels]);

	const tooltipRef = React.useRef<HTMLDivElement | null>(null);
	const [tooltipDimensions, setTooltipDimensions] = React.useState({
		width: 0,
		height: 0,
	});
	const [tooltip, setTooltip] = React.useState<{
		info: AreaChartTooltipInfo;
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
		setActivePointId(null);
		setActivePointX(null);
	}, [cancelScheduledTooltipHide, setActivePointId, setActivePointX]);

	const scheduleTooltipHide = React.useCallback(
		(delay = 140) => {
			cancelScheduledTooltipHide();
			hideTooltipTimeoutRef.current = window.setTimeout(() => {
				clearTooltip();
			}, delay);
		},
		[cancelScheduledTooltipHide, clearTooltip],
	);

	React.useEffect(() => {
		if (!tooltip || tooltip.visible || tooltip.entering) return;
		const timeoutId = window.setTimeout(() => {
			setTooltip(null);
		}, 200);
		return () => window.clearTimeout(timeoutId);
	}, [tooltip]);

	React.useLayoutEffect(() => {
		if (!tooltipRef.current || typeof ResizeObserver === 'undefined') return;
		const observer = new ResizeObserver(([entry]) => {
			if (!entry) return;
			const { width, height: obsHeight } = entry.contentRect;
			setTooltipDimensions((previous) =>
				Math.abs(previous.width - width) < 0.5 &&
				Math.abs(previous.height - obsHeight) < 0.5
					? previous
					: { width, height: obsHeight },
			);
		});
		observer.observe(tooltipRef.current);
		return () => observer.disconnect();
	}, []);

	React.useLayoutEffect(() => {
		if (!tooltip || !tooltip.entering) return;
		const frameId = window.requestAnimationFrame(() => {
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
		(viewBoxPoint: { x: number; y: number }) => {
			if (!outerRef.current || !svgRef.current) return null;
			const containerRect = outerRef.current.getBoundingClientRect();
			const svgRect = svgRef.current.getBoundingClientRect();
			const scaleX = viewBoxWidth > 0 ? svgRect.width / viewBoxWidth : 1;
			const scaleY = viewBoxHeight > 0 ? svgRect.height / viewBoxHeight : 1;
			const anchorX =
				svgRect.left - containerRect.left + viewBoxPoint.x * scaleX;
			const anchorY = svgRect.top - containerRect.top + viewBoxPoint.y * scaleY;
			const tooltipPadding = 12;
			const tooltipOffset = 0;
			const pointGap = 0;
			const estimatedWidth = tooltipDimensions.width || 200;
			const estimatedHeight = tooltipDimensions.height || 84;

			const minX = tooltipPadding;
			const maxX = containerRect.width - estimatedWidth - tooltipPadding;
			const minY = tooltipPadding;
			const maxY = containerRect.height - estimatedHeight - tooltipPadding;

			type Placement = {
				horizontal: 'left' | 'right';
				vertical: 'top' | 'bottom';
			};

			const placements: Placement[] = [
				{ horizontal: 'left', vertical: 'top' },
				{ horizontal: 'right', vertical: 'top' },
				{ horizontal: 'left', vertical: 'bottom' },
				{ horizontal: 'right', vertical: 'bottom' },
			];

			const tryPlacement = (
				placement: Placement,
				allowOverflow: boolean,
			): {
				x: number;
				y: number;
				horizontal: Placement['horizontal'];
				vertical: Placement['vertical'];
			} | null => {
				const candidateX =
					placement.horizontal === 'left'
						? anchorX - estimatedWidth - tooltipOffset
						: anchorX + tooltipOffset;
				const candidateY =
					placement.vertical === 'top'
						? anchorY - estimatedHeight - tooltipOffset
						: anchorY + tooltipOffset;

				if (!allowOverflow) {
					if (candidateX < minX || candidateX > maxX) return null;
					if (candidateY < minY || candidateY > maxY) return null;
				}

				let x = clamp(candidateX, minX, maxX);
				let y = clamp(candidateY, minY, maxY);

				if (placement.horizontal === 'left') {
					x = Math.min(x, anchorX - pointGap - estimatedWidth);
				} else {
					x = Math.max(x, anchorX + pointGap);
				}
				x = clamp(x, minX, maxX);

				if (placement.vertical === 'top') {
					y = Math.min(y, anchorY - pointGap - estimatedHeight);
				} else {
					y = Math.max(y, anchorY + pointGap);
				}
				y = clamp(y, minY, maxY);

				const coversPoint =
					anchorX >= x &&
					anchorX <= x + estimatedWidth &&
					anchorY >= y &&
					anchorY <= y + estimatedHeight;

				if (coversPoint) return null;

				return {
					x,
					y,
					horizontal: placement.horizontal,
					vertical: placement.vertical,
				};
			};

			for (const placement of placements) {
				const position = tryPlacement(placement, false);
				if (position) return position;
			}

			for (const placement of placements) {
				const position = tryPlacement(placement, true);
				if (position) return position;
			}

			const fallbackHorizontal =
				anchorX + pointGap <= maxX ? ('right' as const) : ('left' as const);
			const fallbackVertical =
				anchorY - pointGap - estimatedHeight >= minY
					? ('top' as const)
					: anchorY + pointGap <= maxY
						? ('bottom' as const)
						: ('top' as const);

			let fallbackX =
				fallbackHorizontal === 'right'
					? anchorX + pointGap
					: anchorX - estimatedWidth - pointGap;
			let fallbackY =
				fallbackVertical === 'top'
					? anchorY - estimatedHeight - pointGap
					: anchorY + pointGap;

			fallbackX = clamp(fallbackX, minX, maxX);
			fallbackY = clamp(fallbackY, minY, maxY);

			return {
				x: fallbackX,
				y: fallbackY,
				horizontal: fallbackHorizontal,
				vertical: fallbackVertical,
			};
		},
		[
			tooltipDimensions.height,
			tooltipDimensions.width,
			viewBoxHeight,
			viewBoxWidth,
		],
	);

	const updateTooltipForPoint = React.useCallback(
		(
			seriesItem: PositionedSeries,
			point: AreaChartPoint,
			viewBoxPoint: { x: number; y: number },
		) => {
			cancelScheduledTooltipHide();
			setActivePointId(point.id);
			setActivePointX(point.x);

			if (!showTooltip) return;

			const position = calculateTooltipPosition(viewBoxPoint);
			if (!position) return;

			const formattedXNode = formatX(point);
			const formattedYNode = formatYForSeries(seriesItem.id, point);
			const formattedXText = toPlainText(
				formattedXNode,
				getPointLabelText(point),
			);
			const formattedYText = toPlainText(
				formattedYNode,
				getPointValueText(point),
			);

			const seriesEntries = computedSeries.flatMap<AreaChartTooltipSeriesEntry>(
				(candidate) => {
					const matched = candidate.points.find(
						(candidatePoint) => candidatePoint.x === point.x,
					);
					if (!matched) return [];
					const formattedValueNode = formatYForSeries(candidate.id, matched);
					const formattedValueText = toPlainText(
						formattedValueNode,
						getPointValueText(matched),
					);
					return [
						{
							seriesId: candidate.id,
							seriesLabel: candidate.seriesLabel,
							seriesColor: candidate.color,
							valueLabel: candidate.valueLabel,
							point: matched,
							value: matched.value,
							formattedValue: formattedValueNode,
							formattedValueText,
						},
					];
				},
			);

			setTooltip((previous) => {
				const shouldAnimateIn = !previous || !previous.visible;
				const next = {
					info: {
						point,
						value: point.value,
						seriesId: seriesItem.id,
						seriesLabel: seriesItem.seriesLabel,
						seriesColor: seriesItem.color,
						valueLabel: seriesItem.valueLabel,
						formattedX: formattedXNode,
						formattedY: formattedYNode,
						formattedXText,
						formattedYText,
						seriesEntries,
					},
					x: position.x,
					y: position.y,
					horizontal: position.horizontal,
					vertical: position.vertical,
					visible: !shouldAnimateIn,
					entering: shouldAnimateIn,
				};

				if (
					previous &&
					previous.info.point.id === point.id &&
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
			calculateTooltipPosition,
			cancelScheduledTooltipHide,
			formatX,
			formatYForSeries,
			computedSeries,
			setActivePointId,
			setActivePointX,
			showTooltip,
		],
	);

	const handlePointerMove = React.useCallback(
		(event: React.PointerEvent<SVGRectElement>) => {
			const targetRect = event.currentTarget.getBoundingClientRect();
			if (targetRect.width === 0 || chartWidth === 0) return;
			const localX = event.clientX - targetRect.left;
			const scale = chartWidth / targetRect.width;
			const pointerViewBoxX = chartStartX + localX * scale;

			let closest = null as {
				series: PositionedSeries;
				point: AreaChartPoint;
				viewBox: { x: number; y: number };
				distance: number;
			} | null;

			positionedPointsAll.forEach(({ series: seriesItem, point, x, y }) => {
				const distance = Math.abs(x - pointerViewBoxX);
				if (closest === null || distance < closest.distance) {
					closest = { series: seriesItem, point, viewBox: { x, y }, distance };
				}
			});

			if (!closest) return;

			updateTooltipForPoint(closest.series, closest.point, closest.viewBox);
		},
		[chartStartX, chartWidth, positionedPointsAll, updateTooltipForPoint],
	);

	const handlePointerLeave = React.useCallback(
		(event: React.PointerEvent<Element>) => {
			if (event.pointerType === 'touch' || event.pointerType === 'pen') {
				return;
			}
			scheduleTooltipHide();
		},
		[scheduleTooltipHide],
	);

	const renderTooltip =
		showTooltip && tooltip && tooltipRender
			? tooltipRender(tooltip.info as AreaChartTooltipInfo)
			: tooltip && (
					<div className="space-y-2">
						<div className="text-xs font-semibold text-foreground">
							{tooltip.info.formattedX}
						</div>
						<div className="space-y-1">
							{tooltip.info.seriesEntries.map((entry) => {
								return (
									<div
										key={entry.seriesId}
										className="flex items-center justify-between gap-3"
									>
										<div className="flex items-center gap-2">
											<span
												className="inline-flex h-2.5 w-1 shrink-0 rounded-[1px]"
												style={{ backgroundColor: entry.seriesColor }}
											/>
											<span className={cn('text-xs text-foreground/70')}>
												{entry.seriesLabel}
											</span>
										</div>
										<span className={cn('text-xs text-foreground/45')}>
											{entry.formattedValue}
										</span>
									</div>
								);
							})}
						</div>
					</div>
				);

	React.useEffect(() => {
		if (!showChart) {
			setTooltip(null);
		}
	}, [showChart]);

	React.useEffect(() => {
		if (!tooltip) {
			return;
		}

		const handlePointerDown = (event: PointerEvent) => {
			const container = outerRef.current;
			if (!container) return;
			const { target } = event;
			if (target instanceof Node && container.contains(target)) {
				return;
			}
			clearTooltip();
		};

		window.addEventListener('pointerdown', handlePointerDown);

		return () => {
			window.removeEventListener('pointerdown', handlePointerDown);
		};
	}, [clearTooltip, tooltip]);

	let body: React.ReactNode = null;

	if (error) {
		body =
			typeof error === 'string' ? (
				<AreaChartState
					label="There was a problem rendering the chart."
					description={error}
				/>
			) : (
				error
			);
	} else if (loading) {
		body = loadingState ?? (
			<AreaChartState label="Loading chart data…" description={undefined} />
		);
	} else if (!hasEnoughPoints) {
		body = emptyState ?? (
			<AreaChartState
				label="Not enough data to display yet."
				description="Provide at least two data points or adjust your filters."
			/>
		);
	} else {
		body = (
			/* biome-ignore lint/a11y/noSvgWithoutTitle: handled via aria-label */
			<svg
				ref={svgRef}
				className="h-full w-full text-foreground/45"
				viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
				aria-label={svgTitle}
				preserveAspectRatio="xMidYMid meet"
				style={{ overflow: 'visible' }}
				shapeRendering="geometricPrecision"
				onPointerLeave={handlePointerLeave}
				{...(trimmedAriaLabel
					? { role: 'img', 'aria-labelledby': svgTitleId }
					: { role: 'img', 'aria-hidden': true })}
			>
				<defs>
					{computedSeries.map((seriesItem) => (
						<linearGradient
							key={seriesItem.gradientId}
							id={seriesItem.gradientId}
							x1="0"
							x2="0"
							y1="0"
							y2="1"
						>
							<stop
								offset="0%"
								stopColor={seriesItem.color}
								stopOpacity={0.28}
							/>
							<stop
								offset="100%"
								stopColor={seriesItem.color}
								stopOpacity={0}
							/>
						</linearGradient>
					))}
				</defs>
				<rect width="100%" height="100%" fill="transparent" />
				<g>
					{showGrid ? (
						<g stroke="currentColor" strokeOpacity={0.1} strokeWidth={1}>
							{yAxisTicks.map((tick) => (
								<line
									key={`grid-y-${tick.value}`}
									x1={chartStartX}
									y1={tick.position}
									x2={chartRight}
									y2={tick.position}
								/>
							))}
						</g>
					) : null}
					{computedSeries.map((seriesItem) => (
						<g key={`series-${seriesItem.id}`}>
							{seriesItem.areaPath ? (
								<path
									d={seriesItem.areaPath}
									fill={`url(#${seriesItem.gradientId})`}
									stroke="none"
								/>
							) : null}
							{seriesItem.linePath ? (
								<path
									d={seriesItem.linePath}
									fill="none"
									stroke={seriesItem.color}
									strokeWidth={2}
									strokeLinejoin="round"
									strokeLinecap="round"
								/>
							) : null}
						</g>
					))}
					<g className="text-[10px] font-normal text-foreground/45">
						{showXAxisLabels
							? xAxisTicks.map((tick) => (
									<g key={`axis-x-${tick.id}`}>
										<text
											x={tick.position}
											y={Math.min(
												viewBoxHeight + 4,
												chartBottom + axisTickLength + 20,
											)}
											textAnchor="middle"
											fill="currentColor"
											className="text-[11px]"
										>
											{tick.label}
										</text>
									</g>
								))
							: null}
						{showYAxisLabels
							? yAxisTicks.map((tick) => (
									<g key={`axis-y-${tick.value}-${Math.round(tick.position)}`}>
										<text
											data-area-chart-y-label
											x={yTickLabelX}
											y={tick.position + 3}
											textAnchor="end"
											fill="currentColor"
											className="text-[11px]"
										>
											{tick.label}
										</text>
									</g>
								))
							: null}
					</g>
					{showDots
						? computedSeries.flatMap((seriesItem) =>
								seriesItem.positionedPoints.map(({ point, x, y }) => {
									const isActive =
										activePointId === point.id ||
										(activePointX !== null && point.x === activePointX);
									const formattedXNode = formatX(point);
									const formattedYNode = formatYForSeries(seriesItem.id, point);
									const formattedXText = toPlainText(
										formattedXNode,
										getPointLabelText(point),
									);
									const formattedYText = toPlainText(
										formattedYNode,
										getPointValueText(point),
									);
									return (
										<g key={`${seriesItem.id}-${point.id}`}>
											{/* biome-ignore lint/a11y/useSemanticElements: A <circle> cannot be replaced with <button> inside SVG, so we provide button semantics via role. */}
											<circle
												cx={x}
												cy={y}
												r={isActive ? 5 : 4}
												fill={seriesItem.color}
												fillOpacity={isActive ? 1 : 0}
												stroke={seriesItem.color}
												strokeOpacity={isActive ? 1 : 0}
												strokeWidth={0.5}
												style={{
													opacity: isActive ? 1 : 0,
												}}
												role="button"
												tabIndex={0}
												aria-pressed={isActive}
												aria-label={`${seriesItem.seriesLabel} ${formattedXText}: ${formattedYText}`}
												onPointerEnter={() =>
													updateTooltipForPoint(seriesItem, point, { x, y })
												}
												onPointerLeave={(event) => {
													if (
														event.pointerType === 'touch' ||
														event.pointerType === 'pen'
													) {
														return;
													}
													scheduleTooltipHide();
												}}
												onFocus={() =>
													updateTooltipForPoint(seriesItem, point, { x, y })
												}
												onBlur={clearTooltip}
												onClick={() =>
													updateTooltipForPoint(seriesItem, point, { x, y })
												}
												onKeyDown={(event) => {
													if (event.key === 'Enter' || event.key === ' ') {
														event.preventDefault();
														updateTooltipForPoint(seriesItem, point, {
															x,
															y,
														});
													}
													if (event.key === 'Escape') {
														clearTooltip();
													}
												}}
											/>
										</g>
									);
								}),
							)
						: null}
					<rect
						x={chartStartX}
						y={padding.top}
						width={chartWidth}
						height={chartHeight}
						fill="transparent"
						onPointerMove={handlePointerMove}
						onPointerLeave={handlePointerLeave}
						onPointerDown={(event) => {
							if (event.pointerType === 'touch') {
								handlePointerMove(event);
							}
						}}
					/>
				</g>
			</svg>
		);
	}

	return (
		<div
			ref={combinedRef}
			className={cn('not-prose relative w-full p-4', className)}
			style={{ ...style, height: resolvedHeight, minHeight: resolvedHeight }}
			{...rest}
		>
			<div
				ref={(node) => {
					chartContainerRef.current = node;
				}}
				className="relative h-full w-full"
			>
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
						className="pointer-events-none absolute left-0 top-0 z-50 min-w-32 max-w-xs rounded-md border border-border bg-popover p-2 text-xs text-foreground shadow-md"
						style={{
							transformOrigin: `${tooltip.horizontal} ${tooltip.vertical}`,
							transform: `translate3d(${tooltip.x}px, ${tooltip.y}px, 0) scale(${tooltip.visible ? 1 : 0.95})`,
							opacity: tooltip.visible ? 1 : 0,
							transition:
								'transform 450ms var(--ease-smooth), opacity 300ms var(--ease-smooth)',
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
AreaChartGraphBase.displayName = 'AreaChartGraph';

type AreaChartGraphComponent = <TData extends ChartDatum = ChartDatum>(
	props: AreaChartGraphProps<TData> & { ref?: React.Ref<HTMLDivElement> },
) => React.ReactElement | null;

export const AreaChartGraph = AreaChartGraphBase as AreaChartGraphComponent;

export interface AreaChartLegendProps
	extends React.HTMLAttributes<HTMLDivElement> {}

export const AreaChartLegend = React.forwardRef<
	HTMLDivElement,
	AreaChartLegendProps
>(({ className, ...props }, ref) => {
	const { series } = useAreaChartContext();

	if (!series.length) {
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
			{series.map((seriesItem) => (
				<div key={seriesItem.id} className="flex items-center gap-2">
					<span
						className="inline-flex h-2.5 w-1 shrink-0 rounded-[1px]"
						style={{ backgroundColor: seriesItem.color }}
					/>
					<span className="text-xs font-medium text-foreground">
						{seriesItem.seriesLabel}
					</span>
				</div>
			))}
		</div>
	);
});
AreaChartLegend.displayName = 'AreaChartLegend';

export interface AreaChartDataTableProps
	extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
	className?: string;
}

export const AreaChartDataTable = React.forwardRef<
	HTMLDivElement,
	AreaChartDataTableProps
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
AreaChartDataTable.displayName = 'AreaChartDataTable';

export interface AreaChartDataTableContentProps<
	TData extends ChartDatum = ChartDatum,
> {
	className?: string;
	rowClassName?: string;
	labelClassName?: string;
	valueClassName?: string;
	deltaClassName?: string;
	showDelta?: boolean;
	deltaFormatter?: (
		current: AreaChartPoint<TData>,
		previous: AreaChartPoint<TData> | null,
	) => React.ReactNode;
	valueFormatter?: (
		point: AreaChartPoint<TData>,
		meta: { total: number; domain: [number, number] },
	) => React.ReactNode;
	showTotalRow?: boolean;
	averageLabel?: React.ReactNode;
	averageFormatter?: (average: number) => React.ReactNode;
}

export function AreaChartDataTableContent<
	TData extends ChartDatum = ChartDatum,
>({
	className = '',
	rowClassName,
	labelClassName,
	valueClassName,
	deltaClassName,
	showDelta = true,
	deltaFormatter,
	valueFormatter,
	showTotalRow = true,
	averageLabel = 'Average',
	averageFormatter,
}: AreaChartDataTableContentProps<TData>) {
	const { points, total, formatX, formatY, yDomain } =
		useAreaChartContext<TData>();

	if (!points.length) {
		return null;
	}

	const average = total / points.length;

	const baseRowClass = showDelta
		? 'grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3'
		: 'grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3';

	type DeltaTone = 'positive' | 'negative' | 'neutral' | 'custom';

	const formatDeltaPercentage = (ratio: number) => {
		const absoluteRatio = Math.abs(ratio);
		const maximumFractionDigits = absoluteRatio >= 100 ? 0 : 1;
		const minimumFractionDigits =
			absoluteRatio > 0 && absoluteRatio < 1 ? 1 : 0;
		const formattedMagnitude = absoluteRatio.toLocaleString(undefined, {
			maximumFractionDigits,
			minimumFractionDigits,
		});
		const prefix = ratio > 0 ? '+' : ratio < 0 ? '−' : '';
		return `${prefix}${formattedMagnitude}%`;
	};

	const resolveDeltaToneClass = (tone: DeltaTone) =>
		tone === 'positive'
			? 'text-success/90'
			: tone === 'negative'
				? 'text-destructive/90'
				: 'text-foreground/45';

	const rows = points.map((point: AreaChartPoint<TData>, index) => {
		const previous = index > 0 ? (points[index - 1] ?? null) : null;
		const resolvedValue = valueFormatter
			? valueFormatter(point, { total, domain: yDomain })
			: formatY(point);
		const delta: {
			content: React.ReactNode;
			tone: DeltaTone;
			ratio: number | null;
		} = (() => {
			if (!showDelta) {
				return { content: null, tone: 'neutral', ratio: null };
			}
			if (deltaFormatter) {
				return {
					content: deltaFormatter(point, previous),
					tone: 'custom',
					ratio: null,
				};
			}
			if (
				!previous ||
				!Number.isFinite(previous.value) ||
				previous.value === 0
			) {
				return { content: '—', tone: 'neutral', ratio: null };
			}
			const change = point.value - previous.value;
			const ratio = (change / Math.abs(previous.value)) * 100;
			if (!Number.isFinite(ratio)) {
				return { content: '—', tone: 'neutral', ratio: null };
			}
			const tone =
				ratio > 0
					? ('positive' as const)
					: ratio < 0
						? ('negative' as const)
						: ('neutral' as const);
			return {
				content: formatDeltaPercentage(ratio),
				tone,
				ratio,
			};
		})();

		return {
			point,
			resolvedValue,
			delta,
		};
	});

	const { sum: deltaSum, count: deltaCount } = showDelta
		? rows.reduce<{ sum: number; count: number }>(
				(acc, row) => {
					if (row.delta.ratio !== null) {
						acc.sum += row.delta.ratio;
						acc.count += 1;
					}
					return acc;
				},
				{ sum: 0, count: 0 },
			)
		: { sum: 0, count: 0 };

	const averageDelta =
		showDelta && deltaCount > 0 ? deltaSum / deltaCount : null;

	const averageDeltaTone =
		averageDelta !== null
			? averageDelta > 0
				? ('positive' as const)
				: averageDelta < 0
					? ('negative' as const)
					: ('neutral' as const)
			: ('neutral' as const);

	const averageDeltaContent =
		showDelta && averageDelta !== null
			? formatDeltaPercentage(averageDelta)
			: showDelta
				? '—'
				: null;

	return (
		<div className={cn('space-y-2', className)}>
			{rows.map(({ point, resolvedValue, delta }) => {
				return (
					<div key={point.id} className={cn(baseRowClass, rowClassName)}>
						<div
							className={cn(
								'flex items-center gap-2 text-foreground/70',
								labelClassName,
							)}
						>
							<span className="truncate text-sm font-medium">
								{formatX(point)}
							</span>
						</div>
						<span
							className={cn(
								'inline-flex min-w-10 justify-end whitespace-nowrap text-right text-sm font-medium text-foreground/70 tabular-nums',
								valueClassName,
							)}
						>
							{resolvedValue}
						</span>
						{showDelta ? (
							<span
								className={cn(
									'inline-flex min-w-14 justify-end whitespace-nowrap text-right text-xs uppercase tracking-wide tabular-nums',
									resolveDeltaToneClass(delta.tone),
									deltaClassName,
								)}
							>
								{delta.content}
							</span>
						) : null}
					</div>
				);
			})}
			{showTotalRow ? (
				<div
					className={cn(
						showDelta
							? 'grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 border-t border-border/60 pt-3 text-sm font-medium text-foreground'
							: 'grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-t border-border/60 pt-3 text-sm font-medium text-foreground',
						rowClassName,
					)}
				>
					<span>{averageLabel}</span>
					<span
						className={cn(
							'inline-flex min-w-10 justify-end whitespace-nowrap text-right tabular-nums',
							valueClassName,
						)}
					>
						{averageFormatter?.(average) ??
							average.toLocaleString(undefined, { maximumFractionDigits: 2 })}
					</span>
					{showDelta ? (
						<span
							className={cn(
								'inline-flex min-w-14 justify-end whitespace-nowrap text-right text-xs uppercase tracking-wide tabular-nums',
								resolveDeltaToneClass(averageDeltaTone),
								deltaClassName,
							)}
						>
							{averageDeltaContent}
						</span>
					) : null}
				</div>
			) : null}
		</div>
	);
}

export const AreaChart = AreaChartRoot;
