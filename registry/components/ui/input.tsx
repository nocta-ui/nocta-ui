import React from 'react';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: 'default' | 'error' | 'success';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  helperText?: string;
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
    focus:outline-none focus:ring-2 focus:ring-offset-2     
    focus:ring-offset-white/50 dark:focus:ring-offset-neutral-900/50
    disabled:opacity-50 disabled:cursor-not-allowed
    placeholder:text-neutral-400 dark:placeholder:text-neutral-500
    not-prose
  `;

  const variants = {
    default: `
      border-neutral-200 dark:border-neutral-700/50
      bg-white dark:bg-neutral-900
      text-neutral-900 dark:text-neutral-100
      hover:border-neutral-300/50 dark:hover:border-neutral-600/50
      focus:border-neutral-900/50 dark:focus:border-neutral-100/50
      focus:ring-neutral-900/50 dark:focus:ring-neutral-100/50
    `,
    error: `
      border-red-300 dark:border-red-700/50
      bg-white dark:bg-neutral-900
      text-neutral-900 dark:text-neutral-100
      hover:border-red-400/50 dark:hover:border-red-600/50
      focus:border-red-500/50 dark:focus:border-red-500/50
      focus:ring-red-500/50 dark:focus:ring-red-500/50
    `,
    success: `
      border-green-300 dark:border-green-700/50
      bg-white dark:bg-neutral-900
      text-neutral-900 dark:text-neutral-100
      hover:border-green-400/50 dark:hover:border-green-600/50
      focus:border-green-500/50 dark:focus:border-green-500/50
      focus:ring-green-500/50 dark:focus:ring-green-500/50
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

  const inputClasses = `
    ${baseStyles}
    ${variants[variant]}
    ${sizes[size]}
    ${leftIcon ? 'pl-10' : ''}
    ${rightIcon ? 'pr-10' : ''}
    ${className}
  `;

  const displayErrorMessage = variant === 'error' && errorMessage;

  return (
    <div className={`not-prose ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className={`
            absolute left-3 top-1/2 transform -translate-y-1/2
            text-neutral-400 dark:text-neutral-500
            ${iconSizes[size]}
            ${disabled ? 'opacity-50' : ''}
          `}>
            {leftIcon}
          </div>
        )}
        
        <input
          className={inputClasses}
          disabled={disabled}
          {...props}
        />
        
        {rightIcon && (
          <div className={`
            absolute right-3 top-1/2 transform -translate-y-1/2
            text-neutral-400 dark:text-neutral-500
            ${iconSizes[size]}
            ${disabled ? 'opacity-50' : ''}
          `}>
            {rightIcon}
          </div>
        )}
      </div>
      
      {displayErrorMessage && (
        <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">
          {errorMessage}
        </p>
      )}
      
      {helperText && !displayErrorMessage && (
        <p className="mt-1.5 text-sm text-neutral-600 dark:text-neutral-400">
          {helperText}
        </p>
      )}
    </div>
  );
};