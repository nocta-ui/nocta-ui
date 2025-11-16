'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import type React from 'react';
import { useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';

const skeletonVariants = cva('bg-card-muted', {
	variants: {
		variant: {
			default: '',
			shimmer:
				"relative overflow-hidden after:absolute after:inset-0 after:animate-[shimmer_2s_ease-out_infinite] after:bg-[linear-gradient(90deg,transparent_0%,rgba(0,0,0,0.05)_50%,transparent_100%)] after:content-[''] dark:after:bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.05)_50%,transparent_100%)]",
		},
		shape: {
			rectangle: 'rounded',
			circle: 'rounded-full',
			text: 'rounded',
		},
		size: {
			sm: '',
			md: '',
			lg: '',
		},
	},
	compoundVariants: [
		{
			shape: 'text',
			size: 'sm',
			class: 'h-3',
		},
		{
			shape: 'text',
			size: 'md',
			class: 'h-4',
		},
		{
			shape: 'text',
			size: 'lg',
			class: 'h-5',
		},
		{
			shape: 'circle',
			size: 'sm',
			class: 'h-8 w-8',
		},
		{
			shape: 'circle',
			size: 'md',
			class: 'h-12 w-12',
		},
		{
			shape: 'circle',
			size: 'lg',
			class: 'h-16 w-16',
		},
		{
			shape: 'rectangle',
			size: 'sm',
			class: 'h-8',
		},
		{
			shape: 'rectangle',
			size: 'md',
			class: 'h-12',
		},
		{
			shape: 'rectangle',
			size: 'lg',
			class: 'h-16',
		},
	],
	defaultVariants: {
		variant: 'default',
		shape: 'rectangle',
		size: 'md',
	},
});

const lastTextLineVariants = cva('', {
	variants: {
		isLast: {
			true: 'w-3/4',
			false: 'w-full',
		},
	},
	defaultVariants: {
		isLast: false,
	},
});

export interface SkeletonProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof skeletonVariants> {
	width?: string | number;
	height?: string | number;
	lines?: number;
	className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
	variant = 'default',
	size = 'md',
	shape = 'rectangle',
	width,
	height,
	lines = 1,
	className = '',
	...props
}) => {
	useEffect(() => {
		if (variant !== 'shimmer') return;
		if (!document.getElementById('shimmer-keyframes')) {
			const style = document.createElement('style');
			style.id = 'shimmer-keyframes';
			style.innerHTML = `@keyframes shimmer {\n  0% {\n    transform: translateX(-100%);\n  }\n  100% {\n    transform: translateX(100%);\n  }\n}`;
			document.head.appendChild(style);
		}
	}, [variant]);

	const lineKeys = useMemo(
		() =>
			Array.from({ length: lines }, () =>
				typeof crypto !== 'undefined' && 'randomUUID' in crypto
					? (crypto as Crypto).randomUUID()
					: Math.random().toString(36).slice(2),
			),
		[lines],
	);

	if (shape === 'text' && lines > 1) {
		return (
			<div
				aria-hidden="true"
				role="presentation"
				className={cn('space-y-2', className)}
				{...props}
			>
				{lineKeys.map((key, index) => (
					<div
						key={key}
						className={cn(
							skeletonVariants({ variant, shape, size }),
							lastTextLineVariants({ isLast: index === lines - 1 }),
						)}
						style={{
							width: width && index === 0 ? width : undefined,
							height: height ? height : undefined,
						}}
					/>
				))}
			</div>
		);
	}

	const inlineStyles: React.CSSProperties = {};
	if (width) inlineStyles.width = width;
	if (height) inlineStyles.height = height;

	return (
		<div
			aria-hidden="true"
			role="presentation"
			className={cn(
				skeletonVariants({ variant, shape, size }),
				shape === 'circle' ? '' : 'w-full',
				className,
			)}
			style={inlineStyles}
			{...props}
		/>
	);
};
