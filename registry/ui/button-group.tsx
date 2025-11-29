'use client';

import * as Ariakit from '@ariakit/react';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '@/lib/utils';

const buttonGroupVariants = cva(
	[
		'w-fit relative inline-flex rounded-md border text-sm font-medium bg-card shadow-sm card-highlight select-none',
		'disabled:pointer-events-none disabled:opacity-50 flex overflow-hidden text-foreground border-border',
		'[&>[data-button-group-item]:first-of-type]:rounded-l-md [&>[data-button-group-item]:last-of-type]:rounded-r-md',
	],
	{
		variants: {
			size: {
				sm: 'text-xs',
				md: 'text-sm',
				lg: 'text-base',
			},
		},
		defaultVariants: {
			size: 'md',
		},
	},
);

const ButtonGroupItemVariants = cva(
	[
		'flex-1 flex items-center justify-center cursor-pointer hover:bg-card-muted',
		"[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0",
		'transition-[background-color,box-shadow] ease-out-quad duration-100',
		'focus-visible:ring-1 focus-visible:ring-ring/50 focus-visible:ring-offset-1 focus-visible:ring-offset-ring-offset/50 focus-visible:outline-none focus-visible:rounded-md',
		'border-l border-border first:border-l-0',
	],
	{
		variants: {
			size: {
				sm: 'h-8 px-3 py-1.5 px-3 gap-1.5 has-[>svg]:px-2.5',
				md: 'h-9 px-4 py-2 gap-2 has-[>svg]:px-3',
				lg: 'h-10 px-6 gap-2 has-[>svg]:px-4',
			},
			active: {
				true: 'bg-card-muted',
			},
		},
		defaultVariants: {
			size: 'md',
		},
	},
);

type ButtonGroupSize = NonNullable<
	VariantProps<typeof buttonGroupVariants>['size']
>;

interface ButtonGroupContextValue {
	size: ButtonGroupSize;
	disabled: boolean;
}

const ButtonGroupContext = React.createContext<ButtonGroupContextValue | null>(
	null,
);

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
	size?: ButtonGroupSize;
	disabled?: boolean;
}

export const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
	({ size = 'md', disabled = false, className, children, ...props }, ref) => {
		const contextValue = React.useMemo(
			() => ({
				size,
				disabled,
			}),
			[size, disabled],
		);

		return (
			<ButtonGroupContext.Provider value={contextValue}>
				<div
					ref={ref}
					role="toolbar"
					aria-disabled={disabled || undefined}
					className={cn(buttonGroupVariants({ size }), className)}
					{...props}
				>
					{children}
				</div>
			</ButtonGroupContext.Provider>
		);
	},
);
ButtonGroup.displayName = 'ButtonGroup';

export interface ButtonGroupItemProps
	extends Omit<Ariakit.ButtonProps, 'className' | 'children' | 'render'> {
	children: React.ReactNode;
	className?: string;
	asChild?: boolean;
	active?: boolean;
}

export const ButtonGroupItem = React.forwardRef<
	HTMLButtonElement,
	ButtonGroupItemProps
>(
	(
		{
			children,
			className,
			asChild = false,
			active = false,
			disabled,
			...props
		},
		ref,
	) => {
		const context = React.useContext(ButtonGroupContext);
		if (!context) {
			throw new Error('ButtonGroupItem must be used within a <ButtonGroup>.');
		}

		const isDisabled = disabled ?? context.disabled;
		const buttonType = props.type ?? (asChild ? undefined : 'button');
		const classes = cn(
			ButtonGroupItemVariants({
				size: context.size,
				active,
			}),
			className,
		);

		if (asChild && React.isValidElement(children)) {
			const child = children as React.ReactElement<{
				className?: string;
				'data-button-group-item'?: string;
			}>;
			const mergedChild = React.cloneElement(child, {
				className: cn(child.props.className, classes),
				'data-button-group-item': child.props['data-button-group-item'] ?? '',
			});

			return (
				<Ariakit.Button
					render={mergedChild}
					type={buttonType}
					ref={ref}
					disabled={isDisabled}
					{...props}
				/>
			);
		}

		return (
			<Ariakit.Button
				ref={ref}
				className={classes}
				type={buttonType}
				disabled={isDisabled}
				data-button-group-item=""
				{...props}
			>
				{children}
			</Ariakit.Button>
		);
	},
);
ButtonGroupItem.displayName = 'ButtonGroupItem';
