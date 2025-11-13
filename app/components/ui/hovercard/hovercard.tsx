'use client';

import * as Ariakit from '@ariakit/react';
import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';
import { cn } from '@/lib/utils';

const hovercardTriggerVariants = cva(
	"not-prose inline-flex cursor-pointer items-center justify-center rounded-md border shadow-sm [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 transition-[background-color,box-shadow] duration-150 ease-basic focus-visible:ring-1 focus-visible:ring-ring/50 focus-visible:ring-offset-1 focus-visible:ring-offset-ring-offset/50 focus-visible:outline-none",
	{
		variants: {
			variant: {
				default: 'bg-card hover:bg-card-muted border-border text-foreground',
			},
			size: {
				sm: 'h-8 px-3 py-1.5 gap-1.5 has-[>svg]:px-2.5 text-sm',
				md: 'h-9 px-4 py-2 gap-2 has-[>svg]:px-3 text-sm',
				lg: 'h-10 px-6 py-2 gap-2 has-[>svg]:px-4 text-base',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'md',
		},
	},
);

const hovercardContentVariants = cva(
	'not-prose relative w-fit rounded-lg border border-border bg-card-muted text-foreground shadow-md',
	{
		variants: {
			variant: {
				default: '',
			},
			size: {
				sm: 'px-3 py-2 text-sm',
				md: 'px-4 py-3 text-sm',
				lg: 'px-6 py-4 text-base',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'md',
		},
	},
);

const hovercardMotion =
	'duration-300 ease-smooth transition-[translate,opacity,scale] opacity-0 scale-95 -translate-y-2 data-enter:opacity-100 data-enter:scale-100 data-enter:translate-y-0 data-leave:opacity-0 data-leave:scale-95 data-leave:-translate-y-2';

type HovercardPlacement =
	| 'top'
	| 'top-start'
	| 'top-end'
	| 'bottom'
	| 'bottom-start'
	| 'bottom-end'
	| 'left'
	| 'left-start'
	| 'left-end'
	| 'right'
	| 'right-start'
	| 'right-end';

type HovercardIntentHandler = boolean | ((event: MouseEvent) => boolean);

export interface HovercardProps {
	children: React.ReactNode;
	open?: boolean;
	placement?: HovercardPlacement;
	defaultOpen?: boolean;
	timeout?: number;
	openDelay?: number;
	closeDelay?: number;
	onOpenChange?: (open: boolean) => void;
}

export interface HovercardTriggerProps
	extends VariantProps<typeof hovercardTriggerVariants> {
	children: React.ReactNode;
	asChild?: boolean;
	className?: string;
}

export interface HovercardContentProps
	extends VariantProps<typeof hovercardContentVariants> {
	children: React.ReactNode;
	className?: string;
	portal?: boolean;
	fixed?: boolean;
	gutter?: number;
	showArrow?: boolean;
	hideOnHoverOutside?: HovercardIntentHandler;
	disablePointerEventsOnApproach?: HovercardIntentHandler;
	autoFocusOnShow?: boolean;
}

export type HovercardHeadingProps = React.ComponentPropsWithoutRef<
	typeof Ariakit.HovercardHeading
>;

export type HovercardDescriptionProps = React.ComponentPropsWithoutRef<
	typeof Ariakit.HovercardDescription
>;

type HovercardHeadingElement = React.ComponentRef<
	typeof Ariakit.HovercardHeading
>;
type HovercardDescriptionElement = React.ComponentRef<
	typeof Ariakit.HovercardDescription
>;

const HovercardStoreContext =
	React.createContext<Ariakit.HovercardStore | null>(null);

export const Hovercard: React.FC<HovercardProps> = ({
	children,
	open,
	defaultOpen = false,
	onOpenChange,
	placement = 'bottom',
	timeout = 400,
	openDelay,
	closeDelay,
}) => {
	const store = Ariakit.useHovercardStore({
		placement,
		timeout,
		...(openDelay !== undefined ? { showTimeout: openDelay } : {}),
		...(closeDelay !== undefined ? { hideTimeout: closeDelay } : {}),
		...(open !== undefined
			? onOpenChange
				? { open, setOpen: onOpenChange }
				: { open }
			: { defaultOpen }),
	});

	return (
		<HovercardStoreContext.Provider value={store}>
			<Ariakit.HovercardProvider store={store}>
				<div className="not-prose relative">{children}</div>
			</Ariakit.HovercardProvider>
		</HovercardStoreContext.Provider>
	);
};

export const HovercardTrigger: React.FC<HovercardTriggerProps> = ({
	children,
	asChild = false,
	className = '',
	variant = 'default',
	size = 'md',
}) => {
	const store = React.useContext(HovercardStoreContext);
	if (!store)
		throw new Error('HovercardTrigger must be used within <Hovercard>');

	const triggerClassName = cn(
		hovercardTriggerVariants({ variant, size }),
		'font-medium',
		className,
	);

	if (asChild && React.isValidElement(children)) {
		const child = children as React.ReactElement<{ className?: string }>;
		const merged = React.cloneElement(child, {
			className: cn(child.props.className, triggerClassName),
		});

		return <Ariakit.HovercardAnchor store={store} render={merged} />;
	}

	return (
		<Ariakit.HovercardAnchor
			store={store}
			render={<button type="button" />}
			className={triggerClassName}
		>
			{children}
		</Ariakit.HovercardAnchor>
	);
};

export const HovercardContent: React.FC<HovercardContentProps> = ({
	children,
	className = '',
	variant = 'default',
	size = 'md',
	portal = true,
	fixed = false,
	gutter = 0,
	showArrow = true,
	hideOnHoverOutside = true,
	disablePointerEventsOnApproach = true,
	autoFocusOnShow = false,
}) => {
	const store = React.useContext(HovercardStoreContext);
	if (!store)
		throw new Error('HovercardContent must be used within <Hovercard>');

	return (
		<Ariakit.Hovercard
			store={store}
			portal={portal}
			fixed={fixed}
			gutter={gutter}
			hideOnHoverOutside={hideOnHoverOutside}
			disablePointerEventsOnApproach={disablePointerEventsOnApproach}
			autoFocusOnShow={autoFocusOnShow}
			className={cn(
				hovercardContentVariants({ variant, size }),
				hovercardMotion,
				className,
			)}
		>
			{showArrow ? <Ariakit.HovercardArrow /> : null}
			{children}
		</Ariakit.Hovercard>
	);
};

export const HovercardHeading = React.forwardRef<
	HovercardHeadingElement,
	HovercardHeadingProps
>(({ className = '', ...props }, ref) => (
	<Ariakit.HovercardHeading
		ref={ref}
		className={cn(
			'not-prose text-sm leading-none font-medium text-foreground',
			className,
		)}
		{...props}
	/>
));

HovercardHeading.displayName = 'HovercardHeading';

export const HovercardDescription = React.forwardRef<
	HovercardDescriptionElement,
	HovercardDescriptionProps
>(({ className = '', ...props }, ref) => (
	<Ariakit.HovercardDescription
		ref={ref}
		className={cn(
			'not-prose text-sm leading-snug text-foreground/70',
			className,
		)}
		{...props}
	/>
));

HovercardDescription.displayName = 'HovercardDescription';
