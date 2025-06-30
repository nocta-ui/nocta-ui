import React from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'pulse';
  size?: 'sm' | 'md' | 'lg';
  shape?: 'rectangle' | 'circle' | 'text';
  width?: string | number;
  height?: string | number;
  lines?: number;
  className?: string;
}

// Skeleton Component
export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'default',
  size = 'md',
  shape = 'rectangle',
  width,
  height,
  lines = 1,
  className = '',
  ...props
}) => {
  const getBaseStyles = () => {
    return 'bg-neutral-200 dark:bg-neutral-700 rounded not-prose';
  };

  const variants = {
    default: '', // No animation, static skeleton
    pulse: 'animate-pulse',
  };

  const shapes = {
    rectangle: 'rounded',
    circle: 'rounded-full',
    text: 'rounded'
  };

  const sizes = {
    sm: shape === 'text' ? 'h-3' : shape === 'circle' ? 'w-8 h-8' : 'h-8',
    md: shape === 'text' ? 'h-4' : shape === 'circle' ? 'w-12 h-12' : 'h-12',
    lg: shape === 'text' ? 'h-5' : shape === 'circle' ? 'w-16 h-16' : 'h-16'
  };

  // Handle multiple text lines
  if (shape === 'text' && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`} {...props}>
        {Array.from({ length: lines }, (_, index) => (
          <div
            key={index}
            className={cn(getBaseStyles(), variants[variant], shapes[shape], sizes[size], index === lines - 1 ? 'w-3/4' : 'w-full', className)}
            style={{
              width: width && index === 0 ? width : undefined,
              height: height ? height : undefined
            }}
          />
        ))}
      </div>
    );
  }

  // Single skeleton element
  const inlineStyles: React.CSSProperties = {};
  if (width) inlineStyles.width = width;
  if (height) inlineStyles.height = height;

  return (
    <div
      className={cn(getBaseStyles(), variants[variant], shapes[shape], sizes[size], shape === 'circle' ? '' : 'w-full', className)}
      style={inlineStyles}
      {...props}
    />
  );
}; 