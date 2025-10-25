'use client';

import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { useI18n } from 'fumadocs-ui/contexts/i18n';
import { useSearchContext } from 'fumadocs-ui/contexts/search';
import type { ComponentProps } from 'react';

import { cn } from '../lib/cn';
import { type ButtonProps, buttonVariants } from './ui/button';

interface SearchToggleProps
	extends Omit<ComponentProps<'button'>, 'color'>,
		ButtonProps {
	hideIfDisabled?: boolean;
}

export function SearchToggle({
	hideIfDisabled,
	size = 'icon-sm',
	color = 'ghost',
	...props
}: SearchToggleProps) {
	const { setOpenSearch, enabled } = useSearchContext();
	if (hideIfDisabled && !enabled) return null;

	return (
		<button
			type="button"
			className={cn(
				buttonVariants({
					size,
					color,
				}),
				props.className,
			)}
			data-search=""
			aria-label="Open Search"
			onClick={() => {
				setOpenSearch(true);
			}}
		>
			<MagnifyingGlassIcon aria-hidden="true" />
		</button>
	);
}

export function LargeSearchToggle({
	hideIfDisabled,
	...props
}: ComponentProps<'button'> & {
	hideIfDisabled?: boolean;
}) {
	const { enabled, hotKey, setOpenSearch } = useSearchContext();
	const { text } = useI18n();
	if (hideIfDisabled && !enabled) return null;

	return (
		<button
			type="button"
			data-search-full=""
			{...props}
			className={cn(
				'cursor-pointer inline-flex items-center gap-2 rounded-md border border-fd-border bg-card-muted p-1.5 ps-2 text-sm text-fd-muted-foreground transition-colors duration-200 ease-in-out hover:bg-card-muted hover:text-fd-accent-foreground/70',
				'focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:outline-none focus-visible:ring-offset-ring-offset/50 focus-visible:border-border focus-visible:ring-ring/50',
				props.className,
			)}
			onClick={() => {
				setOpenSearch(true);
			}}
		>
			<MagnifyingGlassIcon aria-hidden="true" className="size-5" />
			{text.search}
			<div className="ms-auto inline-flex gap-0.5">
				{hotKey.map((k, i) => (
					<kbd key={i} className="rounded-md border bg-card px-1.5">
						{k.display}
					</kbd>
				))}
			</div>
		</button>
	);
}
