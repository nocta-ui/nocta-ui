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
    focus-visible:ring-offset-white/50 dark:focus-visible:ring-offset-nocta-900/50
    disabled:opacity-50 disabled:cursor-not-allowed not-prose cursor-pointer
  `;
  
  const variants = {
    primary: `
      bg-linear-to-b from-nocta-900 to-nocta-700 dark:from-white dark:to-nocta-300 text-white dark:text-nocta-900 
      hover:bg-nocta-800 dark:hover:bg-nocta-200 
      focus-visible:ring-nocta-900/50 dark:focus-visible:ring-nocta-100/50
      shadow-sm hover:shadow-md
    `,
    secondary: `
      bg-nocta-100 dark:bg-nocta-800 text-nocta-900 dark:text-nocta-100 
      hover:bg-nocta-200 dark:hover:bg-nocta-700 
      focus-visible:ring-nocta-500/50 dark:focus-visible:ring-nocta-400/50
      border border-nocta-300 dark:border-nocta-600
    `,
    ghost: `
      text-nocta-700 dark:text-nocta-300 
      hover:bg-nocta-200 dark:hover:bg-nocta-800 
      focus-visible:ring-nocta-500/50 dark:focus-visible:ring-nocta-400/50
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