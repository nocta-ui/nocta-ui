'use client';

import * as Ariakit from '@ariakit/react';
import { cva, type VariantProps } from 'class-variance-authority';
import type React from 'react';
import { cn } from '@/lib/utils';

const menubarVariants = cva(
	'not-prose inline-flex items-center gap-1 rounded-md border border-border bg-card p-1 text-sm text-foreground/70 shadow-sm',
	{
		variants: {
			size: {
				md: 'h-11.5',
			},
		},
		defaultVariants: {
			size: 'md',
		},
	},
);

const menubarTriggerVariants = cva(
	'inline-flex select-none items-center gap-2 rounded-sm px-3 py-1.5 text-sm font-medium transition-colors outline-none ring-offset-background hover:bg-card-muted hover:text-foreground focus-visible:border-border focus-visible:ring-1 focus-visible:ring-ring/50 focus-visible:ring-offset-1 focus-visible:ring-offset-ring-offset/50 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
	{
		variants: {
			size: {
				md: 'h-9 text-sm',
			},
		},
		defaultVariants: {
			size: 'md',
		},
	},
);

const menubarContentVariants = cva(
	'not-prose z-50 min-w-[12rem] origin-top rounded-md border border-border bg-card text-foreground/70 shadow-md -translate-y-1 scale-95 opacity-0 transition-all duration-150 data-enter:translate-y-0 data-enter:scale-100 data-enter:opacity-100 data-leave:-translate-y-1 data-leave:scale-95 data-leave:opacity-0 ease-in-out',
	{
		variants: {
			size: {
				md: 'p-1',
			},
		},
		defaultVariants: {
			size: 'md',
		},
	},
);

const menubarSubContentVariants = cva(
	'not-prose z-50 min-w-[10rem] origin-top-left rounded-md border border-border bg-card text-foreground/70 shadow-md -translate-y-1 scale-95 opacity-0 transition-all duration-150 data-enter:translate-y-0 data-enter:scale-100 data-enter:opacity-100 data-leave:-translate-y-1 data-leave:scale-95 data-leave:opacity-0 ease-in-out',
	{
		variants: {
			size: {
				md: 'p-1',
			},
		},
		defaultVariants: {
			size: 'md',
		},
	},
);

const menubarItemVariants = cva(
	'flex w-full cursor-pointer select-none items-center rounded-sm px-3 py-2 text-sm transition-colors outline-none hover:bg-card-muted hover:text-foreground focus-visible:bg-card-muted focus-visible:text-foreground aria-disabled:pointer-events-none aria-disabled:opacity-50',
	{
		variants: {
			inset: {
				true: 'pl-9',
				false: '',
			},
			destructive: {
				true: 'text-error/90 hover:bg-error/10 hover:text-error',
				false: '',
			},
		},
		defaultVariants: {
			inset: false,
			destructive: false,
		},
	},
);

export interface MenubarProps {
	children: React.ReactNode;
	className?: string;
	size?: VariantProps<typeof menubarVariants>['size'];
}

export const Menubar: React.FC<MenubarProps> = ({
	children,
	className,
	size,
}) => {
	const menubar = Ariakit.useMenubarStore({
		orientation: 'horizontal',
		focusLoop: true,
	});

	return (
		<Ariakit.MenubarProvider store={menubar}>
			<Ariakit.Menubar
				store={menubar}
				className={cn(menubarVariants({ size }), className)}
			>
				{children}
			</Ariakit.Menubar>
		</Ariakit.MenubarProvider>
	);
};

export interface MenubarMenuProps {
	children: React.ReactNode;
}

export const MenubarMenu: React.FC<MenubarMenuProps> = ({ children }) => {
	return <Ariakit.MenuProvider>{children}</Ariakit.MenuProvider>;
};

export interface MenubarTriggerProps
	extends VariantProps<typeof menubarTriggerVariants> {
	children: React.ReactNode;
	className?: string;
	disabled?: boolean;
}

export const MenubarTrigger: React.FC<MenubarTriggerProps> = ({
	children,
	className,
	disabled,
	size,
}) => {
	const menu = Ariakit.useMenuContext();
	if (!menu) {
		throw new Error('MenubarTrigger must be used within a MenubarMenu.');
	}
	const open = Ariakit.useStoreState(menu, 'open');

	return (
		<Ariakit.MenuItem
			render={
				<Ariakit.MenuButton
					store={menu}
					disabled={Boolean(disabled)}
					className={cn(
						menubarTriggerVariants({ size }),
						open && 'bg-card-muted text-foreground',
						className,
					)}
				/>
			}
			disabled={Boolean(disabled)}
		>
			{children}
		</Ariakit.MenuItem>
	);
};

export interface MenubarContentProps
	extends VariantProps<typeof menubarContentVariants> {
	children: React.ReactNode;
	className?: string;
}

export const MenubarContent: React.FC<MenubarContentProps> = ({
	children,
	className,
	size,
}) => (
	<Ariakit.Menu
		portal
		gutter={9}
		className={cn(menubarContentVariants({ size }), className)}
	>
		<div className="flex flex-col gap-1">{children}</div>
	</Ariakit.Menu>
);

export interface MenubarItemProps
	extends VariantProps<typeof menubarItemVariants> {
	children: React.ReactNode;
	className?: string;
	disabled?: boolean;
	onClick?: () => void;
}

export const MenubarItem: React.FC<MenubarItemProps> = ({
	children,
	className,
	disabled,
	inset,
	destructive,
	onClick,
}) => (
	<Ariakit.MenuItem
		disabled={Boolean(disabled)}
		onClick={onClick}
		className={cn(menubarItemVariants({ inset, destructive }), className)}
	>
		{children}
	</Ariakit.MenuItem>
);

export const MenubarSeparator: React.FC<{ className?: string }> = ({
	className,
}) => (
	<Ariakit.MenuSeparator
		className={cn('-mx-1 h-px bg-border opacity-60', className)}
	/>
);

export const MenubarSub: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	return <Ariakit.MenuProvider>{children}</Ariakit.MenuProvider>;
};

export interface MenubarSubTriggerProps
	extends VariantProps<typeof menubarItemVariants> {
	children: React.ReactNode;
	className?: string;
	disabled?: boolean;
}

export const MenubarSubTrigger: React.FC<MenubarSubTriggerProps> = ({
	children,
	className,
	disabled,
	inset,
	destructive,
}) => {
	const menu = Ariakit.useMenuContext();
	if (!menu) {
		throw new Error('MenubarSubTrigger must be used within a MenubarSub.');
	}

	return (
		<Ariakit.MenuItem
			render={
				<Ariakit.MenuButton
					store={menu}
					disabled={Boolean(disabled)}
					className={cn(menubarItemVariants({ inset, destructive }), className)}
				/>
			}
			disabled={Boolean(disabled)}
		>
			<span className="flex flex-1 items-center justify-start">{children}</span>
			<Ariakit.MenuButtonArrow className="ml-2" />
		</Ariakit.MenuItem>
	);
};

export interface MenubarSubContentProps
	extends VariantProps<typeof menubarSubContentVariants> {
	children: React.ReactNode;
	className?: string;
}

export const MenubarSubContent: React.FC<MenubarSubContentProps> = ({
	children,
	className,
	size,
}) => (
	<Ariakit.Menu
		portal
		className={cn(menubarSubContentVariants({ size }), className)}
	>
		<div className="flex flex-col gap-1">{children}</div>
	</Ariakit.Menu>
);
