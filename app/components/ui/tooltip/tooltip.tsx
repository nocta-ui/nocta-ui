'use client';

import * as Ariakit from '@ariakit/react';
import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';
import { cn } from '@/lib/utils';

const tooltipContentVariants = cva(
	`not-prose pointer-events-auto z-50 origin-top -translate-y-2 scale-95 transform rounded-md border px-3 py-2 text-sm opacity-0 shadow-md transition-all duration-300 ease-smooth data-enter:translate-y-0 data-enter:scale-100 data-enter:opacity-100 data-leave:-translate-y-2 data-leave:scale-95 data-leave:opacity-0`,
	{
		variants: {
			variant: {
				default: `border-border bg-card-muted text-foreground`,
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	},
);

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
	children: React.ReactNode;
	delayDuration?: number;
	placement?: TooltipPlacement;
	gutter?: number;
	portal?: boolean;
	fixed?: boolean;
	showArrow?: boolean;
}

export interface TooltipTriggerProps extends Ariakit.TooltipAnchorProps {
	children: React.ReactNode;
	className?: string;
}

export interface TooltipContentProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof tooltipContentVariants> {
	children: React.ReactNode;
	className?: string;
}

interface TooltipConfig {
	gutter?: number;
	portal?: boolean;
	fixed?: boolean;
	showArrow?: boolean;
}

const TooltipConfigContext = React.createContext<TooltipConfig>({
	gutter: 0,
	portal: true,
	fixed: false,
	showArrow: true,
});

const useTooltipConfig = () => React.useContext(TooltipConfigContext);

export const Tooltip: React.FC<TooltipProps> = ({
	children,
	delayDuration = 400,
	placement = 'top',
	gutter = 0,
	portal = true,
	fixed = false,
	showArrow = true,
}) => {
	return (
		<TooltipConfigContext.Provider value={{ gutter, portal, fixed, showArrow }}>
			<Ariakit.TooltipProvider
				showTimeout={delayDuration}
				hideTimeout={100}
				placement={placement}
			>
				{children}
			</Ariakit.TooltipProvider>
		</TooltipConfigContext.Provider>
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
			<Ariakit.TooltipAnchor
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
		<Ariakit.TooltipAnchor
			className={cn('not-prose inline-flex items-center', className)}
			{...(autoFocus === undefined ? {} : { autoFocus })}
			{...restProps}
		>
			{children}
		</Ariakit.TooltipAnchor>
	);
};

export const TooltipContent: React.FC<TooltipContentProps> = ({
	children,
	className,
	variant = 'default',
	autoFocus,
	...props
}) => {
	const {
		gutter: contextGutter,
		portal: contextPortal,
		fixed: contextFixed,
		showArrow: contextShowArrow,
	} = useTooltipConfig();

	return (
		<Ariakit.Tooltip
			className={cn(tooltipContentVariants({ variant }), className)}
			gutter={contextGutter}
			portal={contextPortal ?? true}
			fixed={contextFixed ?? false}
			{...(autoFocus === undefined ? {} : { autoFocus })}
			{...props}
		>
			{children}
			{(contextShowArrow ?? true) ? <Ariakit.TooltipArrow /> : null}
		</Ariakit.Tooltip>
	);
};
