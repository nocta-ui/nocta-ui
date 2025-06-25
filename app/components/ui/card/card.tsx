
import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
  className?: string;
}

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export interface CardActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

// Base Card Component
export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  ...props 
}) => {
  return (
    <div 
      className={`
        bg-white dark:bg-neutral-900 
        border border-neutral-300 dark:border-neutral-700/50 
        rounded-xl 
        shadow-sm dark:shadow-lg 
        hover:shadow-md dark:hover:shadow-xl 
        transition-all duration-300 ease-out 
        backdrop-blur-sm 
        overflow-hidden 
        not-prose 
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

// Card Header
export const CardHeader: React.FC<CardHeaderProps> = ({ 
  children, 
  className = '', 
  ...props 
}) => {
  return (
    <div 
      className={`
        px-6 py-5 
        border-b border-neutral-100 dark:border-neutral-700/50
        not-prose 
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

// Card Title
export const CardTitle: React.FC<CardTitleProps> = ({ 
  children, 
  className = '', 
  as: Component = 'h3', 
  ...props 
}) => {
  return React.createElement(
    Component,
    {
      className: `
        text-lg font-semibold 
        text-neutral-900 dark:text-neutral-100 
        tracking-tight leading-tight 
        not-prose 
        ${className}
      `,
      ...props
    },
    children
  );
};

// Card Description
export const CardDescription: React.FC<CardDescriptionProps> = ({ 
  children, 
  className = '', 
  ...props 
}) => {
  return (
    <p 
      className={`
        text-sm 
        text-neutral-600 dark:text-neutral-400 
        leading-relaxed mt-1 
        not-prose 
        ${className}
      `}
      {...props}
    >
      {children}
    </p>
  );
};

// Card Content
export const CardContent: React.FC<CardContentProps> = ({ 
  children, 
  className = '', 
  ...props 
}) => {
  return (
    <div 
      className={`
        px-6 py-5 
        not-prose text-sm
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

// Card Footer
export const CardFooter: React.FC<CardFooterProps> = ({ 
  children, 
  className = '', 
  ...props 
}) => {
  return (
    <div 
      className={`
        px-6 py-4 
        bg-neutral-50 dark:bg-neutral-800/50
        border-t border-neutral-100 dark:border-neutral-700/50 
        flex items-center justify-end 
        not-prose 
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

// Card Actions
export const CardActions: React.FC<CardActionsProps> = ({ 
  children, 
  className = '', 
  ...props 
}) => {
  return (
    <div 
      className={`
        flex items-center gap-2 
        not-prose 
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};