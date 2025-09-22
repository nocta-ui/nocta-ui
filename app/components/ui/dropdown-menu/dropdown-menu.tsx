"use client";

import * as Ariakit from "@ariakit/react";
import { cva, type VariantProps } from "class-variance-authority";
import type React from "react";
import { cn } from "@/lib/utils";

const dropdownMenuContentVariants = cva(
	`z-50 overflow-hidden rounded-md border bg-background border-border
   text-primary-muted shadow-sm not-prose
   transform transition-all duration-200 ease-in-out
   origin-top -translate-y-1 opacity-0 scale-95
   data-[enter]:translate-y-0 data-[enter]:opacity-100 data-[enter]:scale-100
   data-[leave]:-translate-y-1 data-[leave]:opacity-0 data-[leave]:scale-95`,
	{
		variants: {
			size: {
				sm: "min-w-[8rem] p-1",
				md: "min-w-[10rem] p-1",
				lg: "min-w-[12rem] p-2",
			},
		},
		defaultVariants: {
			size: "md",
		},
	},
);

const dropdownSubMenuContentVariants = cva(
	`z-50 overflow-hidden rounded-md border bg-background border-border
   text-foreground shadow-sm not-prose transform transition-all duration-200
   origin-top-left -translate-y-1 opacity-0 scale-95
   data-[enter]:translate-y-0 data-[enter]:opacity-100 data-[enter]:scale-100
   data-[leave]:-translate-y-1 data-[leave]:opacity-0 data-[leave]:scale-95`,
	{
		variants: {
			size: {
				sm: "min-w-[7rem] p-1",
				md: "min-w-[8rem] p-1",
				lg: "min-w-[10rem] p-2",
			},
		},
		defaultVariants: {
			size: "md",
		},
	},
);

const dropdownMenuItemVariants = cva(
	`w-full relative flex cursor-pointer select-none items-center rounded-sm px-3 py-2 text-sm
   outline-none transition-colors focus-visible:bg-background-muted
   focus-visible:text-primary aria-disabled:pointer-events-none
   aria-disabled:opacity-50 hover:bg-background-muted hover:text-primary`,
	{
		variants: {
			inset: {
				true: "pl-8",
				false: "",
			},
			destructive: {
				true: "text-error/90 hover:text-error hover:bg-error/10",
				false: "",
			},
		},
		defaultVariants: {
			inset: false,
			destructive: false,
		},
	},
);

export interface DropdownMenuProps {
	children: React.ReactNode;
	className?: string;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
	children,
	className,
}) => {
	const menu = Ariakit.useMenuStore({ animated: true });

	return (
		<Ariakit.MenuProvider store={menu}>
			<div className={cn("not-prose", className)}>{children}</div>
		</Ariakit.MenuProvider>
	);
};

export interface DropdownMenuTriggerProps {
	children: React.ReactNode;
	className?: string;
	disabled?: boolean;
}

export const DropdownMenuTrigger: React.FC<DropdownMenuTriggerProps> = ({
	children,
	className,
	disabled,
}) => {
	const menu = Ariakit.useMenuContext();

	return (
		<Ariakit.MenuButton
			store={menu}
			disabled={disabled}
			className={cn(
				"appearance-none bg-transparent p-0 text-left",
				className,
				disabled && "opacity-50",
			)}
		>
			{children}
		</Ariakit.MenuButton>
	);
};

export const DropdownMenuContent: React.FC<
	{
		children: React.ReactNode;
		className?: string;
	} & VariantProps<typeof dropdownMenuContentVariants>
> = ({ children, className, size }) => (
	<Ariakit.Menu
		portal
		sameWidth
		gutter={4}
		className={cn(dropdownMenuContentVariants({ size }), className)}
	>
		<div className="flex flex-col gap-1">{children}</div>
	</Ariakit.Menu>
);

export const DropdownMenuItem: React.FC<
	{
		children: React.ReactNode;
		className?: string;
		disabled?: boolean;
		inset?: boolean;
		destructive?: boolean;
		onClick?: () => void;
	} & VariantProps<typeof dropdownMenuItemVariants>
> = ({ children, className, disabled, inset, destructive, onClick }) => (
	<Ariakit.MenuItem
		disabled={disabled}
		onClick={onClick}
		className={cn(dropdownMenuItemVariants({ inset, destructive }), className)}
	>
		{children}
	</Ariakit.MenuItem>
);

export const DropdownMenuSeparator: React.FC<{ className?: string }> = ({
	className,
}) => (
	<Ariakit.MenuSeparator
		className={cn("-mx-1 my-1 h-px bg-border-muted", className)}
	/>
);

export const DropdownMenuSub: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const subMenu = Ariakit.useMenuStore({ animated: true });
	return (
		<Ariakit.MenuProvider store={subMenu}>{children}</Ariakit.MenuProvider>
	);
};

export const DropdownMenuSubTrigger: React.FC<
	{
		children: React.ReactNode;
		className?: string;
		disabled?: boolean;
		inset?: boolean;
		destructive?: boolean;
	} & VariantProps<typeof dropdownMenuItemVariants>
> = ({ children, className, disabled, inset, destructive }) => (
	<Ariakit.MenuButton
		disabled={disabled}
		className={cn(dropdownMenuItemVariants({ inset, destructive }), className)}
	>
		<span className="flex-1 flex justify-start items-center">{children}</span>
		<Ariakit.MenuButtonArrow className="ml-2" />
	</Ariakit.MenuButton>
);

export const DropdownMenuSubContent: React.FC<
	{
		children: React.ReactNode;
		className?: string;
	} & VariantProps<typeof dropdownSubMenuContentVariants>
> = ({ children, className, size }) => (
	<Ariakit.Menu
		portal
		className={cn(dropdownSubMenuContentVariants({ size }), className)}
	>
		<div className="flex flex-col gap-1">{children}</div>
	</Ariakit.Menu>
);
