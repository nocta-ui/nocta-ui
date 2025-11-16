'use client';

import * as Ariakit from '@ariakit/react';
import { cva, type VariantProps } from 'class-variance-authority';
import type { FC, ReactNode } from 'react';
import { cn } from '@/lib/utils';

const menubarVariants = cva(
	'relative inline-flex items-center rounded-md border border-border bg-card p-1 shadow-sm shadow-card',
	{
		variants: {
			size: {
				md: '',
			},
		},
		defaultVariants: {
			size: 'md',
		},
	},
);

const menubarTriggerVariants = cva(
	'inline-flex select-none items-center gap-2 rounded-sm h-7.5 px-3 py-1.5 px-3 gap-1.5 has-[>svg]:px-2.5 text-sm font-medium text-foreground/70 outline-none hover:bg-card-muted hover:text-foreground transition-[background-color,color,box-shadow] ease-out-quad duration-100 focus-visible:ring-1 focus-visible:ring-ring/50 focus-visible:ring-offset-1 focus-visible:ring-offset-ring-offset/50 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
	{
		variants: {
			size: {
				md: 'text-sm',
			},
		},
		defaultVariants: {
			size: 'md',
		},
	},
);

const menubarContentVariants = cva(
	'z-50 min-w-[12rem] origin-top rounded-md border border-border bg-popover shadow-md shadow-card -translate-y-2 scale-95 opacity-0 transition-[translate,opacity,scale] duration-300 ease-smooth data-enter:translate-y-0 data-enter:scale-100 data-enter:opacity-100 data-leave:-translate-y-2 data-leave:scale-95 data-leave:opacity-0',
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
	'z-50 min-w-[10rem] origin-top-left rounded-md border border-border bg-popover shadow-md shadow-card -translate-y-2 scale-95 opacity-0 transition-[translate,opacity,scale] duration-300 ease-smooth data-enter:translate-y-0 data-enter:scale-100 data-enter:opacity-100 data-leave:-translate-y-2 data-leave:scale-95 data-leave:opacity-0',
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
	"flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm [&_svg]:shrink-0 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 gap-2 outline-none text-foreground/70 hover:bg-popover-muted hover:text-foreground focus-visible:bg-popover-muted focus-visible:text-foreground aria-disabled:pointer-events-none aria-disabled:opacity-50",
	{
		variants: {
			inset: {
				true: 'pl-9',
				false: '',
			},
			destructive: {
				true: 'text-destructive/90 hover:bg-destructive/10 hover:text-destructive',
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
	children: ReactNode;
	className?: string;
	size?: VariantProps<typeof menubarVariants>['size'];
}

export const Menubar: FC<MenubarProps> = ({ children, className, size }) => {
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
	children: ReactNode;
}

export const MenubarMenu: FC<MenubarMenuProps> = ({ children }) => {
	const menubar = Ariakit.useMenubarContext();
	const menu = Ariakit.useMenuStore({ menubar: menubar ?? null });

	return <Ariakit.MenuProvider store={menu}>{children}</Ariakit.MenuProvider>;
};

export interface MenubarTriggerProps
	extends VariantProps<typeof menubarTriggerVariants> {
	children: ReactNode;
	className?: string;
	disabled?: boolean;
}

export const MenubarTrigger: FC<MenubarTriggerProps> = ({
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
						open && 'bg-popover-muted text-foreground',
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
	children: ReactNode;
	className?: string;
}

export const MenubarContent: FC<MenubarContentProps> = ({
	children,
	className,
	size,
}) => {
	return (
		<Ariakit.Menu
			portal
			gutter={9}
			className={cn(menubarContentVariants({ size }), className)}
		>
			<div className="flex flex-col">{children}</div>
		</Ariakit.Menu>
	);
};

export interface MenubarItemProps
	extends VariantProps<typeof menubarItemVariants> {
	children: ReactNode;
	className?: string;
	disabled?: boolean;
	onClick?: () => void;
}

export const MenubarItem: FC<MenubarItemProps> = ({
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

export const MenubarSeparator: FC<{ className?: string }> = ({ className }) => (
	<Ariakit.MenuSeparator
		className={cn('-mx-1 my-1 h-px bg-border opacity-60', className)}
	/>
);

export const MenubarSub: FC<{ children: ReactNode }> = ({ children }) => {
	return <Ariakit.MenuProvider>{children}</Ariakit.MenuProvider>;
};

export interface MenubarSubTriggerProps
	extends VariantProps<typeof menubarItemVariants> {
	children: ReactNode;
	className?: string;
	disabled?: boolean;
}

export const MenubarSubTrigger: FC<MenubarSubTriggerProps> = ({
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
	const open = Ariakit.useStoreState(menu, 'open');

	return (
		<Ariakit.MenuItem
			render={
				<Ariakit.MenuButton
					store={menu}
					disabled={Boolean(disabled)}
					className={cn(
						menubarItemVariants({ inset, destructive }),
						open && 'bg-popover-muted text-foreground',
						className,
					)}
				/>
			}
			disabled={Boolean(disabled)}
		>
			<span className="flex flex-1 items-center justify-start [&_svg]:shrink-0 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 gap-2">
				{children}
			</span>
			<Ariakit.MenuButtonArrow className="ml-2" />
		</Ariakit.MenuItem>
	);
};

export interface MenubarSubContentProps
	extends VariantProps<typeof menubarSubContentVariants> {
	children: ReactNode;
	className?: string;
}

export const MenubarSubContent: FC<MenubarSubContentProps> = ({
	children,
	className,
	size,
}) => (
	<Ariakit.Menu
		portal
		className={cn(menubarSubContentVariants({ size }), className)}
	>
		<div className="flex flex-col">{children}</div>
	</Ariakit.Menu>
);
