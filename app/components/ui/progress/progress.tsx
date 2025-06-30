import React from 'react';
import { cn } from '@/lib/utils';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  variant?: 'default' | 'success' | 'warning' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
  'aria-label'?: string;
}

// Progress Component
export const Progress: React.FC<ProgressProps> = ({
  value = 0,
  max = 100,
  variant = 'default',
  size = 'md',
  showLabel = false,
  className = '',
  'aria-label': ariaLabel,
  ...props
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const baseStyles = `
    relative w-full overflow-hidden rounded-full
    bg-neutral-200 dark:bg-neutral-700
    transition-all duration-200 ease-in-out
    not-prose
  `;

  const sizes = {
    sm: 'h-2',
    md: 'h-3', 
    lg: 'h-4'
  };

  const variants = {
    default: `
      [&>div]:bg-neutral-900 dark:[&>div]:bg-neutral-100/50
    `,
    success: `
      [&>div]:bg-green-500 dark:[&>div]:bg-green-600/50
    `,
    warning: `
      [&>div]:bg-yellow-500 dark:[&>div]:bg-yellow-600/50
    `,
    destructive: `
      [&>div]:bg-red-500 dark:[&>div]:bg-red-600/50
    `
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            {ariaLabel || 'Progress'}
          </span>
          <span className="text-sm text-neutral-500 dark:text-neutral-400 ml-2">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      
      <div
        className={cn(baseStyles, sizes[size], variants[variant], className)}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-label={ariaLabel}
        {...props}
      >
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}; 