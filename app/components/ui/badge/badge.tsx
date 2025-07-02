'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'destructive' | 'success' | 'warning' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Badge Component
export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseStyles = `
    inline-flex items-center justify-center rounded-full font-medium
    transition-all duration-200 ease-in-out
    whitespace-nowrap
    not-prose
  `;

  const variants = {
    default: `
      bg-linear-to-b from-nocta-900 to-nocta-700 dark:from-white dark:to-nocta-300
      text-white dark:text-nocta-900
      hover:bg-nocta-900 dark:hover:bg-nocta-200
    `,
    secondary: `
      bg-nocta-100 dark:bg-nocta-900
      text-nocta-900 dark:text-nocta-100
      hover:bg-nocta-200 dark:hover:bg-nocta-800
      border border-nocta-300 dark:border-nocta-600
    `,
    destructive: `
      bg-red-500 dark:bg-red-600/50
      text-white dark:text-white
      hover:bg-red-600 dark:hover:bg-red-700
    `,
    success: `
      bg-green-500 dark:bg-green-600/50
      text-white dark:text-white
      hover:bg-green-600 dark:hover:bg-green-700
    `,
    warning: `
      bg-yellow-500 dark:bg-yellow-600/50
      text-white dark:text-white
      hover:bg-yellow-600 dark:hover:bg-yellow-700
    `,
    outline: `
      bg-transparent
      text-nocta-900 dark:text-nocta-100
      border border-nocta-300 dark:border-nocta-700/50
      hover:bg-nocta-50 dark:hover:bg-nocta-900
    `
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm'
  };

  return (
    <span
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </span>
  );
}; 