'use client';

import React, { useState, useRef, useEffect } from 'react';

export interface SelectProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export interface SelectContentProps {
  children: React.ReactNode;
  className?: string;
  position?: 'bottom' | 'top';
}

export interface SelectItemProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export interface SelectValueProps {
  placeholder?: string;
  className?: string;
}

// Generate unique ID for accessibility
let selectIdCounter = 0;
const generateSelectId = () => `select-${++selectIdCounter}`;

// Context for Select state management
const SelectContext = React.createContext<{
  value?: string;
  displayValue?: React.ReactNode;
  onValueChange?: (value: string, displayValue: React.ReactNode) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
  contentId: string;
}>({
  open: false,
  setOpen: () => {},
  contentId: '',
});

// Main Select Component
export const Select: React.FC<SelectProps> = ({
  value: controlledValue,
  defaultValue,
  onValueChange,
  disabled = false,
  children,
  size = 'md',
}) => {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const [displayValue, setDisplayValue] = useState<React.ReactNode>(null);
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [contentId] = useState(() => generateSelectId());
  
  const value = controlledValue !== undefined ? controlledValue : uncontrolledValue;

  const handleValueChange = (newValue: string, newDisplayValue: React.ReactNode) => {
    if (controlledValue === undefined) {
      setUncontrolledValue(newValue);
    }
    setDisplayValue(newDisplayValue);
    onValueChange?.(newValue);
    setOpen(false);
  };

  return (
    <SelectContext.Provider
      value={{
        value: value,
        displayValue,
        onValueChange: handleValueChange,
        open,
        setOpen,
        disabled,
        size,
        triggerRef,
        contentId,
      }}
    >
      <div className="relative not-prose">
        {children}
      </div>
    </SelectContext.Provider>
  );
};

// Select Trigger
export const SelectTrigger: React.FC<SelectTriggerProps> = ({
  children,
  className = '',
  size: propSize,
  ...props
}) => {
  const { open, setOpen, disabled, size: contextSize, triggerRef, contentId } = React.useContext(SelectContext);
  const size = propSize || contextSize || 'md';

  const baseStyles = `
    flex h-10 w-fit items-center justify-between
    rounded-lg border border-neutral-200 dark:border-neutral-700/50
    bg-white dark:bg-neutral-900
    px-3 py-2 text-sm
    placeholder:text-neutral-400 dark:placeholder:text-neutral-500
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white/50 dark:focus:ring-offset-neutral-900/50
    focus:ring-neutral-900/50 dark:focus:ring-neutral-100/50
    focus:border-neutral-900 dark:focus:border-neutral-100
    disabled:cursor-not-allowed disabled:opacity-50
    hover:border-neutral-300 dark:hover:border-neutral-600
    transition-all duration-200 ease-out
    not-prose
  `;

  const sizes = {
    sm: 'h-8 px-2 text-xs',
    md: 'h-10 px-3 text-sm',
    lg: 'h-12 px-4 text-base'
  };

  return (
    <button
      ref={triggerRef}
      type="button"
      role="combobox"
      aria-expanded={open}
      aria-controls={contentId}
      aria-haspopup="listbox"
      disabled={disabled}
      className={`
        ${baseStyles}
        ${sizes[size]}
        ${className}
      `}
      onClick={() => !disabled && setOpen(!open)}
      {...props}
    >
      {children}
      <svg
        className={`ml-2 h-4 w-4 shrink-0 opacity-50 transition-transform duration-200 ease-in-out ${
          open ? 'rotate-180' : ''
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
};

// Select Content
export const SelectContent: React.FC<SelectContentProps> = ({
  children,
  className = '',
  position = 'bottom',
}) => {
  const { open, setOpen, triggerRef, contentId } = React.useContext(SelectContext);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

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
      }, 200); // Match animation duration
      return () => clearTimeout(timer);
    }
  }, [open]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isClickInContent = contentRef.current && contentRef.current.contains(target);
      const isClickInTrigger = triggerRef?.current && triggerRef.current.contains(target);
      
      if (!isClickInContent && !isClickInTrigger) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, setOpen, triggerRef]);

  if (!shouldRender) return null;

  const positionStyles = {
    bottom: 'top-full mt-1',
    top: 'bottom-full mb-1'
  };

  const animationStyles = position === 'bottom' 
    ? `transform transition-all duration-200 ease-out origin-top ${
        isVisible 
          ? 'translate-y-0 opacity-100' 
          : '-translate-y-1 opacity-0'
      }`
    : `transform transition-all duration-200 ease-out origin-bottom ${
        isVisible 
          ? 'translate-y-0 opacity-100' 
          : 'translate-y-1 opacity-0'
      }`;

  return (
    <div
      ref={contentRef}
      id={contentId}
      role="listbox"
      className={`
        absolute z-50 w-fit
        min-w-[8rem] overflow-hidden
        rounded-lg border border-neutral-200 dark:border-neutral-700/50
        bg-white dark:bg-neutral-900
        shadow-lg dark:shadow-xl
        ${positionStyles[position]}
        ${animationStyles}
        not-prose
        ${className}
      `}
    >
      <div className="max-h-60 overflow-auto py-1 flex flex-col gap-1">
        {children}
      </div>
    </div>
  );
};

// Select Item
export const SelectItem: React.FC<SelectItemProps> = ({
  value,
  children,
  className = '',
  disabled = false,
}) => {
  const { value: selectedValue, onValueChange } = React.useContext(SelectContext);
  const isSelected = selectedValue === value;

  return (
    <div
      role="option"
      aria-selected={isSelected}
      className={`
        relative flex cursor-pointer select-none items-center
        px-3 py-2 text-sm outline-none mx-1 rounded-md
        hover:bg-neutral-100 dark:hover:bg-neutral-800
        focus:bg-neutral-100 dark:focus:bg-neutral-800
        ${isSelected ? 'bg-neutral-100 dark:bg-neutral-800' : ''}
        ${disabled ? 'pointer-events-none opacity-50' : ''}
        transition-colors duration-150
        not-prose
        ${className}
      `}
      onClick={() => !disabled && onValueChange?.(value, children)}
    >
      <span className={`flex-1 ${isSelected ? 'font-medium' : ''}`}>
        {children}
      </span>
      {isSelected && (
        <svg
          className="ml-2 h-4 w-4 text-neutral-600 dark:text-neutral-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )}
    </div>
  );
};

// Select Value
export const SelectValue: React.FC<SelectValueProps> = ({
  placeholder = 'Select an option...',
  className = '',
}) => {
  const { value, displayValue } = React.useContext(SelectContext);
  
  return (
    <span className={`block text-left ${className}`}>
      {value ? (
        <span>{displayValue}</span>
      ) : (
        <span className="text-neutral-400 dark:text-neutral-500">
          {placeholder}
        </span>
      )}
    </span>
  );
};