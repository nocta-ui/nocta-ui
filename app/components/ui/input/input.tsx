import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';
import { cn } from '@/lib/utils';

const wrapperVariants = cva(
	[
		'relative flex w-fit rounded-md border',
		'bg-card text-foreground',
		'focus-within:ring-1 focus-within:ring-offset-1',
		'focus-within:ring-offset-ring-offset/50',
		'has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50',
		'not-prose shadow-sm shadow-card',
	],
	{
		variants: {
			variant: {
				default: ['border-border', 'focus-within:ring-ring/50'],
				error: [
					'border-destructive/40',
					'focus-within:ring-destructive/50 dark:focus-within:ring-destructive/50',
				],
				success: [
					'border-success/40',
					'focus-within:ring-success/50 dark:focus-within:ring-success/50',
				],
			},
			size: {
				sm: 'h-8',
				md: 'h-9',
				lg: 'h-10',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'md',
		},
	},
);

const inputVariants = cva(
	[
		'w-full bg-transparent outline-none',
		'placeholder:text-foreground/45',
		'disabled:cursor-not-allowed',
	],
	{
		variants: {
			size: {
				sm: 'px-2.5 py-0.5 text-sm',
				md: 'px-3 py-1 text-sm',
				lg: 'px-3.5 py-1.5 text-base',
			},
			hasLeftIcon: {
				true: 'pl-10',
				false: '',
			},
			hasRightIcon: {
				true: 'pr-10',
				false: '',
			},
		},
		defaultVariants: {
			size: 'md',
			hasLeftIcon: false,
			hasRightIcon: false,
		},
	},
);

const iconVariants = cva(
	['absolute top-1/2 -translate-y-1/2 transform', 'text-foreground/45'],
	{
		variants: {
			position: {
				left: 'left-3',
				right: 'right-3',
			},
			size: {
				sm: 'h-4 w-4',
				md: 'h-4 w-4',
				lg: 'h-5 w-5',
			},
			disabled: {
				true: 'opacity-50',
				false: '',
			},
		},
		defaultVariants: {
			size: 'md',
			disabled: false,
		},
	},
);

const labelVariants = cva(
	'mb-1.5 block text-sm font-medium text-foreground/70',
	{
		variants: {
			variant: {
				default: '',
				error: '',
				success: '',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	},
);

const messageVariants = cva('mt-1.5 text-sm', {
	variants: {
		type: {
			error: 'text-destructive/90',
			success: 'text-success/90',
			helper: 'text-foreground/45',
		},
	},
});

export interface InputProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
		VariantProps<typeof inputVariants> {
	label?: string;
	helperText?: string;
	successMessage?: string;
	errorMessage?: string;
	leftIcon?: React.ReactNode;
	rightIcon?: React.ReactNode;
	className?: string;
	containerClassName?: string;
	wrapperClassName?: string;
	variant?: 'default' | 'error' | 'success';
}

export const Input: React.FC<InputProps> = ({
	variant = 'default',
	size = 'md',
	label,
	helperText,
	successMessage,
	errorMessage,
	leftIcon,
	rightIcon,
	className = '',
	containerClassName = '',
	wrapperClassName = '',
	disabled,
	...props
}) => {
	const hasLeftIcon = !!leftIcon;
	const hasRightIcon = !!rightIcon;
	const displayErrorMessage = variant === 'error' && errorMessage;

	const autoId = React.useId();
	const inputId = props.id ?? autoId;
	const describedBy: string[] = [];

	return (
		<div className={`not-prose ${containerClassName}`}>
			{label && (
				<label htmlFor={inputId} className={labelVariants({ variant })}>
					{label}
				</label>
			)}

			<div className={cn(wrapperVariants({ variant, size }), wrapperClassName)}>
				{leftIcon && (
					<div
						className={cn(
							iconVariants({
								position: 'left',
								size,
								disabled: !!disabled,
							}),
							'[&>svg]:h-full [&>svg]:w-full',
						)}
					>
						{leftIcon}
					</div>
				)}

				<input
					className={cn(
						inputVariants({ size, hasLeftIcon, hasRightIcon }),
						className,
					)}
					id={inputId}
					disabled={disabled}
					aria-invalid={displayErrorMessage ? true : undefined}
					aria-describedby={(() => {
						if (displayErrorMessage) describedBy.push(`${inputId}-error`);
						else if (successMessage) describedBy.push(`${inputId}-success`);
						if (helperText) describedBy.push(`${inputId}-helper`);
						return describedBy.length ? describedBy.join(' ') : undefined;
					})()}
					{...props}
				/>

				{rightIcon && (
					<div
						className={cn(
							iconVariants({
								position: 'right',
								size,
								disabled: !!disabled,
							}),
							'[&>svg]:h-full [&>svg]:w-full',
						)}
					>
						{rightIcon}
					</div>
				)}
			</div>

			{displayErrorMessage && (
				<p
					id={`${inputId}-error`}
					className={messageVariants({ type: 'error' })}
				>
					{errorMessage}
				</p>
			)}

			{!displayErrorMessage && successMessage && (
				<p
					id={`${inputId}-success`}
					className={messageVariants({ type: 'success' })}
				>
					{successMessage}
				</p>
			)}

			{helperText && (
				<p
					id={`${inputId}-helper`}
					className={messageVariants({ type: 'helper' })}
				>
					{helperText}
				</p>
			)}
		</div>
	);
};
