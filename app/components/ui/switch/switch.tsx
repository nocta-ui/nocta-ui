'use client';

import * as Ariakit from '@ariakit/react';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '@/lib/utils';

const switchVariants = cva(
	[
		'relative inline-flex items-center rounded-full border-2 border-transparent',
		'cursor-pointer transition-all duration-150 ease-in-out',
		'peer-focus-visible:ring-1 peer-focus-visible:outline-none',
		'peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-ring-offset/50',
	],
	{
		variants: {
			size: {
				sm: 'h-5 w-9',
				md: 'h-6 w-11',
				lg: 'h-7 w-13',
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
				class: 'bg-foreground/30 peer-focus-visible:ring-ring/50',
			},
			{
				checked: false,
				class: 'bg-foreground/15 peer-focus-visible:ring-ring/50',
			},
		],
		defaultVariants: {
			size: 'md',
			checked: false,
			disabled: false,
		},
	},
);

const thumbVariants = cva(
	[
		'inline-block rounded-full bg-card dark:bg-foreground',
		'transform shadow-sm transition-transform duration-150 ease-in-out',
	],
	{
		variants: {
			size: {
				sm: 'size-4',
				md: 'size-5',
				lg: 'size-6',
			},
			checked: {
				true: '',
				false: '',
			},
		},
		compoundVariants: [
			{ size: 'sm', checked: true, class: 'translate-x-4' },
			{ size: 'sm', checked: false, class: 'translate-x-0' },
			{ size: 'md', checked: true, class: 'translate-x-5' },
			{ size: 'md', checked: false, class: 'translate-x-0' },
			{ size: 'lg', checked: true, class: 'translate-x-6' },
			{ size: 'lg', checked: false, class: 'translate-x-0' },
		],
		defaultVariants: {
			size: 'md',
			checked: false,
		},
	},
);

export interface SwitchProps
	extends Omit<React.ComponentPropsWithoutRef<typeof Ariakit.Checkbox>, 'size'>,
		Omit<VariantProps<typeof switchVariants>, 'checked' | 'disabled'> {
	size?: 'sm' | 'md' | 'lg';
	disabled?: boolean;
	className?: string;
	onCheckedChange?: (checked: boolean) => void;
}

export const Switch: React.FC<SwitchProps> = ({
	size = 'md',
	disabled = false,
	className,
	onCheckedChange,
	checked,
	defaultChecked,
	...props
}) => {
	const id = React.useId();
	const store = Ariakit.useCheckboxStore(
		checked !== undefined
			? onCheckedChange
				? {
						value: checked,
						setValue: (val) => {
							const next = Array.isArray(val)
								? val.some(Boolean)
								: val === true;
							onCheckedChange(next);
						},
					}
				: { value: checked }
			: { defaultValue: defaultChecked ?? false },
	);
	const value = Ariakit.useStoreState(store, 'value');
	const isChecked = value === true;

	return (
		<>
			<Ariakit.Checkbox
				id={id}
				store={store}
				role="switch"
				disabled={disabled}
				className="peer sr-only"
				{...props}
			/>
			<label
				htmlFor={id}
				className={cn(
					switchVariants({ size, checked: isChecked, disabled }),
					className,
				)}
			>
				<span className={thumbVariants({ size, checked: isChecked })} />
			</label>
		</>
	);
};
