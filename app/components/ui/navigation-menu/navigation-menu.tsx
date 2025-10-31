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
	'inline-flex h-9 items-center gap-2 rounded-md px-4 text-sm font-medium text-foreground transition-colors duration-150 ease-out ring-offset-background hover:text-foreground focus-visible:bg-card-muted focus-visible:text-foreground focus-visible:ring-1 focus-visible:border-border focus-visible:ring-1 focus-visible:ring-ring/50 focus-visible:ring-offset-1 focus-visible:ring-offset-ring-offset/50 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 data-[expanded=true]:bg-card-muted cursor-pointer',
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
	'not-prose relative z-50 w-[min(32rem,calc(100vw-4rem))] rounded-lg border border-border bg-card text-foreground/70 opacity-0 scale-95 shadow-2xl data-[enter]:translate-y-0 data-[enter]:scale-100 data-[enter]:opacity-100 data-[leave]:translate-y-1 data-[leave]:scale-95 data-[leave]:opacity-0 translate-y-1 transition-all duration-150 ease-out-sine',
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
	'flex last:h-full flex-col items-start gap-1 rounded-md px-4 py-3 text-left text-sm text-foreground/70 transition-colors duration-150 ease-out outline-none hover:bg-card-muted hover:text-foreground focus-visible:border-border focus-visible:ring-1 focus-visible:ring-ring/50 focus-visible:ring-offset-1 focus-visible:ring-offset-ring-offset/50 focus-visible:outline-none data-[focus-visible]:outline-none data-[focus-visible]:bg-card-muted [a&]:cursor-pointer',
);

const navigationMenuGroupVariants = cva('flex flex-col gap-2 items-stretch');

const navigationMenuGroupLabelClass =
	'px-4 text-[10px] uppercase leading-none tracking-widest text-foreground/45';

type MenuPlacement = NonNullable<Ariakit.MenuProviderProps['placement']>;

interface NavigationMenuContextValue {
	registerItem: (id: string) => number;
	setActiveIndex: (index: number) => void;
	resetMotion: () => void;
	commitActiveIndex: (index: number) => void;
	activeIndex: number | null;
	previousIndex: number | null;
	setShift: React.Dispatch<React.SetStateAction<number>>;
	setPlacement: React.Dispatch<React.SetStateAction<MenuPlacement>>;
}

type NavigationMenuMotionVariant =
	| 'from-start'
	| 'from-end'
	| 'to-start'
	| 'to-end';

const NavigationMenuContext =
	React.createContext<NavigationMenuContextValue | null>(null);

function useNavigationMenu(componentName: string): NavigationMenuContextValue {
	const context = React.useContext(NavigationMenuContext);
	if (!context) {
		throw new Error(`${componentName} must be used within a NavigationMenu`);
	}
	return context;
}

const navigationMenuMotionViewportClass = 'relative w-full';
const navigationMenuMotionWrapperClass =
	'w-full [--navigation-menu-motion-duration:150ms] p-4 [--navigation-menu-motion-distance:min(50px,15vw)] md:[--navigation-menu-motion-distance:min(220px,35vw)] data-[state=leave]:fixed data-[state=leave]:inset-0 data-[state=leave]:pointer-events-none data-[motion]:[animation-duration:var(--navigation-menu-motion-duration)] data-[motion]:[animation-timing-function:cubic-bezier(0,0,0.2,1)] data-[motion]:[animation-fill-mode:both] data-[motion]:[will-change:transform,opacity] data-[motion=from-start]:[animation-name:navigation-menu-enter-from-start] data-[motion=from-end]:[animation-name:navigation-menu-enter-from-end] data-[motion=to-start]:[animation-name:navigation-menu-exit-to-start] data-[motion=to-end]:[animation-name:navigation-menu-exit-to-end]';
const NAVIGATION_MENU_MOTION_MS = 150;

type MenuItemRender = Ariakit.MenuItemProps['render'];

const resolveRenderProp = (
	render: MenuItemRender | undefined,
	href?: string,
): MenuItemRender | undefined => {
	if (render) {
		return render;
	}
	if (!href) {
		return undefined;
	}
	return (props: React.ComponentPropsWithoutRef<'a'>) => (
		<a {...props} href={href}>
			{props.children}
		</a>
	);
};

const useDelayedPresence = (isOpen: boolean, delay: number) => {
	const [shouldRender, setShouldRender] = React.useState(isOpen);
	const [isLeaving, setIsLeaving] = React.useState(false);
	const timeoutRef = React.useRef<number | null>(null);

	React.useEffect(() => {
		if (isOpen) {
			if (timeoutRef.current !== null) {
				window.clearTimeout(timeoutRef.current);
				timeoutRef.current = null;
			}
			setShouldRender(true);
			setIsLeaving(false);
			return;
		}

		if (!shouldRender || isLeaving) {
			return;
		}

		setIsLeaving(true);
		timeoutRef.current = window.setTimeout(() => {
			setShouldRender(false);
			setIsLeaving(false);
			timeoutRef.current = null;
		}, delay);
	}, [isOpen, delay, shouldRender, isLeaving]);

	React.useEffect(
		() => () => {
			if (timeoutRef.current !== null) {
				window.clearTimeout(timeoutRef.current);
			}
		},
		[],
	);

	return { shouldRender, isLeaving };
};

type MotionDirection = 'forward' | 'backward' | null;

const resolveMotionDirection = ({
	open,
	isLeaving,
	activeIndex,
	previousIndex,
	itemIndex,
}: {
	open: boolean;
	isLeaving: boolean;
	activeIndex: number | null;
	previousIndex: number | null;
	itemIndex: number;
}): MotionDirection => {
	if (open) {
		const referenceIndex =
			activeIndex !== null && activeIndex !== itemIndex
				? activeIndex
				: previousIndex;
		if (referenceIndex == null || referenceIndex === itemIndex) {
			return null;
		}
		return itemIndex > referenceIndex ? 'forward' : 'backward';
	}

	if (isLeaving) {
		if (activeIndex !== null && activeIndex !== itemIndex) {
			return activeIndex > itemIndex ? 'forward' : 'backward';
		}
		if (previousIndex !== null && previousIndex !== itemIndex) {
			return previousIndex > itemIndex ? 'forward' : 'backward';
		}
	}

	return null;
};

const resolveMotionVariant = (
	direction: MotionDirection,
	open: boolean,
	isLeaving: boolean,
): NavigationMenuMotionVariant | undefined => {
	if (direction === null) {
		return undefined;
	}
	if (open) {
		return direction === 'forward' ? 'from-end' : 'from-start';
	}
	if (isLeaving) {
		return direction === 'forward' ? 'to-start' : 'to-end';
	}
	return undefined;
};

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
	const registeredItems = React.useRef(new Map<string, number>());
	const [activeIndex, setActiveIndexState] = React.useState<number | null>(
		null,
	);
	const [previousIndex, setPreviousIndex] = React.useState<number | null>(null);

	const resetMotion = React.useCallback(() => {
		setActiveIndexState(null);
		setPreviousIndex(null);
	}, []);

	const commitActiveIndex = React.useCallback((index: number) => {
		setPreviousIndex(index);
	}, []);

	const registerItem = React.useCallback((id: string) => {
		const items = registeredItems.current;
		const existingIndex = items.get(id);
		if (existingIndex !== undefined) {
			return existingIndex;
		}
		const nextIndex = items.size;
		items.set(id, nextIndex);
		return nextIndex;
	}, []);

	const setActiveIndex = React.useCallback((index: number) => {
		setActiveIndexState((prev) => {
			if (prev === index) return prev;
			setPreviousIndex(prev);
			return index;
		});
	}, []);

	const navigationMenuContextValue = React.useMemo(
		() => ({
			registerItem,
			setActiveIndex,
			resetMotion,
			commitActiveIndex,
			activeIndex,
			previousIndex,
			setShift,
			setPlacement,
		}),
		[
			registerItem,
			setActiveIndex,
			resetMotion,
			commitActiveIndex,
			activeIndex,
			previousIndex,
		],
	);

	return (
		<Ariakit.Menubar
			ref={ref}
			{...props}
			className={cn(navigationMenuVariants({ size }), className)}
		>
			<NavigationMenuContext.Provider value={navigationMenuContextValue}>
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
						gutter={8}
						unmountOnHide={false}
						wrapperProps={{
							className: cn(
								'[&:has([data-enter])]:transition-[transform] [&:has([data-enter])]:duration-150 ease-out overflow-x-hidden overflow-y-visible',
								panelWrapperClassName,
							),
						}}
						className={cn(
							navigationMenuPanelVariants({ size }),
							panelClassName,
						)}
					></Ariakit.Menu>
				</Ariakit.MenuProvider>
			</NavigationMenuContext.Provider>
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
	const {
		setShift,
		setPlacement,
		registerItem,
		setActiveIndex: setActiveItemIndex,
		resetMotion,
		commitActiveIndex,
		activeIndex,
		previousIndex,
	} = useNavigationMenu('NavigationMenuItem');
	const context = Ariakit.useMenuContext();
	if (!context) {
		throw new Error('NavigationMenuItem must be used within a NavigationMenu');
	}
	const itemId = React.useId();
	const itemIndex = React.useMemo(
		() => registerItem(itemId),
		[registerItem, itemId],
	);
	const menu = Ariakit.useMenuStore({ store: context });
	const parentMenu = Ariakit.useStoreState(menu, 'contentElement');
	const open = Ariakit.useStoreState(
		menu,
		(state) => state.mounted && state.anchorElement === menuButton,
	);
	const { shouldRender: shouldRenderContent, isLeaving } = useDelayedPresence(
		open,
		NAVIGATION_MENU_MOTION_MS,
	);
	const shouldResetMotion = !open && !shouldRenderContent && !isLeaving;
	const motionDirection = resolveMotionDirection({
		open,
		isLeaving,
		activeIndex,
		previousIndex,
		itemIndex,
	});
	const motionVariant = resolveMotionVariant(motionDirection, open, isLeaving);
	const motionState = open ? 'enter' : isLeaving ? 'leave' : undefined;
	const ariaHidden = motionState === 'leave' ? true : undefined;
	const hasChildren = !!children;
	const enterTimeoutRef = React.useRef<number | null>(null);
	const isCurrentItem = activeIndex === itemIndex;

	const clearEnterTimeout = React.useCallback(() => {
		if (enterTimeoutRef.current !== null) {
			window.clearTimeout(enterTimeoutRef.current);
			enterTimeoutRef.current = null;
		}
	}, []);

	const scheduleActiveCommit = React.useCallback(() => {
		clearEnterTimeout();
		enterTimeoutRef.current = window.setTimeout(() => {
			commitActiveIndex(itemIndex);
			enterTimeoutRef.current = null;
		}, NAVIGATION_MENU_MOTION_MS);
	}, [clearEnterTimeout, commitActiveIndex, itemIndex]);

	React.useEffect(() => clearEnterTimeout, [clearEnterTimeout]);

	React.useLayoutEffect(() => {
		if (!open) return;
		setShift(shift);
		setPlacement(placement ?? 'bottom');
		setActiveItemIndex(itemIndex);
	}, [
		open,
		placement,
		setPlacement,
		setShift,
		shift,
		setActiveItemIndex,
		itemIndex,
	]);

	React.useEffect(() => {
		if (!shouldResetMotion) return;
		if (!isCurrentItem) {
			return;
		}
		resetMotion();
	}, [shouldResetMotion, isCurrentItem, resetMotion]);

	React.useEffect(() => {
		if (!open) {
			clearEnterTimeout();
			return;
		}

		if (!isCurrentItem) {
			return;
		}

		if (motionVariant === undefined) {
			commitActiveIndex(itemIndex);
			return;
		}

		scheduleActiveCommit();
	}, [
		open,
		clearEnterTimeout,
		itemIndex,
		motionVariant,
		commitActiveIndex,
		isCurrentItem,
		scheduleActiveCommit,
	]);

	const itemRender = React.useMemo(
		() => resolveRenderProp(render, href),
		[render, href],
	);
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
				!hasChildren && 'hover:bg-card-muted',
				className,
			)}
			{...(itemRender ? { render: itemRender } : {})}
			{...itemProps}
		>
			<span className="flex items-center gap-2">
				{label}
				{hasChildren && (
					<Icons.ChevronDown
						className={cn(
							'ml-1 size-4 transition-transform duration-150 ease-out',
							open && 'rotate-180',
						)}
					/>
				)}
			</span>
		</Ariakit.MenuItem>
	);

	if (!hasChildren) {
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
			{shouldRenderContent && parentMenu && (
				<Ariakit.Portal portalElement={parentMenu}>
					<div
						data-motion={motionVariant}
						data-state={motionState}
						className={navigationMenuMotionViewportClass}
					>
						<div
							data-motion={motionVariant}
							data-state={motionState}
							aria-hidden={ariaHidden}
							className={cn(
								navigationMenuContentLayoutClass,
								navigationMenuMotionWrapperClass,
							)}
						>
							{children}
						</div>
					</div>
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
	const itemRender = React.useMemo(
		() => resolveRenderProp(render, href),
		[render, href],
	);

	return (
		<Ariakit.MenuItem
			ref={ref}
			store={menu}
			tabbable
			focusOnHover={false}
			aria-labelledby={labelId}
			aria-describedby={description ? descriptionId : undefined}
			className={cn(navigationMenuLinkVariants(), className)}
			{...(itemRender ? { render: itemRender } : {})}
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
