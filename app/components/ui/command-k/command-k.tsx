'use client';

import { cva } from 'class-variance-authority';
import type React from 'react';
import {
	useCallback,
	useEffect,
	useId,
	useMemo,
	useRef,
	useState,
} from 'react';
import {
	Dialog,
	DialogContent,
	DialogSurface,
} from '@/app/components/ui/dialog';
import { Icons } from '@/app/components/ui/icons/icons';
import { Input } from '@/app/components/ui/input';
import { cn } from '@/lib/utils';

export type CommandKItem = {
	id?: string;
	label: string;
	group?: string;
	description?: string;
	keywords?: string[];
	icon?: React.ReactNode;
	shortcut?: string[];
	disabled?: boolean;
	action?: () => void;
};

export interface CommandKProps {
	items: CommandKItem[];
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	placeholder?: string;
	emptyMessage?: string;
	closeOnAction?: boolean;
	size?: 'sm' | 'md' | 'lg' | 'xl';
	className?: string;
	listClassName?: string;
	autoFocus?: boolean;
	hotkey?: {
		key: string;
		metaKey?: boolean;
		ctrlKey?: boolean;
	};
	onSelect?: (item: CommandKItem) => void;
}

const groupHeaderClass = cva(
	'px-3 pt-2 pb-1 text-xs font-medium tracking-wide text-foreground/45',
);

const listItemClass = cva(
	[
		'relative flex cursor-pointer items-center gap-3 rounded-sm h-9 px-3 py-2',
		'text-sm text-foreground',
		'hover:bg-card-muted',
		'transition-colors duration-300 ease-smooth',
	].join(' '),
	{
		variants: {
			highlighted: { true: 'bg-card-muted', false: '' },
			disabled: {
				true: 'pointer-events-none cursor-not-allowed opacity-50',
				false: '',
			},
		},
		defaultVariants: { highlighted: false, disabled: false },
	},
);

const kbdClass = cva(
	[
		'flex items-center justify-center font-mono',
		'h-5 min-w-[2.2rem] rounded-sm border px-1.5',
		'text-[10px] leading-none font-medium',
		'border-border',
		'bg-card-muted/50',
		'text-foreground/70 shadow-sm',
	].join(' '),
);

const usePlatformMeta = () => {
	const [isMac, setIsMac] = useState(false);
	useEffect(() => {
		const ua = navigator.userAgent.toLowerCase();
		setIsMac(/mac|iphone|ipad|ipod/.test(ua));
	}, []);
	return isMac;
};

export const CommandK: React.FC<CommandKProps> = ({
	items,
	open: controlledOpen,
	defaultOpen = false,
	onOpenChange,
	placeholder = 'Type a command or search...',
	emptyMessage = 'No results',
	closeOnAction = true,
	size = 'xl',
	className = '',
	listClassName = '',
	autoFocus = true,
	hotkey = { key: 'k' },
	onSelect,
}) => {
	const [internalOpen, setInternalOpen] = useState(defaultOpen);
	const [query, setQuery] = useState('');
	const [highlightedIndex, setHighlightedIndex] = useState(0);
	const searchContainerRef = useRef<HTMLDivElement>(null);
	const listRef = useRef<HTMLDivElement>(null);
	const optionRefs = useRef<(HTMLDivElement | null)[]>([]);
	const isMac = usePlatformMeta();

	const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
	const setOpen = onOpenChange || setInternalOpen;

	const baseId = useId();

	const normalized = useMemo(() => {
		return items.map((it, idx) => ({
			key: it.id ?? `${it.group ?? '_'}-${it.label}-${idx}`,
			item: it,
		}));
	}, [items]);

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) return normalized;
		return normalized.filter(({ item }) => {
			const hay = [item.label, item.description ?? '', ...(item.keywords ?? [])]
				.join(' ')
				.toLowerCase();
			return hay.includes(q);
		});
	}, [normalized, query]);

	const grouped = useMemo(() => {
		const groups = new Map<string, { key: string; item: CommandKItem }[]>();
		filtered.forEach((entry) => {
			const g = entry.item.group ?? 'General';
			if (!groups.has(g)) groups.set(g, []);
			groups.get(g)?.push(entry);
		});
		return groups;
	}, [filtered]);

	const flatSelectable = useMemo(
		() => Array.from(grouped.values()).flat(),
		[grouped],
	);

	const getOptionId = useCallback(
		(i: number) => `${baseId}-cmdk-option-${i}`,
		[baseId],
	);

	const close = useCallback(() => {
		setOpen(false);
		setQuery('');
		setHighlightedIndex(0);
	}, [setOpen]);

	const handleSelect = useCallback(
		(entry: { key: string; item: CommandKItem }) => {
			if (entry.item.disabled) return;
			entry.item.action?.();
			onSelect?.(entry.item);
			if (closeOnAction) close();
		},
		[closeOnAction, close, onSelect],
	);

	useEffect(() => {
		const onKeyDown = (e: KeyboardEvent) => {
			const keyMatch = e.key.toLowerCase() === hotkey.key.toLowerCase();

			const requiresMeta = hotkey.metaKey === true;
			const requiresCtrl = hotkey.ctrlKey === true;
			let modifierOk: boolean;
			if (!requiresMeta && !requiresCtrl) {
				modifierOk = isMac ? e.metaKey : e.ctrlKey;
			} else if (requiresMeta && requiresCtrl) {
				modifierOk = e.metaKey || e.ctrlKey;
			} else {
				modifierOk =
					(requiresMeta ? e.metaKey : true) &&
					(requiresCtrl ? e.ctrlKey : true);
			}

			const isModifierPressed = e.metaKey || e.ctrlKey || e.altKey;

			const target = e.target as HTMLElement | null;
			const isTypingElement =
				!!target &&
				(target.tagName === 'INPUT' ||
					target.tagName === 'TEXTAREA' ||
					target.isContentEditable);

			if (keyMatch && modifierOk) {
				e.preventDefault();
				e.stopPropagation();
				if (isTypingElement && !isModifierPressed) return;
				setOpen(!open);
				return;
			}

			if (e.key === 'Escape' && open) {
				e.preventDefault();
				close();
			}
		};
		document.addEventListener('keydown', onKeyDown);
		return () => document.removeEventListener('keydown', onKeyDown);
	}, [hotkey, open, setOpen, close, isMac]);

	useEffect(() => {
		if (!open || !autoFocus) return;
		let raf1: number | null = null;
		let raf2: number | null = null;
		let t1: ReturnType<typeof setTimeout> | null = null;

		const focusInput = () => {
			const el = searchContainerRef.current?.querySelector(
				'input[type="text"], input:not([type])',
			) as HTMLInputElement | null;
			if (el) {
				try {
					el.focus({ preventScroll: true });
					const val = el.value;
					el.value = '';
					el.value = val;
				} catch {}
			}
		};

		raf1 = requestAnimationFrame(() => {
			focusInput();
			raf2 = requestAnimationFrame(() => focusInput());
		});
		t1 = setTimeout(focusInput, 220);

		return () => {
			if (raf1) cancelAnimationFrame(raf1);
			if (raf2) cancelAnimationFrame(raf2);
			if (t1) clearTimeout(t1);
		};
	}, [open, autoFocus]);

	useEffect(() => {
		const node = optionRefs.current[highlightedIndex];
		if (node) node.scrollIntoView({ block: 'nearest' });
	}, [highlightedIndex]);

	useEffect(() => {
		if (!open) return;
		const onShortcut = (e: KeyboardEvent) => {
			const modifierOk = isMac ? e.metaKey : e.ctrlKey;
			const isChar = e.key.length === 1 && /[a-z0-9]/i.test(e.key);
			if (!modifierOk || !isChar) return;

			const pressedKey = e.key.toUpperCase();
			const normalize = (t: string) => t.trim().toUpperCase();
			const isShiftToken = (t: string) => /^(SHIFT|⇧)$/.test(normalize(t));

			const match = flatSelectable.find((entry) => {
				const sc = entry.item.shortcut;
				if (!sc || sc.length === 0 || entry.item.disabled) return false;
				const requiresShift = sc.some(isShiftToken);
				if (requiresShift && !e.shiftKey) return false;
				const letter = sc.find((t) => /^[a-z0-9]$/i.test(t));
				if (!letter) return false;
				return normalize(letter) === pressedKey;
			});
			if (match) {
				e.preventDefault();
				e.stopPropagation();
				handleSelect(match);
			}
		};
		document.addEventListener('keydown', onShortcut);
		return () => document.removeEventListener('keydown', onShortcut);
	}, [open, isMac, flatSelectable, handleSelect]);

	const onKeyNav = (e: React.KeyboardEvent) => {
		if (!open) return;
		if (flatSelectable.length === 0) return;
		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault();
				setHighlightedIndex((i) => (i + 1) % flatSelectable.length);
				break;
			case 'ArrowUp':
				e.preventDefault();
				setHighlightedIndex(
					(i) => (i - 1 + flatSelectable.length) % flatSelectable.length,
				);
				break;
			case 'Enter':
				e.preventDefault();
				{
					const entry = flatSelectable[highlightedIndex];
					if (entry) handleSelect(entry);
				}
				break;
			case 'Home':
				e.preventDefault();
				setHighlightedIndex(0);
				break;
			case 'End':
				e.preventDefault();
				setHighlightedIndex(flatSelectable.length - 1);
				break;
		}
	};

	const shortcutHint = useMemo(() => {
		const key = hotkey.key.toUpperCase();
		const requiresMeta = hotkey.metaKey === true;
		const requiresCtrl = hotkey.ctrlKey === true;
		if (!requiresMeta && !requiresCtrl) {
			return isMac ? `⌘${key}` : `Ctrl+${key}`;
		}
		if (requiresMeta && requiresCtrl) {
			return isMac ? `⌘${key}` : `Ctrl+${key}`;
		}
		if (requiresMeta) return `⌘${key}`;
		if (requiresCtrl) return `Ctrl+${key}`;
		return key;
	}, [hotkey, isMac]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogSurface
				size={size}
				showClose={false}
				className={cn('p-0!', className)}
			>
				<DialogContent className="p-0">
					<div className="px-0.5 pt-2" ref={searchContainerRef}>
						<div className="relative">
							<Input
								role="combobox"
								aria-controls={`${baseId}-commandk-listbox`}
								aria-expanded={open}
								aria-autocomplete="list"
								aria-activedescendant={
									flatSelectable[highlightedIndex]
										? getOptionId(highlightedIndex)
										: undefined
								}
								value={query}
								onChange={(e) => {
									setQuery(e.target.value);
									setHighlightedIndex(0);
								}}
								onKeyDown={onKeyNav}
								placeholder={placeholder}
								className="w-full border-none! pr-12 shadow-none! focus-visible:border-none focus-visible:ring-0 focus-visible:ring-offset-0"
								leftIcon={
									<Icons.Search
										aria-hidden="true"
										className="size-5! -mt-0.5 -ml-0.5"
									/>
								}
							/>
							<div className="pointer-events-none absolute top-1/2 right-3 h-fit -translate-y-1/2">
								<span aria-hidden="true" className={kbdClass()}>
									{shortcutHint}
								</span>
								<span className="sr-only">Shortcut: {shortcutHint}</span>
							</div>
						</div>
					</div>

					<div
						ref={listRef}
						className={cn(
							'mt-2 max-h-80 overflow-auto py-2',
							'border-t border-border/60',
							listClassName,
						)}
						id={`${baseId}-commandk-listbox`}
						role="listbox"
						aria-label="Command results"
						onKeyDown={onKeyNav}
					>
						<div aria-live="polite" className="sr-only">
							{filtered.length} result{filtered.length === 1 ? '' : 's'}
						</div>
						{flatSelectable.length === 0 ? (
							<output
								aria-live="polite"
								className="flex items-center justify-center px-3 py-6 text-center text-sm text-foreground/45"
							>
								{emptyMessage}
							</output>
						) : (
							Array.from(grouped.entries()).map(([group, entries]) => (
								<div key={group} className="px-2">
									<fieldset className="m-0 mt-1 flex flex-col gap-1 border-0 p-0">
										<legend className={groupHeaderClass()}>{group}</legend>
										{entries.map((entry) => {
											const flatIndex = flatSelectable.findIndex(
												(f) => f.key === entry.key,
											);
											const highlighted = flatIndex === highlightedIndex;
											return (
												<div
													key={entry.key}
													ref={(el) => {
														optionRefs.current[flatIndex] = el;
													}}
													className={listItemClass({
														highlighted,
														disabled: !!entry.item.disabled,
													})}
													id={getOptionId(flatIndex)}
													role="option"
													aria-selected={highlighted}
													aria-disabled={entry.item.disabled || undefined}
													tabIndex={-1}
													onMouseEnter={() => setHighlightedIndex(flatIndex)}
													onClick={() => handleSelect(entry)}
													onKeyDown={(e) => {
														if (entry.item.disabled) return;
														if (e.key === 'Enter' || e.key === ' ') {
															e.preventDefault();
															handleSelect(entry);
														}
													}}
												>
													{entry.item.icon && (
														<span
															aria-hidden="true"
															className="shrink-0 text-foreground/45"
														>
															{entry.item.icon}
														</span>
													)}
													<div className="flex min-w-0 flex-1 flex-row gap-3">
														<div className="truncate font-medium">
															{entry.item.label}
														</div>
														{entry.item.description && (
															<div className="mt-0.5 hidden truncate text-xs text-foreground/70 md:block">
																{entry.item.description}
															</div>
														)}
													</div>
													{entry.item.shortcut &&
														entry.item.shortcut.length > 0 && (
															<div
																aria-hidden="true"
																className="ml-2 flex items-center gap-1"
															>
																{(() => {
																	const sc = entry.item.shortcut ?? [];
																	const hasShift = sc.some((t) =>
																		/^(shift|⇧)$/i.test(t.trim()),
																	);
																	const letters = sc
																		.filter((t) => /^[a-z0-9]$/i.test(t.trim()))
																		.map((t) => t.trim().toUpperCase());
																	const tokens = [
																		isMac ? '⌘' : 'Ctrl',
																		...(hasShift ? ['⇧'] : []),
																		...letters,
																	];
																	return tokens.map((tok) => (
																		<span key={`${tok}`} className={kbdClass()}>
																			{tok}
																		</span>
																	));
																})()}
															</div>
														)}
												</div>
											);
										})}
									</fieldset>
								</div>
							))
						)}
					</div>

					<div className="flex items-center justify-between gap-2 border-t border-border/60 bg-card-muted/30 px-3 py-2 text-xs text-foreground/70">
						<div className="flex items-center gap-2">
							<span className="hidden sm:inline">Navigate</span>
							<div className="flex items-center gap-1" aria-hidden="true">
								<span className={kbdClass()}>↑</span>
								<span className={kbdClass()}>↓</span>
							</div>
							<span className="sr-only">Navigate with arrow keys</span>
						</div>
						<div className="flex items-center gap-2">
							<span className="hidden sm:inline">Select</span>
							<div className="flex items-center gap-1" aria-hidden="true">
								<span className={kbdClass()}>Enter</span>
							</div>
							<span className="sr-only">Select with Enter key</span>
						</div>
					</div>
				</DialogContent>
			</DialogSurface>
		</Dialog>
	);
};

export default CommandK;
