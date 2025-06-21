'use client';

import React, { createContext, useContext, useId } from 'react';

// Context for form field state
interface FormFieldContextValue {
  id: string;
  name: string;
  error?: string;
  description?: string;
}

const FormFieldContext = createContext<FormFieldContextValue | null>(null);

// Hook to access form field context
const useFormField = () => {
  const context = useContext(FormFieldContext);
  if (!context) {
    throw new Error('useFormField must be used within a FormField');
  }
  return context;
};

// Form interfaces
export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
  className?: string;
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
}

export interface FormFieldProps {
  children: React.ReactNode;
  name: string;
  error?: string;
  description?: string;
  className?: string;
}

export interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  className?: string;
  required?: boolean;
}

export interface FormControlProps {
  children: React.ReactNode;
  className?: string;
}

export interface FormDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
  className?: string;
}

export interface FormMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode;
  className?: string;
  type?: 'error' | 'success' | 'warning';
}

export interface FormActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

// Main Form Component
export const Form: React.FC<FormProps> = ({ 
  children, 
  className = '', 
  onSubmit,
  ...props 
}) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (onSubmit) {
      event.preventDefault();
      onSubmit(event);
    }
  };

  return (
    <form 
      className={`space-y-6 not-prose ${className}`}
      onSubmit={handleSubmit}
      {...props}
    >
      {children}
    </form>
  );
};

// Form Field Container
export const FormField: React.FC<FormFieldProps> = ({ 
  children, 
  name, 
  error, 
  description,
  className = '' 
}) => {
  const id = useId();
  
  const contextValue: FormFieldContextValue = {
    id: `form-field-${id}`,
    name,
    error,
    description
  };

  return (
    <FormFieldContext.Provider value={contextValue}>
      <div className={`space-y-2 ${className}`}>
        {children}
      </div>
    </FormFieldContext.Provider>
  );
};

// Form Label
export const FormLabel: React.FC<FormLabelProps> = ({ 
  children, 
  className = '', 
  required = false,
  ...props 
}) => {
  const { id } = useFormField();

  return (
    <label 
      htmlFor={id}
      className={`
        block text-sm font-medium 
        text-neutral-700 dark:text-neutral-300
        leading-none peer-disabled:cursor-not-allowed 
        peer-disabled:opacity-70
        ${className}
      `}
      {...props}
    >
      {children}
      {required && (
        <span className="text-red-600 dark:text-red-400 ml-1" aria-label="required">
          *
        </span>
      )}
    </label>
  );
};

// Form Control Wrapper
export const FormControl: React.FC<FormControlProps> = ({ 
  children, 
  className = '' 
}) => {
  const { id, error } = useFormField();

  return (
    <div className={`relative ${className}`}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            id,
            'aria-invalid': error ? 'true' : 'false',
            'aria-describedby': error ? `${id}-error` : undefined,
            ...(child.props as any),
          });
        }
        return child;
      })}
    </div>
  );
};

// Form Description
export const FormDescription: React.FC<FormDescriptionProps> = ({ 
  children, 
  className = '', 
  ...props 
}) => {
  const { id } = useFormField();

  return (
    <p 
      id={`${id}-description`}
      className={`
        text-sm text-neutral-600 dark:text-neutral-400
        leading-relaxed
        ${className}
      `}
      {...props}
    >
      {children}
    </p>
  );
};

// Form Message (Error/Success/Warning)
export const FormMessage: React.FC<FormMessageProps> = ({ 
  children, 
  className = '', 
  type = 'error',
  ...props 
}) => {
  const { id, error } = useFormField();
  const message = children || error;

  if (!message) return null;

  const variants = {
    error: 'text-red-600 dark:text-red-400',
    success: 'text-green-600 dark:text-green-400',
    warning: 'text-yellow-600 dark:text-yellow-400'
  };

  return (
    <p 
      id={`${id}-${type}`}
      className={`
        text-sm leading-none
        ${variants[type]}
        ${className}
      `}
      role={type === 'error' ? 'alert' : undefined}
      {...props}
    >
      {message}
    </p>
  );
};

// Form Actions
export const FormActions: React.FC<FormActionsProps> = ({ 
  children, 
  className = '', 
  align = 'right',
  ...props 
}) => {
  const alignments = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end'
  };

  return (
    <div 
      className={`
        flex items-center gap-3 pt-4
        ${alignments[align]}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}; 