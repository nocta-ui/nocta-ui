'use client';
import type {
	NavigationMenuContentProps,
	NavigationMenuTriggerProps,
} from '@radix-ui/react-navigation-menu';
import { cva, type VariantProps } from 'class-variance-authority';
import Link, { type LinkProps } from 'fumadocs-core/link';
import { useNav } from 'fumadocs-ui/contexts/layout';
import { type ComponentProps, useState } from 'react';
import { cn } from '../../../lib/cn';
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	NavigationMenuViewport,
} from '../../navigation-menu';
import { buttonVariants } from '../../ui/button';
import { BaseLinkItem } from '../shared/index';

const navItemVariants = cva(
	'inline-flex items-center gap-1 p-2 text-foreground/70 transition-all duration-150 ease-basic hover:text-foreground data-[active=true]:text-foreground [&_svg]:size-4',
);

export function Navbar(props: ComponentProps<'div'>) {
	const [value, setValue] = useState('');
	const { isTransparent } = useNav();

	return (
		<NavigationMenu value={value} onValueChange={setValue} asChild>
			<header
				id="nd-nav"
				{...props}
				className={cn(
					'fixed top-(--fd-banner-height) right-(--removed-body-scroll-bar-size,0) left-0 z-40 border-b border-fd-border backdrop-blur-lg transition-colors *:mx-auto *:max-w-fd-container',
					value.length > 0 && 'max-lg:rounded-b-2xl max-lg:shadow-lg',
					(!isTransparent || value.length > 0) && 'bg-background/80',
					props.className,
				)}
			>
				<NavigationMenuList
					className="flex h-14 w-full items-center px-4"
					asChild
				>
					<nav>{props.children}</nav>
				</NavigationMenuList>

				<NavigationMenuViewport />
			</header>
		</NavigationMenu>
	);
}

export const NavbarMenu = NavigationMenuItem;

export function NavbarMenuContent(props: NavigationMenuContentProps) {
	return (
		<NavigationMenuContent
			{...props}
			className={cn(
				'grid grid-cols-1 gap-2 p-4 md:grid-cols-2 lg:grid-cols-3',
				props.className,
			)}
		>
			{props.children}
		</NavigationMenuContent>
	);
}

export function NavbarMenuTrigger(props: NavigationMenuTriggerProps) {
	return (
		<NavigationMenuTrigger
			{...props}
			className={cn(navItemVariants(), 'rounded-md', props.className)}
		>
			{props.children}
		</NavigationMenuTrigger>
	);
}

export function NavbarMenuLink(props: LinkProps) {
	return (
		<NavigationMenuLink asChild>
			<Link
				{...props}
				className={cn(
					'flex flex-col gap-2 rounded-lg border bg-card-muted p-3 transition-all duration-150 hover:bg-foreground/75 hover:text-foreground',
					props.className,
				)}
			>
				{props.children}
			</Link>
		</NavigationMenuLink>
	);
}

const linkVariants = cva('', {
	variants: {
		variant: {
			main: navItemVariants(),
			button: buttonVariants({
				color: 'secondary',
				className: 'gap-1.5 [&_svg]:size-4',
			}),
			icon: buttonVariants({
				color: 'ghost',
				size: 'icon',
			}),
		},
	},
	defaultVariants: {
		variant: 'main',
	},
});

export function NavbarLink({
	item,
	variant,
	...props
}: ComponentProps<typeof BaseLinkItem> & VariantProps<typeof linkVariants>) {
	return (
		<NavigationMenuItem>
			<NavigationMenuLink asChild>
				<BaseLinkItem
					{...props}
					item={item}
					className={cn(linkVariants({ variant }), props.className)}
				>
					{props.children}
				</BaseLinkItem>
			</NavigationMenuLink>
		</NavigationMenuItem>
	);
}
