'use client';

import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';
import { ChevronDownIcon as ChevronDown } from '@radix-ui/react-icons';
import { forwardRef, type ReactNode, useEffect, useState } from 'react';
import { cn } from '@/lib/cn';

const Collapsible = CollapsiblePrimitive.Root;
const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;

export const colorTokens = [
	{
		token: '--base-hue',
		description: 'Hue anchor for the entire palette',
		light: '248',
		dark: '248',
		showSwatch: false,
	},
	{
		token: '--chart-hue-step',
		description: 'Hue offset between consecutive chart series',
		light: '4',
		dark: '4',
		showSwatch: false,
	},
	{
		token: '--color-background',
		description: 'Base background',
		light: 'oklch(0.99 0.004 var(--base-hue))',
		dark: 'oklch(0.1408 0.0044 var(--base-hue))',
	},
	{
		token: '--color-card',
		description: 'Surface for cards',
		light: 'oklch(1 0 0)',
		dark: 'oklch(0.1703 0.006 var(--base-hue))',
	},
	{
		token: '--color-card-muted',
		description: 'Muted surface',
		light: 'oklch(0.96 0.005 var(--base-hue))',
		dark: 'oklch(0.2139 0.0085 var(--base-hue))',
	},
	{
		token: '--color-foreground',
		description: 'Primary text',
		light: 'oklch(0.1408 0.0044 var(--base-hue))',
		dark: 'oklch(0.9824 0.0013 var(--base-hue))',
	},
	{
		token: '--color-border',
		description: 'Neutral border',
		light: 'oklch(0.8925 0.0014 var(--base-hue))',
		dark: 'oklch(0.278 0.006 var(--base-hue))',
	},
	{
		token: '--color-ring',
		description: 'Focus ring',
		light: 'oklch(0.55 0.012 var(--base-hue))',
		dark: 'oklch(0.58 0.012 var(--base-hue))',
	},
	{
		token: '--color-ring-offset',
		description: 'Offset ring',
		light: 'oklch(0.96 0.002 var(--base-hue))',
		dark: 'oklch(0.15 0.005 var(--base-hue))',
	},
	{
		token: '--color-overlay',
		description: 'Modal overlay',
		light: 'oklch(0.92 0.003 var(--base-hue) / 0.65)',
		dark: 'oklch(0.12 0.004 var(--base-hue) / 0.65)',
	},
	{
		token: '--color-gradient-from',
		description: 'Gradient start',
		light: 'oklch(0.3603 0.0181 var(--base-hue))',
		dark: 'oklch(0.3203 0.009 var(--base-hue))',
	},
	{
		token: '--color-gradient-to',
		description: 'Gradient end',
		light: 'oklch(0.2517 0.02 var(--base-hue))',
		dark: 'oklch(0.2517 0.01 var(--base-hue))',
	},
	{
		token: '--color-destructive',
		description: 'Destructive state',
		light: 'oklch(0.62 0.21 25)',
		dark: 'oklch(0.58 0.22 25)',
	},
	{
		token: '--color-warning',
		description: 'Warning state',
		light: 'oklch(0.8 0.2 75)',
		dark: 'oklch(0.75 0.18 75)',
	},
	{
		token: '--color-success',
		description: 'Success state',
		light: 'oklch(0.7 0.18 155)',
		dark: 'oklch(0.68 0.19 155)',
	},
	{
		token: '--color-chart-1',
		description: 'Chart series 1',
		light: 'oklch(0.8 0.13 calc(var(--base-hue) - var(--chart-hue-step)))',
		dark: 'oklch(0.84 0.13 calc(var(--base-hue) - var(--chart-hue-step)))',
	},
	{
		token: '--color-chart-2',
		description: 'Chart series 2',
		light: 'oklch(0.68 0.2 var(--base-hue))',
		dark: 'oklch(0.74 0.2 var(--base-hue))',
	},
	{
		token: '--color-chart-3',
		description: 'Chart series 3',
		light: 'oklch(0.6 0.23 calc(var(--base-hue) + var(--chart-hue-step)))',
		dark: 'oklch(0.66 0.23 calc(var(--base-hue) + var(--chart-hue-step)))',
	},
	{
		token: '--color-chart-4',
		description: 'Chart series 4',
		light: 'oklch(0.53 0.23 calc(var(--base-hue) + (var(--chart-hue-step) * 2)))',
		dark: 'oklch(0.58 0.23 calc(var(--base-hue) + (var(--chart-hue-step) * 2)))',
	},
	{
		token: '--color-chart-5',
		description: 'Chart series 5',
		light: 'oklch(0.47 0.2 calc(var(--base-hue) + (var(--chart-hue-step) * 3)))',
		dark: 'oklch(0.52 0.2 calc(var(--base-hue) + (var(--chart-hue-step) * 3)))',
	},
];

export const shadowTokens = [
	{
		token: '--shadow-sm',
		description: 'Light elevation',
		value: [
			'0px 1px 1px -0.5px rgba(9, 9, 11, 0.025)',
			'0px 3px 3px -1.5px rgba(9, 9, 11, 0.05)',
			'0px 6px 6px -3px rgba(9, 9, 11, 0.05)',
		],
	},
	{
		token: '--shadow-md',
		description: 'Medium elevation',
		value: [
			'0px 1px 1px -0.5px rgba(9, 9, 11, 0.025)',
			'0px 3px 3px -1.5px rgba(9, 9, 11, 0.05)',
			'0px 6px 6px -3px rgba(9, 9, 11, 0.05)',
			'0px 12px 12px -6px rgba(9, 9, 11, 0.05)',
			'0px 24px 24px -12px rgba(9, 9, 11, 0.05)',
		],
	},
	{
		token: '--shadow-lg',
		description: 'Elevated card',
		value: [
			'0px 1px 1px -0.5px rgba(9, 9, 11, 0.025)',
			'0px 3px 3px -1.5px rgba(9, 9, 11, 0.05)',
			'0px 6px 6px -3px rgba(9, 9, 11, 0.05)',
			'0px 16px 16px -8px rgba(9, 9, 11, 0.05)',
			'0px 32px 32px -16px rgba(9, 9, 11, 0.05)',
		],
	},
	{
		token: '--shadow-xl',
		description: 'Popover / modal level',
		value: [
			'0px 1px 1px -0.5px rgba(9, 9, 11, 0.025)',
			'0px 3px 3px -1.5px rgba(9, 9, 11, 0.05)',
			'0px 6px 6px -3px rgba(9, 9, 11, 0.05)',
			'0px 20px 20px -10px rgba(9, 9, 11, 0.05)',
			'0px 40px 40px -20px rgba(9, 9, 11, 0.05)',
		],
	},
	{
		token: '--shadow-2xl',
		description: 'Highest elevation',
		value: [
			'0px 1px 1px -0.5px rgba(9, 9, 11, 0.025)',
			'0px 3px 3px -1.5px rgba(9, 9, 11, 0.05)',
			'0px 6px 6px -3px rgba(9, 9, 11, 0.05)',
			'0px 24px 24px -12px rgba(9, 9, 11, 0.05)',
			'0px 48px 48px -24px rgba(9, 9, 11, 0.05)',
		],
	},
	{
		token: '--shadow-inner',
		description: 'Inset shadow',
		value: [
			'inset 0px 1px 2px rgba(9, 9, 11, 0.05)',
			'inset 0px -1px 2px rgba(9, 9, 11, 0.025)',
		],
	},
];

export const radiusTokens = [
	{
		token: '--radius-base',
		description: 'Base border radius for all components',
		value: '0.175rem',
	},
];

export const motionTokens = [
	{
		token: '--ease-basic',
		description:
			'Global motion curve used for hover effects',
		value: 'cubic-bezier(0, 0, 0.2, 1)',
	},
	{
		token: '--ease-smooth',
		description:
			'Global motion curve used for other transformations',
		value: 'cubic-bezier(0.32, 0.72, 0, 1)',
	},
];

const CollapsibleContent = forwardRef<
	HTMLDivElement,
	CollapsiblePrimitive.CollapsibleContentProps
>(({ children, ...props }, ref) => {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	return (
		<CollapsiblePrimitive.CollapsibleContent
			ref={ref}
			{...props}
			className={cn(
				'overflow-hidden',
				mounted &&
					'data-[state=closed]:animate-fd-collapsible-up data-[state=open]:animate-fd-collapsible-down',
				props.className,
			)}
		>
			{children}
		</CollapsiblePrimitive.CollapsibleContent>
	);
});
CollapsibleContent.displayName =
	CollapsiblePrimitive.CollapsibleContent.displayName;

export interface ColorTokenRow {
	token: string;
	description?: ReactNode;
	light: string;
	dark: string;
	showSwatch?: boolean;
}

export interface ShadowTokenRow {
	token: string;
	description?: ReactNode;
	value: string | string[];
}

interface SingleValueTokenRow {
	token: string;
	description?: ReactNode;
	value: string;
}

export interface RadiusTokenRow extends SingleValueTokenRow {}
export interface MotionTokenRow extends SingleValueTokenRow {}

type TokenTableProps =
	| {
			category: 'color';
			tokens: ColorTokenRow[];
	  }
	| {
			category: 'shadow';
			tokens: ShadowTokenRow[];
	  }
	| {
			category: 'radius';
			tokens: RadiusTokenRow[];
	  }
	| {
			category: 'motion';
			tokens: MotionTokenRow[];
	  };

const FIELD_LABEL_CLASS = 'text-foreground/45 not-prose pe-2';

export function TokenTable(props: TokenTableProps) {
	if (props.category === 'color') {
		return (
			<TokenTableShell secondaryHeader="Preview">
				{props.tokens.map((token) => (
					<ColorTokenItem key={token.token} token={token} />
				))}
			</TokenTableShell>
		);
	}

	if (props.category === 'shadow') {
		return (
			<TokenTableShell secondaryHeader="Layers">
				{props.tokens.map((token) => (
					<ShadowTokenItem key={token.token} token={token} />
				))}
			</TokenTableShell>
		);
	}

	const singleValueTokens = props.tokens as SingleValueTokenRow[];

	return (
		<TokenTableShell secondaryHeader="Value">
			{singleValueTokens.map((token) => (
				<SingleValueTokenItem key={token.token} token={token} />
			))}
		</TokenTableShell>
	);
}

function TokenTableShell({
	children,
	secondaryHeader,
}: {
	children: ReactNode;
	secondaryHeader: ReactNode;
}) {
	return (
		<div className="@container flex flex-col p-1 bg-card shadow-sm text-foreground rounded-lg border border-fd-border my-6 text-sm overflow-hidden">
			<div className="flex font-medium items-center px-3 py-1 not-prose text-foreground/45">
				<p className="w-[25%] min-w-40">Token</p>
				<p className="@max-lg:hidden">{secondaryHeader}</p>
			</div>
			{children}
		</div>
	);
}

function ColorTokenItem({ token }: { token: ColorTokenRow }) {
	const [open, setOpen] = useState(false);
	const showSwatch = token.showSwatch ?? true;

	return (
		<Collapsible
			open={open}
			onOpenChange={setOpen}
			className={cn(
				'rounded-md overflow-hidden transition-all duration-500 ease-smooth border',
				open
					? 'bg-background not-last:mb-2 border-fd-border'
					: 'border-transparent',
			)}
		>
			<CollapsibleTrigger className="relative cursor-pointer flex flex-row items-center w-full group text-start px-3 py-2 not-prose hover:bg-card-muted data-[state=open]:bg-card-muted duration-100 ease-basic">
				<code className="w-fit font-mono font-medium bg-card-muted rounded border border-fd-border px-2 py-0.5 text-left">
					{token.token}
				</code>
				<ChevronDown className="absolute end-2 size-5 text-foreground/70 transition-transform group-data-[state=open]:rotate-180 duration-500 ease-smooth" />
			</CollapsibleTrigger>

			<CollapsibleContent>
				<div className="grid grid-cols-[1fr_3fr] gap-y-4 text-sm p-3 overflow-auto fd-scroll-container border-t">
					{token.description && (
						<>
							<p className={FIELD_LABEL_CLASS}>Description</p>
							<div className="text-sm prose prose-no-margin">
								{token.description}
							</div>
						</>
					)}

					<p className={FIELD_LABEL_CLASS}>Light Mode</p>
					<div className="flex items-center gap-3">
						{showSwatch && <Swatch color={token.light} />}
						<CodePill>{token.light}</CodePill>
					</div>

					<p className={FIELD_LABEL_CLASS}>Dark Mode</p>
					<div className="flex items-center gap-3">
						{showSwatch && <Swatch color={token.dark} />}
						<CodePill>{token.dark}</CodePill>
					</div>
				</div>
			</CollapsibleContent>
		</Collapsible>
	);
}

function ShadowTokenItem({ token }: { token: ShadowTokenRow }) {
	const [open, setOpen] = useState(false);
	const layers = Array.isArray(token.value) ? token.value : [token.value];

	return (
		<Collapsible
			open={open}
			onOpenChange={setOpen}
			className={cn(
				'rounded-md overflow-hidden transition-all duration-500 ease-smooth border',
				open
					? 'shadow-sm bg-background not-last:mb-2 border-fd-border'
					: 'border-transparent',
			)}
		>
			<CollapsibleTrigger className="relative cursor-pointer flex flex-row items-center w-full group text-start px-3 py-2 not-prose hover:bg-card-muted data-[state=open]:bg-card-muted transition-all duration-100 ease-basic">
				<code className="w-fit font-mono font-medium bg-card-muted rounded border border-fd-border px-2 py-0.5 text-left">
					{token.token}
				</code>
				<ChevronDown className="absolute end-2 size-5 text-foreground/70 transition-transform group-data-[state=open]:rotate-180 duration-500 ease-smooth" />
			</CollapsibleTrigger>

			<CollapsibleContent>
				<div className="grid grid-cols-[1fr_3fr] gap-y-4 text-sm p-3 overflow-auto fd-scroll-container border-t">
					{token.description && (
						<>
							<p className={FIELD_LABEL_CLASS}>Description</p>
							<div className="text-sm prose prose-no-margin">
								{token.description}
							</div>
						</>
					)}

					<p className={FIELD_LABEL_CLASS}>Layers</p>
					<div className="flex flex-col gap-2 text-xs">
						{layers.map((layer, index) => (
							<CodePill key={`${token.token}-${index}`}>{layer}</CodePill>
						))}
					</div>
				</div>
			</CollapsibleContent>
		</Collapsible>
	);
}

function SingleValueTokenItem({ token }: { token: SingleValueTokenRow }) {
	const [open, setOpen] = useState(false);

	return (
		<Collapsible
			open={open}
			onOpenChange={setOpen}
			className={cn(
				'rounded-md overflow-hidden transition-all duration-500 ease-smooth border',
				open
					? 'shadow-sm bg-background not-last:mb-2 border-fd-border'
					: 'border-transparent',
			)}
		>
			<CollapsibleTrigger className="relative cursor-pointer flex flex-row items-center w-full group text-start px-3 py-2 not-prose hover:bg-card-muted data-[state=open]:bg-card-muted transition-all duration-100 ease-basic">
				<code className="w-fit font-mono font-medium bg-card-muted rounded border border-fd-border px-2 py-0.5 text-left">
					{token.token}
				</code>
				<ChevronDown className="absolute end-2 size-5 text-foreground/70 transition-transform group-data-[state=open]:rotate-180 duration-500 ease-smooth" />
			</CollapsibleTrigger>

			<CollapsibleContent>
				<div className="grid grid-cols-[1fr_3fr] gap-y-4 text-sm p-3 overflow-auto fd-scroll-container border-t">
					{token.description && (
						<>
							<p className={FIELD_LABEL_CLASS}>Description</p>
							<div className="text-sm prose prose-no-margin">
								{token.description}
							</div>
						</>
					)}

					<p className={FIELD_LABEL_CLASS}>Value</p>
					<CodePill>{token.value}</CodePill>
				</div>
			</CollapsibleContent>
		</Collapsible>
	);
}

function Swatch({ color, label }: { color: string; label?: string }) {
	return (
		<div className="inline-flex items-center gap-1">
			<span
				className="h-6 w-6 rounded border border-fd-border shadow-inner"
				style={{ backgroundColor: color }}
			/>
			{label && <span className="text-foreground/70 text-xs">{label}</span>}
		</div>
	);
}

function CodePill({ children }: { children: ReactNode }) {
	return (
		<code className="inline-flex items-center rounded border border-fd-border w-fit bg-card-muted px-2 py-1 font-mono text-xs text-foreground">
			{children}
		</code>
	);
}
