'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import type React from 'react';

import { cn } from '@/lib/utils';

const kbdVariants = cva(
	[
		'relative inline-flex items-center justify-center select-none',
		'whitespace-nowrap rounded-sm border font-mono font-medium',
		'border-border text-foreground/70 card-highlight shadow-sm',
	],
	{
		variants: {
			size: {
				sm: 'h-5 min-w-[2rem] px-1 text-[10px]',
				md: 'h-6 min-w-[2.2rem] px-1.5 text-[11px]',
				lg: 'h-7 min-w-[2.5rem] px-2 text-xs',
			},
			variant: {
				default: 'bg-card',
			},
		},
		defaultVariants: {
			size: 'md',
			variant: 'default',
		},
	},
);

export interface KbdProps
	extends React.HTMLAttributes<HTMLElement>,
		VariantProps<typeof kbdVariants> {
	className?: string;
}

export const Kbd: React.FC<KbdProps> = ({
	size = 'md',
	variant = 'default',
	className = '',
	...props
}) => {
	return (
		<kbd className={cn(kbdVariants({ size, variant }), className)} {...props} />
	);
};
