'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'destructive';
  disabled?: boolean;
  className?: string;
  id?: string;
}

// Switch Component
export const Switch: React.FC<SwitchProps> = ({
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
    relative inline-flex items-center rounded-full border-2 border-transparent
    transition-all duration-200 ease-out cursor-pointer
    focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-2
    focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900
    not-prose
  `;

  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : '';

  const variants = {
    default: checked
      ? 'bg-linear-to-b from-neutral-900 to-neutral-700 dark:from-white dark:to-neutral-300/50 focus-visible:ring-neutral-900/50 dark:focus-visible:ring-neutral-100/50'
      : 'bg-neutral-200 dark:bg-neutral-700 focus-visible:ring-neutral-500/50',
    success: checked
      ? 'bg-green-500 dark:bg-green-600/50 focus-visible:ring-green-500/50'
      : 'bg-neutral-200 dark:bg-neutral-700 focus-visible:ring-green-500/50',
    warning: checked
      ? 'bg-yellow-500 dark:bg-yellow-600/50 focus-visible:ring-yellow-500/50'
      : 'bg-neutral-200 dark:bg-neutral-700 focus-visible:ring-yellow-500/50',
    destructive: checked
      ? 'bg-red-500 dark:bg-red-600/50 focus-visible:ring-red-500/50'
      : 'bg-neutral-200 dark:bg-neutral-700 focus-visible:ring-red-500/50'
  };

  const sizes = {
    sm: {
      switch: 'h-5 w-9',
      thumb: 'h-3 w-3',
      translateChecked: 'translate-x-4',
      translateUnchecked: 'translate-x-1'
    },
    md: {
      switch: 'h-6 w-11',
      thumb: 'h-4 w-4',
      translateChecked: 'translate-x-5',
      translateUnchecked: 'translate-x-1'
    },
    lg: {
      switch: 'h-7 w-12',
      thumb: 'h-5 w-5',
      translateChecked: 'translate-x-5',
      translateUnchecked: 'translate-x-1'
    }
  };

  const currentTranslate = checked ? sizes[size].translateChecked : sizes[size].translateUnchecked;

  const thumbStyles = `
    inline-block rounded-full bg-white dark:bg-white
    shadow-sm transform transition-transform duration-200 ease-in-out
    ${sizes[size].thumb}
    ${currentTranslate}
  `;

  return (
    <label
      className={cn(baseStyles, variants[variant], sizes[size].switch, disabledStyles, className)}
      htmlFor={id}
    >
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        id={id}
        role="switch"
        aria-checked={checked}
        {...props}
      />
      <span className={thumbStyles} />
    </label>
  );
}; 