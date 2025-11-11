'use client';

import * as Ariakit from '@ariakit/react';
import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';
import { cn } from '@/lib/utils';

export const buttonVariants = cva(
	"not-prose relative inline-flex cursor-pointer items-center justify-center rounded-md font-medium [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 transition-all duration-300 ease-smooth focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-offset-ring-offset/50 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
	{
		variants: {
			variant: {
				default:
					'bg-linear-to-b from-gradient-from to-gradient-to hover:contrast-90 shadow-[inset_0_1px_0_0_rgb(255_255_255/.32),0px_1px_1px_-0.5px_rgba(9,9,11,0.05),0px_3px_3px_-1.5px_rgba(9,9,11,0.05),0px_6px_6px_-3px_rgba(9,9,11,0.05)] dark:shadow-[inset_0_1px_0_0_rgb(255_255_255/.12),0px_1px_1px_-0.5px_rgba(9,9,11,0.05),0px_3px_3px_-1.5px_rgba(9,9,11,0.05),0px_6px_6px_-3px_rgba(9,9,11,0.05)] text-card dark:text-foreground focus-visible:border-border focus-visible:ring-ring/50',
				secondary:
					'border border-border bg-card text-foreground shadow-sm hover:bg-card-muted focus-visible:border-border focus-visible:ring-ring/50',
				ghost:
					'text-foreground hover:bg-card-muted focus-visible:border-border focus-visible:ring-ring/50',
				icon: 'text-foreground hover:bg-card-muted focus-visible:border-border focus-visible:ring-ring/50',
			},
			size: {
				sm: 'h-8 px-3 py-1.5 px-3 gap-1.5 has-[>svg]:px-2.5 text-sm',
				md: 'h-9 px-4 py-2 gap-2 has-[>svg]:px-3 text-sm',
				lg: 'h-10 px-6 py-2 gap-2 has-[>svg]:px-4 text-base',
			},
		},
		compoundVariants: [
			{
				variant: 'icon',
				size: 'sm',
				class: 'size-8 p-0 text-sm',
			},
			{
				variant: 'icon',
				size: 'md',
				class: 'size-9 p-0 text-sm',
			},
			{
				variant: 'icon',
				size: 'lg',
				class: 'size-10 p-0 text-base',
			},
		],
		defaultVariants: {
			variant: 'default',
			size: 'md',
		},
	},
);

export interface ButtonProps
	extends Omit<Ariakit.ButtonProps, 'className' | 'children' | 'render'>,
		VariantProps<typeof buttonVariants> {
	children: React.ReactNode;
	className?: string;
	asChild?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
	children,
	variant = 'default',
	size = 'md',
	className = '',
	type,
	asChild = false,
	...props
}) => {
	const buttonType = type ?? (asChild ? undefined : 'button');
	const classes = cn(
		buttonVariants({
			variant,
			size,
		}),
		className,
	);

	if (asChild && React.isValidElement(children)) {
		const child = children as React.ReactElement<{ className?: string }>;
		const mergedChild = React.cloneElement(child, {
			className: cn(child.props.className, classes),
		});

		return (
			<Ariakit.Button
				render={mergedChild}
				type={buttonType}
				{...props}
			/>
		);
	}

	return (
		<Ariakit.Button className={classes} type={buttonType} {...props}>
			{children}
		</Ariakit.Button>
	);
};
