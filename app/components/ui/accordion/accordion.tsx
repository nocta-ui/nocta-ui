'use client';

import React, { useState, createContext, useContext, useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';

export interface AccordionProps {
  children: React.ReactNode;
  type?: 'single' | 'multiple';
  variant?: 'default' | 'card';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  defaultValue?: string | string[];
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
}

export interface AccordionItemProps {
  children: React.ReactNode;
  value: string;
  className?: string;
  disabled?: boolean;
}

export interface AccordionTriggerProps {
  children: React.ReactNode;
  className?: string;
}

export interface AccordionContentProps {
  children: React.ReactNode;
  className?: string;
}

// Accordion Context
interface AccordionContextType {
  type: 'single' | 'multiple';
  variant: 'default' | 'card';
  size: 'sm' | 'md' | 'lg';
  openItems: string[];
  toggleItem: (value: string) => void;
  isOpen: (value: string) => boolean;
}

const AccordionContext = createContext<AccordionContextType | undefined>(undefined);

const useAccordion = () => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('Accordion components must be used within an Accordion');
  }
  return context;
};

// Item Context
interface AccordionItemContextType {
  value: string;
  isOpen: boolean;
  disabled: boolean;
}

const AccordionItemContext = createContext<AccordionItemContextType | undefined>(undefined);

const useAccordionItem = () => {
  const context = useContext(AccordionItemContext);
  if (!context) {
    throw new Error('AccordionTrigger and AccordionContent must be used within an AccordionItem');
  }
  return context;
};

// Main Accordion Component
export const Accordion: React.FC<AccordionProps> = React.memo(({
  children,
  type = 'single',
  variant = 'default',
  size = 'md',
  className = '',
  defaultValue,
  value: controlledValue,
  onValueChange,
  ...props
}) => {
  const [internalValue, setInternalValue] = useState<string[]>(() => {
    if (defaultValue) {
      return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
    }
    return [];
  });

  const openItems = useMemo(() => {
    return controlledValue 
      ? (Array.isArray(controlledValue) ? controlledValue : [controlledValue])
      : internalValue;
  }, [controlledValue, internalValue]);

  const toggleItem = useCallback((itemValue: string) => {
    let newValue: string[];

    if (type === 'single') {
      newValue = openItems.includes(itemValue) ? [] : [itemValue];
    } else {
      newValue = openItems.includes(itemValue)
        ? openItems.filter(v => v !== itemValue)
        : [...openItems, itemValue];
    }

    if (!controlledValue) {
      setInternalValue(newValue);
    }

    if (onValueChange) {
      onValueChange(type === 'single' ? newValue[0] || '' : newValue);
    }
  }, [type, openItems, controlledValue, onValueChange]);

  const isOpen = useCallback((itemValue: string) => openItems.includes(itemValue), [openItems]);

  const contextValue = useMemo(() => ({
    type,
    variant,
    size,
    openItems,
    toggleItem,
    isOpen
  }), [type, variant, size, openItems, toggleItem, isOpen]);

  const baseStyles = `
    w-full
    not-prose
  `;

  const variants = {
    default: '',
    card: 'space-y-2'
  };

  return (
    <AccordionContext.Provider value={contextValue}>
      <div
        className={cn(baseStyles, variants[variant], className)}
        {...props}
      >
        {children}
      </div>
    </AccordionContext.Provider>
  );
});

Accordion.displayName = 'Accordion';

// Accordion Item
export const AccordionItem: React.FC<AccordionItemProps> = React.memo(({
  children,
  value,
  className = '',
  disabled = false,
  ...props
}) => {
  const { variant, isOpen } = useAccordion();
  const itemIsOpen = isOpen(value);

  const contextValue = useMemo(() => ({
    value,
    isOpen: itemIsOpen,
    disabled
  }), [value, itemIsOpen, disabled]);

  const baseStyles = `
    transition-all duration-200 ease-in-out
    not-prose
  `;

  const variants = {
    default: `
      border-b border-nocta-300 dark:border-nocta-700/50
      last:border-b-0
    `,
    card: `
      border border-nocta-300 dark:border-nocta-700/50
      rounded-lg overflow-hidden
      bg-linear-to-b from-white to-nocta-200 dark:from-nocta-900 dark:to-nocta-800
      shadow-sm dark:shadow-lg
      ${itemIsOpen ? 'shadow-md dark:shadow-xl' : ''}
    `
  };

  return (
    <AccordionItemContext.Provider value={contextValue}>
      <div
        className={cn(baseStyles, variants[variant], className)}
        {...props}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
});

AccordionItem.displayName = 'AccordionItem';

// Accordion Trigger
export const AccordionTrigger: React.FC<AccordionTriggerProps> = React.memo(({
  children,
  className = '',
  ...props
}) => {
  const { variant, size, toggleItem } = useAccordion();
  const { value, isOpen, disabled } = useAccordionItem();

  const handleClick = useCallback(() => {
    if (!disabled) {
      toggleItem(value);
    }
  }, [disabled, toggleItem, value]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }, [handleClick]);

  const baseStyles = `
    w-full flex items-center justify-between text-left
    transition-all duration-200 ease-in-out
    focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-2
    focus-visible:ring-offset-white/50 dark:focus-visible:ring-offset-nocta-900/50
    focus-visible:ring-nocta-900/50 dark:focus-visible:ring-nocta-100/50
    not-prose
  `;

  const sizeStyles = {
    sm: {
      default: 'py-2 px-0',
      card: 'px-4 py-2'
    },
    md: {
      default: 'py-3 px-0',
      card: 'px-5 py-3'
    },
    lg: {
      default: 'py-4 px-0',
      card: 'px-6 py-4'
    }
  };

  const variants = {
    default: `
      ${sizeStyles[size].default}
      text-nocta-900 dark:text-nocta-100
      hover:text-nocta-700 dark:hover:text-nocta-300
      ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    `,
    card: `
      ${sizeStyles[size].card}
      text-nocta-900 dark:text-nocta-100
      bg-linear-to-b from-white to-nocta-200 dark:from-nocta-900 dark:to-nocta-800
      hover:bg-nocta-50 dark:hover:bg-nocta-800/50
      ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      ${isOpen ? 'bg-nocta-50 dark:bg-nocta-800/50' : ''}
    `
  };

  const sizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const iconSize = useMemo(() => {
    return size === 'sm' ? 14 : size === 'md' ? 16 : 20;
  }, [size]);

  return (
    <button
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-expanded={isOpen}
      disabled={disabled}
      {...props}
    >
      <span className="font-medium">{children}</span>
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`
          transition-transform duration-200 ease-in-out flex-shrink-0 ml-2
          text-nocta-500 dark:text-nocta-400
          will-change-transform
          ${isOpen ? 'rotate-180' : 'rotate-0'}
        `}
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>
  );
});

AccordionTrigger.displayName = 'AccordionTrigger';

// Accordion Content
export const AccordionContent: React.FC<AccordionContentProps> = React.memo(({
  children,
  className = '',
  ...props
}) => {
  const { variant, size } = useAccordion();
  const { isOpen } = useAccordionItem();
  const contentRef = React.useRef<HTMLDivElement>(null);
  const innerRef = React.useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(0);
  const rafRef = React.useRef<number | undefined>(undefined);

  const updateHeight = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    
    rafRef.current = requestAnimationFrame(() => {
      if (innerRef.current) {
        const newHeight = innerRef.current.scrollHeight;
        setHeight(newHeight);
      }
    });
  }, []);

  React.useEffect(() => {
    if (!innerRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      updateHeight();
    });
    
    resizeObserver.observe(innerRef.current);
    updateHeight();
    
    return () => {
      resizeObserver.disconnect();
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [updateHeight]);

  React.useEffect(() => {
    updateHeight();
  }, [children, updateHeight]);

  const sizeStyles = {
    sm: {
      default: 'pb-2',
      card: 'px-4 py-2'
    },
    md: {
      default: 'pb-3',
      card: 'px-5 py-3'
    },
    lg: {
      default: 'pb-4',
      card: 'px-6 py-4'
    }
  };

  const sizes = {
    sm: 'text-xs',
    md: 'text-sm', 
    lg: 'text-base'
  };

  const contentStyle = useMemo(() => ({
    height: isOpen ? `${height}px` : '0px',
    opacity: isOpen ? 1 : 0,
  }), [isOpen, height]);

  return (
    <div
      ref={contentRef}
      className={cn("overflow-hidden transition-all duration-200 ease-out not-prose", sizes[size], className)}
      style={contentStyle}
      {...props}
    >
      <div
        ref={innerRef}
        className={cn(sizeStyles[size][variant], variant === 'card' ? 'border-t border-nocta-100 dark:border-nocta-700/50' : '', 'text-nocta-600 dark:text-nocta-400 leading-relaxed')}
      >
        {children}
      </div>
    </div>
  );
});

AccordionContent.displayName = 'AccordionContent'; 