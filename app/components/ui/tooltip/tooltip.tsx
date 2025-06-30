'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

export interface TooltipProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  delayDuration?: number;
}

export interface TooltipTriggerProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  asChild?: boolean;
  className?: string;
}

export interface TooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  alignOffset?: number;
  showArrow?: boolean;
}

// Tooltip Context
interface TooltipContextType {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  delayDuration: number;
}

const TooltipContext = React.createContext<TooltipContextType | undefined>(undefined);

const useTooltip = () => {
  const context = React.useContext(TooltipContext);
  if (!context) {
    throw new Error('Tooltip components must be used within a Tooltip');
  }
  return context;
};

// Main Tooltip Component
export const Tooltip: React.FC<TooltipProps> = ({ 
  children, 
  open: controlledOpen, 
  onOpenChange,
  delayDuration = 400,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);
  
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  return (
    <TooltipContext.Provider value={{ 
      open, 
      onOpenChange: setOpen, 
      triggerRef,
      delayDuration 
    }}>
      {children}
    </TooltipContext.Provider>
  );
};

// Tooltip Trigger
export const TooltipTrigger: React.FC<TooltipTriggerProps> = ({ 
  children, 
  className = '', 
  asChild = false,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  ...props 
}) => {
  const { onOpenChange, triggerRef, delayDuration } = useTooltip();
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const leaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      onOpenChange(true);
    }, delayDuration);
    onMouseEnter?.(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    leaveTimeoutRef.current = setTimeout(() => {
      onOpenChange(false);
    }, 100); // Short delay to allow moving to tooltip
    onMouseLeave?.(e);
  };

  const handleFocus = (e: React.FocusEvent<HTMLElement>) => {
    onOpenChange(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
    onOpenChange(false);
    onBlur?.(e);
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      if (leaveTimeoutRef.current) {
        clearTimeout(leaveTimeoutRef.current);
      }
    };
  }, []);

  if (asChild && React.isValidElement(children)) {
    type ChildProps = React.HTMLAttributes<HTMLElement> & {
      onMouseEnter?: React.MouseEventHandler<HTMLElement>;
      onMouseLeave?: React.MouseEventHandler<HTMLElement>;
      onFocus?: React.FocusEventHandler<HTMLElement>;
      onBlur?: React.FocusEventHandler<HTMLElement>;
    };
    
    const childElement = children as React.ReactElement<ChildProps>;
    
    // For ref handling, we need to type it more specifically
    type ElementWithRef = React.ReactElement & { 
      ref?: React.Ref<HTMLElement> | undefined;
    };
    
    return React.cloneElement(childElement, {
      ref: (node: HTMLElement | null) => {
        // Set our ref
        if (triggerRef) {
          triggerRef.current = node;
        }
        // Forward to the child's ref if it exists
        const childWithRef = children as ElementWithRef;
        const childRef = childWithRef.ref;
        if (typeof childRef === 'function') {
          childRef(node);
        } else if (childRef && typeof childRef === 'object' && 'current' in childRef) {
          (childRef as { current: HTMLElement | null }).current = node;
        }
      },
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onFocus: handleFocus,
      onBlur: handleBlur,
      'aria-describedby': 'tooltip',
      ...childElement.props,
    } as Partial<ChildProps> & { ref: React.Ref<HTMLElement> });
  }

  return (
    <span
      ref={triggerRef}
      className={cn('inline-block cursor-default not-prose', className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      aria-describedby="tooltip"
      {...props}
    >
      {children}
    </span>
  );
};

// Tooltip Content
export const TooltipContent: React.FC<TooltipContentProps> = ({ 
  children, 
  className = '', 
  side = 'top',
  align = 'center',
  sideOffset = 8,
  alignOffset = 0,
  showArrow = true,
  onMouseEnter,
  onMouseLeave,
  ...props 
}) => {
  const { open, onOpenChange, triggerRef } = useTooltip();
  const contentRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [actualSide, setActualSide] = useState<'top' | 'bottom' | 'left' | 'right'>(side);

  // Calculate position when tooltip should open
  useEffect(() => {
    if (!open) {
      setPosition(null);
      setIsVisible(false);
      setIsMeasuring(false);
      setActualSide(side);
      return;
    }

    // Start measuring phase
    setIsMeasuring(true);
    setIsVisible(false);
    
  }, [open, side]);

  // Calculate position after measuring render
  useEffect(() => {
    if (!isMeasuring || !contentRef.current || !triggerRef.current) return;

    const calculatePosition = () => {
      const triggerRect = triggerRef.current!.getBoundingClientRect();
      const contentRect = contentRef.current!.getBoundingClientRect();
      
      // If content has no dimensions yet, try again
      if (contentRect.width === 0 || contentRect.height === 0) {
        requestAnimationFrame(calculatePosition);
        return;
      }
      
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const margin = 8; // Minimum margin from viewport edge

      // Helper function to calculate position for a given side
      const getPositionForSide = (targetSide: 'top' | 'bottom' | 'left' | 'right') => {
        let x = 0;
        let y = 0;

        switch (targetSide) {
          case 'top':
            x = triggerRect.left + triggerRect.width / 2 - contentRect.width / 2;
            y = triggerRect.top - contentRect.height - sideOffset;
            break;
          case 'bottom':
            x = triggerRect.left + triggerRect.width / 2 - contentRect.width / 2;
            y = triggerRect.bottom + sideOffset;
            break;
          case 'left':
            x = triggerRect.left - contentRect.width - sideOffset;
            y = triggerRect.top + triggerRect.height / 2 - contentRect.height / 2;
            break;
          case 'right':
            x = triggerRect.right + sideOffset;
            y = triggerRect.top + triggerRect.height / 2 - contentRect.height / 2;
            break;
        }

        // Apply alignment offset
        if (targetSide === 'top' || targetSide === 'bottom') {
          if (align === 'start') x = triggerRect.right - contentRect.width + alignOffset;
          if (align === 'end') x = triggerRect.left + alignOffset;
        } else {
          if (align === 'start') y = triggerRect.bottom - contentRect.height + alignOffset;
          if (align === 'end') y = triggerRect.top + alignOffset;
        }

        return { x, y };
      };

      // Helper function to check if position fits in viewport
      const fitsInViewport = (x: number, y: number) => {
        return x >= margin && 
               x + contentRect.width <= viewportWidth - margin && 
               y >= margin && 
               y + contentRect.height <= viewportHeight - margin;
      };

      // Try preferred side first
      let bestSide = side;
      let { x, y } = getPositionForSide(side);

      // If preferred side doesn't fit, try the opposite side
      if (!fitsInViewport(x, y)) {
        let oppositeSide: 'top' | 'bottom' | 'left' | 'right';
        
        switch (side) {
          case 'top':
            oppositeSide = 'bottom';
            break;
          case 'bottom':
            oppositeSide = 'top';
            break;
          case 'left':
            oppositeSide = 'right';
            break;
          case 'right':
            oppositeSide = 'left';
            break;
        }

        const oppositePosition = getPositionForSide(oppositeSide);
        
        // If opposite side fits, use it
        if (fitsInViewport(oppositePosition.x, oppositePosition.y)) {
          bestSide = oppositeSide;
          x = oppositePosition.x;
          y = oppositePosition.y;
        } else {
          // If neither fits perfectly, choose the one with more space
          const preferredSpaceAvailable = 
            side === 'top' ? triggerRect.top : 
            side === 'bottom' ? viewportHeight - triggerRect.bottom :
            side === 'left' ? triggerRect.left :
            viewportWidth - triggerRect.right;
          
          const oppositeSpaceAvailable = 
            oppositeSide === 'top' ? triggerRect.top : 
            oppositeSide === 'bottom' ? viewportHeight - triggerRect.bottom :
            oppositeSide === 'left' ? triggerRect.left :
            viewportWidth - triggerRect.right;

          if (oppositeSpaceAvailable > preferredSpaceAvailable) {
            bestSide = oppositeSide;
            x = oppositePosition.x;
            y = oppositePosition.y;
          }
        }
      }

      // Constrain to viewport boundaries as fallback
      x = Math.max(margin, Math.min(x, viewportWidth - contentRect.width - margin));
      y = Math.max(margin, Math.min(y, viewportHeight - contentRect.height - margin));

      setActualSide(bestSide);
      setPosition({ x, y });
      setIsMeasuring(false);
      
      // Show tooltip in next frame for smooth animation
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    };

    // Calculate position in next frame to ensure element is rendered
    requestAnimationFrame(calculatePosition);
    
  }, [isMeasuring, side, align, sideOffset, alignOffset, triggerRef]);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    // Keep tooltip open when hovering over it
    onMouseEnter?.(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    onOpenChange(false);
    onMouseLeave?.(e);
  };

  // Don't render anything if not open
  if (!open) return null;

  const tooltipContent = (
    <div
      ref={contentRef}
      id="tooltip"
      role="tooltip"
      className={cn(`
        fixed z-50 px-3 py-2 text-sm
        bg-neutral-900 dark:bg-neutral-100
        text-neutral-100 dark:text-neutral-900
        border border-neutral-700 dark:border-neutral-300
        rounded-lg shadow-lg
        pointer-events-auto
        transition-opacity duration-200 ease-in-out
        not-prose
        ${className}
        ${isMeasuring 
          ? 'opacity-0 pointer-events-none' 
          : isVisible && position
            ? 'opacity-100 scale-100' 
            : 'opacity-0 scale-95'
        }
      `)}
      style={{
        left: position ? `${position.x}px` : '0px',
        top: position ? `${position.y}px` : '0px',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
      
      {showArrow && !isMeasuring && (
        <div
          className={cn(`
            absolute w-2 h-2
            bg-neutral-900 dark:bg-neutral-100
            border border-neutral-700 dark:border-neutral-300
            rotate-45
            ${actualSide === 'top' ? 'bottom-[-5px] left-1/2 -translate-x-1/2 border-t-0 border-l-0' : ''}
            ${actualSide === 'bottom' ? 'top-[-5px] left-1/2 -translate-x-1/2 border-b-0 border-r-0' : ''}
            ${actualSide === 'left' ? 'right-[-5px] top-1/2 -translate-y-1/2 border-l-0 border-b-0' : ''}
            ${actualSide === 'right' ? 'left-[-5px] top-1/2 -translate-y-1/2 border-r-0 border-t-0' : ''}
          `)}
        />
      )}
    </div>
  );

  return createPortal(tooltipContent, document.body);
};