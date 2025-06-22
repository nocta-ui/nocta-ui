'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  duration?: number;
  visible?: boolean;
  onClose?: () => void;
  className?: string;
}

export interface ToastHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export interface ToastTitleProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export interface ToastDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
  className?: string;
}

export interface ToastActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export interface ToastCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  onClose?: () => void;
}

// Base Toast Component
export const Toast: React.FC<ToastProps> = ({ 
  children, 
  duration = 5000,
  visible = true,
  onClose,
  className = '', 
  ...props 
}) => {
  const [isVisible, setIsVisible] = useState(visible);
  const [isAnimating, setIsAnimating] = useState(true); // Start with animation state
  const toastRef = useRef<HTMLDivElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Trigger enter animation and focus management
    if (visible) {
      // Store the currently active element to restore focus later
      previousActiveElementRef.current = document.activeElement as HTMLElement;
      
      const enterTimer = setTimeout(() => {
        setIsAnimating(false);
        // Focus the toast for accessibility
        if (toastRef.current) {
          toastRef.current.focus();
        }
      }, 50); // Small delay to ensure the component is mounted

      return () => clearTimeout(enterTimer);
    }
  }, [visible]);

  const handleClose = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
      // Restore focus to the previously active element without scrolling
      if (previousActiveElementRef.current) {
        previousActiveElementRef.current.focus({ preventScroll: true });
      }
    }, 200);
  }, [onClose]);

  // Focus trap functionality
  const getFocusableElements = () => {
    if (!toastRef.current) return [];
    
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'textarea:not([disabled])',
      'select:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ');
    
    return Array.from(toastRef.current.querySelectorAll(focusableSelectors)) as HTMLElement[];
  };

  const handleGlobalKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose();
      return;
    }

    if (e.key === 'Tab') {
      const focusableElements = getFocusableElements();
      
      // If no focusable elements, prevent tabbing and keep focus on toast
      if (focusableElements.length === 0) {
        e.preventDefault();
        toastRef.current?.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement as HTMLElement;

      if (e.shiftKey) {
        // Shift + Tab (backward)
        if (activeElement === firstElement || !toastRef.current?.contains(activeElement)) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab (forward)
        if (activeElement === lastElement || !toastRef.current?.contains(activeElement)) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  }, [handleClose]);

  useEffect(() => {
    if (visible && duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration, handleClose]);

  // Add event listeners for focus trap
  useEffect(() => {
    if (!visible) return;

    document.addEventListener('keydown', handleGlobalKeyDown);

    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [visible, handleGlobalKeyDown]);

  if (!isVisible) return null;

  const baseStyles = `
    fixed bottom-4 right-4 z-50
    max-w-sm w-full
    bg-white dark:bg-neutral-900 
    border border-neutral-200 dark:border-neutral-700/50 
    rounded-lg
    shadow-lg dark:shadow-xl 
    backdrop-blur-sm 
    overflow-hidden 
    not-prose
    transition-all duration-200 ease-out
    ${isAnimating ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
  `;

  return (
    <div 
      ref={toastRef}
      className={`
        ${baseStyles}
        ${className}
      `}
      role="alert"
      tabIndex={-1}
      {...props}
    >
      {children}
    </div>
  );
};

// Toast Header
export const ToastHeader: React.FC<ToastHeaderProps> = ({ 
  children, 
  className = '', 
  ...props 
}) => {
  return (
    <div 
      className={`
        px-6 py-4 
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

// Toast Title
export const ToastTitle: React.FC<ToastTitleProps> = ({ 
  children, 
  className = '', 
  as: Component = 'h4', 
  ...props 
}) => {
  return React.createElement(
    Component,
    {
      className: `
        text-sm font-semibold 
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

// Toast Description
export const ToastDescription: React.FC<ToastDescriptionProps> = ({ 
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

// Toast Actions
export const ToastActions: React.FC<ToastActionsProps> = ({ 
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
        flex items-center justify-end gap-2 
        not-prose 
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

// Toast Close Button
export const ToastClose: React.FC<ToastCloseProps> = ({ 
  className = '', 
  onClose,
  ...props 
}) => {
  return (
    <button
      className={`
        absolute top-2 right-2
        p-1 rounded-md 
        text-neutral-400 dark:text-neutral-500
        hover:text-neutral-600 dark:hover:text-neutral-300
        hover:bg-neutral-100 dark:hover:bg-neutral-700/50
        transition-colors duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500
        not-prose
        ${className}
      `}
      onClick={onClose}
      aria-label="Close toast"
      {...props}
    >
      <svg 
        width="14" 
        height="14" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="M18 6L6 18M6 6l12 12" />
      </svg>
    </button>
  );
}; 