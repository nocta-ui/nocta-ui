'use client';

import * as Ariakit from '@ariakit/react';
import { cva, type VariantProps } from 'class-variance-authority';
import type React from 'react';
import { Icons } from '@/app/components/ui/icons/icons';
import { cn } from '@/lib/utils';

const checkboxVariants = cva(
	[
		'relative inline-flex items-center justify-center rounded border',
		'cursor-pointer transition-colors duration-150 ease-in-out',
		'has-[:focus-visible]:ring-1 has-[:focus-visible]:ring-offset-1 has-[:focus-visible]:outline-none',
		'has-[:focus-visible]:ring-offset-ring-offset/50',
		'not-prose shadow-sm',
	],
	{
		variants: {
			size: {
				sm: 'h-4 w-4',
				md: 'h-5 w-5',
				lg: 'h-6 w-6',
			},
			checked: {
				true: '',
				false: '',
			},
			disabled: {
				true: 'cursor-not-allowed opacity-50',
				false: '',
			},
		},
		compoundVariants: [
			{
				checked: true,
				class: 'border-border bg-foreground has-[:focus-visible]:ring-ring/50',
			},
			{
				checked: false,
				class: 'border-border bg-card has-[:focus-visible]:ring-ring/50',
			},
		],
		defaultVariants: {
			size: 'md',
			checked: false,
			disabled: false,
		},
	},
);

const iconVariants = cva(
	['text-card transition-opacity duration-150 ease-in-out'],
	{
		variants: {
			size: {
				sm: 'h-3 w-3',
				md: 'h-4 w-4',
				lg: 'h-4.5 w-4.5',
			},
			checked: {
				true: 'opacity-100',
				false: 'opacity-0',
			},
		},
		defaultVariants: {
			size: 'md',
			checked: false,
		},
	},
);

export interface CheckboxProps
	extends Omit<
			React.InputHTMLAttributes<HTMLInputElement>,
			'size' | 'disabled'
		>,
		Omit<VariantProps<typeof checkboxVariants>, 'checked'> {
	checked?: boolean;
	onCheckedChange?: (checked: boolean) => void;
	disabled?: boolean;
	className?: string;
	id?: string;
	defaultChecked?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({
	checked,
	onCheckedChange,
	defaultChecked,
	size = 'md',
	disabled = false,
	className = '',
	id,
	...props
}) => {
	let propsForStore: Parameters<typeof Ariakit.useCheckboxStore<boolean>>[0];
	if (typeof checked !== 'undefined') {
		if (onCheckedChange) {
			propsForStore = {
				value: checked,
				setValue: (value) => {
					const bool = Array.isArray(value) ? value.length > 0 : Boolean(value);
					onCheckedChange(bool);
				},
			};
		} else {
			propsForStore = { value: checked };
		}
	} else {
		propsForStore = { defaultValue: Boolean(defaultChecked) };
	}
	const store = Ariakit.useCheckboxStore<boolean>(propsForStore);

	const isChecked = Ariakit.useStoreState(store, 'value');
	const { name, autoFocus, ...restProps } = props;
	const checkboxProps = {
		...restProps,
		...(typeof name === 'undefined' ? {} : { name }),
		...(typeof autoFocus === 'undefined' ? {} : { autoFocus }),
	};

	return (
		<label
			className={cn(
				checkboxVariants({ size, checked: isChecked, disabled }),
				className,
			)}
			htmlFor={id}
		>
			<Ariakit.Checkbox
				store={store}
				className="sr-only"
				disabled={disabled}
				id={id}
				{...checkboxProps}
			/>
			<Icons.Check
				aria-hidden="true"
				className={iconVariants({ size, checked: isChecked })}
			/>
		</label>
	);
};
