'use client';

import * as Ariakit from '@ariakit/react';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { Icons } from '@/app/components/ui/icons/icons';
import { cn } from '@/lib/utils';

const navigationMenuVariants = cva(
	'not-prose inline-flex h-11 items-center gap-1 px-2 text-sm text-foreground/70',
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

const navigationMenuTriggerVariants = cva(
	'inline-flex h-9 items-center gap-2 rounded-md px-4 text-sm font-medium text-foreground/70 transition-colors duration-200 ease-in-out ring-offset-background hover:text-foreground focus-visible:bg-card-muted focus-visible:text-foreground focus-visible:ring-1 focus-visible:border-border focus-visible:ring-1 focus-visible:ring-ring/50 focus-visible:ring-offset-1 focus-visible:ring-offset-ring-offset/50 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 data-[expanded=true]:bg-card-muted data-[expanded=true]:text-foreground cursor-pointer',
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

const navigationMenuPanelVariants = cva(
	'not-prose relative z-50 w-[min(32rem,calc(100vw-4rem))] rounded-lg border border-border bg-card p-4 text-foreground/70 opacity-0 shadow-2xl data-[enter]:translate-y-0 data-[enter]:opacity-100 data-[leave]:translate-y-1 data-[leave]:opacity-0 translate-y-1 transition-all duration-200 ease-in-out',
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

const navigationMenuContentLayoutClass =
	'flex flex-col gap-3 [&:has([role=group])]:grid [&:has([role=group])]:gap-2 [&:has([role=group])]:grid-cols-1 md:[&:has([role=group])]:grid-cols-2';

const navigationMenuLinkVariants = cva(
	'flex flex-col items-start gap-1 rounded-md px-4 py-3 text-left text-sm text-foreground/70 transition-colors duration-200 ease-in-out outline-none hover:bg-card-muted hover:text-foreground focus-visible:border-border focus-visible:ring-1 focus-visible:ring-ring/50 focus-visible:ring-offset-1 focus-visible:ring-offset-ring-offset/50 focus-visible:outline-none data-[focus-visible]:outline-none [a&]:cursor-pointer',
);

const navigationMenuGroupVariants = cva('flex flex-col gap-2 items-stretch');

const navigationMenuGroupLabelClass =
	'px-4 text-xs uppercase tracking-widest text-foreground/45';

const SetShiftContext = React.createContext<
	React.Dispatch<React.SetStateAction<number>>
>(() => {});

type MenuPlacement = NonNullable<Ariakit.MenuProviderProps['placement']>;

const SetPlacementContext = React.createContext<
	React.Dispatch<React.SetStateAction<MenuPlacement>>
>(() => {});

export interface NavigationMenuProps
	extends Omit<Ariakit.MenubarProps, 'className' | 'children'>,
		VariantProps<typeof navigationMenuVariants> {
	children: React.ReactNode;
	className?: string;
	panelClassName?: string;
	panelWrapperClassName?: string;
	arrowClassName?: string;
}

export const NavigationMenu = React.forwardRef<
	HTMLDivElement,
	NavigationMenuProps
>(function NavigationMenu(
	{
		children,
		className,
		size,
		panelClassName,
		panelWrapperClassName,
		arrowClassName,
		...props
	},
	ref,
) {
	const [shift, setShift] = React.useState(0);
	const [placement, setPlacement] = React.useState<MenuPlacement>('bottom');

	return (
		<Ariakit.Menubar
			ref={ref}
			{...props}
			className={cn(navigationMenuVariants({ size }), className)}
		>
			<SetShiftContext.Provider value={setShift}>
				<SetPlacementContext.Provider value={setPlacement}>
					<Ariakit.MenuProvider
						placement={placement}
						showTimeout={100}
						hideTimeout={250}
					>
						{children}
						<Ariakit.Menu
							portal
							shift={shift}
							tabIndex={-1}
							unmountOnHide
							wrapperProps={{
								className: cn(
									'[&:has([data-enter])]:transition-[transform] [&:has([data-enter])]:duration-200',
									panelWrapperClassName,
								),
							}}
							className={cn(
								navigationMenuPanelVariants({ size }),
								panelClassName,
							)}
						>
							<Ariakit.MenuArrow
								className={cn('transition-[left]', arrowClassName)}
							/>
						</Ariakit.Menu>
					</Ariakit.MenuProvider>
				</SetPlacementContext.Provider>
			</SetShiftContext.Provider>
		</Ariakit.Menubar>
	);
});

NavigationMenu.displayName = 'NavigationMenu';

export interface NavigationMenuItemProps
	extends Omit<Ariakit.MenuItemProps, 'children'>,
		VariantProps<typeof navigationMenuTriggerVariants> {
	label: React.ReactNode;
	href?: string;
	shift?: number;
	placement?: Ariakit.MenuStoreProps['placement'];
	children?: React.ReactNode;
	className?: string;
}

export const NavigationMenuItem = React.forwardRef<
	HTMLDivElement,
	NavigationMenuItemProps
>(function NavigationMenuItem(
	{
		label,
		children,
		className,
		href,
		shift = 0,
		placement = 'bottom',
		size,
		render,
		...itemProps
	},
	ref,
) {
	const [menuButton, setMenuButton] = React.useState<HTMLDivElement | null>(
		null,
	);
	const setShift = React.useContext(SetShiftContext);
	const setPlacement = React.useContext(SetPlacementContext);
	const context = Ariakit.useMenuContext();
	if (!context) {
		throw new Error('NavigationMenuItem must be used within a NavigationMenu');
	}
	const menu = Ariakit.useMenuStore({ store: context });
	const parentMenu = Ariakit.useStoreState(menu, 'contentElement');
	const open = Ariakit.useStoreState(
		menu,
		(state) => state.mounted && state.anchorElement === menuButton,
	);

	React.useLayoutEffect(() => {
		if (!open) return;
		setShift(shift);
		setPlacement(placement ?? 'bottom');
	}, [open, placement, setPlacement, setShift, shift]);

	const renderElement =
		render ??
		(href
			? (props: React.ComponentPropsWithoutRef<'a'>) => (
					<a {...props} href={href}>
						{props.children}
					</a>
				)
			: undefined);

	const renderProps = renderElement ? { render: renderElement } : {};
	const storeForItem = menu.menubar ?? menu;

	const item = (
		<Ariakit.MenuItem
			ref={ref}
			store={storeForItem}
			tabbable
			blurOnHoverEnd={false}
			data-expanded={open ? 'true' : undefined}
			className={cn(
				navigationMenuTriggerVariants({ size }),
				open && 'bg-card-muted text-foreground',
				className,
			)}
			{...renderProps}
			{...itemProps}
		>
			<span className="flex items-center gap-2">
				{label}
				{!!children && (
					<Icons.ChevronDown
						className={cn(
							'ml-1 size-4 transition-transform duration-200',
							open && 'rotate-180',
						)}
					/>
				)}
			</span>
		</Ariakit.MenuItem>
	);

	if (!children) {
		return item;
	}

	return (
		<Ariakit.MenuProvider store={menu} parent={null}>
			<Ariakit.MenuButton
				ref={setMenuButton}
				showOnHover
				render={item}
				onFocusVisible={(event) => {
					menu.setDisclosureElement(event.currentTarget);
					menu.setAnchorElement(event.currentTarget);
					menu.show();
				}}
				toggleOnClick={() => {
					if (href) return false;
					menu.show();
					return false;
				}}
			/>
			{open && parentMenu && (
				<Ariakit.Portal
					className={navigationMenuContentLayoutClass}
					portalElement={parentMenu}
				>
					{children}
				</Ariakit.Portal>
			)}
		</Ariakit.MenuProvider>
	);
});

NavigationMenuItem.displayName = 'NavigationMenuItem';

export interface NavigationMenuLinkProps
	extends Omit<Ariakit.MenuItemProps, 'children'> {
	label: React.ReactNode;
	description?: React.ReactNode;
	href?: string;
	className?: string;
}

export const NavigationMenuLink = React.forwardRef<
	HTMLDivElement,
	NavigationMenuLinkProps
>(function NavigationMenuLink(
	{ label, description, href, className, render, ...props },
	ref,
) {
	const menu = Ariakit.useMenuContext();
	if (!menu) {
		throw new Error('NavigationMenuLink must be used within a NavigationMenu');
	}
	const id = React.useId();
	const labelId = `${id}-label`;
	const descriptionId = `${id}-description`;
	const renderElement =
		render ??
		(href
			? (props: React.ComponentPropsWithoutRef<'a'>) => (
					<a {...props} href={href}>
						{props.children}
					</a>
				)
			: undefined);

	const renderProps = renderElement ? { render: renderElement } : {};

	return (
		<Ariakit.MenuItem
			ref={ref}
			store={menu}
			tabbable
			focusOnHover={false}
			aria-labelledby={labelId}
			aria-describedby={description ? descriptionId : undefined}
			className={cn(navigationMenuLinkVariants(), className)}
			{...renderProps}
			{...props}
		>
			<span id={labelId} className="text-sm font-medium text-foreground">
				{label}
			</span>
			{description && (
				<span id={descriptionId} className="text-xs text-foreground/70">
					{description}
				</span>
			)}
		</Ariakit.MenuItem>
	);
});

NavigationMenuLink.displayName = 'NavigationMenuLink';

export interface NavigationMenuGroupProps
	extends Ariakit.MenuGroupProps,
		VariantProps<typeof navigationMenuGroupVariants> {
	label?: React.ReactNode;
	className?: string;
	labelClassName?: string;
}

export const NavigationMenuGroup = React.forwardRef<
	HTMLDivElement,
	NavigationMenuGroupProps
>(function NavigationMenuGroup(
	{ label, className, labelClassName, children, ...props },
	ref,
) {
	return (
		<Ariakit.MenuGroup
			ref={ref}
			{...props}
			className={cn(navigationMenuGroupVariants(), className)}
		>
			{label && (
				<Ariakit.MenuGroupLabel
					className={cn(navigationMenuGroupLabelClass, labelClassName)}
				>
					{label}
				</Ariakit.MenuGroupLabel>
			)}
			{children}
		</Ariakit.MenuGroup>
	);
});

NavigationMenuGroup.displayName = 'NavigationMenuGroup';
