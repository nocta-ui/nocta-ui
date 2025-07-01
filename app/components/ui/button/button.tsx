import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Button Component
export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '', 
  ...props 
}) => {
  const baseStyles = `
    inline-flex items-center justify-center rounded-lg font-medium
    transition-all duration-200 ease-in-out 
    focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-2
    focus-visible:ring-offset-white/50 dark:focus-visible:ring-offset-neutral-900/50
    disabled:opacity-50 disabled:cursor-not-allowed not-prose cursor-pointer
  `;
  
  const variants = {
    primary: `
      bg-linear-to-b from-neutral-900 to-neutral-700 dark:from-white dark:to-neutral-300 text-white dark:text-neutral-900 
      hover:bg-neutral-800 dark:hover:bg-neutral-200 
      focus-visible:ring-neutral-900/50 dark:focus-visible:ring-neutral-100/50
      shadow-sm hover:shadow-md
    `,
    secondary: `
      bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 
      hover:bg-neutral-200 dark:hover:bg-neutral-700 
      focus-visible:ring-neutral-500/50 dark:focus-visible:ring-neutral-400/50
      border border-neutral-300 dark:border-neutral-600
    `,
    ghost: `
      text-neutral-700 dark:text-neutral-300 
      hover:bg-neutral-200 dark:hover:bg-neutral-800 
      focus-visible:ring-neutral-500/50 dark:focus-visible:ring-neutral-400/50
    `
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  
  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};