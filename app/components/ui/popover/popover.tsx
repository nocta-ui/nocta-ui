'use client';

import React, { useState, useRef, useEffect, useId, useCallback } from 'react';
import { cn } from '@/lib/utils';

// Popover interfaces
export interface PopoverProps {
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface PopoverTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
  className?: string;
}

export interface PopoverContentProps {
  children: React.ReactNode;
  className?: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  alignOffset?: number;
  avoidCollisions?: boolean;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onPointerDownOutside?: (event: PointerEvent) => void;
}

export interface PopoverArrowProps {
  className?: string;
  width?: number;
  height?: number;
}

// Context for Popover state management
const PopoverContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  contentId: string;
}>({
  open: false,
  setOpen: () => {},
  triggerRef: { current: null },
  contentId: '',
});

// Main Popover Component
export const Popover: React.FC<PopoverProps> = ({
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const triggerRef = useRef<HTMLElement>(null);
  const contentId = useId();

  const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;

  const setOpen = (newOpen: boolean) => {
    if (controlledOpen === undefined) {
      setUncontrolledOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  };

  return (
    <PopoverContext.Provider
      value={{
        open,
        setOpen,
        triggerRef,
        contentId,
      }}
    >
      <div className="relative not-prose">
        {children}
      </div>
    </PopoverContext.Provider>
  );
};

// Popover Trigger
export const PopoverTrigger: React.FC<PopoverTriggerProps> = ({
  children,
  asChild = false,
  className = '',
}) => {
  const { open, setOpen, triggerRef, contentId } = React.useContext(PopoverContext);

  const handleClick = () => {
    setOpen(!open);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setOpen(!open);
    }
  };

  if (asChild && React.isValidElement(children)) {
    const childProps = children.props as Record<string, unknown>;
    return React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
      ref: triggerRef,
      'aria-expanded': open,
      'aria-controls': contentId,
      'aria-haspopup': 'dialog',
      onClick: handleClick,
      onKeyDown: handleKeyDown,
      className: `${(childProps.className as string) || ''} ${className}`.trim(),
    });
  }

  return (
    <button
      ref={triggerRef as React.RefObject<HTMLButtonElement>}
      type="button"
      aria-expanded={open}
      aria-controls={contentId}
      aria-haspopup="dialog"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`
        inline-flex items-center justify-center
        rounded-lg border border-nocta-300 dark:border-nocta-700/50
        bg-linear-to-b from-white to-nocta-200 dark:from-nocta-900 dark:to-nocta-800
        px-3 py-2 text-sm font-medium
        text-nocta-900 dark:text-nocta-100
        hover:bg-nocta-50 dark:hover:bg-nocta-800
        focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-2
        focus-visible:ring-nocta-500/50 dark:focus-visible:ring-nocta-400/50
        focus-visible:ring-offset-white/50 dark:focus-visible:ring-offset-nocta-900/50
        transition-colors duration-200
        not-prose
        ${className}
      `}
    >
      {children}
    </button>
  );
};

// Popover Content
export const PopoverContent: React.FC<PopoverContentProps> = ({
  children,
  className = '',
  side = 'bottom',
  align = 'center',
  sideOffset = 8,
  alignOffset = 0,
  avoidCollisions = true,
  onEscapeKeyDown,
  onPointerDownOutside,
}) => {
  const { open, setOpen, triggerRef, contentId } = React.useContext(PopoverContext);
  const contentRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const [actualSide, setActualSide] = useState(side);
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [isMeasuring, setIsMeasuring] = useState(false);



  // Handle open/close animations
  useEffect(() => {
    if (open) {
      setShouldRender(true);
      setIsMeasuring(true);
      setIsVisible(false);
      setPosition(null);
    } else {
      setIsVisible(false);
      setIsMeasuring(false);
      // Don't reset position immediately - keep it for smooth close animation
      const timer = setTimeout(() => {
        setShouldRender(false);
        setPosition(null); // Reset position only after animation completes
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Shared position calculation function
  const calculatePosition = useCallback(() => {
    if (!contentRef.current || !triggerRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const contentRect = contentRef.current.getBoundingClientRect();
    
    // If content has no dimensions yet, try again
    if (contentRect.width === 0 || contentRect.height === 0) {
      if (isMeasuring) {
        requestAnimationFrame(calculatePosition);
      }
      return;
    }

    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    let finalSide = side;
    let top = 0;
    let left = 0;

    // Calculate base position
    switch (side) {
      case 'top':
        top = triggerRect.top - contentRect.height - sideOffset;
        break;
      case 'bottom':
        top = triggerRect.bottom + sideOffset;
        break;
      case 'left':
        left = triggerRect.left - contentRect.width - sideOffset;
        break;
      case 'right':
        left = triggerRect.right + sideOffset;
        break;
    }

    // Calculate alignment
    if (side === 'top' || side === 'bottom') {
      switch (align) {
        case 'start':
          left = triggerRect.left + alignOffset;
          break;
        case 'center':
          left = triggerRect.left + triggerRect.width / 2 - contentRect.width / 2 + alignOffset;
          break;
        case 'end':
          left = triggerRect.right - contentRect.width + alignOffset;
          break;
      }
    } else {
      switch (align) {
        case 'start':
          top = triggerRect.top + alignOffset;
          break;
        case 'center':
          top = triggerRect.top + triggerRect.height / 2 - contentRect.height / 2 + alignOffset;
          break;
        case 'end':
          top = triggerRect.bottom - contentRect.height + alignOffset;
          break;
      }
    }

    // Collision detection
    if (avoidCollisions) {
      // Check if content goes outside viewport and flip if needed
      if (side === 'top' && top < 0) {
        finalSide = 'bottom';
        top = triggerRect.bottom + sideOffset;
      } else if (side === 'bottom' && top + contentRect.height > viewport.height) {
        finalSide = 'top';
        top = triggerRect.top - contentRect.height - sideOffset;
      } else if (side === 'left' && left < 0) {
        finalSide = 'right';
        left = triggerRect.right + sideOffset;
      } else if (side === 'right' && left + contentRect.width > viewport.width) {
        finalSide = 'left';
        left = triggerRect.left - contentRect.width - sideOffset;
      }

      // Keep content within viewport bounds
      if (side === 'top' || side === 'bottom') {
        left = Math.max(8, Math.min(left, viewport.width - contentRect.width - 8));
      } else {
        top = Math.max(8, Math.min(top, viewport.height - contentRect.height - 8));
      }
    }

    setPosition({ top, left });
    setActualSide(finalSide);
    
    // Show popover in next frame for smooth animation (only during initial measuring)
    if (isMeasuring) {
      setIsMeasuring(false);
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    }
  }, [side, align, sideOffset, alignOffset, avoidCollisions, isMeasuring, triggerRef]);

  // Calculate position after measuring render
  useEffect(() => {
    if (!isMeasuring) return;
    
    // Calculate position in next frame to ensure element is rendered
    requestAnimationFrame(calculatePosition);
    
  }, [isMeasuring, calculatePosition]);

  // Update position on scroll and resize
  useEffect(() => {
    if (!open || isMeasuring) return;

    window.addEventListener('scroll', calculatePosition, true); // Use capture for all scroll events
    window.addEventListener('resize', calculatePosition);

    return () => {
      window.removeEventListener('scroll', calculatePosition, true);
      window.removeEventListener('resize', calculatePosition);
    };
  }, [open, isMeasuring, calculatePosition]);

  // Handle escape key and outside clicks
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onEscapeKeyDown?.(event);
        if (!event.defaultPrevented) {
          setOpen(false);
        }
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      const isClickInContent = contentRef.current?.contains(target);
      const isClickInTrigger = triggerRef.current?.contains(target);

      if (!isClickInContent && !isClickInTrigger) {
        onPointerDownOutside?.(event);
        if (!event.defaultPrevented) {
          setOpen(false);
        }
      }
    };

    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('pointerdown', handlePointerDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [open, onEscapeKeyDown, onPointerDownOutside, setOpen, triggerRef]);

  if (!shouldRender) return null;

  const animationStyles = `
    transform transition-opacity transition-scale transition-transform duration-200 ease-out
    ${isMeasuring 
      ? 'opacity-0 pointer-events-none' 
      : isVisible && position
        ? 'translate-y-0 opacity-100 scale-100' 
        : actualSide === 'top' 
          ? 'translate-y-1 opacity-0 scale-95'
          : actualSide === 'bottom'
          ? '-translate-y-1 opacity-0 scale-95'
          : actualSide === 'left'
          ? 'translate-x-1 opacity-0 scale-95'
          : '-translate-x-1 opacity-0 scale-95'
    }
  `;

  return (
    <div className='relative p-[1px] bg-linear-to-b from-nocta-500/20 to-transparent rounded-xl'>
      <div
      ref={contentRef}
      id={contentId}
      role="dialog"
      aria-modal="false"
      style={{
        position: 'fixed',
        top: position ? `${position.top}px` : '0px',
        left: position ? `${position.left}px` : '0px',
        zIndex: 50,
      }}
      className={cn('w-fit min-w-[8rem] max-w-[var(--popover-content-available-width,_theme(spacing.80))] rounded-lg border border-nocta-300 dark:border-nocta-700/50 bg-linear-to-b from-white to-nocta-200 dark:from-nocta-900 dark:to-nocta-800 p-4 shadow-lg dark:shadow-xl', animationStyles, 'not-prose', className)}
    >
      {children}
    </div>
    </div>
  );
};

// Popover Arrow
export const PopoverArrow: React.FC<PopoverArrowProps> = ({
  className = '',
  width = 12,
  height = 6,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 12 6"
      className={cn('fill-white dark:fill-nocta-900 stroke-nocta-200 dark:stroke-nocta-700/50', className)}
    >
      <path d="M0 6L6 0L12 6" strokeWidth={1} />
    </svg>
  );
}; 