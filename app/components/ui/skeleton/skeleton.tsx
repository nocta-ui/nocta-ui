import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const skeletonVariants = cva(
  'bg-nocta-200 dark:bg-nocta-800 not-prose',
  {
    variants: {
      variant: {
        default: '',
        pulse: 'animate-pulse',
      },
      shape: {
        rectangle: 'rounded',
        circle: 'rounded-full',
        text: 'rounded'
      },
      size: {
        sm: '',
        md: '',
        lg: ''
      }
    },
    compoundVariants: [
      {
        shape: 'text',
        size: 'sm',
        class: 'h-3'
      },
      {
        shape: 'text',
        size: 'md',
        class: 'h-4'
      },
      {
        shape: 'text',
        size: 'lg',
        class: 'h-5'
      },
      {
        shape: 'circle',
        size: 'sm',
        class: 'w-8 h-8'
      },
      {
        shape: 'circle',
        size: 'md',
        class: 'w-12 h-12'
      },
      {
        shape: 'circle',
        size: 'lg',
        class: 'w-16 h-16'
      },
      {
        shape: 'rectangle',
        size: 'sm',
        class: 'h-8'
      },
      {
        shape: 'rectangle',
        size: 'md',
        class: 'h-12'
      },
      {
        shape: 'rectangle',
        size: 'lg',
        class: 'h-16'
      }
    ],
    defaultVariants: {
      variant: 'default',
      shape: 'rectangle',
      size: 'md'
    }
  }
);

const lastTextLineVariants = cva(
  '',
  {
    variants: {
      isLast: {
        true: 'w-3/4',
        false: 'w-full'
      }
    },
    defaultVariants: {
      isLast: false
    }
  }
);

export interface SkeletonProps 
  extends React.HTMLAttributes<HTMLDivElement>, 
    VariantProps<typeof skeletonVariants> {
  width?: string | number;
  height?: string | number;
  lines?: number;
  className?: string;
}

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
  if (shape === 'text' && lines > 1) {
    return (
      <div className={cn('space-y-2', className)} {...props}>
        {Array.from({ length: lines }, (_, index) => (
          <div
            key={index}
            className={cn(
              skeletonVariants({ variant, shape, size }),
              lastTextLineVariants({ isLast: index === lines - 1 })
            )}
            style={{
              width: width && index === 0 ? width : undefined,
              height: height ? height : undefined
            }}
          />
        ))}
      </div>
    );
  }

  const inlineStyles: React.CSSProperties = {};
  if (width) inlineStyles.width = width;
  if (height) inlineStyles.height = height;

  return (
    <div
      className={cn(
        skeletonVariants({ variant, shape, size }),
        shape === 'circle' ? '' : 'w-full',
        className
      )}
      style={inlineStyles}
      {...props}
    />
  );
};