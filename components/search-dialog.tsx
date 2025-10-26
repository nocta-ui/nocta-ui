'use client';

import React, {
	createContext,
	Fragment,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
	HTMLAttributes,
} from 'react';
import {
	ChevronRightIcon as ChevronRight,
	FrameIcon as Hash,
	MagnifyingGlassIcon as SearchIcon,
} from '@radix-ui/react-icons';
import { I18nLabel, useI18n } from 'fumadocs-ui/contexts/i18n';
import { cn } from '@/lib/utils';
import {
	Dialog,
	DialogContent,
	DialogOverlay,
	DialogTitle,
} from '@radix-ui/react-dialog';
import { cva } from 'class-variance-authority';
import { useEffectEvent } from 'fumadocs-core/utils/use-effect-event';
import { useRouter } from 'fumadocs-core/framework';
import { useOnChange } from 'fumadocs-core/utils/use-on-change';
import scrollIntoView from 'scroll-into-view-if-needed';
import { buttonVariants } from '../components/ui/button';

interface SearchDialogProps {
	open: boolean;
	onOpenChange: (value: boolean) => void;
	search: string;
	onSearchChange: (value: string) => void;
	isLoading?: boolean;
	children: React.ReactNode;
}

interface SearchItem {
	id: string;
	type: 'page' | 'heading' | 'action' | 'text';
	url?: string;
	external?: boolean;
	onSelect?: () => void;
	content: string;
	contentWithHighlights?: {
		content: string;
		styles?: { highlight?: boolean };
	}[];
	breadcrumbs?: string[];
	node?: React.ReactNode;
}

interface SearchListProps extends HTMLAttributes<HTMLDivElement> {
	items?: SearchItem[] | null;
	Empty?: React.FC;
	Item?: React.FC<{ item: SearchItem; onClick: () => void }>;
}

interface TagsListProps extends HTMLAttributes<HTMLDivElement> {
	tag?: string;
	onTagChange: (tag?: string) => void;
	allowClear?: boolean;
	children: React.ReactNode;
}

interface TagsListItemProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	value: string;
}

const Context = createContext<any>(null);
const ListContext = createContext<any>(null);
const TagsListContext = createContext<any>(null);

// ==============================
// Search Dialog Components
// ==============================

export function SearchDialog({
	open,
	onOpenChange,
	search,
	onSearchChange,
	isLoading = false,
	children,
}: SearchDialogProps) {
	const [active, setActive] = useState<string | null>(null);

	const value = useMemo(
		() => ({
			open,
			onOpenChange,
			search,
			onSearchChange,
			active,
			setActive,
			isLoading,
		}),
		[active, isLoading, onOpenChange, onSearchChange, open, search],
	);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<Context.Provider value={value}>{children}</Context.Provider>
		</Dialog>
	);
}

export function SearchDialogHeader(props: HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			{...props}
			className={cn('flex flex-row items-center gap-2 p-3', props.className)}
		/>
	);
}

export function SearchDialogInput(
	props: React.InputHTMLAttributes<HTMLInputElement>,
) {
	const { text } = useI18n();
	const { search, onSearchChange } = useSearch();

	return (
		<input
			{...props}
			value={search}
			onChange={(e) => onSearchChange(e.target.value)}
			placeholder={text.search}
			className={cn(
				'w-0 flex-1 bg-transparent text-lg placeholder:text-foreground/35 text-foreground focus-visible:outline-none',
				props.className,
			)}
		/>
	);
}

export function SearchDialogClose({
	children = 'ESC',
	className,
	...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
	const { onOpenChange } = useSearch();
	return (
		<button
			type="button"
			onClick={() => onOpenChange(false)}
			className={cn(
				buttonVariants({
					color: 'outline',
					size: 'sm',
					className:
						'font-mono text-foreground/35 cursor-pointer bg-card shadow-sm border-border',
				}),
				className,
			)}
			{...props}
		>
			{children}
		</button>
	);
}

export function SearchDialogFooter(props: HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			{...props}
			className={cn('bg-fd-secondary/50 p-3 empty:hidden', props.className)}
		/>
	);
}

export function SearchDialogOverlay(props: HTMLAttributes<HTMLDivElement>) {
	return (
		<DialogOverlay
			{...props}
			className={cn(
				'fixed inset-0 z-50 backdrop-blur-xs bg-overlay data-[state=open]:animate-fd-fade-in data-[state=closed]:animate-fd-fade-out',
				props.className,
			)}
		/>
	);
}

export function SearchDialogContent({
	children,
	...props
}: React.ComponentProps<typeof DialogContent>) {
	const { text } = useI18n();
	return (
		<DialogContent
			aria-describedby={undefined}
			{...props}
			className={cn(
				'fixed left-1/2 top-4 md:top-[calc(50%-250px)] z-50 w-[calc(100%-1rem)] max-w-screen-sm -translate-x-1/2 rounded-lg border border-border bg-card text-foreground/70 shadow-2xl overflow-hidden data-[state=closed]:animate-fd-dialog-out data-[state=open]:animate-fd-dialog-in',
				'*:border-b *:has-[+:last-child[data-empty=true]]:border-b-0 *:data-[empty=true]:border-b-0 *:last:border-b-0',
				props.className,
			)}
		>
			<DialogTitle className="hidden">{text.search}</DialogTitle>
			{children}
		</DialogContent>
	);
}

export function SearchDialogList({
	items = null,
	Empty = () => (
		<div className="py-12 text-center text-sm text-foreground/70">
			<I18nLabel label="searchNoResult" />
		</div>
	),
	Item = (props) => <SearchDialogListItem {...props} />,
	...props
}: SearchListProps) {
	const ref = useRef<HTMLDivElement>(null);
	const [active, setActive] = useState<string | null>(
		items && items.length > 0 ? items[0].id : null,
	);
	const { onOpenChange } = useSearch();
	const router = useRouter();

	const onOpen = (item: SearchItem) => {
		if (item.type === 'action' && item.onSelect) {
			item.onSelect();
		} else if (item.external && item.url) {
			window.open(item.url, '_blank')?.focus();
		} else if (item.url) {
			router.push(item.url);
		}
		onOpenChange(false);
	};

	const onKey = useEffectEvent((e: KeyboardEvent) => {
		if (!items || e.isComposing) return;
		if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
			let idx = items.findIndex((item) => item.id === active);
			if (idx === -1) idx = 0;
			else if (e.key === 'ArrowDown') idx++;
			else idx--;
			setActive(items.at(idx % items.length)?.id ?? null);
			e.preventDefault();
		}
		if (e.key === 'Enter') {
			const selected = items.find((item) => item.id === active);
			if (selected) onOpen(selected);
			e.preventDefault();
		}
	});

	useEffect(() => {
		const element = ref.current;
		if (!element) return;
		const observer = new ResizeObserver(() => {
			const viewport = element.firstElementChild as HTMLElement;
			if (viewport)
				element.style.setProperty(
					'--fd-animated-height',
					`${viewport.clientHeight}px`,
				);
		});
		const viewport = element.firstElementChild as HTMLElement;
		if (viewport) observer.observe(viewport);
		window.addEventListener('keydown', onKey);
		return () => {
			observer.disconnect();
			window.removeEventListener('keydown', onKey);
		};
	}, []);

	useOnChange(items, () => {
		if (items && items.length > 0) setActive(items[0].id);
	});

	return (
		<div
			{...props}
			ref={ref}
			data-empty={items === null}
			className={cn(
				'overflow-hidden h-(--fd-animated-height) transition-[height]',
				props.className,
			)}
		>
			<div
				className={cn(
					'w-full flex flex-col overflow-y-auto max-h-[460px] p-1',
					!items && 'hidden',
				)}
			>
				<ListContext.Provider value={{ active, setActive }}>
					{items?.length === 0 && <Empty />}
					{items?.map((item) => (
						<Fragment key={item.id}>
							<Item item={item} onClick={() => onOpen(item)} />
						</Fragment>
					))}
				</ListContext.Provider>
			</div>
		</div>
	);
}

export function SearchDialogListItem({
	item,
	className,
	children,
	renderHighlights: render = renderHighlights,
	...props
}: {
	item: SearchItem;
	className?: string;
	children?: React.ReactNode;
	renderHighlights?: typeof renderHighlights;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
	const { active: activeId, setActive } = useSearchList();
	const active = item.id === activeId;

	if (!children) {
		if (item.type === 'action') {
			children = item.node;
		} else {
			children = (
				<>
					<div className="inline-flex items-center text-foreground/35 text-xs empty:hidden">
						{item.breadcrumbs?.map((crumb, i) => (
							<Fragment key={i}>
								{i > 0 && <ChevronRight className="size-4" />}
								{crumb}
							</Fragment>
						))}
					</div>
					{item.type !== 'page' && (
						<div
							role="none"
							className="absolute start-3 inset-y-0 w-px bg-fd-border"
						/>
					)}
					<p
						className={cn(
							'min-w-0 truncate',
							item.type !== 'page' && 'ps-4',
							item.type === 'page' || item.type === 'heading'
								? 'font-medium'
								: 'text-foreground/70',
						)}
					>
						{item.type === 'heading' && (
							<Hash className="inline me-1 size-4 text-foreground" />
						)}
						{item.contentWithHighlights
							? render(item.contentWithHighlights)
							: item.content}
					</p>
				</>
			);
		}
	}

	const ref = useCallback(
		(element: HTMLButtonElement | null) => {
			if (active && element) {
				scrollIntoView(element, {
					scrollMode: 'if-needed',
					block: 'nearest',
					boundary: element.parentElement!,
				});
			}
		},
		[active],
	);

	return (
		<button
			type="button"
			ref={ref}
			aria-selected={active}
			className={cn(
				'relative select-none px-2.5 py-2 text-start text-sm rounded-md cursor-pointer transition-colors duration-200 ease-in-out',
				active && 'bg-card-muted',
				className,
			)}
			onPointerMove={() => setActive(item.id)}
			{...props}
		>
			{children}
		</button>
	);
}

export function SearchDialogIcon({
	className,
	...props
}: Omit<React.ComponentProps<typeof SearchIcon>, 'children'>) {
	const { isLoading } = useSearch();
	return (
		<SearchIcon
			{...props}
			className={cn(
				'size-6 text-foreground/35',
				isLoading && 'animate-pulse duration-400',
				className,
			)}
		/>
	);
}

// ==============================
// Tags List
// ==============================

const itemVariants = cva(
	'rounded-md border px-2 py-0.5 text-xs font-medium text-fd-muted-foreground transition-colors',
	{
		variants: {
			active: {
				true: 'bg-fd-accent text-fd-accent-foreground',
			},
		},
	},
);

export function TagsList({
	tag,
	onTagChange,
	allowClear = false,
	children,
	...props
}: TagsListProps) {
	const value = useMemo(
		() => ({
			value: tag,
			onValueChange: onTagChange,
			allowClear,
		}),
		[allowClear, onTagChange, tag],
	);

	return (
		<div
			{...props}
			className={cn('flex items-center gap-1 flex-wrap', props.className)}
		>
			<TagsListContext.Provider value={value}>
				{children}
			</TagsListContext.Provider>
		</div>
	);
}

export function TagsListItem({
	value,
	className,
	...props
}: TagsListItemProps) {
	const { onValueChange, value: selectedValue, allowClear } = useTagsList();
	const selected = value === selectedValue;

	return (
		<button
			type="button"
			data-active={selected}
			className={cn(itemVariants({ active: selected, className }))}
			onClick={() => onValueChange(selected && allowClear ? undefined : value)}
			tabIndex={-1}
			{...props}
		>
			{props.children}
		</button>
	);
}

// ==============================
// Utils / Hooks
// ==============================

function renderHighlights(
	highlights: { content: string; styles?: { highlight?: boolean } }[],
) {
	return highlights.map((node, i) =>
		node.styles?.highlight ? (
			<span key={i} className="text-foreground">
				{node.content}
			</span>
		) : (
			<Fragment key={i}>{node.content}</Fragment>
		),
	);
}

export function useSearch() {
	const ctx = useContext(Context);
	if (!ctx) throw new Error('Missing <SearchDialog />');
	return ctx;
}

export function useTagsList() {
	const ctx = useContext(TagsListContext);
	if (!ctx) throw new Error('Missing <TagsList />');
	return ctx;
}

export function useSearchList() {
	const ctx = useContext(ListContext);
	if (!ctx) throw new Error('Missing <SearchDialogList />');
	return ctx;
}
export interface SharedProps {
	open: boolean;
	onOpenChange: (value: boolean) => void;
	search: string;
	onSearchChange: (value: string) => void;
	isLoading?: boolean;
	children?: React.ReactNode;
}
