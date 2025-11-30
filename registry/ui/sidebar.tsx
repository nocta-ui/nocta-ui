'use client';

import { Role } from '@ariakit/react';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Icons } from '@/registry/lib/icons';
import { Button } from '@/registry/ui/button';
import { CommandK, type CommandKItem } from '@/registry/ui/command-k';
import { Kbd } from '@/registry/ui/kbd';
import { ScrollArea } from '@/registry/ui/scroll-area';
import { Separator } from '@/registry/ui/separator';
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetSurface,
	SheetTitle,
} from '@/registry/ui/sheet';
import {
	Tooltip,
	TooltipContent,
	type TooltipContentProps,
	type TooltipProps,
	TooltipTrigger,
} from '@/registry/ui/tooltip';

const SIDEBAR_WIDTH = '18rem';
const SIDEBAR_WIDTH_MOBILE = '19rem';
const SIDEBAR_HOVER_ZONE = 12;
const SIDEBAR_MOBILE_SHEET_STYLES = {
	'--sheet-width': SIDEBAR_WIDTH_MOBILE,
	width: 'var(--sheet-width)',
} as React.CSSProperties;
const SIDEBAR_HOVER_ZONE_STYLE = {
	width: SIDEBAR_HOVER_ZONE,
} as React.CSSProperties;

type SidebarMenuItemContextValue = {
	collapsible: boolean;
	open: boolean;
	toggle: () => void;
};

const SidebarMenuItemContext =
	React.createContext<SidebarMenuItemContextValue | null>(null);

const useSidebarMenuItem = () => React.useContext(SidebarMenuItemContext);

type SidebarContextValue = {
	side: 'left' | 'right';
	state: 'expanded' | 'collapsed';
	open: boolean;
	setOpen: (open: boolean | ((open: boolean) => boolean)) => void;
	toggleSidebar: () => void;
	isMobile: boolean;
	openMobile: boolean;
	setOpenMobile: (open: boolean | ((open: boolean) => boolean)) => void;
	isPeeking: boolean;
	startPeek: () => void;
	stopPeek: () => void;
};

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

function useSidebar() {
	const context = React.useContext(SidebarContext);
	if (!context) {
		throw new Error('useSidebar must be used within a SidebarProvider.');
	}

	return context;
}

function useMediaQuery(query: string) {
	const [matches, setMatches] = React.useState(false);

	React.useEffect(() => {
		if (typeof window === 'undefined' || !window.matchMedia) {
			return;
		}

		const mediaQuery = window.matchMedia(query);
		const updateMatches = () => setMatches(mediaQuery.matches);

		updateMatches();
		mediaQuery.addEventListener('change', updateMatches);

		return () => mediaQuery.removeEventListener('change', updateMatches);
	}, [query]);

	return matches;
}

function useIsMobile() {
	return useMediaQuery('(max-width: 768px)');
}

type ControllableStateProps<T> = {
	value?: T | undefined;
	defaultValue: T;
	onChange?: (value: T) => void;
};

function useControllableState<T>({
	value,
	defaultValue,
	onChange,
}: ControllableStateProps<T>) {
	const [internalValue, setInternalValue] = React.useState(defaultValue);
	const isControlled = value !== undefined;
	const currentValue = isControlled ? (value as T) : internalValue;
	const valueRef = React.useRef(currentValue);

	React.useEffect(() => {
		valueRef.current = currentValue;
	}, [currentValue]);

	const setValue = React.useCallback(
		(nextValue: T | ((previous: T) => T)) => {
			const resolvedValue =
				typeof nextValue === 'function'
					? (nextValue as (previous: T) => T)(valueRef.current)
					: nextValue;
			if (!isControlled) {
				setInternalValue(resolvedValue);
			}
			onChange?.(resolvedValue);
		},
		[isControlled, onChange],
	);

	return [currentValue, setValue] as const;
}

function usePeekState(open: boolean, isMobile: boolean) {
	const [isPeeking, setIsPeeking] = React.useState(false);
	const peekTimeoutRef = React.useRef<number | null>(null);

	const clearPeekTimeout = React.useCallback(() => {
		if (peekTimeoutRef.current !== null && typeof window !== 'undefined') {
			window.clearTimeout(peekTimeoutRef.current);
			peekTimeoutRef.current = null;
		}
	}, []);

	const startPeek = React.useCallback(() => {
		if (open || isMobile) {
			return;
		}
		clearPeekTimeout();
		setIsPeeking(true);
	}, [clearPeekTimeout, isMobile, open]);

	const stopPeek = React.useCallback(() => {
		if (open || isMobile) {
			return;
		}
		clearPeekTimeout();
		if (typeof window === 'undefined') {
			setIsPeeking(false);
			return;
		}
		peekTimeoutRef.current = window.setTimeout(() => {
			setIsPeeking(false);
			peekTimeoutRef.current = null;
		}, 150);
	}, [clearPeekTimeout, isMobile, open]);

	React.useEffect(() => {
		return () => clearPeekTimeout();
	}, [clearPeekTimeout]);

	React.useEffect(() => {
		if (open) {
			setIsPeeking(false);
		}
	}, [open]);

	return { isPeeking, startPeek, stopPeek } as const;
}

type SidebarProviderProps = React.ComponentProps<'div'> & {
	side?: 'left' | 'right';
	defaultOpen?: boolean;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
};

function SidebarProvider({
	side = 'left',
	defaultOpen = true,
	open: openProp,
	onOpenChange,
	className,
	children,
	style,
	...props
}: SidebarProviderProps) {
	const isMobile = useIsMobile();
	const [open, setOpen] = useControllableState({
		defaultValue: defaultOpen,
		...(openProp !== undefined ? { value: openProp } : {}),
		...(onOpenChange ? { onChange: onOpenChange } : {}),
	});
	const [openMobile, setOpenMobile] = React.useState(false);
	const { isPeeking, startPeek, stopPeek } = usePeekState(open, isMobile);

	React.useEffect(() => {
		if (!isMobile) {
			setOpenMobile(false);
		}
	}, [isMobile]);

	const toggleSidebar = React.useCallback(() => {
		if (isMobile) {
			setOpenMobile((value) => !value);
			return;
		}
		setOpen((value) => !value);
	}, [isMobile, setOpen]);

	const state = open ? 'expanded' : 'collapsed';

	const contextValue = React.useMemo<SidebarContextValue>(
		() => ({
			side,
			open,
			setOpen,
			toggleSidebar,
			state,
			isMobile,
			openMobile,
			setOpenMobile,
			isPeeking,
			startPeek,
			stopPeek,
		}),
		[
			side,
			open,
			setOpen,
			toggleSidebar,
			state,
			isMobile,
			openMobile,
			startPeek,
			stopPeek,
			isPeeking,
		],
	);

	const providerStyle = React.useMemo(
		() =>
			({
				'--sidebar-width': SIDEBAR_WIDTH,
				'--sidebar-width-mobile': SIDEBAR_WIDTH_MOBILE,
				...style,
			}) as React.CSSProperties,
		[style],
	);

	return (
		<SidebarContext.Provider value={contextValue}>
			<div
				data-slot="sidebar-wrapper"
				data-state={state}
				data-side={side}
				data-peek={isPeeking ? 'true' : 'false'}
				className={cn(
					'group/sidebar-wrapper relative flex min-h-96 w-full',
					className,
				)}
				style={providerStyle}
				{...props}
			>
				{children}
			</div>
		</SidebarContext.Provider>
	);
}

type SidebarProps = React.ComponentProps<'div'> & {
	side?: 'left' | 'right';
};

function Sidebar({
	className,
	children,
	side: sideProp,
	...props
}: SidebarProps) {
	const {
		side: contextSide,
		state,
		isMobile,
		open,
		openMobile,
		setOpenMobile,
		isPeeking,
		startPeek,
		stopPeek,
	} = useSidebar();
	const side = sideProp ?? contextSide;
	const isVisible = open || isPeeking;
	const isFloating = !open;

	if (isMobile) {
		return (
			<SidebarMobileView
				side={side}
				openMobile={openMobile}
				setOpenMobile={setOpenMobile}
			>
				{children}
			</SidebarMobileView>
		);
	}

	return (
		<SidebarDesktopView
			{...props}
			className={className}
			side={side}
			state={state}
			isOpen={open}
			isVisible={isVisible}
			isFloating={isFloating}
			startPeek={startPeek}
			stopPeek={stopPeek}
		>
			{children}
		</SidebarDesktopView>
	);
}

type SidebarMobileViewProps = {
	side: 'left' | 'right';
	openMobile: boolean;
	setOpenMobile: SidebarContextValue['setOpenMobile'];
	children: React.ReactNode;
};

function SidebarMobileView({
	side,
	openMobile,
	setOpenMobile,
	children,
}: SidebarMobileViewProps) {
	return (
		<Sheet open={openMobile} onOpenChange={setOpenMobile}>
			<SheetSurface
				showClose={false}
				side={side}
				style={SIDEBAR_MOBILE_SHEET_STYLES}
			>
				<SheetHeader className="sr-only">
					<SheetTitle>Sidebar</SheetTitle>
					<SheetDescription>Displays the sidebar navigation.</SheetDescription>
				</SheetHeader>
				<SheetContent className="p-0 relative">
					<SidebarTrigger
						floating={false}
						className="absolute right-3 top-3 h-8 w-8 md:flex border-none before:content-none! before:shadow-none!"
					/>
					<div className="flex h-full w-full flex-col overflow-hidden">
						{children}
					</div>
				</SheetContent>
			</SheetSurface>
		</Sheet>
	);
}

type SidebarDesktopViewProps = React.ComponentProps<'div'> & {
	side: 'left' | 'right';
	state: 'expanded' | 'collapsed';
	isOpen: boolean;
	isVisible: boolean;
	isFloating: boolean;
	startPeek: () => void;
	stopPeek: () => void;
};

function SidebarDesktopView({
	className,
	children,
	side,
	state,
	isOpen,
	isVisible,
	isFloating,
	startPeek,
	stopPeek,
	...props
}: SidebarDesktopViewProps) {
	const gapClasses = cn(
		'relative hidden h-full shrink-0 transition-[width] duration-450 ease-smooth md:block',
		isOpen ? 'w-(--sidebar-width)' : 'w-0',
	);
	const hoverZoneClasses = cn(
		'absolute inset-y-0 z-30',
		side === 'left' ? 'left-0' : 'right-0',
	);
	const floatingClasses = isFloating
		? 'top-2 bottom-2 rounded-lg card-highlight'
		: 'inset-y-0 h-full';
	const sidePositionClasses =
		side === 'left'
			? isFloating
				? 'left-2 border'
				: 'left-0 border-r'
			: isFloating
				? 'right-2 border'
				: 'right-0 border-l';
	const hiddenTranslateClasses =
		side === 'left'
			? '-translate-x-[calc(100%+1.5rem)]'
			: 'translate-x-[calc(100%+1.5rem)]';
	const visibilityClasses = isVisible
		? 'pointer-events-auto translate-x-0'
		: cn('pointer-events-none', hiddenTranslateClasses);
	const containerClasses = cn(
		'absolute z-40 flex w-(--sidebar-width) flex-col bg-popover border-border text-foreground transition-[translate,width,transform] duration-450 ease-smooth',
		isVisible &&
			!isFloating &&
			'transition-[translate,width,transform,left,right,top,bottom,border-radius]',
		floatingClasses,
		sidePositionClasses,
		visibilityClasses,
	);

	return (
		<div
			data-slot="sidebar"
			data-state={state}
			data-side={side}
			data-visible={isVisible ? 'true' : 'false'}
			data-floating={isFloating ? 'true' : 'false'}
			aria-hidden={isOpen ? undefined : true}
			className={cn('group/sidebar relative z-50 hidden md:flex', className)}
			{...props}
		>
			<div data-slot="sidebar-gap" className={gapClasses} />
			<div
				data-slot="sidebar-hover-zone"
				className={hoverZoneClasses}
				style={SIDEBAR_HOVER_ZONE_STYLE}
				onPointerEnter={startPeek}
				onPointerLeave={stopPeek}
			/>
			<div
				data-slot="sidebar-container"
				className={containerClasses}
				onPointerEnter={startPeek}
				onPointerLeave={stopPeek}
			>
				<div className="relative flex h-full w-full flex-col">
					<SidebarTrigger
						floating={false}
						className="absolute right-3 top-3 hidden h-8 w-8 md:flex hover:bg-transparent border-none before:content-none! before:shadow-none!"
					/>
					{children}
				</div>
			</div>
		</div>
	);
}

type SidebarTriggerProps = Omit<
	React.ComponentProps<typeof Button>,
	'children'
> & {
	children?: React.ReactNode;
	floating?: boolean;
};

function SidebarTrigger({
	className,
	children,
	floating = true,
	onClick,
	...props
}: SidebarTriggerProps) {
	const { toggleSidebar } = useSidebar();

	return (
		<Button
			type="button"
			variant="icon"
			data-slot="sidebar-trigger"
			className={cn(
				'group/sidebar-trigger cursor-pointer bg-popover text-foreground/70 hover:bg-popover-muted hover:text-foreground border border-border card-highlight',
				floating &&
					'absolute top-4.5 left-4.5 z-20 h-10 w-10 rounded-md shadow-lg',
				className,
			)}
			onClick={(event) => {
				onClick?.(event);
				toggleSidebar();
			}}
			{...props}
		>
			{children ?? <Icons.ViewVertical className="size-5" />}
			<span className="sr-only">Toggle sidebar</span>
		</Button>
	);
}

function SidebarInset({ className, ...props }: React.ComponentProps<'main'>) {
	return (
		<main
			data-slot="sidebar-inset"
			className={cn(
				'relative w-full transition-[padding] duration-450 ease-smooth',
				className,
			)}
			{...props}
		/>
	);
}

type SidebarInputProps = Omit<
	React.ComponentProps<typeof Button>,
	'children' | 'variant' | 'size'
> & {
	items?: CommandKItem[];
	placeholder?: string;
};

function SidebarInput({
	className,
	onClick,
	items = [],
	placeholder = 'Search...',
	disabled,
	...props
}: SidebarInputProps) {
	const [open, setOpen] = React.useState(false);
	const isDisabled = Boolean(disabled);

	return (
		<>
			<Button
				type="button"
				data-slot="sidebar-input"
				size="md"
				variant="ghost"
				disabled={isDisabled}
				onClick={(event) => {
					if (isDisabled) {
						onClick?.(event);
						return;
					}
					onClick?.(event);
					setOpen(true);
				}}
				className={cn(
					'group/sidebar-input h-9 px-3 py-2 w-full justify-start gap-2 rounded-md bg-card hover:bg-card hover:text-foreground/70 text-sm text-foreground/45',
					'border border-border dark:border-none ring-2 ring-card-muted',
					"relative before:content-[''] before:absolute before:inset-0 before:rounded-md before:pointer-events-none",
					'dark:before:shadow-[inset_0_1px_0_rgb(0_0_0/0.1),inset_0_-1px_0_oklch(from_var(--arrow-highlight)_l_c_h/0.6)]',
					isDisabled && 'opacity-50',
					className,
				)}
				{...props}
			>
				<Icons.Search className="size-5 text-foreground/45" />
				<span className="flex-1 truncate text-left">{placeholder}</span>
				<div className="flex gap-1 items-center">
					<Kbd size="md" className="bg-card-muted">
						⌘ K
					</Kbd>
				</div>
			</Button>

			<CommandK items={items} open={open} onOpenChange={setOpen} />
		</>
	);
}

function SidebarHeader({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="sidebar-header"
			className={cn(
				'flex flex-col gap-3 border-b border-border/60 p-4',
				className,
			)}
			{...props}
		/>
	);
}

function SidebarFooter({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="sidebar-footer"
			className={cn(
				'flex flex-col gap-3 bg-[color-mix(in_oklch,var(--color-popover)_70%,var(--color-popover-muted)_30%)] border-t border-border/60 p-4',
				className,
			)}
			{...props}
		/>
	);
}

function SidebarSeparator({
	className,
	...props
}: React.ComponentProps<typeof Separator>) {
	return (
		<Separator
			variant="muted"
			data-slot="sidebar-separator"
			className={cn('my-2', className)}
			{...props}
		/>
	);
}

function SidebarContent({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<ScrollArea type="scroll" className="flex-1">
			<div
				data-slot="sidebar-content"
				className={cn('flex flex-1 flex-col gap-3 p-4', className)}
				{...props}
			/>
		</ScrollArea>
	);
}

function SidebarGroup({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="sidebar-group"
			className={cn('flex w-full min-w-0 flex-col', className)}
			{...props}
		/>
	);
}

function SidebarGroupLabel({
	className,
	asChild = false,
	children,
	...props
}: React.ComponentProps<'div'> & { asChild?: boolean }) {
	const classes = cn(
		'flex h-8 items-center gap-2 px-2 text-xs font-medium uppercase tracking-widest text-foreground/45',
		className,
	);

	if (asChild && React.isValidElement(children)) {
		return (
			<Role
				data-slot="sidebar-group-label"
				className={classes}
				{...props}
				render={children}
			/>
		);
	}

	return (
		<div data-slot="sidebar-group-label" className={classes} {...props}>
			{children}
		</div>
	);
}

function SidebarGroupAction({
	className,
	asChild = false,
	children,
	...props
}: React.ComponentProps<'button'> & { asChild?: boolean }) {
	const classes = cn(
		'absolute top-1/2 -translate-y-1/2 right-2 flex size-6 cursor-pointer items-center justify-center rounded-sm text-foreground/70 hover:bg-popover-muted hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring/50 focus-visible:ring-offset-1 focus-visible:ring-offset-ring-offset/50 focus-visible:outline-none transition-[background-color,color,box-shadow] ease-out-quad duration-100',
		className,
	);

	if (asChild && React.isValidElement(children)) {
		return (
			<Role.button
				data-slot="sidebar-group-action"
				className={classes}
				{...props}
				render={children}
			/>
		);
	}

	return (
		<button
			type="button"
			data-slot="sidebar-group-action"
			className={classes}
			{...props}
		>
			{children}
		</button>
	);
}

function SidebarGroupContent({
	className,
	...props
}: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="sidebar-group-content"
			className={cn('flex flex-col gap-1', className)}
			{...props}
		/>
	);
}

function SidebarMenu({ className, ...props }: React.ComponentProps<'ul'>) {
	return (
		<ul
			data-slot="sidebar-menu"
			className={cn('flex flex-col gap-1', className)}
			{...props}
		/>
	);
}

type SidebarMenuItemProps = React.ComponentProps<'li'> & {
	collapsible?: boolean;
	defaultOpen?: boolean;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
};

function SidebarMenuItem({
	className,
	children,
	collapsible = false,
	defaultOpen = false,
	open: openProp,
	onOpenChange,
	...props
}: SidebarMenuItemProps) {
	const [open, setOpen] = useControllableState({
		defaultValue: defaultOpen,
		...(openProp !== undefined ? { value: openProp } : {}),
		...(onOpenChange ? { onChange: onOpenChange } : {}),
	});

	const toggle = React.useCallback(() => {
		if (!collapsible) return;
		setOpen((previous) => !previous);
	}, [collapsible, setOpen]);

	const contextValue = React.useMemo(() => {
		if (!collapsible) return null;
		return {
			collapsible,
			open,
			toggle,
		};
	}, [collapsible, open, toggle]);

	return (
		<SidebarMenuItemContext.Provider value={contextValue}>
			<li
				data-slot="sidebar-menu-item"
				data-state={collapsible ? (open ? 'open' : 'closed') : undefined}
				data-collapsible={collapsible ? 'true' : undefined}
				className={cn('group/menu-item relative', className)}
				{...props}
			>
				{children}
			</li>
		</SidebarMenuItemContext.Provider>
	);
}

const sidebarNavButtonBaseClasses =
	"cursor-pointer flex w-full items-center bg-transparent border border-transparent justify-start gap-3 rounded-md h-9 px-4 py-2 gap-2 has-[svg:not([data-slot=sidebar-menu-indicator])]:px-3 text-sm text-left [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-5 shrink-0 [&_svg]:shrink-0 font-medium text-foreground/70 focus-visible:ring-1 focus-visible:ring-ring/50 focus-visible:ring-offset-1 focus-visible:ring-offset-ring-offset/50 focus-visible:outline-none transition-[box-shadow] ease-out-quad duration-100";
const sidebarNavSubButtonBaseClasses =
	"cursor-pointer flex w-full items-center justify-start gap-3 bg-transparent border border-transparent rounded-md first:mt-1 h-8 px-3 py-1.5 px-3 gap-1.5 has-[svg]:px-2.5 text-sm text-left [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-5 shrink-0 [&_svg]:shrink-0 font-medium text-foreground/70 focus-visible:ring-1 focus-visible:ring-ring/50 focus-visible:ring-offset-1 focus-visible:ring-offset-ring-offset/50 focus-visible:outline-none transition-[box-shadow] ease-out-quad duration-100";

const sidebarNavButtonStateClasses =
	'relative hover:bg-popover-muted hover:text-foreground data-[active=true]:bg-popover-muted data-[active=true]:text-foreground data-[active=true]:card-highlight dark:data-[active=true]:border-border';
const sidebarMenuButtonBaseClasses = `group/menu-button peer/menu-button ${sidebarNavButtonBaseClasses}`;

type SidebarMenuButtonTooltipProps = {
	content: React.ReactNode;
	delayDuration?: TooltipProps['delayDuration'];
	placement?: TooltipProps['placement'];
	gutter?: TooltipProps['gutter'];
	portal?: TooltipProps['portal'];
	fixed?: TooltipProps['fixed'];
	showArrow?: TooltipProps['showArrow'];
	contentProps?: Omit<TooltipContentProps, 'children'>;
};

type SidebarMenuButtonProps = React.ComponentProps<'button'> & {
	asChild?: boolean;
	isActive?: boolean;
	tooltip?: React.ReactNode | SidebarMenuButtonTooltipProps;
};

function SidebarMenuButton({
	className,
	isActive = false,
	asChild = false,
	children,
	type,
	onClick,
	tooltip,
	...props
}: SidebarMenuButtonProps) {
	const menuItem = useSidebarMenuItem();
	const { state, isMobile } = useSidebar();
	const classes = cn(
		sidebarMenuButtonBaseClasses,
		sidebarNavButtonStateClasses,
		className,
	);
	const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
		onClick?.(event);
		if (!event.defaultPrevented && menuItem?.collapsible) {
			menuItem.toggle();
		}
	};
	const sharedProps = {
		...props,
		className: classes,
		'data-sidebar': 'menu-button',
		'data-slot': 'sidebar-menu-button',
		'data-active': isActive,
		...(menuItem?.collapsible ? { 'aria-expanded': menuItem.open } : {}),
	};

	const indicator = menuItem?.collapsible ? (
		<Icons.ChevronDown
			aria-hidden="true"
			data-state={menuItem.open ? 'open' : 'closed'}
			data-slot="sidebar-menu-indicator"
			className="ml-auto size-4 shrink-0 text-foreground/70 transition-transform duration-300 ease-smooth data-[state=closed]:-rotate-90"
		/>
	) : null;

	const button =
		asChild && React.isValidElement(children) ? (
			<Role.button {...sharedProps} onClick={handleClick} render={children} />
		) : (
			<button type={type ?? 'button'} onClick={handleClick} {...sharedProps}>
				{children}
				{indicator}
			</button>
		);

	const tooltipConfig =
		React.useMemo<SidebarMenuButtonTooltipProps | null>(() => {
			if (!tooltip) return null;
			if (
				React.isValidElement(tooltip) ||
				typeof tooltip === 'string' ||
				typeof tooltip === 'number'
			) {
				return { content: tooltip };
			}
			if (
				typeof tooltip === 'object' &&
				tooltip !== null &&
				'content' in tooltip &&
				tooltip.content !== undefined
			) {
				return tooltip as SidebarMenuButtonTooltipProps;
			}
			return { content: tooltip as React.ReactNode };
		}, [tooltip]);

	if (!tooltipConfig) {
		return button;
	}

	const {
		content,
		delayDuration,
		placement,
		gutter,
		portal,
		fixed,
		showArrow,
		contentProps,
	} = tooltipConfig;
	const { hidden: contentHidden, ...restContentProps } = contentProps ?? {};
	const defaultShouldHide = state !== 'collapsed' || isMobile;
	const shouldSkipTooltip = contentHidden ?? defaultShouldHide;

	if (shouldSkipTooltip) {
		return button;
	}

	return (
		<Tooltip
			delayDuration={delayDuration ?? 400}
			placement={placement ?? 'right'}
			gutter={gutter ?? 4}
			portal={portal ?? true}
			fixed={fixed ?? false}
			showArrow={showArrow ?? true}
		>
			<TooltipTrigger className="w-full">{button}</TooltipTrigger>
			<TooltipContent className="p-1 text-xs rounded" {...restContentProps}>
				{content}
			</TooltipContent>
		</Tooltip>
	);
}

function SidebarMenuAction({
	className,
	showOnHover = false,
	...props
}: React.ComponentProps<'button'> & { showOnHover?: boolean }) {
	return (
		<button
			type="button"
			data-slot="sidebar-menu-action"
			className={cn(
				'absolute z-10 top-1/2 -translate-y-1/2 right-2 flex size-6 cursor-pointer items-center justify-center rounded-sm border border-transparent text-foreground/70 transition-all hover:text-foreground hover:bg-popover-muted',
				showOnHover &&
					'opacity-0 transition-opacity group-hover/menu-item:opacity-100',
				className,
			)}
			{...props}
		/>
	);
}

function SidebarMenuSub({
	className,
	children,
	...props
}: React.ComponentProps<'ul'>) {
	const menuItem = useSidebarMenuItem();
	const isOpen = menuItem?.open ?? true;
	const subRef = React.useRef<HTMLUListElement>(null);
	const [measuredHeight, setMeasuredHeight] = React.useState(0);

	const measureHeight = React.useCallback(() => {
		const element = subRef.current;
		if (!element) return;
		const nextHeight = element.scrollHeight;
		setMeasuredHeight((value) => (value === nextHeight ? value : nextHeight));
	}, []);

	React.useLayoutEffect(() => {
		measureHeight();
	}, [measureHeight]);

	React.useEffect(() => {
		if (typeof window === 'undefined' || !('ResizeObserver' in window)) {
			return;
		}
		const element = subRef.current;
		if (!element) return;
		const resizeObserver = new ResizeObserver(() => measureHeight());
		resizeObserver.observe(element);
		return () => resizeObserver.disconnect();
	}, [measureHeight]);

	const inlineStyles = React.useMemo<React.CSSProperties>(() => {
		const heightValue = `${measuredHeight}px`;
		return {
			'--sidebar-menu-sub-height': heightValue,
			maxHeight: isOpen ? heightValue : '0px',
		};
	}, [isOpen, measuredHeight]);

	return (
		<ul
			ref={subRef}
			data-slot="sidebar-menu-sub"
			data-state={isOpen ? 'open' : 'closed'}
			className={cn(
				'ml-4 pl-2 flex flex-col overflow-hidden border-border transition-[max-height,opacity] duration-300 ease-smooth',
				'relative before:absolute before:left-0 before:top-2 before:bottom-2 before:w-px before:bg-border',
				isOpen
					? 'pointer-events-auto opacity-100'
					: 'pointer-events-none opacity-0',
				className,
			)}
			style={inlineStyles}
			aria-hidden={isOpen ? undefined : true}
			{...props}
		>
			{children}
		</ul>
	);
}

function SidebarMenuSubItem({
	className,
	...props
}: React.ComponentProps<'li'>) {
	return (
		<li
			data-slot="sidebar-menu-sub-item"
			className={cn('group/menu-sub-item relative', className)}
			{...props}
		/>
	);
}

function SidebarMenuSubButton({
	className,
	asChild = false,
	isActive = false,
	children,
	type,
	tabIndex: tabIndexProp,
	tooltip,
	...props
}: React.ComponentProps<'button'> & {
	asChild?: boolean;
	isActive?: boolean;
	tooltip?: React.ReactNode | SidebarMenuButtonTooltipProps;
}) {
	const menuItem = useSidebarMenuItem();
	const { state, isMobile } = useSidebar();
	const classes = cn(
		sidebarNavSubButtonBaseClasses,
		sidebarNavButtonStateClasses,
		className,
	);
	const computedTabIndex =
		tabIndexProp !== undefined
			? tabIndexProp
			: menuItem?.collapsible && !menuItem.open
				? -1
				: undefined;
	const sharedProps = {
		...props,
		className: classes,
		'data-slot': 'sidebar-menu-sub-button',
		'data-active': isActive,
		tabIndex: computedTabIndex,
	};

	const button =
		asChild && React.isValidElement(children) ? (
			<Role.button {...sharedProps} render={children} />
		) : (
			<button type={type ?? 'button'} {...sharedProps}>
				{children}
			</button>
		);

	const tooltipConfig =
		React.useMemo<SidebarMenuButtonTooltipProps | null>(() => {
			if (!tooltip) return null;
			if (
				React.isValidElement(tooltip) ||
				typeof tooltip === 'string' ||
				typeof tooltip === 'number'
			) {
				return { content: tooltip };
			}
			if (
				typeof tooltip === 'object' &&
				tooltip !== null &&
				'content' in tooltip &&
				tooltip.content !== undefined
			) {
				return tooltip as SidebarMenuButtonTooltipProps;
			}
			return { content: tooltip as React.ReactNode };
		}, [tooltip]);

	if (!tooltipConfig) {
		return button;
	}

	const {
		content,
		delayDuration,
		placement,
		gutter,
		portal,
		fixed,
		showArrow,
		contentProps,
	} = tooltipConfig;
	const { hidden: contentHidden, ...restContentProps } = contentProps ?? {};
	const defaultShouldHide = state !== 'collapsed' || isMobile;
	const shouldSkipTooltip = contentHidden ?? defaultShouldHide;

	if (shouldSkipTooltip) {
		return button;
	}

	return (
		<Tooltip
			delayDuration={delayDuration ?? 400}
			placement={placement ?? 'right'}
			gutter={gutter ?? 4}
			portal={portal ?? true}
			fixed={fixed ?? false}
			showArrow={showArrow ?? true}
		>
			<TooltipTrigger className="w-full">{button}</TooltipTrigger>
			<TooltipContent className="p-1 text-xs rounded" {...restContentProps}>
				{content}
			</TooltipContent>
		</Tooltip>
	);
}

export {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupAction,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarInput,
	SidebarInset,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	SidebarProvider,
	SidebarSeparator,
	SidebarTrigger,
	useSidebar,
};
