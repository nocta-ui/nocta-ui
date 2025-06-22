'use client';

import React, { useState, createContext, useContext } from 'react';

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
export const Accordion: React.FC<AccordionProps> = ({
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

  const openItems = controlledValue 
    ? (Array.isArray(controlledValue) ? controlledValue : [controlledValue])
    : internalValue;

  const toggleItem = (itemValue: string) => {
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
  };

  const isOpen = (itemValue: string) => openItems.includes(itemValue);

  const baseStyles = `
    w-full
    not-prose
  `;

  const variants = {
    default: '',
    card: 'space-y-2'
  };

  return (
    <AccordionContext.Provider
      value={{
        type,
        variant,
        size,
        openItems,
        toggleItem,
        isOpen
      }}
    >
      <div
        className={`
          ${baseStyles}
          ${variants[variant]}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    </AccordionContext.Provider>
  );
};

// Accordion Item
export const AccordionItem: React.FC<AccordionItemProps> = ({
  children,
  value,
  className = '',
  disabled = false,
  ...props
}) => {
  const { variant, isOpen } = useAccordion();
  const itemIsOpen = isOpen(value);

  const baseStyles = `
    transition-all duration-200 ease-in-out
    not-prose
  `;

  const variants = {
    default: `
      border-b border-neutral-200 dark:border-neutral-700/50
      last:border-b-0
    `,
    card: `
      border border-neutral-200 dark:border-neutral-700/50
      rounded-lg overflow-hidden
      bg-white dark:bg-neutral-900
      shadow-sm dark:shadow-lg
      ${itemIsOpen ? 'shadow-md dark:shadow-xl' : ''}
    `
  };

  return (
    <AccordionItemContext.Provider
      value={{
        value,
        isOpen: itemIsOpen,
        disabled
      }}
    >
      <div
        className={`
          ${baseStyles}
          ${variants[variant]}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
};

// Accordion Trigger
export const AccordionTrigger: React.FC<AccordionTriggerProps> = ({
  children,
  className = '',
  ...props
}) => {
  const { variant, size, toggleItem } = useAccordion();
  const { value, isOpen, disabled } = useAccordionItem();

  const handleClick = () => {
    if (!disabled) {
      toggleItem(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  const baseStyles = `
    w-full flex items-center justify-between text-left
    transition-all duration-200 ease-in-out
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
    focus-visible:ring-offset-white/50 dark:focus-visible:ring-offset-neutral-900/50
    focus-visible:ring-neutral-900/50 dark:focus-visible:ring-neutral-100/50
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
      text-neutral-900 dark:text-neutral-100
      hover:text-neutral-700 dark:hover:text-neutral-300
      ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    `,
    card: `
      ${sizeStyles[size].card}
      text-neutral-900 dark:text-neutral-100
      bg-white dark:bg-neutral-900
      hover:bg-neutral-50 dark:hover:bg-neutral-800/50
      ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      ${isOpen ? 'bg-neutral-50 dark:bg-neutral-800/50' : ''}
    `
  };

  const sizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

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
        width={size === 'sm' ? 14 : size === 'md' ? 16 : 20}
        height={size === 'sm' ? 14 : size === 'md' ? 16 : 20}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`
          transition-transform duration-200 ease-in-out flex-shrink-0 ml-2
          text-neutral-500 dark:text-neutral-400
          ${isOpen ? 'rotate-180' : 'rotate-0'}
        `}
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>
  );
};

// Accordion Content
export const AccordionContent: React.FC<AccordionContentProps> = ({
  children,
  className = '',
  ...props
}) => {
  const { variant, size } = useAccordion();
  const { isOpen } = useAccordionItem();

  const baseStyles = `
    overflow-hidden transition-all duration-200 ease-in-out
    not-prose
  `;

  const sizeStyles = {
    sm: {
      default: isOpen ? 'pb-2' : 'pb-0',
      card: isOpen ? 'px-4 py-2' : 'px-4 pb-0'
    },
    md: {
      default: isOpen ? 'pb-3' : 'pb-0',
      card: isOpen ? 'px-5 py-3' : 'px-5 pb-0'
    },
    lg: {
      default: isOpen ? 'pb-4' : 'pb-0',
      card: isOpen ? 'px-6 py-4' : 'px-6 pb-0'
    }
  };

  const variants = {
    default: `
      ${sizeStyles[size].default}
    `,
    card: `
      ${sizeStyles[size].card}
      border-t border-neutral-100 dark:border-neutral-700/50
    `
  };

  const sizes = {
    sm: 'text-xs',
    md: 'text-sm', 
    lg: 'text-base'
  };

  return (
    <div
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      style={{
        height: isOpen ? 'auto' : '0',
        opacity: isOpen ? 1 : 0
      }}
      {...props}
    >
      {isOpen && (
        <div className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
}; 