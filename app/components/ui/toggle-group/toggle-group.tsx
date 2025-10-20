'use client';

import {
	Composite,
	CompositeItem,
	type CompositeStore,
	useCompositeStore,
} from '@ariakit/react';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '@/lib/utils';

const toggleGroupVariants = cva(
	[
		'w-fit not-prose inline-flex rounded-md border shadow-sm select-none',
		'border-border text-sm font-medium transition-all duration-200 ease-in-out',
		'disabled:pointer-events-none disabled:opacity-50',
	],
	{
		variants: {
			variant: {
				default: 'bg-card text-foreground',
			},
			size: {
				sm: 'text-xs',
				md: 'text-sm',
				lg: 'text-base',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'md',
		},
	},
);

const toggleGroupItemVariants = cva(
	[
		'flex-1 flex items-center justify-center transition-all duration-200 ease-in-out cursor-pointer',
		'hover:bg-card-muted',
		'focus-visible:border-border focus-visible:ring-1 focus-visible:ring-ring/50 focus-visible:ring-offset-1 focus-visible:ring-offset-ring-offset/50 focus-visible:outline-none focus-visible:rounded-md',
		'first:rounded-l-md last:rounded-r-md',
	],
	{
		variants: {
			size: {
				sm: 'px-3 py-1.5',
				md: 'px-4 py-2',
				lg: 'px-6 py-3',
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

export interface ToggleGroupProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof toggleGroupVariants> {
	value?: string[];
	defaultValue?: string[];
	onValueChange?: (value: string[]) => void;
	single?: boolean;
	children: React.ReactNode;
}

export interface ToggleGroupItemProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	value: string;
	children?: React.ReactNode;
}

interface ToggleGroupContextValue {
	store: CompositeStore;
	values: string[];
	onSelect: (value: string) => void;
	single: boolean;
	size: NonNullable<VariantProps<typeof toggleGroupVariants>['size']>;
}

const ToggleGroupContext = React.createContext<ToggleGroupContextValue | null>(
	null,
);

export const ToggleGroup = React.forwardRef<HTMLDivElement, ToggleGroupProps>(
	(
		{
			value,
			defaultValue = [],
			onValueChange,
			single = false,
			children,
			className,
			variant = 'default',
			size = 'md',
			...props
		},
		ref,
	) => {
		const store = useCompositeStore();
		const isControlled = value !== undefined;
		const [internalValue, setInternalValue] =
			React.useState<string[]>(defaultValue);

		const currentValue = isControlled ? (value ?? []) : internalValue;

		const handleSelect = (val: string) => {
			let newValue: string[];

			if (single) {
				newValue = currentValue.includes(val) ? [] : [val];
			} else {
				newValue = currentValue.includes(val)
					? currentValue.filter((v) => v !== val)
					: [...currentValue, val];
			}

			if (!isControlled) setInternalValue(newValue);
			onValueChange?.(newValue);
		};

		return (
			<ToggleGroupContext.Provider
				value={{
					store,
					values: currentValue,
					onSelect: handleSelect,
					single,
					size: size as NonNullable<typeof size>,
				}}
			>
				<Composite
					ref={ref}
					store={store}
					role={single ? 'radiogroup' : 'group'}
					className={cn(
						toggleGroupVariants({ variant, size }),
						'flex divide-x divide-border',
						className,
					)}
					{...props}
				>
					{children}
				</Composite>
			</ToggleGroupContext.Provider>
		);
	},
);
ToggleGroup.displayName = 'ToggleGroup';

export const ToggleGroupItem = React.forwardRef<
	HTMLButtonElement,
	ToggleGroupItemProps
>(({ value, children, className, ...props }, ref) => {
	const ctx = React.useContext(ToggleGroupContext);
	if (!ctx)
		throw new Error('ToggleGroupItem must be used within a <ToggleGroup>.');

	const isSelected = ctx.values.includes(value);

	return (
		<CompositeItem
			render={<button type="button" ref={ref} />}
			role={ctx.single ? 'radio' : 'checkbox'}
			aria-checked={isSelected}
			data-state={isSelected ? 'on' : 'off'}
			onClick={() => ctx.onSelect(value)}
			className={cn(
				toggleGroupItemVariants({
					size: ctx.size,
					active: isSelected,
				}),
				className,
			)}
			{...props}
		>
			{children}
		</CompositeItem>
	);
});
ToggleGroupItem.displayName = 'ToggleGroupItem';
