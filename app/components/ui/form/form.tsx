"use client";

import {
	Form as AriakitForm,
	FormDescription as AriakitFormDescription,
	FormError as AriakitFormError,
	FormInput as AriakitFormInput,
	FormLabel as AriakitFormLabel,
	FormSubmit as AriakitFormSubmit,
	type FormStore,
	useFormStore,
} from "@ariakit/react";
import React, { createContext, useContext, useId } from "react";
import { cn } from "@/lib/utils";

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
		throw new Error("useFormField must be used within a FormField");
	}
	return context;
};

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
	children: React.ReactNode;
	className?: string;
	onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
	store?: FormStore;
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
	type?: "error" | "success" | "warning";
}

export interface FormActionsProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
	className?: string;
	align?: "left" | "center" | "right";
}

export const Form: React.FC<FormProps> = ({
	children,
	className = "",
	onSubmit,
	store: providedStore,
	...props
}) => {
	const internalStore = useFormStore({});
	const store = providedStore ?? internalStore;

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		if (onSubmit) {
			event.preventDefault();
			onSubmit(event);
		}
	};

	return (
		<AriakitForm
			store={store}
			className={cn("space-y-6 not-prose", className)}
			onSubmit={handleSubmit}
			{...props}
		>
			{children}
		</AriakitForm>
	);
};

export const FormField: React.FC<FormFieldProps> = ({
	children,
	name,
	error,
	description,
	className = "",
}) => {
	const id = useId();

	const contextValue: FormFieldContextValue = {
		id: `form-field-${id}`,
		name,
		error,
		description,
	};

	return (
		<FormFieldContext.Provider value={contextValue}>
			<div className={cn("space-y-2", className)}>{children}</div>
		</FormFieldContext.Provider>
	);
};

export const FormLabel: React.FC<FormLabelProps> = ({
	children,
	className = "",
	required = false,
	...props
}) => {
	const { name } = useFormField();

	return (
		<AriakitFormLabel
			name={name}
			className={cn(
				"block text-sm font-medium text-primary-muted leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
				className,
			)}
			{...props}
		>
			{children}
			{required && <span className="text-error/90 ml-1">*</span>}
		</AriakitFormLabel>
	);
};

export const FormControl: React.FC<FormControlProps> = ({
	children,
	className = "",
}) => {
	return <div className={cn("relative", className)}>{children}</div>;
};

export const FormDescription: React.FC<FormDescriptionProps> = ({
	children,
	className = "",
	...props
}) => {
	const { name } = useFormField();
	return (
		<AriakitFormDescription
			name={name}
			className={cn(
				"text-sm text-foreground-subtle leading-relaxed",
				className,
			)}
			{...props}
		>
			{children}
		</AriakitFormDescription>
	);
};

export const FormMessage: React.FC<FormMessageProps> = ({
	children,
	className = "",
	type = "error",
	...props
}) => {
	const { name, error: ctxError } = useFormField();
	const message = children ?? ctxError;

	const variants = {
		error: "text-error/90",
		success: "text-success/90",
		warning: "text-warning/90",
	} as const;

	if (type !== "error") {
		if (!message) return null;
		return (
			<p
				className={cn("text-sm leading-none", variants[type], className)}
				{...props}
			>
				{message}
			</p>
		);
	}

	if (message) {
		return (
			<p
				className={cn("text-sm leading-none", variants.error, className)}
				role="alert"
				{...props}
			>
				{message}
			</p>
		);
	}

	return (
		<AriakitFormError
			name={name}
			className={cn("text-sm leading-none", variants.error, className)}
			role="alert"
			{...props}
		/>
	);
};

export interface FormInputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	className?: string;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
	({ className = "", ...props }, ref) => {
		const { name } = useFormField();
		return (
			<AriakitFormInput
				ref={ref}
				name={name}
				className={className}
				{...props}
			/>
		);
	},
);
FormInput.displayName = "FormInput";

export interface FormSubmitProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	className?: string;
}

export const FormSubmit: React.FC<FormSubmitProps> = ({
	className = "",
	children,
	...props
}) => {
	return (
		<AriakitFormSubmit className={className} {...props}>
			{children}
		</AriakitFormSubmit>
	);
};

export const FormActions: React.FC<FormActionsProps> = ({
	children,
	className = "",
	align = "right",
	...props
}) => {
	const alignments = {
		left: "justify-start",
		center: "justify-center",
		right: "justify-end",
	};

	return (
		<div
			className={cn(
				"flex items-center gap-3 pt-4",
				alignments[align],
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
};
