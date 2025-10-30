'use client';

import type { TooltipAnchorProps as AriakitTooltipAnchorProps } from '@ariakit/react';
import {
	Tooltip as AriakitTooltip,
	TooltipAnchor,
	TooltipArrow,
	TooltipProvider,
} from '@ariakit/react';
import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

const tooltipContentVariants = cva(
	`not-prose pointer-events-auto z-50 origin-top -translate-y-1 scale-95 transform overflow-hidden rounded-md border px-3 py-2 text-sm opacity-0 shadow-md transition-all duration-150 ease-out data-enter:translate-y-0 data-enter:scale-100 data-enter:opacity-100 data-leave:-translate-y-1 data-leave:scale-95 data-leave:opacity-0`,
	{
		variants: {
			variant: { default: `border-border bg-card-muted text-foreground` },
		},
		defaultVariants: { variant: 'default' },
	},
);

export interface TooltipProps {
	children: React.ReactNode;
	delayDuration?: number;
}

export interface TooltipTriggerProps extends AriakitTooltipAnchorProps {
	children: React.ReactNode;
	className?: string;
}

export interface TooltipContentProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof tooltipContentVariants> {
	children: React.ReactNode;
	className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
	children,
	delayDuration = 400,
}) => {
	return (
		<TooltipProvider showTimeout={delayDuration} hideTimeout={100}>
			{children}
		</TooltipProvider>
	);
};

export const TooltipTrigger: React.FC<TooltipTriggerProps> = ({
	children,
	className,
	...props
}) => {
	const { autoFocus, ...restProps } = props;
	if (React.isValidElement(children)) {
		return (
			<TooltipAnchor
				render={(anchorProps) =>
					React.cloneElement(
						children as React.ReactElement<{ className?: string }>,
						{
							...(anchorProps as Record<string, unknown>),
							className: cn(
								'not-prose inline-flex items-center',
								className,
								(children as React.ReactElement<{ className?: string }>).props
									.className,
							),
						},
					)
				}
				{...(autoFocus === undefined ? {} : { autoFocus })}
				{...restProps}
			/>
		);
	}

	return (
		<TooltipAnchor
			className={cn('not-prose inline-flex items-center', className)}
			{...(autoFocus === undefined ? {} : { autoFocus })}
			{...restProps}
		>
			{children}
		</TooltipAnchor>
	);
};

export const TooltipContent: React.FC<TooltipContentProps> = ({
	children,
	className,
	variant = 'default',
	autoFocus,
	...props
}) => {
	if (typeof document === 'undefined') {
		return null;
	}

	return createPortal(
		<AriakitTooltip
			gutter={-4}
			className={cn(tooltipContentVariants({ variant }), className)}
			{...(autoFocus === undefined ? {} : { autoFocus })}
			{...props}
		>
			{children}
			<TooltipArrow className="stroke-muted fill-card-muted" />
		</AriakitTooltip>,
		document.body,
	);
};
