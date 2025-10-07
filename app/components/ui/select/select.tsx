'use client';

import * as Ariakit from '@ariakit/react';
import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';
import { Icons } from '@/app/components/ui/icons/icons';
import { cn } from '@/lib/utils';

const selectTriggerVariants = cva(
	`not-prose not-prose flex w-fit cursor-pointer items-center justify-between rounded-md border shadow-sm transition-all duration-200 ease-in-out placeholder:text-foreground/45 hover:bg-card-muted focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-offset-ring-offset/50 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50`,
	{
		variants: {
			variant: {
				default: `border-border bg-card text-foreground focus-visible:border-border focus-visible:ring-ring/50`,
				error: `border-error/40 bg-card text-foreground focus-visible:border-error/50 focus-visible:ring-error/50 dark:focus-visible:ring-error/50`,
				success: `border-success/40 bg-card text-foreground focus-visible:border-success/50 focus-visible:ring-success/50 dark:focus-visible:ring-success/50`,
			},
			size: {
				sm: 'h-8 px-2 text-xs',
				md: 'h-10 px-3 text-sm',
				lg: 'h-12 px-4 text-base',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'md',
		},
	},
);

export interface SelectProps
	extends VariantProps<typeof selectTriggerVariants> {
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	disabled?: boolean;
	children: React.ReactNode;
}

export interface SelectTriggerProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof selectTriggerVariants> {
	children: React.ReactNode;
	className?: string;
}

export interface SelectContentProps {
	children: React.ReactNode;
	className?: string;
	portal?: boolean;
	fixed?: boolean;
}

export interface SelectItemProps {
	value: string;
	children: React.ReactNode;
	className?: string;
	disabled?: boolean;
}

export interface SelectValueProps {
	placeholder?: string;
	className?: string;
}

type SelectSize = NonNullable<
	VariantProps<typeof selectTriggerVariants>['size']
>;
type SelectVariant = NonNullable<
	VariantProps<typeof selectTriggerVariants>['variant']
>;

type InternalCtx = {
	size: SelectSize;
	variant: SelectVariant;
	disabled?: boolean;
};

const InternalContext = React.createContext<InternalCtx>({
	size: 'md',
	variant: 'default',
});

export const Select: React.FC<SelectProps> = ({
	value: controlledValue,
	defaultValue,
	onValueChange,
	disabled = false,
	children,
	size = 'md',
	variant = 'default',
}) => {
	const store = Ariakit.useSelectStore({
		value: controlledValue,
		defaultValue,
		setValue: (v) => onValueChange?.(String(v ?? '')),
		animated: true,
	});

	const normalizedSize: SelectSize = size ?? 'md';
	const normalizedVariant: SelectVariant = variant ?? 'default';
	const contextValue = React.useMemo<InternalCtx>(
		() => ({ size: normalizedSize, variant: normalizedVariant, disabled }),
		[normalizedSize, normalizedVariant, disabled],
	);

	return (
		<Ariakit.SelectProvider store={store}>
			<InternalContext.Provider value={contextValue}>
				<div className="not-prose relative">{children}</div>
			</InternalContext.Provider>
		</Ariakit.SelectProvider>
	);
};

export const SelectTrigger: React.FC<SelectTriggerProps> = ({
	children,
	className = '',
	size: propSize,
	variant: propVariant,
	...props
}) => {
	const ctx = React.useContext(InternalContext);
	const select = Ariakit.useSelectContext();
	const isOpen = Ariakit.useStoreState(select, (s) => s?.open ?? false);
	const size: SelectSize = propSize ?? ctx.size ?? 'md';
	const variant: SelectVariant = propVariant ?? ctx.variant ?? 'default';

	return (
		<Ariakit.Select
			disabled={ctx.disabled}
			className={cn(selectTriggerVariants({ size, variant }), className)}
			{...props}
		>
			{children}
			<Icons.ChevronDown
				aria-hidden="true"
				className={cn(
					'ml-2 h-4 w-4 shrink-0 opacity-50 transition-transform duration-200 ease-in-out',
					isOpen && 'rotate-180',
				)}
			/>
		</Ariakit.Select>
	);
};

export const SelectContent: React.FC<SelectContentProps> = ({
	children,
	className = '',
	portal = true,
	fixed = false,
}) => {
	return (
		<Ariakit.SelectPopover
			sameWidth
			portal={portal}
			fixed={fixed}
			className={cn(
				'absolute z-[999] my-1 overflow-hidden rounded-md border border-border bg-card shadow-md',
				'origin-top -translate-y-1 scale-95 transform opacity-0 transition-all duration-200 ease-in-out data-[enter]:translate-y-0 data-[enter]:scale-100 data-[enter]:opacity-100 data-[leave]:-translate-y-1 data-[leave]:scale-95 data-[leave]:opacity-0',
				'not-prose',
				className,
			)}
		>
			<div className="z-50 flex max-h-42 flex-col gap-1 overflow-auto py-1">
				{children}
			</div>
		</Ariakit.SelectPopover>
	);
};

export const SelectItem: React.FC<SelectItemProps> = ({
	value,
	children,
	className = '',
	disabled = false,
}) => {
	const select = Ariakit.useSelectContext();
	const isSelected = Ariakit.useStoreState(select, (s) => s?.value === value);

	return (
		<Ariakit.SelectItem
			value={value}
			disabled={disabled}
			className={cn(
				'relative mx-1 flex cursor-pointer items-center justify-between rounded-sm px-3 py-2 text-sm text-foreground/70 transition-colors duration-200 outline-none select-none hover:bg-card-muted hover:text-foreground focus-visible:bg-card-muted',
				isSelected && 'bg-card-muted font-medium text-foreground',
				disabled && 'pointer-events-none cursor-not-allowed opacity-50',
				className,
			)}
		>
			<span className="flex-1">{children}</span>
			{isSelected && (
				<Icons.Check
					aria-hidden="true"
					className="ml-2 h-4 w-4 text-foreground/70"
				/>
			)}
		</Ariakit.SelectItem>
	);
};

export const SelectValue: React.FC<SelectValueProps> = ({
	placeholder = 'Select an option...',
	className = '',
}) => {
	const select = Ariakit.useSelectContext();
	const currentValue = Ariakit.useStoreState(select, (s) => s?.value ?? '');
	const items = Ariakit.useStoreState(select, (s) => s?.items ?? []);
	const currentItem = items.find((item) => item.value === currentValue);

	return (
		<span
			className={cn(
				'block truncate text-left whitespace-pre-wrap text-foreground',
				className,
			)}
		>
			{currentItem ? (
				currentItem.element?.textContent
			) : (
				<span className="whitespace-pre-wrap text-foreground/45">
					{placeholder}
				</span>
			)}
		</span>
	);
};
