'use client';

import React, { useState, useRef, useEffect, useCallback, useId } from 'react';

// Combobox interfaces
export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'error' | 'success';
  className?: string;
  popoverClassName?: string;
  searchable?: boolean;
  clearable?: boolean;
}

export const Combobox: React.FC<ComboboxProps> = ({
  options,
  value: controlledValue,
  defaultValue,
  onValueChange,
  placeholder = 'Select option...',
  searchPlaceholder = 'Search...',
  emptyMessage = 'No options found',
  disabled = false,
  size = 'md',
  variant = 'default',
  className = '',
  popoverClassName = '',
  searchable = true,
  clearable = true,
}) => {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue || '');
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const comboboxId = useId();
  
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const value = controlledValue !== undefined ? controlledValue : uncontrolledValue;
  
  // Filter options based on search term
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get current selected option
  const selectedOption = options.find(option => option.value === value);

  // Handle value change
  const handleValueChange = (newValue: string) => {
    if (disabled) return;
    
    if (controlledValue === undefined) {
      setUncontrolledValue(newValue);
    }
    onValueChange?.(newValue);
    setOpen(false);
    setSearchTerm('');
    setHighlightedIndex(-1);
  };

  // Handle clear
  const handleClear = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    handleValueChange('');
  };

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (disabled) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!open) {
          setOpen(true);
          setHighlightedIndex(0);
        } else {
          setHighlightedIndex(prev => 
            prev < filteredOptions.length - 1 ? prev + 1 : 0
          );
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!open) {
          setOpen(true);
          setHighlightedIndex(filteredOptions.length - 1);
        } else {
          setHighlightedIndex(prev => 
            prev > 0 ? prev - 1 : filteredOptions.length - 1
          );
        }
        break;
      case 'Enter':
        event.preventDefault();
        if (open && highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
          const selectedOption = filteredOptions[highlightedIndex];
          if (!selectedOption.disabled) {
            handleValueChange(selectedOption.value);
          }
        } else if (!open) {
          setOpen(true);
        }
        break;
      case 'Escape':
        event.preventDefault();
        setOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
        triggerRef.current?.focus();
        break;
      case 'Tab':
        setOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
        break;
    }
  }, [open, highlightedIndex, filteredOptions, disabled, handleValueChange]);

  // Scroll highlighted option into view
  useEffect(() => {
    if (highlightedIndex >= 0 && optionRefs.current[highlightedIndex]) {
      optionRefs.current[highlightedIndex]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      });
    }
  }, [highlightedIndex]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isClickInTrigger = triggerRef.current?.contains(target);
      const isClickInList = listRef.current?.contains(target);
      
      if (!isClickInTrigger && !isClickInList) {
        setOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  // Focus search input when opened - with delay to avoid ring flash
  useEffect(() => {
    if (open && searchable && searchInputRef.current) {
      // Small delay to avoid the ring flash effect
      const timeoutId = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 200);
      return () => clearTimeout(timeoutId);
    }
  }, [open, searchable]);

  // Base styles
  const baseStyles = `
    relative w-fit inline-flex items-center justify-between
    rounded-lg border transition-all duration-200 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-offset-2
    focus:ring-offset-white/50 dark:focus:ring-offset-neutral-900/50
    disabled:opacity-50 disabled:cursor-not-allowed
    not-prose
  `;

  const variants = {
    default: `
      border-neutral-200 dark:border-neutral-700/50
      bg-white dark:bg-neutral-900
      text-neutral-900 dark:text-neutral-100
      hover:border-neutral-300/50 dark:hover:border-neutral-600/50
      focus:border-neutral-900/50 dark:focus:border-neutral-100/50
      focus:ring-neutral-900/50 dark:focus:ring-neutral-100/50
    `,
    error: `
      border-red-300 dark:border-red-700/50
      bg-white dark:bg-neutral-900
      text-neutral-900 dark:text-neutral-100
      hover:border-red-400/50 dark:hover:border-red-600/50
      focus:border-red-500/50 dark:focus:border-red-500/50
      focus:ring-red-500/50 dark:focus:ring-red-500/50
    `,
    success: `
      border-green-300 dark:border-green-700/50
      bg-white dark:bg-neutral-900
      text-neutral-900 dark:text-neutral-100
      hover:border-green-400/50 dark:hover:border-green-600/50
      focus:border-green-500/50 dark:focus:border-green-500/50
      focus:ring-green-500/50 dark:focus:ring-green-500/50
    `
  };

  const sizes = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-3 text-sm',
    lg: 'h-12 px-4 text-base'
  };

  return (
    <div className="relative not-prose">
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-controls={`${comboboxId}-listbox`}
        aria-haspopup="listbox"
        disabled={disabled}
        className={`
          ${baseStyles}
          ${variants[variant]}
          ${sizes[size]}
          ${className}
        `}
        onClick={() => !disabled && setOpen(!open)}
        onKeyDown={handleKeyDown}
      >
        <span className={`flex-1 text-left truncate ${
          selectedOption ? '' : 'text-neutral-400 dark:text-neutral-500'
        }`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        
        <div className="flex items-center gap-1 ml-2">
          {/* Clear button */}
          {clearable && selectedOption && !disabled && (
            <div
              role="button"
              tabIndex={0}
              onClick={handleClear}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleClear(e);
                }
              }}
              className="p-0.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 cursor-pointer focus:outline-none focus:ring-1 focus:ring-neutral-500"
              aria-label="Clear selection"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          )}
          
          {/* Chevrons Up Down */}
          <svg
            className="w-4 h-4 text-neutral-400 dark:text-neutral-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m7 15 5 5 5-5" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m7 9 5-5 5 5" />
          </svg>
        </div>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className={`
            absolute z-50 mt-1 w-full
            rounded-lg border border-neutral-200 dark:border-neutral-700/50
            bg-white dark:bg-neutral-900
            shadow-lg dark:shadow-xl
            ${popoverClassName}
          `}
        >
          {/* Search input */}
          {searchable && (
            <div className="p-1 border-b border-neutral-200 dark:border-neutral-700/50">
              <input
                ref={searchInputRef}
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setHighlightedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                className="w-full px-3 py-2 text-sm bg-transparent border-0 focus:outline-none placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
              />
            </div>
          )}

          {/* Options list */}
            <div
             ref={listRef}
             role="listbox"
             id={`${comboboxId}-listbox`}
             className="max-h-60 overflow-auto py-1 flex flex-col gap-1"
           >
            {filteredOptions.length === 0 ? (
                             <div className="px-3 py-2 text-sm text-neutral-500 dark:text-neutral-400 text-center mx-1">
                 {emptyMessage}
               </div>
            ) : (
              filteredOptions.map((option, index) => (
                                 <div
                   key={option.value}
                   ref={(el) => { optionRefs.current[index] = el; }}
                   role="option"
                   aria-selected={option.value === value}
                   className={`
                     relative flex cursor-pointer select-none items-center justify-between
                     px-3 py-2 text-sm outline-none mx-1 rounded-md
                     hover:bg-neutral-100 dark:hover:bg-neutral-800
                     ${highlightedIndex === index ? 'bg-neutral-100 dark:bg-neutral-800' : ''}
                     ${option.value === value ? 'bg-neutral-100 dark:bg-neutral-800 font-medium' : ''}
                     ${option.disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
                     transition-colors duration-150
                   `}
                   onClick={() => !option.disabled && handleValueChange(option.value)}
                 >
                  <span className="flex-1">{option.label}</span>
                  {option.value === value && (
                    <svg className="w-4 h-4 text-neutral-600 dark:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}; 