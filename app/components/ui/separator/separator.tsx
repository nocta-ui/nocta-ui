'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import type React from 'react';

import { cn } from '@/lib/utils';

const separatorVariants = cva('relative shrink-0 rounded-full bg-border', {
	variants: {
		orientation: {
			horizontal: 'w-full',
			vertical: 'h-full min-h-4',
		},
		variant: {
			default: 'bg-border',
			muted: 'bg-border/60',
		},
		thickness: {
			sm: '',
			md: '',
			lg: '',
		},
	},
	compoundVariants: [
		{
			orientation: 'horizontal',
			thickness: 'sm',
			class: 'h-px',
		},
		{
			orientation: 'horizontal',
			thickness: 'md',
			class: 'h-0.5',
		},
		{
			orientation: 'horizontal',
			thickness: 'lg',
			class: 'h-1',
		},
		{
			orientation: 'vertical',
			thickness: 'sm',
			class: 'w-px',
		},
		{
			orientation: 'vertical',
			thickness: 'md',
			class: 'w-0.5',
		},
		{
			orientation: 'vertical',
			thickness: 'lg',
			class: 'w-1',
		},
	],
	defaultVariants: {
		orientation: 'horizontal',
		thickness: 'sm',
		variant: 'default',
	},
});

export interface SeparatorProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof separatorVariants> {
	/**
	 * When true, the separator is treated as decorative and hidden from assistive tech.
	 */
	decorative?: boolean;
	className?: string;
}

export const Separator: React.FC<SeparatorProps> = ({
	orientation = 'horizontal',
	variant = 'default',
	thickness = 'sm',
	decorative = false,
	role,
	className = '',
	...props
}) => {
	const computedRole = role ?? (decorative ? 'presentation' : 'separator');

	const ariaProps =
		!decorative && computedRole === 'separator' && orientation === 'vertical'
			? { 'aria-orientation': 'vertical' as const }
			: {};

	return (
		<div
			role={computedRole}
			aria-hidden={decorative || undefined}
			className={cn(
				separatorVariants({ orientation, variant, thickness }),
				className,
			)}
			{...ariaProps}
			{...props}
		/>
	);
};
