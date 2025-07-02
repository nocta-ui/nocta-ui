import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: 'default' | 'error' | 'success';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  helperText?: string;
  successMessage?: string;
  errorMessage?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  containerClassName?: string;
}

// Input Component
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
  disabled,
  ...props
}) => {
  const baseStyles = `
    w-fit rounded-lg border transition-all duration-200 ease-in-out
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
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const inputClasses = cn(baseStyles, variants[variant], sizes[size], leftIcon ? 'pl-10' : '', rightIcon ? 'pr-10' : '', className);

  const displayErrorMessage = variant === 'error' && errorMessage;

  return (
    <div className={`not-prose ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-nocta-700 dark:text-nocta-300 mb-1.5">
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className={cn('absolute left-3 top-1/2 transform -translate-y-1/2 text-nocta-400 dark:text-nocta-500', iconSizes[size], disabled ? 'opacity-50' : '')}>
            {leftIcon}
          </div>
        )}
        
        <input
          className={inputClasses}
          disabled={disabled}
          {...props}
        />
        
        {rightIcon && (
          <div className={cn('absolute right-3 top-1/2 transform -translate-y-1/2 text-nocta-400 dark:text-nocta-500', iconSizes[size], disabled ? 'opacity-50' : '')}>
            {rightIcon}
          </div>
        )}
      </div>
      
      {displayErrorMessage && (
        <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">
          {errorMessage}
        </p>
      )}

      {!displayErrorMessage && (
        <p className="mt-1.5 text-sm text-green-600 dark:text-green-400">
          {successMessage}
        </p>
      )}

      {helperText && (
        <p className="mt-1.5 text-sm text-nocta-600 dark:text-nocta-400">
          {helperText}
        </p>
      )}
    </div>
  );
};