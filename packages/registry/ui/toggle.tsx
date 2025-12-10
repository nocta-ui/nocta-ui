'use client';

import * as Ariakit from '@ariakit/react';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '../lib/utils';

const toggleVariants = cva(
	[
		'relative inline-flex items-center justify-center gap-2 rounded-md shadow-sm card-highlight',
		"[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0",
		'border text-sm font-medium',
		'focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-offset-ring-offset/50 focus-visible:ring-ring/50 focus-visible:outline-none',
		'transition-[background-color,box-shadow] ease-out-quad duration-100',
		'disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
	],
	{
		variants: {
			variant: {
				default:
					'bg-card hover:bg-card-muted data-[state=on]:bg-card-muted border-border text-foreground',
			},
			size: {
				sm: 'h-8 px-3 py-1.5 px-3 gap-1.5 has-[>svg]:px-2.5 text-sm',
				md: 'h-9 px-4 py-2 gap-2 has-[>svg]:px-3 text-sm',
				lg: 'h-10 px-6 gap-2 has-[>svg]:px-4 text-base',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'md',
		},
	},
);

export interface ToggleProps
	extends Omit<
			React.ComponentPropsWithoutRef<typeof Ariakit.Checkbox>,
			'checked' | 'defaultChecked' | 'onChange' | 'size'
		>,
		VariantProps<typeof toggleVariants> {
	pressed?: boolean;
	defaultPressed?: boolean;
	onPressedChange?: (pressed: boolean) => void;
	children?: React.ReactNode;
}

export const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
	(
		{
			variant = 'default',
			size = 'md',
			className,
			pressed,
			defaultPressed = false,
			onPressedChange,
			disabled,
			children,
			...props
		},
		ref,
	) => {
		const checkbox = Ariakit.useCheckboxStore({
			value: pressed ?? defaultPressed,
			setValue: (value) => onPressedChange?.(!!value),
		});

		const [internalPressed, setInternalPressed] =
			React.useState(defaultPressed);
		const isControlled = pressed !== undefined;
		const isPressed = isControlled ? pressed : internalPressed;

		const handleChange = (checked: boolean) => {
			if (!isControlled) setInternalPressed(checked);
			onPressedChange?.(checked);
		};

		const isDisabled = Boolean(disabled);

		return (
			<Ariakit.Checkbox
				store={checkbox}
				render={<button type="button" ref={ref} disabled={isDisabled} />}
				checked={isPressed}
				onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
					handleChange(event.currentTarget.checked)
				}
				data-state={isPressed ? 'on' : 'off'}
				className={cn(toggleVariants({ variant, size }), className)}
				disabled={isDisabled}
				{...props}
			>
				{children}
			</Ariakit.Checkbox>
		);
	},
);

Toggle.displayName = 'Toggle';

export { toggleVariants };
