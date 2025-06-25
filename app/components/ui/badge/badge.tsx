'use client';

import React from 'react';

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
      bg-neutral-900 dark:bg-neutral-100
      text-white dark:text-neutral-900
      hover:bg-neutral-800 dark:hover:bg-neutral-200
    `,
    secondary: `
      bg-neutral-100 dark:bg-neutral-800
      text-neutral-900 dark:text-neutral-100
      hover:bg-neutral-200 dark:hover:bg-neutral-700
      border border-neutral-300 dark:border-neutral-600
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
      text-neutral-900 dark:text-neutral-100
      border border-neutral-300 dark:border-neutral-700/50
      hover:bg-neutral-50 dark:hover:bg-neutral-800
    `
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm'
  };

  return (
    <span
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  );
}; 