'use client';

import * as Ariakit from '@ariakit/react';
import React, { createContext, useContext, useId } from 'react';
import { cn } from '../lib/utils';

interface FormFieldContextValue {
	id: string;
	name: string;
	error?: string;
	description?: string;
}

const FormFieldContext = createContext<FormFieldContextValue | null>(null);

const useFormField = () => {
	const context = useContext(FormFieldContext);
	if (!context) {
		throw new Error('useFormField must be used within a FormField');
	}
	return context;
};

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
	children: React.ReactNode;
	className?: string;
	onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
	store?: Ariakit.FormStore;
}

export interface FormFieldProps {
	children: React.ReactNode;
	name: string;
	error?: string;
	description?: string;
	className?: string;
}

export interface FormLabelProps
	extends React.LabelHTMLAttributes<HTMLLabelElement> {
	children: React.ReactNode;
	className?: string;
	required?: boolean;
}

export interface FormControlProps {
	children: React.ReactNode;
	className?: string;
}

export interface FormDescriptionProps
	extends React.HTMLAttributes<HTMLParagraphElement> {
	children: React.ReactNode;
	className?: string;
}

export interface FormMessageProps
	extends React.HTMLAttributes<HTMLParagraphElement> {
	children?: React.ReactNode;
	className?: string;
	type?: 'error' | 'success' | 'warning';
}

export interface FormActionsProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
	className?: string;
	align?: 'left' | 'center' | 'right';
}

export const Form: React.FC<FormProps> = ({
	children,
	className = '',
	onSubmit,
	store: providedStore,
	...props
}) => {
	const internalStore = Ariakit.useFormStore({});
	const store = providedStore ?? internalStore;

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		if (onSubmit) {
			event.preventDefault();
			onSubmit(event);
		}
	};

	return (
		<Ariakit.Form
			store={store}
			className={cn('space-y-6', className)}
			onSubmit={handleSubmit}
			{...props}
		>
			{children}
		</Ariakit.Form>
	);
};

export const FormField: React.FC<FormFieldProps> = ({
	children,
	name,
	error,
	description,
	className = '',
}) => {
	const id = useId();

	const contextValue: FormFieldContextValue = {
		id: `form-field-${id}`,
		name,
		...(error !== undefined ? { error } : {}),
		...(description !== undefined ? { description } : {}),
	};

	return (
		<FormFieldContext.Provider value={contextValue}>
			<div className={cn('space-y-2', className)}>{children}</div>
		</FormFieldContext.Provider>
	);
};

export const FormLabel: React.FC<FormLabelProps> = ({
	children,
	className = '',
	required = false,
	...props
}) => {
	const { name } = useFormField();
	const { id, ...restProps } = props;
	const labelProps =
		typeof id === 'undefined' ? restProps : { ...restProps, id };

	return (
		<Ariakit.FormLabel
			name={name}
			className={cn(
				'block text-sm leading-none font-medium text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
				className,
			)}
			{...labelProps}
		>
			{children}
			{required && <span className="ml-1 text-destructive/90">*</span>}
		</Ariakit.FormLabel>
	);
};

export const FormControl: React.FC<FormControlProps> = ({
	children,
	className = '',
}) => {
	return <div className={cn('relative', className)}>{children}</div>;
};

export const FormDescription: React.FC<FormDescriptionProps> = ({
	children,
	className = '',
	...props
}) => {
	const { name } = useFormField();
	const { id, ...restProps } = props;
	const descriptionProps =
		typeof id === 'undefined' ? restProps : { ...restProps, id };
	return (
		<Ariakit.FormDescription
			name={name}
			className={cn('text-sm leading-relaxed text-foreground/45', className)}
			{...descriptionProps}
		>
			{children}
		</Ariakit.FormDescription>
	);
};

export const FormMessage: React.FC<FormMessageProps> = ({
	children,
	className = '',
	type = 'error',
	...rest
}) => {
	const { name, error: ctxError } = useFormField();
	const message = children ?? ctxError;
	const { id, ...props } = rest;
	const forwardedProps = typeof id === 'undefined' ? props : { ...props, id };

	const variants = {
		error: 'text-destructive/90',
		success: 'text-success/90',
		warning: 'text-warning/90',
	} as const;

	if (type !== 'error') {
		if (!message) return null;
		return (
			<p
				className={cn('text-sm leading-none', variants[type], className)}
				{...forwardedProps}
			>
				{message}
			</p>
		);
	}

	if (message) {
		return (
			<p
				className={cn('text-sm leading-none', variants.error, className)}
				role="alert"
				{...forwardedProps}
			>
				{message}
			</p>
		);
	}

	return (
		<Ariakit.FormError
			name={name}
			className={cn('text-sm leading-none', variants.error, className)}
			role="alert"
			{...forwardedProps}
		/>
	);
};

export interface FormInputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	className?: string;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
	({ className = '', name: _name, id, disabled, autoFocus, ...rest }, ref) => {
		const { name } = useFormField();
		return (
			<Ariakit.FormInput
				ref={ref}
				name={name}
				className={className}
				{...rest}
				{...(typeof id === 'undefined' ? {} : { id })}
				{...(typeof disabled === 'undefined' ? {} : { disabled })}
				{...(typeof autoFocus === 'undefined' ? {} : { autoFocus })}
			/>
		);
	},
);
FormInput.displayName = 'FormInput';

export interface FormSubmitProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	className?: string;
}

export const FormSubmit: React.FC<FormSubmitProps> = ({
	className = '',
	children,
	disabled,
	autoFocus,
	...rest
}) => {
	const submitProps = {
		...rest,
		...(typeof disabled === 'undefined' ? {} : { disabled }),
		...(typeof autoFocus === 'undefined' ? {} : { autoFocus }),
	};
	return (
		<Ariakit.FormSubmit className={className} {...submitProps}>
			{children}
		</Ariakit.FormSubmit>
	);
};

export const FormActions: React.FC<FormActionsProps> = ({
	children,
	className = '',
	align = 'right',
	...props
}) => {
	const alignments = {
		left: 'justify-start',
		center: 'justify-center',
		right: 'justify-end',
	};

	return (
		<div
			className={cn(
				'flex items-center gap-3 pt-4',
				alignments[align],
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
};
