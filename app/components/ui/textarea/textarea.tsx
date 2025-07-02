import React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  variant?: 'default' | 'error' | 'success';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  helperText?: string;
  errorMessage?: string;
  successMessage?: string;
  className?: string;
  containerClassName?: string;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

// Textarea Component
export const Textarea: React.FC<TextareaProps> = ({
  variant = 'default',
  size = 'md',
  label,
  helperText,
  errorMessage,
  successMessage,
  className = '',
  containerClassName = '',
  disabled,
  resize = 'vertical',
  rows = 4,
  ...props
}) => {
  const baseStyles = `
    w-full rounded-lg border transition-all duration-200 ease-in-out
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2     
    focus-visible:ring-offset-white/50 dark:focus-visible:ring-offset-nocta-900/50
    disabled:opacity-50 disabled:cursor-not-allowed
    placeholder:text-nocta-400 dark:placeholder:text-nocta-500
    not-prose
  `;

  const variants = {
    default: `
      border-nocta-300 dark:border-nocta-700/50
      bg-white dark:bg-nocta-950
      text-nocta-900 dark:text-nocta-100
      hover:border-nocta-300/50 dark:hover:border-nocta-600/50
      focus-visible:border-nocta-900/50 dark:focus-visible:border-nocta-100/50
      focus-visible:ring-nocta-900/50 dark:focus-visible:ring-nocta-100/50
    `,
    error: `
      border-red-300 dark:border-red-700/50
      bg-white dark:bg-nocta-950
      text-nocta-900 dark:text-nocta-100
      hover:border-red-400/50 dark:hover:border-red-600/50
      focus-visible:border-red-500/50 dark:focus-visible:border-red-500/50
      focus-visible:ring-red-500/50 dark:focus-visible:ring-red-500/50
    `,
    success: `
      border-green-300 dark:border-green-700/50
      bg-white dark:bg-nocta-950
      text-nocta-900 dark:text-nocta-100
      hover:border-green-400/50 dark:hover:border-green-600/50
      focus-visible:border-green-500/50 dark:focus-visible:border-green-500/50
      focus-visible:ring-green-500/50 dark:focus-visible:ring-green-500/50
    `
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-3 py-2.5 text-sm',
    lg: 'px-4 py-3 text-base'
  };

  const resizeClasses = {
    none: 'resize-none',
    vertical: 'resize-y',
    horizontal: 'resize-x', 
    both: 'resize'
  };

  const textareaClasses = `
    ${baseStyles}
    ${variants[variant]}
    ${sizes[size]}
    ${resizeClasses[resize]}
    ${className}
  `;

  const displayErrorMessage = variant === 'error' && errorMessage;
  const displaySuccessMessage = variant === 'success' && successMessage;

  return (
    <div className={cn('not-prose', containerClassName)}>
      {label && (
        <label className="block text-sm font-medium text-nocta-700 dark:text-nocta-300 mb-1.5">
          {label}
        </label>
      )}
      
      <textarea
        className={textareaClasses}
        disabled={disabled}
        rows={rows}
        {...props}
      />
      
      {displayErrorMessage && (
        <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">
          {errorMessage}
        </p>
      )}
      
      {displaySuccessMessage && (
        <p className="mt-1.5 text-sm text-green-600 dark:text-green-400">
          {successMessage}
        </p>
      )}
      
      {helperText && !displayErrorMessage && !displaySuccessMessage && (
        <p className="mt-1.5 text-sm text-nocta-600 dark:text-nocta-400">
          {helperText}
        </p>
      )}
    </div>
  );
}; 