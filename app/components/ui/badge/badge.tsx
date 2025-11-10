'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import type React from 'react';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
	[
		'inline-flex items-center justify-center rounded-full font-medium',
		'shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none',
		'transition-all duration-300 ease-smooth',
		'whitespace-nowrap',
		'not-prose',
	],
	{
		variants: {
			variant: {
				default: [
					'relative bg-foreground/90',
					'text-background',
					'shadow-sm hover:bg-foreground/75',
				],
				secondary: [
					'bg-card',
					'text-foreground',
					'hover:bg-card-muted',
					'border shadow-sm border-border',
				],
				destructive: [
					'bg-destructive/10',
					'text-destructive/90',
					'hover:bg-destructive/25',
					'border shadow-sm border-destructive/40',
				],
				success: [
					'bg-success/10',
					'text-success/90',
					'hover:bg-success/25',
					'border shadow-sm border-success/40',
				],
				warning: [
					'bg-warning/10',
					'text-warning/90',
					'hover:bg-warning/25',
					'border shadow-sm border-warning/40',
				],
			},
			size: {
				sm: 'px-1.5 py-0.25 text-xs',
				md: 'px-2 py-0.5 text-xs',
				lg: 'px-2.5 py-1 text-sm',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'md',
		},
	},
);

export interface BadgeProps
	extends React.HTMLAttributes<HTMLSpanElement>,
		VariantProps<typeof badgeVariants> {
	children: React.ReactNode;
	className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
	children,
	variant = 'default',
	size = 'md',
	className = '',
	...props
}) => {
	return (
		<span
			className={cn(badgeVariants({ variant, size }), className)}
			{...props}
		>
			{children}
		</span>
	);
};
