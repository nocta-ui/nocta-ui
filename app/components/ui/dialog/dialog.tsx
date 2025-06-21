'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export interface DialogProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface DialogTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  asChild?: boolean;
  className?: string;
}

export interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showClose?: boolean;
}

export interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export interface DialogTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export interface DialogDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
  className?: string;
}

export interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export interface DialogActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export interface DialogCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  className?: string;
  asChild?: boolean;
}

// Dialog Context
interface DialogContextType {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DialogContext = React.createContext<DialogContextType | undefined>(undefined);

const useDialog = () => {
  const context = React.useContext(DialogContext);
  if (!context) {
    throw new Error('Dialog components must be used within a Dialog');
  }
  return context;
};

// Main Dialog Component
export const Dialog: React.FC<DialogProps> = ({ 
  children, 
  open: controlledOpen, 
  onOpenChange 
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  return (
    <DialogContext.Provider value={{ open, onOpenChange: setOpen }}>
      {children}
    </DialogContext.Provider>
  );
};

// Dialog Trigger
export const DialogTrigger: React.FC<DialogTriggerProps> = ({ 
  children, 
  className = '', 
  asChild = false,
  onClick,
  ...props 
}) => {
  const { onOpenChange } = useDialog();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onOpenChange(true);
    onClick?.(e);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: handleClick,
      ...(children.props as any),
    });
  }

  return (
    <button
      className={`
        inline-flex items-center justify-center rounded-lg font-medium
        transition-all duration-200 ease-in-out 
        focus:outline-none focus:ring-2 focus:ring-offset-2
        focus:ring-offset-white/50 dark:focus:ring-offset-neutral-900/50
        focus:ring-neutral-900/50 dark:focus:ring-neutral-100/50
        not-prose
        ${className}
      `}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
};

// Dialog Content
export const DialogContent: React.FC<DialogContentProps> = ({ 
  children, 
  className = '', 
  size = 'md',
  showClose = true,
  ...props 
}) => {
  const { open, onOpenChange } = useDialog();
  const contentRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  // Handle animation states
  useEffect(() => {
    if (open) {
      setShouldRender(true);
      // Force a reflow to ensure initial styles are applied, then animate
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });
    } else {
      setIsVisible(false);
      // Delay to allow animation before unmount
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300); // Match animation duration
      return () => clearTimeout(timer);
    }
  }, [open]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onOpenChange(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(e.target as Node)) {
        onOpenChange(false);
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [open, onOpenChange]);

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full mx-4'
  };

  if (!shouldRender) return null;

  const dialogContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className={`
          fixed inset-0 bg-black/50 backdrop-blur-sm 
          transition-opacity duration-300 ease-out
          ${isVisible ? 'opacity-100' : 'opacity-0'}
        `}
        aria-hidden="true"
      />
      
      {/* Dialog */}
      <div
        ref={contentRef}
        className={`
          relative z-50 w-full ${sizes[size]}
          bg-white dark:bg-neutral-900 
          border border-neutral-200 dark:border-neutral-700/50 
          rounded-xl 
          shadow-xl dark:shadow-2xl 
          backdrop-blur-sm 
          not-prose
          transition-all duration-300 ease-out
          ${isVisible 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-95 translate-y-4'
          }
          ${className}
        `}
        role="dialog"
        aria-modal="true"
        {...props}
      >
        {showClose && (
          <DialogClose className="absolute right-4 top-4 z-10">
            <svg 
              className="h-4 w-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
            <span className="sr-only">Close</span>
          </DialogClose>
        )}
        {children}
      </div>
    </div>
  );

  return createPortal(dialogContent, document.body);
};

// Dialog Header
export const DialogHeader: React.FC<DialogHeaderProps> = ({ 
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

// Dialog Title
export const DialogTitle: React.FC<DialogTitleProps> = ({ 
  children, 
  className = '', 
  as: Component = 'h2',
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

// Dialog Description
export const DialogDescription: React.FC<DialogDescriptionProps> = ({ 
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

// Dialog Footer
export const DialogFooter: React.FC<DialogFooterProps> = ({ 
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

// Dialog Actions
export const DialogActions: React.FC<DialogActionsProps> = ({ 
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

// Dialog Close
export const DialogClose: React.FC<DialogCloseProps> = ({ 
  children, 
  className = '', 
  asChild = false,
  onClick,
  ...props 
}) => {
  const { onOpenChange } = useDialog();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onOpenChange(false);
    onClick?.(e);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: handleClick,
      ...(children.props as any),
    });
  }

  return (
    <button
      className={`
        inline-flex items-center justify-center
        w-8 h-8 rounded-md
        text-neutral-400 dark:text-neutral-500
        hover:text-neutral-600 dark:hover:text-neutral-300
        hover:bg-neutral-100 dark:hover:bg-neutral-800
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2
        focus:ring-offset-white/50 dark:focus:ring-offset-neutral-900/50
        focus:ring-neutral-900/50 dark:focus:ring-neutral-100/50
        not-prose
        ${className}
      `}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
}; 