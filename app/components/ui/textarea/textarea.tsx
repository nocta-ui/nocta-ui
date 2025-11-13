import { cva, type VariantProps } from 'class-variance-authority';
import type React from 'react';
import { cn } from '@/lib/utils';

const textareaVariants = cva(
	[
		'flex w-full rounded-md border transition-shadow duration-100 ease-basic',
		'bg-card text-foreground',
		'focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:outline-none',
		'focus-visible:ring-offset-ring-offset/50',
		'disabled:cursor-not-allowed disabled:opacity-50',
		'placeholder:text-foreground/45',
		'not-prose shadow-sm',
	],
	{
		variants: {
			variant: {
				default: ['border-border', 'focus-visible:ring-ring/50'],
				error: [
					'border-destructive/40',
					'focus-visible:ring-destructive/50 dark:focus-visible:ring-destructive/50',
				],
				success: [
					'border-success/40',
					'focus-visible:ring-success/50 dark:focus-visible:ring-success/50',
				],
			},
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
			variant: 'default',
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

			<textarea
				className={cn(textareaVariants({ variant, size, resize }), className)}
				disabled={disabled}
				rows={rows}
				id={textareaId}
				aria-describedby={describedBy}
				aria-invalid={variant === 'error' ? true : undefined}
				{...props}
			/>

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
