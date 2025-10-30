'use client';

import * as Ariakit from '@ariakit/react';
import { cva, type VariantProps } from 'class-variance-authority';
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useId,
	useMemo,
	useState,
} from 'react';
import { cn } from '@/lib/utils';

const menubarVariants = cva(
	'not-prose inline-flex items-center gap-1 rounded-md border border-border bg-card p-1 text-sm text-foreground/70 shadow-sm',
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
	'inline-flex select-none items-center gap-2 rounded-sm px-3 py-1.5 text-sm font-medium transition-colors duration-150 ease-out outline-none ring-offset-background hover:bg-card-muted hover:text-foreground focus-visible:border-border focus-visible:ring-1 focus-visible:ring-ring/50 focus-visible:ring-offset-1 focus-visible:ring-offset-ring-offset/50 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
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
	'not-prose z-50 min-w-[12rem] origin-top rounded-md border border-border bg-card text-foreground/70 shadow-md -translate-y-1 scale-95 opacity-0 transition-all duration-150 ease-out data-enter:translate-y-0 data-enter:scale-100 data-enter:opacity-100 data-leave:-translate-y-1 data-leave:scale-95 data-leave:opacity-0 ease-out data-[skip-animation=true]:transition-none data-[skip-animation=true]:duration-0 data-[skip-animation=true]:ease-linear data-[skip-animation=true]:translate-y-0 data-[skip-animation=true]:scale-100 data-[skip-animation=true]:opacity-100',
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
	'not-prose z-50 min-w-[10rem] origin-top-left rounded-md border border-border bg-card text-foreground/70 shadow-md -translate-y-1 scale-95 opacity-0 transition-all duration-150 ease-out data-enter:translate-y-0 data-enter:scale-100 data-enter:opacity-100 data-leave:-translate-y-1 data-leave:scale-95 data-leave:opacity-0 ease-out',
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

interface MenubarAnimationContextValue {
	activeMenuId: string | null;
	setActiveMenuId: (id: string | null) => void;
	skipAnimation: boolean;
	currentSkipToken: symbol | null;
	requestSkipAnimation: () => symbol;
	releaseSkipAnimation: (token: symbol) => void;
}

const MenubarAnimationContext =
	createContext<MenubarAnimationContextValue | null>(null);

interface MenubarMenuContextValue {
	menuId: string;
	skipAnimation: boolean;
}

const MenubarMenuContext = createContext<MenubarMenuContextValue | null>(null);

export const Menubar: React.FC<MenubarProps> = ({
	children,
	className,
	size,
}) => {
	const menubar = Ariakit.useMenubarStore({
		orientation: 'horizontal',
		focusLoop: true,
	});
	const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
	const [skipState, setSkipState] = useState<{
		token: symbol | null;
		active: boolean;
	}>({
		token: null,
		active: false,
	});

	const requestSkipAnimation = useCallback(() => {
		const token = Symbol('menubar-skip-animation');
		setSkipState({ token, active: true });
		return token;
	}, []);

	const releaseSkipAnimation = useCallback((token: symbol) => {
		setSkipState((state) => {
			if (state.token !== token) {
				return state;
			}

			return { token: null, active: false };
		});
	}, []);

	const { active: skipAnimation, token: currentSkipToken } = skipState;

	const animationContextValue = useMemo<MenubarAnimationContextValue>(
		() => ({
			activeMenuId,
			setActiveMenuId,
			skipAnimation,
			currentSkipToken,
			requestSkipAnimation,
			releaseSkipAnimation,
		}),
		[
			activeMenuId,
			currentSkipToken,
			skipAnimation,
			requestSkipAnimation,
			releaseSkipAnimation,
		],
	);

	return (
		<MenubarAnimationContext.Provider value={animationContextValue}>
			<Ariakit.MenubarProvider store={menubar}>
				<Ariakit.Menubar
					store={menubar}
					className={cn(menubarVariants({ size }), className)}
				>
					{children}
				</Ariakit.Menubar>
			</Ariakit.MenubarProvider>
		</MenubarAnimationContext.Provider>
	);
};

export interface MenubarMenuProps {
	children: React.ReactNode;
}

export const MenubarMenu: React.FC<MenubarMenuProps> = ({ children }) => {
	const menubar = Ariakit.useMenubarContext();
	const animation = useContext(MenubarAnimationContext);
	const menu = Ariakit.useMenuStore({ menubar: menubar ?? null });
	const menuId = useId();
	const [skipAnimation, setSkipAnimation] = useState(false);
	const open = Ariakit.useStoreState(menu, 'open');

	useEffect(() => {
		const shouldSkip = animation?.skipAnimation ?? false;
		setSkipAnimation(shouldSkip);
		menu.setState('animated', !shouldSkip);
	}, [animation?.skipAnimation, menu]);

	useEffect(() => {
		if (!animation) {
			return;
		}

		if (open) {
			animation.setActiveMenuId(menuId);
			if (animation.skipAnimation && animation.currentSkipToken) {
				animation.releaseSkipAnimation(animation.currentSkipToken);
			}
			return;
		}

		if (animation.activeMenuId === menuId) {
			animation.setActiveMenuId(null);
		}
	}, [animation, menuId, open]);

	return (
		<Ariakit.MenuProvider store={menu}>
			<MenubarMenuContext.Provider value={{ menuId, skipAnimation }}>
				{children}
			</MenubarMenuContext.Provider>
		</Ariakit.MenuProvider>
	);
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
	const animation = useContext(MenubarAnimationContext);
	const menuContext = useContext(MenubarMenuContext);

	const handlePointerEnter = useCallback(() => {
		if (disabled) {
			return;
		}

		if (!animation || !menuContext) {
			return;
		}

		if (
			animation.activeMenuId &&
			animation.activeMenuId !== menuContext.menuId
		) {
			animation.requestSkipAnimation();
		}
	}, [animation, disabled, menuContext]);

	return (
		<Ariakit.MenuItem
			render={
				<Ariakit.MenuButton
					store={menu}
					disabled={Boolean(disabled)}
					onPointerEnter={handlePointerEnter}
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
}) => {
	const menuContext = useContext(MenubarMenuContext);

	return (
		<Ariakit.Menu
			portal
			gutter={9}
			data-skip-animation={menuContext?.skipAnimation ? 'true' : undefined}
			className={cn(menubarContentVariants({ size }), className)}
		>
			<div className="flex flex-col gap-1">{children}</div>
		</Ariakit.Menu>
	);
};

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
