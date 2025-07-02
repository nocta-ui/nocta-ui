import React from 'react';
import { cn } from '@/lib/utils';

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'primary' | 'secondary';
  className?: string;
}

// Spinner Component
export const Spinner: React.FC<SpinnerProps> = ({ 
  size = 'md',
  variant = 'default',
  className = '',
  ...props 
}) => {
  const baseStyles = `
    inline-block rounded-full border-2 border-solid border-current border-r-transparent
    animate-spin not-prose
  `;
  
  const variants = {
    default: `
      text-nocta-600 dark:text-nocta-400
    `,
    primary: `
      text-nocta-900 dark:text-nocta-100
    `,
    secondary: `
      text-nocta-500 dark:text-nocta-500
    `
  };
  
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-[3px]'
  };
  
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}; 