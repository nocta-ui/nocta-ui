import React from 'react';

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
    focus:outline-none focus:ring-2 focus:ring-offset-2
    focus:ring-offset-white/50 dark:focus:ring-offset-neutral-900/50
    disabled:opacity-50 disabled:cursor-not-allowed not-prose
  `;
  
  const variants = {
    primary: `
      bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 
      hover:bg-neutral-800 dark:hover:bg-neutral-200 
      focus:ring-neutral-900/50 dark:focus:ring-neutral-100/50
      shadow-sm hover:shadow-md
    `,
    secondary: `
      bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 
      hover:bg-neutral-200 dark:hover:bg-neutral-700 
      focus:ring-neutral-500/50 dark:focus:ring-neutral-400/50
      border border-neutral-200 dark:border-neutral-600
    `,
    ghost: `
      text-neutral-700 dark:text-neutral-300 
      hover:bg-neutral-200 dark:hover:bg-neutral-800 
      focus:ring-neutral-500/50 dark:focus:ring-neutral-400/50
    `
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  
  return (
    <button
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};