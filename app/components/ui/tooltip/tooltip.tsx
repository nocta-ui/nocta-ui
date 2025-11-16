'use client';

import * as Ariakit from '@ariakit/react';
import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';
import { cn } from '@/lib/utils';

type AnyEventHandler = (...args: unknown[]) => void;

const isEventHandlerKey = (key: string) =>
	key.startsWith('on') && key.length > 2 && key[2] === key[2]?.toUpperCase();

const isAnyEventHandler = (value: unknown): value is AnyEventHandler =>
	typeof value === 'function';

const composeEventHandlers = (
	childHandler?: AnyEventHandler,
	anchorHandler?: AnyEventHandler,
) => {
	if (!childHandler) return anchorHandler;
	if (!anchorHandler) return childHandler;
	return (...args: unknown[]) => {
		childHandler(...args);
		const event = args[0];
		const defaultPrevented =
			event && typeof event === 'object' && 'defaultPrevented' in event
				? Boolean((event as { defaultPrevented?: boolean }).defaultPrevented)
				: false;
		if (!defaultPrevented) {
			anchorHandler(...args);
		}
	};
};

const mergeRefs = <T,>(
	...refs: (React.Ref<T> | undefined)[]
): React.RefCallback<T> | undefined => {
	const validRefs = refs.filter(Boolean);
	if (validRefs.length === 0) {
		return undefined;
	}
	return (node: T | null) => {
		for (const ref of validRefs) {
			if (!ref) continue;
			if (typeof ref === 'function') {
				ref(node);
			} else {
				(ref as React.MutableRefObject<T | null>).current = node;
			}
		}
	};
};

const tooltipContentVariants = cva(
	`pointer-events-auto z-50 origin-top -translate-y-2 scale-95 rounded-md border px-3 py-2 text-sm opacity-0 shadow-md shadow-card transition-[translate,opacity,scale] duration-300 ease-smooth data-enter:translate-y-0 data-enter:scale-100 data-enter:opacity-100 data-leave:-translate-y-2 data-leave:scale-95 data-leave:opacity-0`,
	{
		variants: {
			variant: {
				default: `border-border bg-popover text-foreground`,
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
				render={(anchorProps) => {
					const childElement = children as React.ReactElement & {
						ref?: React.Ref<unknown>;
					};
					const childProps = (childElement.props ?? {}) as Record<
						string,
						unknown
					> & { className?: string };
					const {
						ref: anchorRef,
						className: anchorClassName,
						...restAnchorProps
					} = anchorProps;
					const mergedProps: Record<string, unknown> = { ...childProps };

					Object.entries(restAnchorProps as Record<string, unknown>).forEach(
						([key, value]) => {
							if (isEventHandlerKey(key) && isAnyEventHandler(value)) {
								const existingHandler = mergedProps[key] as
									| AnyEventHandler
									| undefined;
								mergedProps[key] = composeEventHandlers(existingHandler, value);
								return;
							}
							mergedProps[key] = value;
						},
					);

					mergedProps['className'] = cn(
						'inline-flex items-center',
						className,
						anchorClassName as string | undefined,
						childProps.className,
					);

					return React.cloneElement(childElement as React.ReactElement<any>, {
						...mergedProps,
						ref: mergeRefs(childElement.ref, anchorRef as React.Ref<unknown>),
					});
				}}
				{...(autoFocus === undefined ? {} : { autoFocus })}
				{...restProps}
			/>
		);
	}

	return (
		<Ariakit.TooltipAnchor
			className={cn('inline-flex items-center', className)}
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
	const tooltipStore = Ariakit.useTooltipContext();
	if (!tooltipStore) {
		throw new Error('TooltipContent must be used within <Tooltip>');
	}
	const currentPlacement = Ariakit.useStoreState(
		tooltipStore,
		'currentPlacement',
	);
	const shouldTintArrow = currentPlacement?.startsWith('bottom');
	const arrowStyle = shouldTintArrow
		? { stroke: 'var(--shadow-highlight)' }
		: undefined;

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
			{(contextShowArrow ?? true) ? (
				<Ariakit.TooltipArrow style={arrowStyle} />
			) : null}
		</Ariakit.Tooltip>
	);
};
