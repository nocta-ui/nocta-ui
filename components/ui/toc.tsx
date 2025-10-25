'use client';
import type { TOCItemType } from 'fumadocs-core/toc';
import * as Primitive from 'fumadocs-core/toc';
import { useI18n } from 'fumadocs-ui/contexts/i18n';
import { type ComponentProps, createContext, useContext, useRef } from 'react';
import { cn } from '../../lib/cn';
import { mergeRefs } from '../../lib/merge-refs';
import { TocThumb } from './toc-thumb';

const TOCContext = createContext<TOCItemType[]>([]);

export function useTOCItems(): TOCItemType[] {
	return useContext(TOCContext);
}

export function TOCProvider({
	toc,
	children,
	...props
}: ComponentProps<typeof Primitive.AnchorProvider>) {
	return (
		<TOCContext value={toc}>
			<Primitive.AnchorProvider toc={toc} {...props}>
				{children}
			</Primitive.AnchorProvider>
		</TOCContext>
	);
}

export function TOCScrollArea({
	ref,
	className,
	...props
}: ComponentProps<'div'>) {
	const viewRef = useRef<HTMLDivElement>(null);

	return (
		<div
			ref={mergeRefs(viewRef, ref)}
			className={cn(
				'relative ms-px min-h-0 overflow-auto [mask-image:linear-gradient(to_bottom,transparent,white_16px,white_calc(100%-16px),transparent)] py-3 text-sm [scrollbar-width:none]',
				className,
			)}
			{...props}
		>
			<Primitive.ScrollProvider containerRef={viewRef}>
				{props.children}
			</Primitive.ScrollProvider>
		</div>
	);
}

export function TOCItems({ ref, className, ...props }: ComponentProps<'div'>) {
	const containerRef = useRef<HTMLDivElement>(null);
	const items = useTOCItems();
	const { text } = useI18n();

	if (items.length === 0)
		return (
			<div className="rounded-lg border bg-foreground p-3 text-xs text-foreground/70">
				{text.tocNoHeadings}
			</div>
		);

	return (
		<>
			<TocThumb
				containerRef={containerRef}
				className="absolute top-(--fd-top) h-(--fd-height) w-px bg-foreground transition-all"
			/>
			<div
				ref={mergeRefs(ref, containerRef)}
				className={cn('flex flex-col border-s border-foreground/10', className)}
				{...props}
			>
				{items.map((item) => (
					<TOCItem key={item.url} item={item} />
				))}
			</div>
		</>
	);
}

function TOCItem({ item }: { item: TOCItemType }) {
	return (
		<Primitive.TOCItem
			href={item.url}
			className={cn(
				'prose py-1.5 text-sm [overflow-wrap:anywhere] text-foreground/70 transition-colors first:pt-0 last:pb-0 data-[active=true]:text-foreground',
				item.depth <= 2 && 'ps-3',
				item.depth === 3 && 'ps-6',
				item.depth >= 4 && 'ps-8',
			)}
		>
			{item.title}
		</Primitive.TOCItem>
	);
}
