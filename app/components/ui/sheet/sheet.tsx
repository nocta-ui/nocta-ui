'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

export interface SheetProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface SheetTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  asChild?: boolean;
  className?: string;
}

export interface SheetContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  side?: 'left' | 'right' | 'top' | 'bottom';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showClose?: boolean;
}

export interface SheetHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export interface SheetTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export interface SheetDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
  className?: string;
}

export interface SheetFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export interface SheetCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  className?: string;
  asChild?: boolean;
}

// Sheet Context
interface SheetContextType {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SheetContext = React.createContext<SheetContextType | undefined>(undefined);

const useSheet = () => {
  const context = React.useContext(SheetContext);
  if (!context) {
    throw new Error('Sheet components must be used within a Sheet');
  }
  return context;
};

// Main Sheet Component
export const Sheet: React.FC<SheetProps> = ({ 
  children, 
  open: controlledOpen, 
  onOpenChange 
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  return (
    <SheetContext.Provider value={{ open, onOpenChange: setOpen }}>
      {children}
    </SheetContext.Provider>
  );
};

// Sheet Trigger
export const SheetTrigger: React.FC<SheetTriggerProps> = ({ 
  children, 
  className = '', 
  asChild = false,
  onClick,
  ...props 
}) => {
  const { onOpenChange } = useSheet();

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
      className={cn('inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white/50 dark:focus-visible:ring-offset-neutral-900/50 focus-visible:ring-neutral-900/50 dark:focus-visible:ring-neutral-100/50 not-prose', className)}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
};

// Sheet Content
export const SheetContent: React.FC<SheetContentProps> = ({ 
  children, 
  className = '', 
  side = 'right',
  size = 'md',
  showClose = true,
  ...props 
}) => {
  const { open, onOpenChange } = useSheet();
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
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        setIsVisible(true);
        // Focus first focusable element or the content itself
        const focusableElements = getFocusableElements();
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        } else {
          contentRef.current?.focus();
        }
      }, 10);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      // Delay removing from DOM to allow exit animation
      const timer = setTimeout(() => {
        setShouldRender(false);
        // Restore focus to the previously active element
        if (previousActiveElementRef.current) {
          previousActiveElementRef.current.focus();
        }
      }, 300); // Match the animation duration

      return () => clearTimeout(timer);
    }
  }, [open]);

  // Add event listeners for keyboard and click outside
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(e.target as Node)) {
        onOpenChange(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    
    // Prevent body scroll when sheet is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [open, handleKeyDown, onOpenChange]);

  if (typeof window === 'undefined' || !shouldRender) {
    return null;
  }

  const sizes = {
    sm: {
      'left': 'w-[70vw] sm:w-80',
      'right': 'w-[70vw] sm:w-80', 
      'top': 'h-[40vh] sm:h-80',
      'bottom': 'h-[40vh] sm:h-80'
    },
    md: {
      'left': 'w-[80vw] sm:w-96',
      'right': 'w-[80vw] sm:w-96',
      'top': 'h-[55vh] sm:h-96', 
      'bottom': 'h-[55vh] sm:h-96'
    },
    lg: {
      'left': 'w-[90vw] sm:w-[28rem]',
      'right': 'w-[90vw] sm:w-[28rem]',
      'top': 'h-[70vh] sm:h-[28rem]',
      'bottom': 'h-[70vh] sm:h-[28rem]'
    },
    xl: {
      'left': 'w-[95vw] sm:w-[32rem]',
      'right': 'w-[95vw] sm:w-[32rem]',
      'top': 'h-[85vh] sm:h-[32rem]',
      'bottom': 'h-[85vh] sm:h-[32rem]'
    },
    full: {
      'left': 'w-full',
      'right': 'w-full',
      'top': 'h-full',
      'bottom': 'h-full'
    }
  };

  const positions = {
    left: 'left-0 top-0 h-full',
    right: 'right-0 top-0 h-full',
    top: 'top-0 left-0 w-full',
    bottom: 'bottom-0 left-0 w-full'
  };

  const animations = {
    left: isVisible ? 'translate-x-0' : '-translate-x-full',
    right: isVisible ? 'translate-x-0' : 'translate-x-full',
    top: isVisible ? 'translate-y-0' : '-translate-y-full',
    bottom: isVisible ? 'translate-y-0' : 'translate-y-full'
  };

  return createPortal(
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div 
        className={cn('fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm transition-opacity duration-300 ease-in-out', isVisible ? 'opacity-100' : 'opacity-0')}
        aria-hidden="true"
      />
      
      {/* Sheet Content */}
      <div
        ref={contentRef}
        className={cn(`
          fixed flex flex-col bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700/50 shadow-xl dark:shadow-2xl border ${positions[side]} ${side === 'left' ? 'rounded-r-2xl' : ''} ${side === 'right' ? 'rounded-l-2xl' : ''} ${side === 'top' ? 'rounded-b-2xl' : ''} ${side === 'bottom' ? 'rounded-t-2xl' : ''} ${sizes[size][side]} transform transition-transform duration-300 ease-in
        `)}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        {...props}
      >
        {/* Close Button */}
        {showClose && (
          <button
            onClick={() => onOpenChange(false)}
            className="
              absolute top-4 right-4 p-1 rounded-md
              text-neutral-500 dark:text-neutral-400
              hover:text-neutral-700 dark:hover:text-neutral-200
              hover:bg-neutral-100 dark:hover:bg-neutral-800
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500/50
              transition-colors duration-200 ease-in-out
              z-10
            "
            aria-label="Close sheet"
          >
            <svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </button>
        )}
        
        {children}
      </div>
    </div>,
    document.body
  );
};

// Sheet Header
export const SheetHeader: React.FC<SheetHeaderProps> = ({ 
  children, 
  className = '', 
  ...props 
}) => {
  return (
    <div 
      className={cn('px-6 py-5 border-b border-neutral-100 dark:border-neutral-700/50 not-prose', className)}
      {...props}
    >
      {children}
    </div>
  );
};

// Sheet Title
export const SheetTitle: React.FC<SheetTitleProps> = ({ 
  children, 
  className = '', 
  as: Component = 'h2', 
  ...props 
}) => {
  return React.createElement(
    Component,
    {
      className: cn('text-lg font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight leading-tight not-prose', className),
      ...props
    },
    children
  );
};

// Sheet Description
export const SheetDescription: React.FC<SheetDescriptionProps> = ({ 
  children, 
  className = '', 
  ...props 
}) => {
  return (
    <p 
      className={cn('text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mt-1 not-prose', className)}
      {...props}
    >
      {children}
    </p>
  );
};

// Sheet Footer
export const SheetFooter: React.FC<SheetFooterProps> = ({ 
  children, 
  className = '', 
  ...props 
}) => {
  return (
    <div 
      className={cn('px-6 py-4 mt-auto bg-neutral-50 dark:bg-neutral-800/50 border-t border-neutral-100 dark:border-neutral-700/50 flex items-center justify-end gap-3 not-prose', className)}
      {...props}
    >
      {children}
    </div>
  );
};

// Sheet Close
export const SheetClose: React.FC<SheetCloseProps> = ({ 
  children, 
  className = '', 
  asChild = false,
  onClick,
  ...props 
}) => {
  const { onOpenChange } = useSheet();

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
      className={cn(`
        inline-flex items-center justify-center rounded-lg font-medium px-4 py-2 text-sm bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset
      `)}
      onClick={handleClick}
      {...props}
    >
      {children || 'Close'}
    </button>
  );
}; 