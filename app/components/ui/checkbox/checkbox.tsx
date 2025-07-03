'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'destructive';
  disabled?: boolean;
  className?: string;
  id?: string;
}

// Checkbox Component
export const Checkbox: React.FC<CheckboxProps> = ({
  checked = false,
  onCheckedChange,
  size = 'md',
  variant = 'default',
  disabled = false,
  className = '',
  id,
  ...props
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled && onCheckedChange) {
      onCheckedChange(event.target.checked);
    }
  };

  const baseStyles = `
    relative inline-flex items-center justify-center rounded border-2
    transition-all duration-200 ease-in-out cursor-pointer
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
    focus-visible:ring-offset-white dark:focus-visible:ring-offset-nocta-900
    not-prose
  `;

  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : '';

  const variants = {
    default: checked
      ? 'bg-nocta-900 dark:bg-nocta-600 border-nocta-900 dark:border-nocta-100/50 focus-visible:ring-nocta-900/50 dark:focus-visible:ring-nocta-100/50'
      : 'bg-nocta-200 dark:bg-nocta-800 border-nocta-300 dark:border-nocta-600 hover:border-nocta-400 dark:hover:border-nocta-500 focus-visible:ring-nocta-500/50',
    success: checked
      ? 'bg-green-500 dark:bg-green-600/50 border-green-500 dark:border-green-600/50 focus-visible:ring-green-500/50'
      : 'bg-nocta-200 dark:bg-nocta-800 border-nocta-300 dark:border-nocta-600 hover:border-green-400 dark:hover:border-green-500 focus-visible:ring-green-500/50',
    warning: checked
      ? 'bg-yellow-500 dark:bg-yellow-600/50 border-yellow-500 dark:border-yellow-600/50 focus-visible:ring-yellow-500/50'
      : 'bg-nocta-200 dark:bg-nocta-800 border-nocta-300 dark:border-nocta-600 hover:border-yellow-400 dark:hover:border-yellow-500 focus-visible:ring-yellow-500/50',
    destructive: checked
      ? 'bg-red-500 dark:bg-red-600/50 border-red-500 dark:border-red-600/50 focus-visible:ring-red-500/50'
      : 'bg-nocta-200 dark:bg-nocta-800 border-nocta-300 dark:border-nocta-600 hover:border-red-400 dark:hover:border-red-500 focus-visible:ring-red-500/50'
  };

  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const iconSizes = {
    sm: 'h-2.5 w-2.5',
    md: 'h-3 w-3',
    lg: 'h-3.5 w-3.5'
  };

  const CheckIcon = () => (
    <svg
      className={cn(iconSizes[size], 'text-nocta-50 dark:text-nocta-50 stroke-[3] transition-opacity duration-200', checked ? 'opacity-100' : 'opacity-0')}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20,6 9,17 4,12" />
    </svg>
  );

  return (
    <label
      className={cn(baseStyles, variants[variant], sizes[size], disabledStyles, className)}
      htmlFor={id}
    >
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        id={id}
        aria-checked={checked}
        {...props}
      />
      <CheckIcon />
    </label>
  );
}; 