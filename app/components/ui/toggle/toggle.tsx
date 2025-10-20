'use client';

import { Checkbox, useCheckboxStore } from '@ariakit/react';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '@/lib/utils';

const toggleVariants = cva(
	[
		'not-prose inline-flex items-center justify-center gap-2 rounded-md shadow-sm',
		'border text-sm font-medium transition-all duration-200 ease-in-out',
		'focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-offset-ring-offset/50 focus-visible:ring-ring/50 focus-visible:outline-none',
		'disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
	],
	{
		variants: {
			variant: {
				default:
					'border-border bg-card text-foreground hover:bg-card-muted data-[state=on]:bg-card-muted',
			},
			size: {
				sm: 'px-3 py-1.5 text-sm',
				md: 'px-4 py-2 text-sm',
				lg: 'px-6 py-3 text-base',
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
			React.ComponentPropsWithoutRef<typeof Checkbox>,
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
		const checkbox = useCheckboxStore({
			value: pressed ?? defaultPressed,
			setValue: (value) => onPressedChange?.(!!value),
		});

		// Jeśli komponent jest niekontrolowany, zarządzamy stanem lokalnie
		const [internalPressed, setInternalPressed] =
			React.useState(defaultPressed);
		const isControlled = pressed !== undefined;
		const isPressed = isControlled ? pressed : internalPressed;

		const handleChange = (checked: boolean) => {
			if (!isControlled) setInternalPressed(checked);
			onPressedChange?.(checked);
		};

		return (
			<Checkbox
				store={checkbox}
				render={<button type="button" ref={ref} />}
				checked={isPressed}
				onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
					handleChange(event.currentTarget.checked)
				}
				data-state={isPressed ? 'on' : 'off'}
				className={cn(toggleVariants({ variant, size }), className)}
				disabled={disabled}
				{...props}
			>
				{children}
			</Checkbox>
		);
	},
);

Toggle.displayName = 'Toggle';

export { toggleVariants };
