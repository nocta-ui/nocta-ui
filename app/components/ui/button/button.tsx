'use client';

import * as Ariakit from '@ariakit/react';
import { cva, type VariantProps } from 'class-variance-authority';
import type React from 'react';
import { cn } from '@/lib/utils';

export const buttonVariants = cva(
	'not-prose relative inline-flex cursor-pointer items-center justify-center rounded-md font-medium transition-all duration-150 ease-in-out focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-offset-ring-offset/50 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
	{
		variants: {
			variant: {
				primary:
					'bg-linear-to-b from-gradient-from to-gradient-to hover:contrast-90 shadow-[inset_0_1px_0_0_rgb(255_255_255/.32),0px_1px_1px_-0.5px_rgba(9,9,11,0.05),0px_3px_3px_-1.5px_rgba(9,9,11,0.05),0px_6px_6px_-3px_rgba(9,9,11,0.05)] dark:shadow-[inset_0_1px_0_0_rgb(255_255_255/.12),0px_1px_1px_-0.5px_rgba(9,9,11,0.05),0px_3px_3px_-1.5px_rgba(9,9,11,0.05),0px_6px_6px_-3px_rgba(9,9,11,0.05)] text-card-muted dark:text-foreground focus-visible:border-border focus-visible:ring-ring/50',
				secondary:
					'border border-border bg-card text-foreground shadow-sm hover:bg-card-muted focus-visible:border-border focus-visible:ring-ring/50',
				ghost:
					'text-foreground hover:bg-card-muted focus-visible:border-border focus-visible:ring-ring/50',
				icon: 'text-foreground hover:bg-card-muted focus-visible:border-border focus-visible:ring-ring/50',
			},
			size: {
				sm: 'px-3 py-1.5 text-sm',
				md: 'px-4 py-2 text-sm',
				lg: 'px-6 py-3 text-base',
			},
		},
		compoundVariants: [
			{
				variant: 'icon',
				size: 'sm',
				class: 'h-8 w-8 p-0 text-sm',
			},
			{
				variant: 'icon',
				size: 'md',
				class: 'h-10 w-10 p-0 text-sm',
			},
			{
				variant: 'icon',
				size: 'lg',
				class: 'h-12 w-12 p-0 text-base',
			},
		],
		defaultVariants: {
			variant: 'primary',
			size: 'md',
		},
	},
);

export interface ButtonProps
	extends Omit<Ariakit.ButtonProps, 'className' | 'children'>,
		VariantProps<typeof buttonVariants> {
	children: React.ReactNode;
	className?: string;
}

export const Button: React.FC<ButtonProps> = ({
	children,
	variant = 'primary',
	size = 'md',
	className = '',
	type,
	render,
	...props
}) => {
	const buttonType = type ?? (render ? undefined : 'button');
	const renderProps = render === undefined ? {} : { render };

	return (
		<Ariakit.Button
			{...renderProps}
			className={cn(
				buttonVariants({
					variant,
					size,
				}),
				className,
			)}
			type={buttonType}
			{...props}
		>
			{children}
		</Ariakit.Button>
	);
};
