'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

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
    return React.cloneElement(
      children as React.ReactElement<React.ButtonHTMLAttributes<HTMLButtonElement>>, 
      {
        onClick: handleClick,
        ...(children.props || {}),
      }
    );
  }

  return (
    <button
      className={cn('inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-2 focus-visible:ring-offset-white/50 dark:focus-visible:ring-offset-nocta-900/50 focus-visible:ring-nocta-900/50 dark:focus-visible:ring-nocta-100/50 not-prose', className)}
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
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  // Focus trap functionality
  const getFocusableElements = () => {
    if (!contentRef.current) return [];
    
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'textarea:not([disabled])',
      'select:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ');
    
    return Array.from(contentRef.current.querySelectorAll(focusableSelectors)) as HTMLElement[];
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onOpenChange(false);
      return;
    }

    if (e.key === 'Tab') {
      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement as HTMLElement;

      if (e.shiftKey) {
        // Shift + Tab (backward)
        if (activeElement === firstElement || !contentRef.current?.contains(activeElement)) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab (forward)
        if (activeElement === lastElement || !contentRef.current?.contains(activeElement)) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  }, [onOpenChange]);

  // Handle animation states and focus management
  useEffect(() => {
    if (open) {
      // Store the currently active element to restore focus later
      previousActiveElementRef.current = document.activeElement as HTMLElement;
      
      setShouldRender(true);
      // Force a reflow to ensure initial styles are applied, then animate
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true);
          // Focus the first focusable element after animation
          setTimeout(() => {
            const focusableElements = getFocusableElements();
            if (focusableElements.length > 0) {
              focusableElements[0].focus();
            }
          }, 100);
        });
      });
    } else {
      setIsVisible(false);
      // Delay to allow animation before unmount
      const timer = setTimeout(() => {
        setShouldRender(false);
        // Restore focus to the element that opened the dialog
        if (previousActiveElementRef.current) {
          previousActiveElementRef.current.focus();
        }
      }, 300); // Match animation duration
      return () => clearTimeout(timer);
    }
  }, [open]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(e.target as Node)) {
        onOpenChange(false);
      }
    };

    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [open, onOpenChange, handleKeyDown]);

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
        className={cn('fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-out', isVisible ? 'opacity-100' : 'opacity-0')}
        aria-hidden="true"
      />
      
      {/* Dialog */}
      <div
      ref={contentRef}
      className={cn('relative p-[1px] bg-linear-to-b from-nocta-500/20 to-transparent rounded-xl shadow-xl dark:shadow-2xl backdrop-blur-sm not-prose transition-all duration-300 ease-out', isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4', sizes[size], className)}>
        <div
          className='relative z-50 w-full bg-linear-to-b from-white to-nocta-200 dark:from-nocta-950 dark:to-nocta-900 rounded-xl'
          role="dialog"
          aria-modal="true"
          aria-describedby="dialog-description"
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
      className={cn('px-6 py-5 border-b border-nocta-100 dark:border-nocta-700/50 not-prose', className)}
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
      className: cn('text-lg font-semibold text-nocta-900 dark:text-nocta-100 tracking-tight leading-tight not-prose', className),
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
      className={cn('text-sm text-nocta-600 dark:text-nocta-400 leading-relaxed mt-1 not-prose', className)}
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
      className={cn('px-6 py-4 bg-nocta-50 dark:bg-nocta-900/50 rounded-b-xl border-t border-nocta-100 dark:border-nocta-700/50 flex items-center justify-end not-prose', className)}
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
      className={cn('flex items-center gap-2 not-prose', className)}
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
    return React.cloneElement(
      children as React.ReactElement<React.ButtonHTMLAttributes<HTMLButtonElement>>, 
      {
        onClick: handleClick,
        ...(children.props || {}),
      }
    );
  }

  return (
    <button
      className={cn('inline-flex items-center justify-center w-8 h-8 rounded-md text-nocta-400 dark:text-nocta-500 hover:text-nocta-600 dark:hover:text-nocta-300 hover:bg-nocta-100 dark:hover:bg-nocta-900 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-2 focus-visible:ring-offset-white/50 dark:focus-visible:ring-offset-nocta-900/50 focus-visible:ring-nocta-900/50 dark:focus-visible:ring-nocta-100/50 not-prose', className)}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
}; 