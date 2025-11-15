'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import type React from 'react';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
	[
		'relative inline-flex items-center justify-center rounded-full font-medium',
		'shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none',
		'whitespace-nowrap shadow-sm shadow-card',
		'not-prose',
	],
	{
		variants: {
			variant: {
				default: [
					'bg-foreground/90',
					'text-background',
					'hover:bg-foreground/75',
				],
				secondary: [
					'bg-card',
					'text-foreground',
					'hover:bg-card-muted',
					'border border-border',
				],
				destructive: [
					'bg-destructive/10',
					'text-destructive/90',
					'hover:bg-destructive/25',
					'border border-destructive/40',
				],
				success: [
					'bg-success/10',
					'text-success/90',
					'hover:bg-success/25',
					'border border-success/40',
				],
				warning: [
					'bg-warning/10',
					'text-warning/90',
					'hover:bg-warning/25',
					'border border-warning/40',
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
