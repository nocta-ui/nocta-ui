import React from 'react';
import { cn } from '@/lib/utils';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive' | 'warning' | 'success';
  className?: string;
  children: React.ReactNode;
}

export interface AlertTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export interface AlertDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
  className?: string;
}

export interface AlertIconProps {
  children: React.ReactNode;
  className?: string;
}

// Base Alert Component
export const Alert: React.FC<AlertProps> = ({
  variant = 'default',
  className = '',
  children,
  ...props
}) => {
  const baseStyles = `
    relative rounded-lg border px-4 py-3
    flex items-start gap-3
    transition-all duration-200 ease-in-out w-fit
    not-prose
  `;

  const variants = {
    default: `
      border-nocta-300 dark:border-nocta-700/50
      bg-linear-to-b from-white to-nocta-200 dark:from-nocta-900 dark:to-nocta-800
      text-nocta-900 dark:text-nocta-100
      [&>svg]:text-nocta-600 dark:[&>svg]:text-nocta-400
    `,
    destructive: `
      border-red-200 dark:border-red-800/50
      bg-red-50 dark:bg-red-950/50
      text-red-900 dark:text-red-100
      [&>svg]:text-red-600 dark:[&>svg]:text-red-400
    `,
    warning: `
      border-yellow-200 dark:border-yellow-800/50
      bg-yellow-50 dark:bg-yellow-950/50
      text-yellow-900 dark:text-yellow-100
      [&>svg]:text-yellow-600 dark:[&>svg]:text-yellow-400
    `,
    success: `
      border-green-200 dark:border-green-800/50
      bg-green-50 dark:bg-green-950/50
      text-green-900 dark:text-green-100
      [&>svg]:text-green-600 dark:[&>svg]:text-green-400
    `
  };

  return (
    <div
      role="alert"
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child) && child.type === AlertIcon) {
          return child;
        }
        if (index === 0 && React.isValidElement(child) && child.type === AlertIcon) {
          return child;
        }
        return null;
      })}
      <div className="flex flex-col min-w-0 flex-1">
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.type !== AlertIcon) {
            return child;
          }
          return null;
        })}
      </div>
    </div>
  );
};

// Alert Title
export const AlertTitle: React.FC<AlertTitleProps> = ({
  children,
  className = '',
  as: Component = 'h5',
  ...props
}) => {
  return React.createElement(
    Component,
    {
      className: cn('mb-1 text-sm font-medium leading-none tracking-tight not-prose', className),
      ...props
    },
    children
  );
};

// Alert Description
export const AlertDescription: React.FC<AlertDescriptionProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div
      className={cn('text-xs [&_p]:leading-relaxed opacity-90 not-prose', className)}
      {...props}
    >
      {children}
    </div>
  );
};

// Alert Icon
export const AlertIcon: React.FC<AlertIconProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={cn('w-4 h-4 flex-shrink-0 mt-0.5', className)}>
      {children}
    </div>
  );
}; 