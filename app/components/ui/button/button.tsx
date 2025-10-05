'use client';

import { Button as AriakitButton } from '@ariakit/react';
import { cva, type VariantProps } from 'class-variance-authority';
import type React from 'react';
import { cn } from '@/lib/utils';

export const buttonVariants = cva(
	'not-prose relative inline-flex cursor-pointer items-center justify-center rounded-md font-medium transition-all duration-200 ease-in-out focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-offset-ring-offset/50 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
	{
		variants: {
			variant: {
				primary:
					'bg-foreground hover:bg-foreground/80 text-background shadow-sm focus-visible:border-border focus-visible:ring-ring/50',
				secondary:
					'border border-none border-border bg-card text-foreground shadow-sm hover:bg-card-muted focus-visible:border-border focus-visible:ring-ring/50 dark:border-solid',
				ghost:
					'text-foreground/70 hover:bg-card-muted focus-visible:border-border focus-visible:ring-ring/50',
				icon: 'text-foreground/70 hover:bg-card-muted focus-visible:border-border focus-visible:ring-ring/50',
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
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
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
	...props
}) => {
	return (
		<AriakitButton
			className={cn(
				buttonVariants({
					variant,
					size,
				}),
				className,
			)}
			type={type ?? 'button'}
			{...props}
		>
			{children}
		</AriakitButton>
	);
};
