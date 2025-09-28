'use client';

import {
	ChevronDownIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
} from '@radix-ui/react-icons';
import {
	type BreadcrumbOptions,
	getBreadcrumbItemsFromPath,
} from 'fumadocs-core/breadcrumb';
import { createContext, usePathname } from 'fumadocs-core/framework';
import Link from 'fumadocs-core/link';
import type { PageTree } from 'fumadocs-core/server';
import { useActiveAnchor } from 'fumadocs-core/toc';
import { useEffectEvent } from 'fumadocs-core/utils/use-effect-event';
import { useI18n } from 'fumadocs-ui/contexts/i18n';
import { useNav } from 'fumadocs-ui/contexts/layout';
import { useSidebar } from 'fumadocs-ui/contexts/sidebar';
import { useTreeContext, useTreePath } from 'fumadocs-ui/contexts/tree';
import {
	type ComponentProps,
	Fragment,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { cn } from '../../../lib/cn';
import { isActive } from '../../../lib/is-active';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '../../ui/collapsible';
import { useTOCItems } from '../../ui/toc';

const TocPopoverContext = createContext<{
	open: boolean;
	setOpen: (open: boolean) => void;
}>('TocPopoverContext');

export function PageTOCPopoverTrigger(props: ComponentProps<'button'>) {
	const { text } = useI18n();
	const { open } = TocPopoverContext.use();
	const items = useTOCItems();
	const active = useActiveAnchor();
	const selected = useMemo(
		() => items.findIndex((item) => active === item.url.slice(1)),
		[items, active],
	);
	const path = useTreePath().at(-1);
	const showItem = selected !== -1 && !open;

	return (
		<CollapsibleTrigger
			{...props}
			className={cn(
				'flex h-(--fd-tocnav-height) w-full items-center gap-2.5 px-4 py-2.5 text-start text-sm text-foreground-muted focus-visible:outline-none md:px-6 [&_svg]:size-4',
				props.className,
			)}
		>
			<ProgressCircle
				value={(selected + 1) / Math.max(1, items.length)}
				max={1}
				className={cn('shrink-0', open && 'text-foreground')}
			/>
			<span className="grid flex-1 *:col-start-1 *:row-start-1 *:my-auto">
				<span
					className={cn(
						'truncate transition-all',
						open && 'text-foreground',
						showItem && 'pointer-events-none -translate-y-full opacity-0',
					)}
				>
					{path?.name ?? text.toc}
				</span>
				<span
					className={cn(
						'truncate transition-all',
						!showItem && 'pointer-events-none translate-y-full opacity-0',
					)}
				>
					{items[selected]?.title}
				</span>
			</span>
			<ChevronDownIcon
				aria-hidden="true"
				className={cn(
					'mx-0.5 shrink-0 transition-transform',
					open && 'rotate-180',
				)}
			/>
		</CollapsibleTrigger>
	);
}

interface ProgressCircleProps
	extends Omit<React.ComponentProps<'svg'>, 'strokeWidth'> {
	value: number;
	strokeWidth?: number;
	size?: number;
	min?: number;
	max?: number;
}

function clamp(input: number, min: number, max: number): number {
	if (input < min) return min;
	if (input > max) return max;
	return input;
}

function ProgressCircle({
	value,
	strokeWidth = 2,
	size = 24,
	min = 0,
	max = 100,
	...restSvgProps
}: ProgressCircleProps) {
	const normalizedValue = clamp(value, min, max);
	const radius = (size - strokeWidth) / 2;
	const circumference = 2 * Math.PI * radius;
	const progress = (normalizedValue / max) * circumference;
	const circleProps = {
		cx: size / 2,
		cy: size / 2,
		r: radius,
		fill: 'none',
		strokeWidth,
	};

	return (
		<svg
			role="progressbar"
			viewBox={`0 0 ${size} ${size}`}
			aria-valuenow={normalizedValue}
			aria-valuemin={min}
			aria-valuemax={max}
			{...restSvgProps}
		>
			<circle {...circleProps} className="stroke-current/25" />
			<circle
				{...circleProps}
				stroke="currentColor"
				strokeDasharray={circumference}
				strokeDashoffset={circumference - progress}
				strokeLinecap="round"
				transform={`rotate(-90 ${size / 2} ${size / 2})`}
				className="transition-all"
			/>
		</svg>
	);
}

export function PageTOCPopoverContent(props: ComponentProps<'div'>) {
	return (
		<CollapsibleContent
			data-toc-popover=""
			{...props}
			className={cn('flex max-h-[50vh] flex-col px-4 md:px-6', props.className)}
		>
			{props.children}
		</CollapsibleContent>
	);
}

export function PageTOCPopover(props: ComponentProps<'div'>) {
	const ref = useRef<HTMLElement>(null);
	const [open, setOpen] = useState(false);
	const { collapsed } = useSidebar();
	const { isTransparent } = useNav();

	const onClick = useEffectEvent((e: Event) => {
		if (!open) return;

		if (ref.current && !ref.current.contains(e.target as HTMLElement))
			setOpen(false);
	});

	useEffect(() => {
		window.addEventListener('click', onClick);

		return () => {
			window.removeEventListener('click', onClick);
		};
	}, [onClick]);

	return (
		<TocPopoverContext.Provider
			value={useMemo(
				() => ({
					open,
					setOpen,
				}),
				[setOpen, open],
			)}
		>
			<Collapsible open={open} onOpenChange={setOpen} asChild>
				<header
					ref={ref}
					id="nd-tocnav"
					{...props}
					className={cn(
						'fixed z-10 border-b pr-(--removed-body-scroll-bar-size,0) backdrop-blur-sm transition-colors xl:hidden max-xl:on-root:[--fd-tocnav-height:40px]',
						(!isTransparent || open) && 'bg-background/80',
						open && 'shadow-lg',
						props.className,
					)}
					style={{
						...props.style,
						top: 'calc(var(--fd-banner-height) + var(--fd-nav-height))',
						insetInlineStart: collapsed
							? '0px'
							: 'calc(var(--fd-sidebar-width) + var(--fd-layout-offset))',
						insetInlineEnd: 0,
					}}
				>
					{props.children}
				</header>
			</Collapsible>
		</TocPopoverContext.Provider>
	);
}

export function PageLastUpdate({
	date: value,
	...props
}: Omit<ComponentProps<'p'>, 'children'> & { date: Date | string }) {
	const { text } = useI18n();
	const [date, setDate] = useState('');

	useEffect(() => {
		// to the timezone of client
		setDate(new Date(value).toLocaleDateString());
	}, [value]);

	return (
		<p
			{...props}
			className={cn('text-sm text-foreground-muted', props.className)}
		>
			{text.lastUpdate} {date}
		</p>
	);
}

type Item = Pick<PageTree.Item, 'name' | 'description' | 'url'>;
export interface FooterProps extends ComponentProps<'div'> {
	/**
	 * Items including information for the next and previous page
	 */
	items?: {
		previous?: Item;
		next?: Item;
	};
}

function scanNavigationList(tree: PageTree.Node[]) {
	const list: PageTree.Item[] = [];

	tree.forEach((node) => {
		if (node.type === 'folder') {
			if (node.index) {
				list.push(node.index);
			}

			list.push(...scanNavigationList(node.children));
			return;
		}

		if (node.type === 'page' && !node.external) {
			list.push(node);
		}
	});

	return list;
}

const listCache = new Map<string, PageTree.Item[]>();

export function PageFooter({ items, ...props }: FooterProps) {
	const { root } = useTreeContext();
	const pathname = usePathname();

	const { previous, next } = useMemo(() => {
		if (items) return items;

		const cached = listCache.get(root.$id);
		const list = cached ?? scanNavigationList(root.children);
		listCache.set(root.$id, list);

		const idx = list.findIndex((item) => isActive(item.url, pathname, false));

		if (idx === -1) return {};
		return {
			previous: list[idx - 1],
			next: list[idx + 1],
		};
	}, [items, pathname, root]);

	return (
		<div
			{...props}
			className={cn(
				'@container grid gap-4 pb-6',
				previous && next ? 'grid-cols-2' : 'grid-cols-1',
				props.className,
			)}
		>
			{previous ? <FooterItem item={previous} index={0} /> : null}
			{next ? <FooterItem item={next} index={1} /> : null}
		</div>
	);
}

function FooterItem({ item, index }: { item: Item; index: 0 | 1 }) {
	const { text } = useI18n();
	const Icon = index === 0 ? ChevronLeftIcon : ChevronRightIcon;

	return (
		<Link
			href={item.url}
			className={cn(
				'flex flex-col gap-2 rounded-lg border bg-background p-4 text-sm transition-colors hover:bg-background-muted/50 hover:text-foreground-muted @max-lg:col-span-full',
				index === 1 && 'text-end',
			)}
		>
			<div
				className={cn(
					'inline-flex items-center gap-1.5 font-medium',
					index === 1 && 'flex-row-reverse',
				)}
			>
				<Icon
					aria-hidden="true"
					className="-mx-1 size-4 shrink-0 rtl:rotate-180"
				/>
				<p>{item.name}</p>
			</div>
			<p className="truncate text-foreground-subtle">
				{item.description ?? (index === 0 ? text.previousPage : text.nextPage)}
			</p>
		</Link>
	);
}

export type BreadcrumbProps = BreadcrumbOptions & ComponentProps<'div'>;

export function PageBreadcrumb({
	includeRoot = false,
	includeSeparator,
	includePage = false,
	...props
}: BreadcrumbProps) {
	const path = useTreePath();
	const { root } = useTreeContext();
	const items = useMemo(() => {
		return getBreadcrumbItemsFromPath(root, path, {
			includePage,
			includeSeparator,
			includeRoot,
		});
	}, [includePage, includeRoot, includeSeparator, path, root]);

	if (items.length === 0) return null;

	return (
		<div
			{...props}
			className={cn(
				'flex items-center gap-1.5 text-sm text-foreground-muted',
				props.className,
			)}
		>
			{items.map((item, i) => {
				const className = cn(
					'truncate',
					i === items.length - 1 && 'font-medium text-foreground',
				);

				return (
					<Fragment key={i}>
						{i !== 0 && (
							<ChevronRightIcon
								aria-hidden="true"
								className="size-3.5 shrink-0"
							/>
						)}
						{item.url ? (
							<Link
								href={item.url}
								className={cn(className, 'transition-opacity hover:opacity-80')}
							>
								{item.name}
							</Link>
						) : (
							<span className={className}>{item.name}</span>
						)}
					</Fragment>
				);
			})}
		</div>
	);
}

export function PageTOC(props: ComponentProps<'div'>) {
	const { collapsed } = useSidebar();
	const offset = collapsed ? '0px' : 'var(--fd-layout-offset)';

	return (
		<div
			id="nd-toc"
			{...props}
			className={cn(
				'fixed right-0 bottom-0 pt-8 pr-(--removed-body-scroll-bar-size,0) pb-2 max-xl:hidden',
				props.className,
			)}
			style={{
				...props.style,
				top: 'calc(var(--fd-banner-height) + var(--fd-nav-height))',
				insetInlineEnd: `max(${offset}, calc(50vw - var(--fd-sidebar-width)/2 - var(--fd-page-width)/2))`,
			}}
		>
			<div className="flex h-full w-(--fd-toc-width) max-w-full flex-col px-8 pe-4">
				{props.children}
			</div>
		</div>
	);
}
