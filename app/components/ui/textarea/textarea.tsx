import { cva, type VariantProps } from 'class-variance-authority';
import type React from 'react';
import { cn } from '@/lib/utils';

const wrapperVariants = cva(
	[
		'relative inline-flex min-w-full rounded-md border',
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
		},
		defaultVariants: {
			variant: 'default',
		},
	},
);

const textareaVariants = cva(
	[
		'h-full min-w-full bg-transparent outline-none',
		'placeholder:text-foreground/45',
		'disabled:cursor-not-allowed',
	],
	{
		variants: {
			size: {
				sm: 'px-2.5 py-1.5 text-sm',
				md: 'px-3 py-2 text-sm',
				lg: 'px-3.5 py-2.5 text-base',
			},
			resize: {
				none: 'resize-none',
				vertical: 'resize-y',
				horizontal: 'resize-x',
				both: 'resize',
			},
		},
		defaultVariants: {
			size: 'md',
			resize: 'vertical',
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

export interface TextareaProps
	extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'>,
		VariantProps<typeof textareaVariants> {
	label?: string;
	helperText?: string;
	errorMessage?: string;
	successMessage?: string;
	className?: string;
	containerClassName?: string;
	wrapperClassName?: string;
	variant?: 'default' | 'error' | 'success';
}

let textareaIdCounter = 0;
const generateTextareaId = () => `textarea-${++textareaIdCounter}`;

export const Textarea: React.FC<TextareaProps> = ({
	variant = 'default',
	size = 'md',
	resize = 'vertical',
	label,
	helperText,
	errorMessage,
	successMessage,
	className = '',
	containerClassName = '',
	wrapperClassName = '',
	disabled,
	rows = 4,
	id,
	...props
}) => {
	const displayErrorMessage = variant === 'error' && errorMessage;
	const displaySuccessMessage = variant === 'success' && successMessage;
	const textareaId = id ?? generateTextareaId();
	const helperId = helperText ? `${textareaId}-helper` : undefined;
	const errorId = displayErrorMessage ? `${textareaId}-error` : undefined;
	const successId = displaySuccessMessage ? `${textareaId}-success` : undefined;
	const describedBy =
		[helperId, errorId, successId].filter(Boolean).join(' ') || undefined;

	return (
		<div className={cn('not-prose', containerClassName)}>
			{label && (
				<label
					htmlFor={textareaId}
					className="mb-1.5 block text-sm font-medium text-foreground/70"
				>
					{label}
				</label>
			)}

			<div className={cn(wrapperVariants({ variant }), wrapperClassName)}>
				<textarea
					className={cn(textareaVariants({ size, resize }), className)}
					disabled={disabled}
					rows={rows}
					id={textareaId}
					aria-describedby={describedBy}
					aria-invalid={variant === 'error' ? true : undefined}
					{...props}
				/>
			</div>

			{displayErrorMessage && (
				<p
					id={errorId}
					className={messageVariants({ type: 'error' })}
					aria-live="polite"
				>
					{errorMessage}
				</p>
			)}
			{displaySuccessMessage && (
				<p
					id={successId}
					className={messageVariants({ type: 'success' })}
					aria-live="polite"
				>
					{successMessage}
				</p>
			)}
			{helperText && !displayErrorMessage && !displaySuccessMessage && (
				<p id={helperId} className={messageVariants({ type: 'helper' })}>
					{helperText}
				</p>
			)}
		</div>
	);
};
