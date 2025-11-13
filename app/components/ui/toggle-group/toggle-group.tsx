'use client';

import * as Ariakit from '@ariakit/react';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '@/lib/utils';

const toggleGroupVariants = cva(
	[
		'w-fit not-prose inline-flex rounded-md border shadow-sm select-none',
		'text-sm font-medium',
		'disabled:pointer-events-none disabled:opacity-50',
	],
	{
		variants: {
			variant: {
				default: 'bg-card text-foreground border-border ',
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
		'flex-1 flex items-center justify-center transition-[background-color,box-shadow] duration-100 ease-basic cursor-pointer',
		"[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0",
		'hover:bg-card-muted',
		'focus-visible:ring-1 focus-visible:ring-ring/50 focus-visible:ring-offset-1 focus-visible:ring-offset-ring-offset/50 focus-visible:outline-none focus-visible:rounded-md',
		'first:rounded-l-md last:rounded-r-md',
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
	store: Ariakit.CompositeStore;
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
		const store = Ariakit.useCompositeStore();
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

		const { autoFocus, ...restProps } = props;
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
				<Ariakit.Composite
					ref={ref}
					store={store}
					role={single ? 'radiogroup' : 'group'}
					className={cn(
						toggleGroupVariants({ variant, size }),
						'flex divide-x divide-border',
						className,
					)}
					{...(autoFocus === undefined ? {} : { autoFocus })}
					{...restProps}
				>
					{children}
				</Ariakit.Composite>
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
	const { disabled, autoFocus, id, ...rest } = props;
	const isDisabled = Boolean(disabled);
	const itemId = id ?? value;

	return (
		<Ariakit.CompositeItem
			id={itemId}
			render={<button type="button" ref={ref} disabled={isDisabled} />}
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
			disabled={isDisabled}
			{...(autoFocus === undefined ? {} : { autoFocus })}
			{...rest}
		>
			{children}
		</Ariakit.CompositeItem>
	);
});
ToggleGroupItem.displayName = 'ToggleGroupItem';
