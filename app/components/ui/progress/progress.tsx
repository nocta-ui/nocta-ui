import { cva, type VariantProps } from 'class-variance-authority';
import type React from 'react';
import { cn } from '@/lib/utils';

const progressVariants = cva(
	[
		'relative w-full overflow-hidden rounded-full',
		'border border-border/60 bg-card-muted shadow-inner',
		'transition-all duration-200 ease-in-out',
		'not-prose',
	],
	{
		variants: {
			variant: {
				default: '[&>div]:bg-foreground dark:[&>div]:bg-foreground/50',
				success: '[&>div]:bg-success/80 dark:[&>div]:bg-success/40',
				warning: '[&>div]:bg-warning/80 dark:[&>div]:bg-warning/40',
				destructive: '[&>div]:bg-error/80 dark:[&>div]:bg-error/40',
			},
			size: {
				sm: 'h-2',
				md: 'h-3',
				lg: 'h-4',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'md',
		},
	},
);

export interface ProgressProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof progressVariants> {
	value?: number;
	max?: number;
	showLabel?: boolean;
	className?: string;
	'aria-label'?: string;
}

export const Progress: React.FC<ProgressProps> = ({
	value = 0,
	max = 100,
	variant = 'default',
	size = 'md',
	showLabel = false,
	className = '',
	'aria-label': ariaLabel,
	...props
}) => {
	const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

	return (
		<div className="w-full">
			{showLabel && (
				<div className="mb-2 flex items-center justify-between">
					<span className="text-sm font-medium text-foreground/70">
						{ariaLabel || 'Progress'}
					</span>
					<span className="ml-2 text-sm text-foreground/45">
						{Math.round(percentage)}%
					</span>
				</div>
			)}

			<div
				className={cn(progressVariants({ variant, size }), className)}
				role="progressbar"
				aria-valuemin={0}
				aria-valuemax={max}
				aria-valuenow={value}
				aria-label={ariaLabel || 'Progress'}
				{...props}
			>
				<div
					className={cn(
						'progress-fill h-full rounded-full transition-all duration-500 ease-in-out',
					)}
					style={{ width: `${percentage}%` }}
				/>
			</div>
		</div>
	);
};
