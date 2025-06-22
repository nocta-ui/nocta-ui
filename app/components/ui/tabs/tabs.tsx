'use client';

import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

// Context for tabs state
interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
  orientation: 'horizontal' | 'vertical';
  variant: 'default' | 'pills' | 'underline';
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

const TabsContext = createContext<TabsContextValue | null>(null);

// Hook to access tabs context
const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('useTabsContext must be used within a Tabs component');
  }
  return context;
};

// Tabs interfaces
export interface TabsProps {
  children: React.ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'pills' | 'underline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}

export interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

export interface TabsTriggerProps {
  children: React.ReactNode;
  value: string;
  className?: string;
  disabled?: boolean;
}

export interface TabsContentProps {
  children: React.ReactNode;
  value: string;
  className?: string;
}

// Main Tabs Component
export const Tabs: React.FC<TabsProps> = ({
  children,
  value: controlledValue,
  defaultValue,
  onValueChange,
  orientation = 'horizontal',
  variant = 'default',
  size = 'md',
  className = '',
  disabled = false,
}) => {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue || '');
  
  const value = controlledValue !== undefined ? controlledValue : uncontrolledValue;

  const handleValueChange = (newValue: string) => {
    if (disabled) return;
    
    if (controlledValue === undefined) {
      setUncontrolledValue(newValue);
    }
    onValueChange?.(newValue);
  };

  const contextValue: TabsContextValue = {
    value,
    onValueChange: handleValueChange,
    orientation,
    variant,
    size,
    disabled,
  };

  return (
    <TabsContext.Provider value={contextValue}>
      <div 
        className={`not-prose ${
          orientation === 'vertical' ? 'flex gap-4' : ''
        } ${className}`}
        data-orientation={orientation}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
};

// Tabs List
export const TabsList: React.FC<TabsListProps> = ({
  children,
  className = '',
}) => {
  const { orientation, variant, size } = useTabsContext();
  const listRef = useRef<HTMLDivElement>(null);

  const baseStyles = `
    inline-flex items-center justify-center
    transition-all duration-200 ease-in-out
    not-prose
  `;

  const orientationStyles = {
    horizontal: 'flex-row',
    vertical: 'flex-col w-fit'
  };

  const variantStyles = {
    default: `
      rounded-lg
      bg-neutral-100 dark:bg-neutral-800
      p-1
    `,
    pills: `
      gap-1
    `,
    underline: `
      border-b border-neutral-200 dark:border-neutral-700
      gap-0
    `
  };

  const sizeStyles = {
    sm: variant === 'default' ? 'p-0.5' : '',
    md: variant === 'default' ? 'p-1' : '',
    lg: variant === 'default' ? 'p-1.5' : ''
  };

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    const triggers = listRef.current?.querySelectorAll('[role="tab"]:not([disabled])') as NodeListOf<HTMLButtonElement>;
    if (!triggers || triggers.length === 0) return;

    const currentIndex = Array.from(triggers).findIndex(trigger => trigger === document.activeElement);
    let nextIndex = currentIndex;

    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        nextIndex = currentIndex <= 0 ? triggers.length - 1 : currentIndex - 1;
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        nextIndex = currentIndex >= triggers.length - 1 ? 0 : currentIndex + 1;
        break;
      case 'Home':
        event.preventDefault();
        nextIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        nextIndex = triggers.length - 1;
        break;
      default:
        return;
    }

    triggers[nextIndex]?.focus();
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-orientation={orientation}
      className={`
        ${baseStyles}
        ${orientationStyles[orientation]}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  );
};

// Tabs Trigger
export const TabsTrigger: React.FC<TabsTriggerProps> = ({
  children,
  value,
  className = '',
  disabled = false,
}) => {
  const { value: selectedValue, onValueChange, variant, size, disabled: contextDisabled } = useTabsContext();
  const isSelected = selectedValue === value;
  const isDisabled = disabled || contextDisabled;

  const baseStyles = `
    inline-flex items-center justify-center whitespace-nowrap
    font-medium transition-all duration-200 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-offset-2
    focus:ring-offset-white/50 dark:focus:ring-offset-neutral-900/50
    focus:ring-neutral-900/50 dark:focus:ring-neutral-100/50
    disabled:pointer-events-none disabled:opacity-50
    not-prose
  `;

  const variantStyles = {
    default: {
      base: `
        w-full rounded-md px-3 py-1.5
        text-neutral-700 dark:text-neutral-300
        hover:text-neutral-900 dark:hover:text-neutral-100
        data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-900
        data-[state=active]:text-neutral-900 dark:data-[state=active]:text-neutral-100
        data-[state=active]:shadow-sm
      `,
    },
    pills: {
      base: `
        rounded-lg px-4 py-2
        text-neutral-700 dark:text-neutral-300
        hover:bg-neutral-100 dark:hover:bg-neutral-800
        hover:text-neutral-900 dark:hover:text-neutral-100
        data-[state=active]:bg-neutral-900 dark:data-[state=active]:bg-neutral-100
        data-[state=active]:text-white dark:data-[state=active]:text-neutral-900
        data-[state=active]:shadow-sm
      `,
    },
    underline: {
      base: `
        px-4 py-3 border-b-2 border-transparent
        text-neutral-700 dark:text-neutral-300
        hover:text-neutral-900 dark:hover:text-neutral-100
        hover:border-neutral-300 dark:hover:border-neutral-600
        data-[state=active]:border-neutral-900 dark:data-[state=active]:border-neutral-100
        data-[state=active]:text-neutral-900 dark:data-[state=active]:text-neutral-100
      `,
    },
  };

  const sizeStyles = {
    sm: {
      default: 'px-2 py-1 text-xs',
      pills: 'px-3 py-1.5 text-xs',
      underline: 'px-3 py-2 text-xs'
    },
    md: {
      default: 'px-3 py-1.5 text-sm',
      pills: 'px-4 py-2 text-sm',
      underline: 'px-4 py-3 text-sm'
    },
    lg: {
      default: 'px-4 py-2 text-base',
      pills: 'px-6 py-2.5 text-base',
      underline: 'px-6 py-4 text-base'
    }
  };

  return (
    <button
      role="tab"
      type="button"
      aria-selected={isSelected}
      aria-controls={`tab-content-${value}`}
      data-state={isSelected ? 'active' : 'inactive'}
      disabled={isDisabled}
      className={`
        ${baseStyles}
        ${variantStyles[variant].base}
        ${sizeStyles[size][variant]}
        ${className}
      `}
      onClick={() => onValueChange(value)}
    >
      {children}
    </button>
  );
};

// Tabs Content
export const TabsContent: React.FC<TabsContentProps> = ({
  children,
  value,
  className = '',
}) => {
  const { value: selectedValue } = useTabsContext();
  const isSelected = selectedValue === value;
  const [isMounted, setIsMounted] = useState(isSelected);

  useEffect(() => {
    if (isSelected) {
      setIsMounted(true);
    }
  }, [isSelected]);

  if (!isMounted && !isSelected) {
    return null;
  }

  return (
    <div
      role="tabpanel"
      id={`tab-content-${value}`}
      aria-labelledby={`tab-trigger-${value}`}
      data-state={isSelected ? 'active' : 'inactive'}
      className={`
        focus:outline-none focus:ring-2 focus:ring-offset-2
        focus:ring-offset-white/50 dark:focus:ring-offset-neutral-900/50
        focus:ring-neutral-900/50 dark:focus:ring-neutral-100/50
        not-prose
        ${isSelected ? 'block' : 'hidden'}
        ${className}
      `}
      tabIndex={0}
    >
      {children}
    </div>
  );
}; 