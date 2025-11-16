'use client';

import { ViewVerticalIcon } from '@radix-ui/react-icons';
import { useNav } from 'fumadocs-ui/contexts/layout';
import { useSidebar } from 'fumadocs-ui/contexts/sidebar';
import type { ComponentProps } from 'react';

import { cn } from '../../../lib/cn';
import { SearchToggle } from '../../search-toggle';
import { SidebarCollapseTrigger } from '../../sidebar';
import { buttonVariants } from '../../ui/button';

export function Navbar(props: ComponentProps<'header'>) {
	const { isTransparent } = useNav();

	return (
		<header
			id="nd-subnav"
			{...props}
			className={cn(
				'fixed top-(--fd-banner-height) right-(--removed-body-scroll-bar-size,0) left-0 z-30 flex items-center border-b ps-4 pe-2.5 backdrop-blur-sm transition-colors',
				!isTransparent && 'bg-background/80',
				props.className,
			)}
		>
			{props.children}
		</header>
	);
}

export function LayoutBody(props: ComponentProps<'main'>) {
	const { collapsed } = useSidebar();

	return (
		<main
			id="nd-docs-layout"
			{...props}
			className={cn(
				'fd-default-layout flex flex-1 flex-col pt-(--fd-nav-height) transition-[padding] duration-450 ease-smooth',
				!collapsed && 'mx-(--fd-layout-offset)',
				props.className,
			)}
			style={{
				...props.style,
				paddingInlineStart: collapsed
					? 'min(calc(100vw - var(--fd-page-width)), var(--fd-sidebar-width))'
					: 'var(--fd-sidebar-width)',
			}}
		>
			{props.children}
		</main>
	);
}

export function CollapsibleControl() {
	const { collapsed } = useSidebar();

	return (
		<div
			className={cn(
				'fixed z-10 flex rounded-md border bg-popover p-0.5 text-foreground/70 transition-opacity shadow-lg shadow-card max-xl:end-4 max-md:hidden xl:start-4',
				!collapsed && 'pointer-events-none opacity-0',
			)}
			style={{
				top: 'calc(var(--fd-banner-height) + var(--fd-tocnav-height) + var(--spacing) * 4)',
			}}
		>
			<SidebarCollapseTrigger
				className={cn(
					buttonVariants({
						color: 'ghost',
						size: 'icon-sm',
						className: 'rounded-sm hover:bg-popover-muted',
					}),
				)}
			>
				<ViewVerticalIcon aria-hidden="true" />
			</SidebarCollapseTrigger>
			<SearchToggle className="rounded-sm hover:bg-popover-muted" hideIfDisabled />
		</div>
	);
}
