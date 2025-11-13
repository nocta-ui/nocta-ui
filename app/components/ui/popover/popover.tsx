'use client';

import * as Ariakit from '@ariakit/react';
import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';
import { cn } from '@/lib/utils';

const popoverTriggerVariants = cva(
	"not-prose not-prose inline-flex cursor-pointer items-center justify-center rounded-md border shadow-sm [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 transition-[background-color,box-shadow] duration-150 ease-basic focus-visible:ring-1 focus-visible:ring-ring/50 focus-visible:ring-offset-1 focus-visible:ring-offset-ring-offset/50 focus-visible:outline-none",
	{
		variants: {
			variant: {
				default: 'bg-card hover:bg-card-muted border-border text-foreground',
			},
			size: {
				sm: 'h-8 px-3 py-1.5 px-3 gap-1.5 has-[>svg]:px-2.5 text-sm',
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

const popoverContentVariants = cva(
	'not-prose relative w-fit rounded-lg border shadow-md transition-shadow focus-visible:ring-none focus-visible:outline-none',
	{
		variants: {
			variant: {
				default: `bg-card-muted border-border text-foreground`,
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

const popoverMotion =
	'duration-300 ease-smooth transition-[translate,opacity,scale] opacity-0 scale-95 -translate-y-2 data-enter:opacity-100 data-enter:scale-100 data-enter:translate-y-0 data-leave:opacity-0 data-leave:scale-95 data-leave:-translate-y-2';

type PopoverPlacement =
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

export interface PopoverProps {
	children: React.ReactNode;
	open?: boolean;
	placement?: PopoverPlacement;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export interface PopoverTriggerProps
	extends VariantProps<typeof popoverTriggerVariants> {
	children: React.ReactNode;
	asChild?: boolean;
	className?: string;
}

export interface PopoverContentProps
	extends VariantProps<typeof popoverContentVariants> {
	children: React.ReactNode;
	className?: string;
	portal?: boolean;
	fixed?: boolean;
	gutter?: number;
	showArrow?: boolean;
}

export type PopoverHeadingProps = React.ComponentPropsWithoutRef<
	typeof Ariakit.PopoverHeading
>;

export type PopoverDescriptionProps = React.ComponentPropsWithoutRef<
	typeof Ariakit.PopoverDescription
>;

type PopoverHeadingElement = React.ComponentRef<typeof Ariakit.PopoverHeading>;
type PopoverDescriptionElement = React.ComponentRef<
	typeof Ariakit.PopoverDescription
>;

const PopoverStoreContext = React.createContext<Ariakit.PopoverStore | null>(
	null,
);

export const Popover: React.FC<PopoverProps> = ({
	children,
	open,
	defaultOpen = false,
	onOpenChange,
	placement,
}) => {
	const store = Ariakit.usePopoverStore({
		...(placement ? { placement } : {}),
		...(open !== undefined
			? onOpenChange
				? { open, setOpen: onOpenChange }
				: { open }
			: { defaultOpen }),
	});

	return (
		<PopoverStoreContext.Provider value={store}>
			<Ariakit.PopoverProvider store={store}>
				<div className="not-prose relative">{children}</div>
			</Ariakit.PopoverProvider>
		</PopoverStoreContext.Provider>
	);
};

export const PopoverTrigger: React.FC<PopoverTriggerProps> = ({
	children,
	asChild = false,
	className = '',
	variant = 'default',
	size = 'md',
}) => {
	const store = React.useContext(PopoverStoreContext);
	if (!store) throw new Error('PopoverTrigger must be used within <Popover>');

	if (asChild && React.isValidElement(children)) {
		const child = children as React.ReactElement<{ className?: string }>;
		const merged = React.cloneElement(child, {
			className: cn(
				child.props.className,
				popoverTriggerVariants({ variant, size }),
				'font-medium',
				className,
			),
		});

		return <Ariakit.PopoverDisclosure render={merged} />;
	}

	return (
		<Ariakit.PopoverDisclosure
			className={cn(
				popoverTriggerVariants({ variant, size }),
				'font-medium',
				className,
			)}
		>
			{children}
		</Ariakit.PopoverDisclosure>
	);
};

export const PopoverContent: React.FC<PopoverContentProps> = ({
	children,
	className = '',
	variant = 'default',
	size = 'md',
	portal = true,
	fixed = false,
	gutter = 0,
	showArrow = true,
}) => {
	const store = React.useContext(PopoverStoreContext);
	if (!store) throw new Error('PopoverContent must be used within <Popover>');

	return (
		<Ariakit.Popover
			portal={portal}
			fixed={fixed}
			gutter={gutter}
			className={cn(
				popoverContentVariants({ variant, size }),
				popoverMotion,
				className,
			)}
		>
			{showArrow ? <Ariakit.PopoverArrow /> : null}
			{children}
		</Ariakit.Popover>
	);
};

export const PopoverHeading = React.forwardRef<
	PopoverHeadingElement,
	PopoverHeadingProps
>(({ className = '', ...props }, ref) => (
	<Ariakit.PopoverHeading
		ref={ref}
		className={cn(
			'not-prose text-sm leading-none font-medium text-foreground',
			className,
		)}
		{...props}
	/>
));

PopoverHeading.displayName = 'PopoverHeading';

export const PopoverDescription = React.forwardRef<
	PopoverDescriptionElement,
	PopoverDescriptionProps
>(({ className = '', ...props }, ref) => (
	<Ariakit.PopoverDescription
		ref={ref}
		className={cn(
			'not-prose text-sm leading-snug text-foreground/70',
			className,
		)}
		{...props}
	/>
));

PopoverDescription.displayName = 'PopoverDescription';
