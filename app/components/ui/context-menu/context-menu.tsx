'use client';

import * as Ariakit from '@ariakit/react';
import { cva, type VariantProps } from 'class-variance-authority';
import type React from 'react';
import { cn } from '@/lib/utils';

const contextMenuContentVariants = cva(
	`not-prose z-50 origin-top -translate-y-1 scale-95 transform overflow-hidden rounded-md border border-border bg-card text-foreground/70 opacity-0 shadow-md transition-all duration-200 ease-in-out data-enter:translate-y-0 data-enter:scale-100 data-enter:opacity-100 data-leave:-translate-y-1 data-leave:scale-95 data-leave:opacity-0`,
	{
		variants: {
			size: {
				sm: 'min-w-[8rem] p-1',
				md: 'min-w-[10rem] p-1',
				lg: 'min-w-[12rem] p-2',
			},
		},
		defaultVariants: {
			size: 'md',
		},
	},
);

const contextSubMenuContentVariants = cva(
	`not-prose z-50 origin-top-left -translate-y-1 scale-95 transform rounded-md border border-border bg-card text-foreground opacity-0 shadow-md transition-all duration-200 data-enter:translate-y-0 data-enter:scale-100 data-enter:opacity-100 data-leave:-translate-y-1 data-leave:scale-95 data-leave:opacity-0 ease-in-out`,
	{
		variants: {
			size: {
				sm: 'min-w-[7rem] p-1',
				md: 'min-w-[8rem] p-1',
				lg: 'min-w-[10rem] p-2',
			},
		},
		defaultVariants: {
			size: 'md',
		},
	},
);

const contextMenuItemVariants = cva(
	`relative flex w-full cursor-pointer items-center rounded-sm px-3 py-2 text-sm transition-colors outline-none select-none hover:bg-card-muted hover:text-foreground focus-visible:bg-card-muted focus-visible:text-foreground aria-disabled:pointer-events-none aria-disabled:opacity-50`,
	{
		variants: {
			inset: {
				true: 'pl-8',
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

export interface ContextMenuProps {
	children: React.ReactNode;
	className?: string;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
	children,
	className,
}) => {
	const menu = Ariakit.useMenuStore({ animated: true });

	return (
		<Ariakit.MenuProvider store={menu}>
			<div className={cn('not-prose', className)}>{children}</div>
		</Ariakit.MenuProvider>
	);
};

export interface ContextMenuTriggerProps {
	children: React.ReactNode;
	className?: string;
	disabled?: boolean;
}

export const ContextMenuTrigger: React.FC<ContextMenuTriggerProps> = ({
	children,
	className,
	disabled,
}) => {
	const menu = Ariakit.useMenuContext();

	return (
		<button
			type="button"
			disabled={disabled}
			onContextMenu={(e) => {
				if (!disabled) {
					e.preventDefault();
					menu?.setAnchorElement(e.currentTarget);
					menu?.show();
				}
			}}
			onKeyDown={(e) => {
				if (disabled) return;
				const isContextKey = e.key === 'ContextMenu';
				const isShiftF10 = e.key === 'F10' && e.shiftKey;
				if (isContextKey || isShiftF10) {
					e.preventDefault();
					menu?.setAnchorElement(e.currentTarget);
					menu?.show();
				}
			}}
			className={cn(
				'appearance-none bg-transparent p-0 text-left',
				className,
				disabled && 'opacity-50',
			)}
		>
			{children}
		</button>
	);
};

export const ContextMenuContent: React.FC<
	{
		children: React.ReactNode;
		className?: string;
		sameWidth?: boolean;
	} & VariantProps<typeof contextMenuContentVariants>
> = ({ children, className, sameWidth = false, size }) => (
	<Ariakit.Menu
		portal
		gutter={4}
		sameWidth={sameWidth}
		className={cn(contextMenuContentVariants({ size }), className)}
	>
		<div className="flex flex-col gap-1">{children}</div>
	</Ariakit.Menu>
);

export const ContextMenuItem: React.FC<
	{
		children: React.ReactNode;
		className?: string;
		disabled?: boolean;
		inset?: boolean;
		destructive?: boolean;
		onClick?: () => void;
	} & VariantProps<typeof contextMenuItemVariants>
> = ({ children, className, disabled, inset, destructive, onClick }) => (
	<Ariakit.MenuItem
		disabled={Boolean(disabled)}
		onClick={onClick}
		className={cn(contextMenuItemVariants({ inset, destructive }), className)}
	>
		{children}
	</Ariakit.MenuItem>
);

export const ContextMenuSeparator: React.FC<{ className?: string }> = ({
	className,
}) => (
	<Ariakit.MenuSeparator
		className={cn('-mx-1 my-1 h-px bg-border opacity-60', className)}
	/>
);

export const ContextMenuSub: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const subMenu = Ariakit.useMenuStore({ animated: true });
	return (
		<Ariakit.MenuProvider store={subMenu}>{children}</Ariakit.MenuProvider>
	);
};

export const ContextMenuSubTrigger: React.FC<
	{
		children: React.ReactNode;
		className?: string;
		disabled?: boolean;
		inset?: boolean;
		destructive?: boolean;
	} & VariantProps<typeof contextMenuItemVariants>
> = ({ children, className, disabled, inset, destructive }) => (
	<Ariakit.MenuButton
		disabled={Boolean(disabled)}
		className={cn(contextMenuItemVariants({ inset, destructive }), className)}
	>
		<span className="flex flex-1 items-center justify-start">{children}</span>
		<Ariakit.MenuButtonArrow className="ml-2" />
	</Ariakit.MenuButton>
);

export const ContextMenuSubContent: React.FC<
	{
		children: React.ReactNode;
		className?: string;
	} & VariantProps<typeof contextSubMenuContentVariants>
> = ({ children, className, size }) => (
	<Ariakit.Menu
		portal
		className={cn(contextSubMenuContentVariants({ size }), className)}
	>
		<div className="flex flex-col gap-1">{children}</div>
	</Ariakit.Menu>
);
