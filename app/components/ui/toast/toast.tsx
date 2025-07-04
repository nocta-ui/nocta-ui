'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';

const hasBackgroundColor = (className: string = '') => {
  return /bg-(?!linear|gradient|none)\w+/.test(className);
};

// Toast types
export type ToastPosition = 
  | 'top-left' 
  | 'top-center' 
  | 'top-right'
  | 'bottom-left' 
  | 'bottom-center' 
  | 'bottom-right';

export interface ToastData {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'success' | 'warning' | 'destructive';
  className?: string;
  duration?: number;
  position?: ToastPosition; // Position of the toast on screen
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose?: () => void;
  shouldClose?: boolean; // Flag for programmatic closing with animation
}

interface ToastContextValue {
  toast: (data: Omit<ToastData, 'id'>) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

/**
 * Hook to use toast functionality
 * 
 * @example
 * const { toast } = useToast();
 * 
 * toast({
 *   title: "Success",
 *   description: "Your action was completed",
 *   variant: "success",
 *   position: "top-right", // Optional: defaults to "bottom-center"
 *   duration: 5000, // Optional: defaults to 5000ms
 *   action: { // Optional
 *     label: "Undo",
 *     onClick: () => console.log("Undo clicked")
 *   }
 * });
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Individual Toast Component
interface ToastItemProps {
  toast: ToastData & { index: number; total: number };
  onRemove: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove }) => {
  const toastRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isExiting = useRef(false);
  const hasAnimatedIn = useRef(false);
  const animationRef = useRef<gsap.core.Tween | null>(null);

  const { id, title, description, variant = 'default', duration = 5000, action, index, shouldClose, position = 'bottom-center', className = '' } = toast;
  
  const shouldRemoveGradient = hasBackgroundColor(className);

  const variants = {
    default: shouldRemoveGradient 
      ? 'bg-none border-nocta-300 dark:border-nocta-800/50' 
      : 'bg-linear-to-b from-white to-nocta-200 dark:from-nocta-950 dark:to-nocta-900 border-nocta-300 dark:border-nocta-800/50',
    success: 'bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800/50 text-green-900 dark:text-green-100',
    warning: 'bg-yellow-50 dark:bg-yellow-950/50 border-yellow-200 dark:border-yellow-800/50 text-yellow-900 dark:text-yellow-100',
    destructive: 'bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800/50 text-red-900 dark:text-red-100'
  };

  // Position styles and animation configurations
  const positionConfig = {
    'top-left': {
      containerClass: 'top-4 left-4',
      widthClass: 'max-w-sm w-full',
      animateIn: { x: -100, y: -20 },
      animateOut: { x: -100, y: -20 }
    },
    'top-center': {
      containerClass: 'top-4 left-1/2 transform -translate-x-1/2',
      widthClass: 'max-w-sm w-full',
      animateIn: { x: 0, y: -100 },
      animateOut: { x: 0, y: -100 }
    },
    'top-right': {
      containerClass: 'top-4 right-4',
      widthClass: 'max-w-sm w-full',
      animateIn: { x: 100, y: -20 },
      animateOut: { x: 100, y: -20 }
    },
    'bottom-left': {
      containerClass: 'bottom-4 left-4',
      widthClass: 'max-w-sm w-full',
      animateIn: { x: -100, y: 20 },
      animateOut: { x: -100, y: 100 }
    },
    'bottom-center': {
      containerClass: 'bottom-4 left-1/2 transform -translate-x-1/2',
      widthClass: 'max-w-sm w-full',
      animateIn: { x: 0, y: 100 },
      animateOut: { x: 0, y: 100 }
    },
    'bottom-right': {
      containerClass: 'bottom-4 right-4',
      widthClass: 'max-w-sm w-full',
      animateIn: { x: 100, y: 20 },
      animateOut: { x: 100, y: 100 }
    }
  };

  const config = positionConfig[position];

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

  const handleClose = useCallback(() => {
    if (!toastRef.current || isExiting.current) return;

    isExiting.current = true;

    if (animationRef.current) {
      animationRef.current.kill();
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    animationRef.current = gsap.to(toastRef.current, {
      x: config.animateOut.x,
      y: config.animateOut.y,
      opacity: 0,
      scale: 0.9,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        onRemove(id);
      }
    });
  }, [id, onRemove, config.animateOut]);

  // Handle programmatic close via shouldClose flag
  useEffect(() => {
    if (shouldClose) {
      handleClose();
    }
  }, [shouldClose, handleClose]);

  useEffect(() => {
    if (!toastRef.current || isExiting.current) return;

    const element = toastRef.current;
    const isLatest = index === 0;
    const isTopPosition = position.startsWith('top-');
    const offset = isTopPosition ? index * 8 : -(index * 8);
    const scale = Math.max(0.92, 1 - index * 0.04);

    if (animationRef.current) {
      animationRef.current.kill();
    }

    if (!hasAnimatedIn.current && isLatest) {
      hasAnimatedIn.current = true;
      
      gsap.set(element, {
        x: config.animateIn.x,
        y: config.animateIn.y,
        opacity: 0,
        scale: 0.9,
        zIndex: 50 - index
      });

      animationRef.current = gsap.to(element, {
        x: 0,
        y: offset,
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: 'power2.out',
        force3D: true,
        delay: 0.01,
        onComplete: () => {
          if (isLatest) {
            const focusableElements = getFocusableElements();
            if (focusableElements.length > 0) {
              focusableElements[0].focus();
            } else {
              element.focus();
            }
          }
        }
      });
    } else {
      gsap.set(element, { zIndex: 50 - index });
      
      animationRef.current = gsap.to(element, {
        x: 0,
        y: offset,
        scale: isLatest ? 1 : scale,
        opacity: index >= 3 ? 0 : 1,
        duration: 0.3,
        ease: 'power2.out',
        force3D: true,
        onComplete: () => {
          if (index >= 3) {
            onRemove(id);
          } else if (isLatest && !hasAnimatedIn.current) {
            hasAnimatedIn.current = true;
            const focusableElements = getFocusableElements();
            if (focusableElements.length > 0) {
              focusableElements[0].focus();
            } else {
              element.focus();
            }
          }
        }
      });
    }
  }, [index, position, config.animateIn.x, config.animateIn.y, id, onRemove]);

  useEffect(() => {
    if (shouldClose || !hasAnimatedIn.current) return;
    
    if (duration > 0) {
      timeoutRef.current = setTimeout(() => {
        handleClose();
      }, duration);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [duration, shouldClose, handleClose]);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Enhanced keyboard handling with focus trap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isLatest = index === 0;
      
      if (e.key === 'Escape' && isLatest) {
        handleClose();
        return;
      }

      // Focus trap only for the latest toast
      if (e.key === 'Tab' && isLatest) {
        const focusableElements = getFocusableElements();
        if (focusableElements.length === 0) return;

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
    };

    // Only add listeners for the latest toast
    if (index === 0) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleClose, index]);

  return (
    <div
      ref={toastRef}
      className={cn(
        `fixed ${config.containerClass} ${config.widthClass} ${variants[variant]} border rounded-lg shadow-lg dark:shadow-xl backdrop-blur-sm overflow-hidden not-prose pointer-events-auto will-change-transform`,
        className
      )}
      style={{ 
        zIndex: 50 - index,
        transformOrigin: position.startsWith('top-') ? 'center top' : 'center bottom'
      }}
      role="alert"
      aria-live="polite"
      tabIndex={-1}
    >
      {/* Close button */}
      <button
        onClick={handleClose}
        className="
          absolute top-2 right-2 p-1 rounded-md
          text-nocta-400 dark:text-nocta-500
          hover:text-nocta-600 dark:hover:text-nocta-300
          hover:bg-nocta-100/50 dark:hover:bg-nocta-800/50
          transition-colors duration-200
          focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-nocta-500/50
        "
        aria-label="Close toast"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      <div className="p-4 pr-8">
        {title && (
          <div className="font-semibold text-sm mb-1 leading-tight">
            {title}
          </div>
        )}
        {description && (
          <div className="text-sm opacity-90 leading-relaxed">
            {description}
          </div>
        )}
        {action && (
          <div className="mt-3">
            <button
              onClick={() => {
                action.onClick();
                handleClose();
              }}
              className="
                inline-flex items-center justify-center rounded-md
                px-3 py-1.5 text-sm font-medium
                bg-linear-to-b from-nocta-900 to-nocta-700 dark:from-white dark:to-nocta-300
                text-nocta-50 dark:text-nocta-900
                hover:bg-nocta-900 dark:hover:bg-nocta-200
                focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-nocta-500/50
                transition-colors duration-200 cursor-pointer
              "
            >
              {action.label}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Toast Manager Component
const ToastManager: React.FC<{ 
  toasts: (ToastData & { index: number; total: number })[], 
  onRemove: (id: string) => void 
}> = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null;

  // Group toasts by position for proper stacking
  const toastsByPosition = toasts.reduce((acc, toast) => {
    const pos = toast.position || 'bottom-center';
    if (!acc[pos]) acc[pos] = [];
    acc[pos].push(toast);
    return acc;
  }, {} as Record<ToastPosition, (ToastData & { index: number; total: number })[]>);

  // Recalculate indices within each position group
  Object.keys(toastsByPosition).forEach(position => {
    toastsByPosition[position as ToastPosition] = toastsByPosition[position as ToastPosition].map((toast, index) => ({
      ...toast,
      index, // Reset index to be relative to position group
      total: toastsByPosition[position as ToastPosition].length
    }));
  });

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {Object.entries(toastsByPosition).map(([position, positionToasts]) => (
        <div key={position}>
          {positionToasts.map((toast) => (
            <ToastItem
              key={toast.id}
              toast={toast}
              onRemove={onRemove}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

// Toast Provider
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const toast = useCallback((data: Omit<ToastData, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 11);
    const newToast: ToastData = { ...data, id };
    
    setToasts(prev => [newToast, ...prev]); // Add to beginning for proper stacking
    return id;
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    // Set shouldClose flag on all toasts with staggered delay
    setToasts(prev => {
      prev.forEach((toast) => {
        setTimeout(() => {
          setToasts(current => 
            current.map(t => 
              t.id === toast.id 
                ? { ...t, shouldClose: true, duration: 0 }
                : t
            )
          );
        });
      });
      
      return prev; // Return unchanged initially
    });
  }, []);

  // Add index and total to each toast for positioning
  const toastsWithIndex = toasts.map((toast, index) => ({
    ...toast,
    index,
    total: toasts.length
  }));

  return (
    <ToastContext.Provider value={{ toast, dismiss, dismissAll }}>
      {children}
      <ToastManager toasts={toastsWithIndex} onRemove={dismiss} />
    </ToastContext.Provider>
  );
};