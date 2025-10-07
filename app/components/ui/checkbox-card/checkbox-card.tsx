'use client';

import {
	Checkbox as AriakitCheckbox,
	useCheckboxStore,
	useStoreState,
} from '@ariakit/react';
import { cva, type VariantProps } from 'class-variance-authority';
import React, { useId } from 'react';
import { cn } from '@/lib/utils';

const checkboxCardVariants = cva(
	[
		'not-prose group relative flex w-full flex-col gap-3 rounded-lg border border-border bg-card px-4 py-3 text-left shadow-sm transition-all duration-200 ease-in-out',
		'has-[:focus-visible]:ring-1 has-[:focus-visible]:ring-ring/50 has-[:focus-visible]:ring-offset-1 has-[:focus-visible]:ring-offset-ring-offset/50 has-[:focus-visible]:outline-none',
	],
	{
		variants: {
			checked: {
				true: '',
				false: '',
			},
			disabled: {
				true: 'cursor-not-allowed opacity-50',
				false: 'cursor-pointer',
			},
		},
		defaultVariants: {
			checked: false,
			disabled: false,
		},
	},
);

const indicatorVariants = cva(
	'flex h-3 w-3 shrink-0 items-center justify-center rounded-full border border-border bg-card transition-colors duration-200 ease-in-out',
	{
		variants: {
			checked: {
				true: 'border-foreground',
				false: '',
			},
			disabled: {
				true: 'opacity-50',
				false: '',
			},
		},
		defaultVariants: {
			checked: false,
			disabled: false,
		},
	},
);

export interface CheckboxCardProps
	extends Omit<
			Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
			'title'
		>,
		Omit<VariantProps<typeof checkboxCardVariants>, 'checked' | 'disabled'> {
	title: React.ReactNode;
	description?: React.ReactNode;
	meta?: React.ReactNode;
	helper?: React.ReactNode;
	children?: React.ReactNode;
	checked?: boolean;
	defaultChecked?: boolean;
	onCheckedChange?: (checked: boolean) => void;
	disabled?: boolean;
	className?: string;
}

export const CheckboxCard = React.forwardRef<
	HTMLLabelElement,
	CheckboxCardProps
>(
	(
		{
			title,
			description,
			meta,
			helper,
			children,
			className = '',
			checked,
			onCheckedChange,
			defaultChecked,
			disabled = false,
			id: idProp,
			...props
		},
		ref,
	) => {
		const generatedId = useId();
		const inputId = idProp ?? generatedId;

		let storeProps: Parameters<typeof useCheckboxStore<boolean>>[0];
		if (typeof checked !== 'undefined') {
			storeProps = {
				value: checked,
				setValue: (value) => {
					const bool = Array.isArray(value)
						? value.some((item) => Boolean(item))
						: Boolean(value);
					onCheckedChange?.(bool);
				},
			};
		} else {
			storeProps = { defaultValue: Boolean(defaultChecked) };
		}

		const store = useCheckboxStore<boolean>(storeProps);
		const storedValue = useStoreState(store, 'value');
		const isChecked = Array.isArray(storedValue)
			? storedValue.some((item) => Boolean(item))
			: Boolean(storedValue);

		return (
			<label
				ref={ref}
				htmlFor={inputId}
				className={cn(
					checkboxCardVariants({ checked: isChecked, disabled }),
					className,
				)}
				data-disabled={disabled ? '' : undefined}
				data-checked={isChecked ? '' : undefined}
			>
				<AriakitCheckbox
					store={store}
					className="sr-only"
					disabled={disabled}
					id={inputId}
					{...props}
				/>
				<div className="flex w-full items-start gap-3">
					<div className="flex flex-1 flex-col gap-3">
						<div className="flex items-start gap-3">
							<div className="flex min-w-0 flex-1 flex-col">
								<span className="truncate text-sm font-medium text-foreground">
									{title}
								</span>
								{description ? (
									<span className="mt-1 text-xs text-foreground/70">
										{description}
									</span>
								) : null}
							</div>
							<div className="flex shrink-0 items-center gap-2">
								{meta ? (
									<span className="whitespace-nowrap text-xs font-medium text-foreground/70">
										{meta}
									</span>
								) : null}
								<span
									aria-hidden="true"
									className={indicatorVariants({
										checked: isChecked,
										disabled,
									})}
								>
									<span
										aria-hidden="true"
										className={cn(
											'h-2 w-2 rounded-full bg-foreground transition-all duration-200 ease-in-out transform',
											isChecked ? 'scale-100 opacity-100' : 'scale-0 opacity-0',
											disabled ? 'opacity-60' : '',
										)}
									></span>
								</span>
							</div>
						</div>
						{children ? (
							<div className="space-y-2 text-sm text-foreground/70">
								{children}
							</div>
						) : null}
						{helper ? (
							<p className="text-xs text-foreground/60">{helper}</p>
						) : null}
					</div>
				</div>
			</label>
		);
	},
);

CheckboxCard.displayName = 'CheckboxCard';
