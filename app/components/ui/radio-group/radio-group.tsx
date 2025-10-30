'use client';

import {
	Radio as AriakitRadio,
	RadioGroup as AriakitRadioGroup,
	RadioProvider as AriakitRadioProvider,
	useRadioStore,
	useStoreState,
} from '@ariakit/react';
import { cva } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '@/lib/utils';

const indicatorVariants = cva(
	'flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border border-border transition-colors duration-150 ease-out',
	{
		variants: {
			checked: {
				true: 'border-foreground',
				false: '',
			},
			disabled: {
				true: 'opacity-50 cursor-not-allowed',
				false: '',
			},
		},
		defaultVariants: {
			checked: false,
			disabled: false,
		},
	},
);

export interface RadioGroupProps
	extends Omit<
		React.ComponentPropsWithoutRef<typeof AriakitRadioGroup>,
		'store'
	> {
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string | number | null) => void;
	disabled?: boolean;
	className?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
	value,
	defaultValue,
	onValueChange,
	disabled = false,
	className,
	children,
	...props
}) => {
	const storeProps: Parameters<typeof useRadioStore>[0] = {};
	if (typeof value !== 'undefined') {
		storeProps.value = value;
		if (onValueChange) {
			storeProps.setValue = onValueChange;
		}
	} else if (typeof defaultValue !== 'undefined') {
		storeProps.defaultValue = defaultValue;
	}

	const store = useRadioStore(storeProps);
	const contextValue = React.useMemo(
		() => ({ store, disabled }),
		[store, disabled],
	);

	return (
		<RadioGroupContext.Provider value={contextValue}>
			<AriakitRadioProvider store={store}>
				<AriakitRadioGroup
					store={store}
					aria-disabled={disabled || undefined}
					data-disabled={disabled ? '' : undefined}
					className={cn('flex flex-col gap-2', className)}
					{...props}
				>
					{children}
				</AriakitRadioGroup>
			</AriakitRadioProvider>
		</RadioGroupContext.Provider>
	);
};

interface RadioGroupContextValue {
	store: ReturnType<typeof useRadioStore>;
	disabled: boolean;
}

const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(
	null,
);

const useRadioGroupContext = () => {
	const context = React.useContext(RadioGroupContext);
	if (!context)
		throw new Error('RadioGroupItem must be used within a RadioGroup');
	return context;
};

const dotVariants = cva(
	'rounded-full bg-foreground transition-transform duration-150 ease-out',
	{
		variants: {
			checked: {
				true: 'scale-100 opacity-100',
				false: 'scale-0 opacity-0',
			},
		},
		defaultVariants: {
			checked: false,
		},
	},
);

export interface RadioGroupItemProps
	extends Omit<React.ComponentPropsWithoutRef<typeof AriakitRadio>, 'store'> {
	label: React.ReactNode;
	description?: React.ReactNode;
	disabled?: boolean;
	className?: string;
}

export const RadioGroupItem = React.forwardRef<
	HTMLLabelElement,
	RadioGroupItemProps
>(({ value, label, description, disabled, className, ...props }, ref) => {
	const { store, disabled: contextDisabled } = useRadioGroupContext();
	const isDisabled = disabled ?? contextDisabled;
	const currentValue = useStoreState(store, 'value');
	const isChecked = currentValue === value;
	const id = React.useId();
	const [focusVisible, setFocusVisible] = React.useState(false);

	return (
		<label
			ref={ref}
			htmlFor={id}
			data-focus-visible={focusVisible ? '' : undefined}
			className={cn(
				'group relative flex items-start gap-2 cursor-pointer select-none rounded-md transition-colors duration-150 ease-out',
				'data-focus-visible:ring-1 data-focus-visible:ring-ring/50 data-focus-visible:ring-offset-1 data-focus-visible:ring-offset-ring-offset/50',
				isDisabled && 'cursor-not-allowed opacity-50',
				className,
			)}
		>
			<AriakitRadio
				id={id}
				store={store}
				value={value}
				disabled={isDisabled}
				className="sr-only"
				onFocusVisible={() => setFocusVisible(true)}
				onBlur={() => setFocusVisible(false)}
				{...props}
			/>

			<span
				aria-hidden="true"
				className={cn(
					indicatorVariants({
						checked: isChecked,
						disabled: isDisabled,
					}),
					'mt-0.5',
				)}
			>
				<span
					aria-hidden="true"
					className={cn(dotVariants({ checked: isChecked }), 'h-2 w-2')}
				/>
			</span>

			<span className="flex flex-col">
				<span className="text-sm font-medium text-foreground leading-tight">
					{label}
				</span>
				{description && (
					<span className="text-xs text-foreground/70 leading-snug mt-0.5">
						{description}
					</span>
				)}
			</span>
		</label>
	);
});

RadioGroupItem.displayName = 'RadioGroupItem';
