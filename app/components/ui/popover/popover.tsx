'use client';

import * as Ariakit from '@ariakit/react';
import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';
import { cn } from '@/lib/utils';

const popoverTriggerVariants = cva(
	'not-prose not-prose inline-flex cursor-pointer items-center justify-center rounded-md border shadow-sm transition-colors duration-200 focus-visible:border-border focus-visible:ring-1 focus-visible:ring-ring/50 focus-visible:ring-offset-1 focus-visible:ring-offset-ring-offset/50 focus-visible:outline-none',
	{
		variants: {
			variant: {
				default: 'border-border bg-card text-foreground hover:bg-card-muted',
			},
			size: {
				sm: 'px-2 py-1 text-xs',
				md: 'px-3 py-2 text-sm',
				lg: 'px-4 py-3 text-base',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'md',
		},
	},
);

const popoverContentVariants = cva(
	'not-prose relative w-fit max-w-[var(--popover-available-width,_theme(spacing.80))] min-w-[8rem] overflow-hidden rounded-lg border border-border bg-card-muted p-4 text-foreground shadow-md',
	{
		variants: {
			size: {
				sm: 'px-3 py-2 text-sm',
				md: 'px-4 py-3 text-sm',
				lg: 'px-6 py-4 text-base',
			},
		},
		defaultVariants: {
			size: 'md',
		},
	},
);

const popoverMotion =
	'transform will-change-transform duration-200 ease-in-out transition opacity-0 scale-95 translate-y-1 data-[enter]:opacity-100 data-[enter]:scale-100 data-[enter]:translate-y-0 data-[leave]:opacity-0 data-[leave]:scale-95 data-[leave]:translate-y-1';

export interface PopoverProps {
	children: React.ReactNode;
	open?: boolean;
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
}

const PopoverStoreContext = React.createContext<Ariakit.PopoverStore | null>(
	null,
);

export const Popover: React.FC<PopoverProps> = ({
	children,
	open,
	defaultOpen = false,
	onOpenChange,
}) => {
	const store = Ariakit.usePopoverStore({
		open,
		defaultOpen,
		setOpen: onOpenChange,
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
	size = 'md',
	portal = true,
	fixed = false,
}) => {
	const store = React.useContext(PopoverStoreContext);
	if (!store) throw new Error('PopoverContent must be used within <Popover>');

	return (
		<Ariakit.Popover
			portal={portal}
			fixed={fixed}
			gutter={8}
			className={cn(popoverContentVariants({ size }), popoverMotion, className)}
		>
			{children}
		</Ariakit.Popover>
	);
};
