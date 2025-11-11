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
	'inline-flex h-9 items-center gap-2 rounded-md px-4 text-sm font-medium text-foreground transition-[background-color,box-shadow] duration-150 ease-basic focus-visible:bg-card-muted focus-visible:ring-1 focus-visible:ring-1 focus-visible:ring-ring/50 focus-visible:ring-offset-1 focus-visible:ring-offset-ring-offset/50 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 data-[expanded=true]:bg-card-muted cursor-pointer',
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
	'not-prose relative z-50 w-[min(32rem,calc(100vw-4rem))] rounded-lg border border-border bg-card text-foreground/70 opacity-0 scale-95 shadow-2xl data-[enter]:translate-y-0 data-[enter]:scale-100 data-[enter]:opacity-100 data-[leave]:scale-95 data-[leave]:-translate-y-2 data-[leave]:opacity-0 -translate-y-2 transition-[translate,opacity,scale]l duration-300 ease-smooth',
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
	'relative flex md:last:h-full flex-col items-start gap-1 rounded-md p-2 text-left text-sm transition-[background-color,box-shadow] duration-150 ease-basic outline-none hover:bg-card-muted focus-visible:ring-1 focus-visible:ring-ring/50 focus-visible:ring-offset-1 focus-visible:ring-offset-ring-offset/50 focus-visible:outline-none data-[focus-visible]:outline-none data-[focus-visible]:bg-card-muted [a&]:cursor-pointer overflow-clip',
);

const navigationMenuGroupVariants = cva('flex flex-col gap-2 items-stretch');

const SetShiftContext = React.createContext<
	React.Dispatch<React.SetStateAction<number>>
>(() => {});

type MenuPlacement = NonNullable<Ariakit.MenuProviderProps['placement']>;

const SetPlacementContext = React.createContext<
	React.Dispatch<React.SetStateAction<MenuPlacement>>
>(() => {});

type MotionAttribute = 'from-start' | 'from-end' | 'to-start' | 'to-end';

interface NavigationMenuMotionPane {
	key: string;
	uid: string;
	index: number;
	phase: 'enter' | 'leave';
	motion: MotionAttribute | null;
	lastDirection: 'start' | 'end' | null;
	content: React.ReactNode;
}

type NavigationMenuOpenAction = {
	type: 'open';
	key: string;
	index: number;
	content: React.ReactNode;
};

type NavigationMenuUpdateAction = {
	type: 'update';
	key: string;
	index: number;
	content: React.ReactNode;
};

type NavigationMenuCloseAction = {
	type: 'close';
	key: string;
};

type NavigationMenuContentAction =
	| NavigationMenuOpenAction
	| NavigationMenuUpdateAction
	| NavigationMenuCloseAction;

interface NavigationMenuContentContextValue {
	dispatch: (action: NavigationMenuContentAction) => void;
}

const NavigationMenuContentContext =
	React.createContext<NavigationMenuContentContextValue | null>(null);

interface NavigationMenuItemOrderContextValue {
	registerItem: (id: string) => number;
	unregisterItem: (id: string) => void;
}

const NavigationMenuItemOrderContext =
	React.createContext<NavigationMenuItemOrderContextValue | null>(null);

const NAVIGATION_MENU_MOTION_DURATION = 450;

const navigationMenuMotionViewportClass =
	'relative w-full overflow-hidden transition-[height] duration-450 ease-smooth [--navigation-menu-motion-duration:450ms] [--navigation-menu-motion-distance:min(550px,35vw)] md:[--navigation-menu-motion-distance:min(250px,35vw)]';

const navigationMenuMotionPaneClass =
	'relative p-2 w-full data-[state=leave]:absolute data-[state=leave]:inset-0 data-[state=leave]:pointer-events-none data-[motion]:[animation-duration:var(--navigation-menu-motion-duration)] data-[motion]:[animation-timing-function:var(--ease-smooth)] data-[motion]:[animation-fill-mode:both] data-[motion]:[will-change:transform,opacity] data-[motion=from-start]:[animation-name:navigation-menu-enter-from-start] data-[motion=from-end]:[animation-name:navigation-menu-enter-from-end] data-[motion=to-start]:[animation-name:navigation-menu-exit-to-start] data-[motion=to-end]:[animation-name:navigation-menu-exit-to-end]';

interface NavigationMenuMotionObserverProps {
	onMenuClose: () => void;
}

function NavigationMenuMotionObserver({
	onMenuClose,
}: NavigationMenuMotionObserverProps) {
	const menu = Ariakit.useMenuContext();
	const mounted = Ariakit.useStoreState(menu, 'mounted');
	const previousMountedRef = React.useRef(mounted);

	React.useEffect(() => {
		if (previousMountedRef.current && !mounted) {
			onMenuClose();
		}
		previousMountedRef.current = mounted;
	}, [mounted, onMenuClose]);

	return null;
}

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
	const [panes, setPanes] = React.useState<NavigationMenuMotionPane[]>([]);
	const itemOrderMapRef = React.useRef(new Map<string, number>());
	const paneIdRef = React.useRef(0);
	const activeKeyRef = React.useRef<string | null>(null);
	const activeIndexRef = React.useRef<number | null>(null);
	const contentRegistryRef = React.useRef(new Map<string, React.ReactNode>());
	const paneRefs = React.useRef(new Map<string, HTMLDivElement>());
	const animationLockTimeoutRef = React.useRef<number | null>(null);
	const isAnimationLockedRef = React.useRef(false);
	const pendingOpenActionRef = React.useRef<NavigationMenuOpenAction | null>(
		null,
	);
	const [animationLockVersion, setAnimationLockVersion] = React.useState(0);
	const [motionViewportHeight, setMotionViewportHeight] = React.useState<
		number | null
	>(null);
	const activePaneUid = React.useMemo(
		() => panes.find((pane) => pane.phase === 'enter')?.uid ?? null,
		[panes],
	);

	React.useLayoutEffect(() => {
		if (!activePaneUid) {
			setMotionViewportHeight(null);
			return;
		}

		const paneElement = paneRefs.current.get(activePaneUid);
		if (!paneElement) {
			return;
		}

		const updateHeight = () => {
			setMotionViewportHeight(paneElement.offsetHeight);
		};

		updateHeight();

		if (typeof ResizeObserver === 'undefined') {
			return;
		}

		const observer = new ResizeObserver(() => {
			updateHeight();
		});

		observer.observe(paneElement);

		return () => {
			observer.disconnect();
		};
	}, [activePaneUid]);

	const handleAnimationLockCompletion = React.useCallback(() => {
		if (animationLockTimeoutRef.current) {
			window.clearTimeout(animationLockTimeoutRef.current);
			animationLockTimeoutRef.current = null;
		}

		if (!isAnimationLockedRef.current) {
			return;
		}

		isAnimationLockedRef.current = false;
		setAnimationLockVersion((version) => version + 1);
	}, []);

	const startAnimationLock = React.useCallback(() => {
		if (animationLockTimeoutRef.current) {
			window.clearTimeout(animationLockTimeoutRef.current);
		}

		isAnimationLockedRef.current = true;
		animationLockTimeoutRef.current = window.setTimeout(() => {
			handleAnimationLockCompletion();
		}, NAVIGATION_MENU_MOTION_DURATION);
	}, [handleAnimationLockCompletion]);

	const resetMotionState = React.useCallback(() => {
		activeKeyRef.current = null;
		activeIndexRef.current = null;
		contentRegistryRef.current.clear();
		pendingOpenActionRef.current = null;
		setPanes([]);
		handleAnimationLockCompletion();
	}, [handleAnimationLockCompletion]);

	const makePane = React.useCallback(
		(
			pane: Omit<NavigationMenuMotionPane, 'uid'>,
		): NavigationMenuMotionPane => ({
			...pane,
			uid: `navigation-pane-${paneIdRef.current++}`,
		}),
		[],
	);

	const registerItem = React.useCallback((id: string) => {
		const map = itemOrderMapRef.current;
		if (!map.has(id)) {
			map.set(id, map.size);
		}
		return map.get(id) ?? 0;
	}, []);

	const unregisterItem = React.useCallback((id: string) => {
		const map = itemOrderMapRef.current;

		if (!map.has(id)) return;

		const removedIndex = map.get(id);
		if (removedIndex === undefined) return;

		map.delete(id);

		for (const [key, value] of map.entries()) {
			if (value > removedIndex) {
				map.set(key, value - 1);
			}
		}
	}, []);

	const handlePaneAnimationEnd = React.useCallback((paneUid: string) => {
		setPanes((prev) =>
			prev.filter((pane) => !(pane.phase === 'leave' && pane.uid === paneUid)),
		);
	}, []);

	const dispatchContentAction = React.useCallback(
		(action: NavigationMenuContentAction) => {
			if (action.type === 'update') {
				contentRegistryRef.current.set(action.key, action.content);
				setPanes((prev) =>
					prev.map((pane) =>
						pane.key === action.key
							? { ...pane, content: action.content, index: action.index }
							: pane,
					),
				);
				return;
			}

			if (action.type === 'close') {
				contentRegistryRef.current.delete(action.key);
				setPanes((prev) => prev.filter((pane) => pane.key !== action.key));
				return;
			}

			const isSameTarget =
				activeKeyRef.current === action.key ||
				activeIndexRef.current === action.index;

			if (isAnimationLockedRef.current && !isSameTarget) {
				pendingOpenActionRef.current = action;
				return;
			}

			contentRegistryRef.current.set(action.key, action.content);
			const previousKey = activeKeyRef.current;
			const previousIndex = activeIndexRef.current;
			const motionAttributes = getMotionAttributes(previousIndex, action.index);
			activeKeyRef.current = action.key;
			activeIndexRef.current = action.index;

			setPanes((prev) => {
				const { enterMotion, leaveMotion } = motionAttributes;

				const leavingPanes = prev.filter(
					(pane) =>
						pane.phase === 'leave' &&
						pane.key !== previousKey &&
						pane.key !== action.key,
				);
				const nextPanes: NavigationMenuMotionPane[] = [...leavingPanes];

				if (
					previousKey &&
					previousKey !== action.key &&
					previousIndex !== null &&
					leaveMotion
				) {
					const previousContent =
						prev.find(
							(pane) => pane.key === previousKey && pane.phase === 'enter',
						)?.content ??
						contentRegistryRef.current.get(previousKey) ??
						null;

					if (previousContent) {
						nextPanes.push(
							makePane({
								key: previousKey,
								index: previousIndex,
								phase: 'leave',
								content: previousContent,
								motion: leaveMotion,
								lastDirection:
									leaveMotion === 'to-end'
										? 'end'
										: leaveMotion === 'to-start'
											? 'start'
											: null,
							}),
						);
					}
				}

				nextPanes.push(
					makePane({
						key: action.key,
						index: action.index,
						phase: 'enter',
						content: action.content,
						motion: enterMotion,
						lastDirection:
							enterMotion === 'from-end'
								? 'end'
								: enterMotion === 'from-start'
									? 'start'
									: null,
					}),
				);

				return nextPanes;
			});

			if (
				motionAttributes.enterMotion !== null ||
				motionAttributes.leaveMotion !== null
			) {
				startAnimationLock();
			}
		},
		[makePane, startAnimationLock],
	);

	const orderContextValue = React.useMemo(
		() => ({
			registerItem,
			unregisterItem,
		}),
		[registerItem, unregisterItem],
	);

	const contentContextValue = React.useMemo(
		() => ({
			dispatch: dispatchContentAction,
		}),
		[dispatchContentAction],
	);

	React.useEffect(() => {
		// Touch the version so lint understands the dependency is intentional.
		void animationLockVersion;

		if (isAnimationLockedRef.current) {
			return;
		}

		const pendingAction = pendingOpenActionRef.current;
		if (!pendingAction) {
			return;
		}

		pendingOpenActionRef.current = null;
		dispatchContentAction(pendingAction);
	}, [animationLockVersion, dispatchContentAction]);

	React.useEffect(() => {
		return () => {
			if (animationLockTimeoutRef.current) {
				window.clearTimeout(animationLockTimeoutRef.current);
			}
		};
	}, []);

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
						<NavigationMenuItemOrderContext.Provider value={orderContextValue}>
							<NavigationMenuContentContext.Provider
								value={contentContextValue}
							>
								<NavigationMenuMotionObserver onMenuClose={resetMotionState} />
								{children}
								<Ariakit.Menu
									portal
									shift={shift}
									tabIndex={-1}
									unmountOnHide
									wrapperProps={{
										className: cn(
											'[&:has([data-enter])]:transition-[transform] [&:has([data-enter])]:duration-450 ease-smooth',
											panelWrapperClassName,
										),
									}}
									className={cn(
										navigationMenuPanelVariants({ size }),
										panelClassName,
									)}
								>
									<div
										className={navigationMenuMotionViewportClass}
										style={
											motionViewportHeight === null
												? undefined
												: { height: motionViewportHeight }
										}
									>
										{panes.map((pane) => (
											<div
												key={pane.uid}
												data-motion={pane.motion ?? undefined}
												data-state={pane.phase === 'enter' ? 'open' : 'leave'}
												className={navigationMenuMotionPaneClass}
												ref={(node) => {
													if (node) {
														paneRefs.current.set(pane.uid, node);
													} else {
														paneRefs.current.delete(pane.uid);
													}
												}}
												onAnimationEnd={(event) => {
													if (
														pane.phase === 'leave' &&
														event.currentTarget === event.target
													) {
														handlePaneAnimationEnd(pane.uid);
													}
												}}
											>
												<div className={navigationMenuContentLayoutClass}>
													{pane.content}
												</div>
											</div>
										))}
									</div>
									<Ariakit.MenuArrow
										className={cn('transition-[left]', arrowClassName)}
									/>
								</Ariakit.Menu>
							</NavigationMenuContentContext.Provider>
						</NavigationMenuItemOrderContext.Provider>
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
	const contentContext = React.useContext(NavigationMenuContentContext);
	const itemOrderContext = React.useContext(NavigationMenuItemOrderContext);
	if (!context || !contentContext || !itemOrderContext) {
		throw new Error('NavigationMenuItem must be used within a NavigationMenu');
	}
	const itemId = React.useId();
	const [itemIndex] = React.useState(() =>
		itemOrderContext.registerItem(itemId),
	);
	React.useEffect(() => {
		return () => {
			itemOrderContext.unregisterItem(itemId);
		};
	}, [itemOrderContext, itemId]);
	const menu = Ariakit.useMenuStore({ store: context });
	const open = Ariakit.useStoreState(
		menu,
		(state) => state.mounted && state.anchorElement === menuButton,
	);

	React.useLayoutEffect(() => {
		if (!open) return;
		setShift(shift);
		setPlacement(placement ?? 'bottom');
	}, [open, placement, setPlacement, setShift, shift]);

	React.useLayoutEffect(() => {
		if (!open) return;
		contentContext.dispatch({
			type: 'open',
			key: itemId,
			index: itemIndex,
			content: children ?? null,
		});
	}, [open, contentContext, itemId, itemIndex, children]);

	React.useLayoutEffect(() => {
		if (!open) return;
		contentContext.dispatch({
			type: 'update',
			key: itemId,
			index: itemIndex,
			content: children ?? null,
		});
	}, [children, open, contentContext, itemId, itemIndex]);

	React.useEffect(() => {
		return () => {
			contentContext.dispatch({ type: 'close', key: itemId });
		};
	}, [contentContext, itemId]);

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
				!children && 'hover:bg-card-muted',
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
							'ml-1 size-4 transition-transform duration-150 ease-basic',
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
		</Ariakit.MenuProvider>
	);
});

NavigationMenuItem.displayName = 'NavigationMenuItem';

export interface NavigationMenuLinkProps
	extends Omit<Ariakit.MenuItemProps, 'children'> {
	label?: React.ReactNode;
	description?: React.ReactNode;
	href?: string;
	className?: string;
	children?: React.ReactNode;
}

export const NavigationMenuLink = React.forwardRef<
	HTMLDivElement,
	NavigationMenuLinkProps
>(function NavigationMenuLink(
	{ label, description, href, className, children, render, ...props },
	ref,
) {
	const menu = Ariakit.useMenuContext();
	if (!menu) {
		throw new Error('NavigationMenuLink must be used within a NavigationMenu');
	}
	const id = React.useId();
	const labelId = `${id}-label`;
	const descriptionId = `${id}-description`;
	const hasCustomChildren = React.useMemo(
		() => React.Children.count(children) > 0,
		[children],
	);

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
			aria-labelledby={!hasCustomChildren ? labelId : undefined}
			aria-describedby={
				!hasCustomChildren && description ? descriptionId : undefined
			}
			className={cn(navigationMenuLinkVariants(), className)}
			{...renderProps}
			{...props}
		>
			{hasCustomChildren ? (
				children
			) : (
				<>
					<span
						id={labelId}
						className="text-sm font-medium leading-none text-foreground"
					>
						{label}
					</span>
					{description && (
						<span
							id={descriptionId}
							className="text-sm text-foreground/70 line-clamp-2 leading-snug"
						>
							{description}
						</span>
					)}
				</>
			)}
		</Ariakit.MenuItem>
	);
});

NavigationMenuLink.displayName = 'NavigationMenuLink';

export interface NavigationMenuGroupProps
	extends Ariakit.MenuGroupProps,
		VariantProps<typeof navigationMenuGroupVariants> {
	className?: string;
}

export const NavigationMenuGroup = React.forwardRef<
	HTMLDivElement,
	NavigationMenuGroupProps
>(function NavigationMenuGroup({ className, children, ...props }, ref) {
	return (
		<Ariakit.MenuGroup
			ref={ref}
			{...props}
			className={cn(navigationMenuGroupVariants(), className)}
		>
			{children}
		</Ariakit.MenuGroup>
	);
});

NavigationMenuGroup.displayName = 'NavigationMenuGroup';

function getMotionAttributes(
	prevIndex: number | null,
	nextIndex: number,
): {
	enterMotion: MotionAttribute | null;
	leaveMotion: MotionAttribute | null;
} {
	if (prevIndex === null || prevIndex === nextIndex) {
		return { enterMotion: null, leaveMotion: null };
	}

	return prevIndex < nextIndex
		? { enterMotion: 'from-end', leaveMotion: 'to-start' }
		: { enterMotion: 'from-start', leaveMotion: 'to-end' };
}
