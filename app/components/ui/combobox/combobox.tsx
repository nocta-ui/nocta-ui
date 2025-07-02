'use client';

import React, { useState, useRef, useEffect, useCallback, useId } from 'react';
import { cn } from '@/lib/utils';

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
  const handleValueChange = useCallback((newValue: string) => {
    if (disabled) return;
    
    if (controlledValue === undefined) {
      setUncontrolledValue(newValue);
    }
    onValueChange?.(newValue);
    setOpen(false);
    setSearchTerm('');
    setHighlightedIndex(-1);
  }, [disabled, controlledValue, onValueChange]);

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
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
    focus-visible:ring-offset-white/50 dark:focus-visible:ring-offset-nocta-900/50
    disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer
    not-prose
  `;

  const variants = {
    default: `
      border-nocta-300 dark:border-nocta-700/50
      bg-white dark:bg-nocta-900
      text-nocta-900 dark:text-nocta-100
      hover:border-nocta-300/50 dark:hover:border-nocta-600/50
      focus-visible:border-nocta-900/50 dark:focus-visible:border-nocta-100/50
      focus-visible:ring-nocta-900/50 dark:focus-visible:ring-nocta-100/50
    `,
    error: `
      border-red-300 dark:border-red-700/50
      bg-white dark:bg-nocta-900
      text-nocta-900 dark:text-nocta-100
      hover:border-red-400/50 dark:hover:border-red-600/50
      focus-visible:border-red-500/50 dark:focus-visible:border-red-500/50
      focus-visible:ring-red-500/50 dark:focus-visible:ring-red-500/50
    `,
    success: `
      border-green-300 dark:border-green-700/50
      bg-white dark:bg-nocta-900
      text-nocta-900 dark:text-nocta-100
      hover:border-green-400/50 dark:hover:border-green-600/50
      focus-visible:border-green-500/50 dark:focus-visible:border-green-500/50
      focus-visible:ring-green-500/50 dark:focus-visible:ring-green-500/50
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
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        onClick={() => !disabled && setOpen(!open)}
        onKeyDown={handleKeyDown}
      >
        <span className={cn('flex-1 text-left truncate', selectedOption ? '' : 'text-nocta-400 dark:text-nocta-500')}>
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
              className="p-0.5 hover:bg-nocta-100 dark:hover:bg-nocta-800 rounded text-nocta-400 dark:text-nocta-500 hover:text-nocta-600 dark:hover:text-nocta-300 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-nocta-500"
              aria-label="Clear selection"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          )}
          
          {/* Chevrons Up Down */}
          <svg
            className="w-4 h-4 text-nocta-400 dark:text-nocta-500"
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
          ref={listRef}
          className={cn('absolute z-50 mt-1 w-full rounded-lg border border-nocta-300 dark:border-nocta-700/50 bg-white dark:bg-nocta-900 shadow-lg dark:shadow-xl', popoverClassName)}
        >
          {/* Search input */}
          {searchable && (
            <div className="p-1 border-b border-nocta-300 dark:border-nocta-700/50">
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
                className="w-full px-3 py-2 text-sm bg-transparent border-0 focus-visible:outline-none placeholder:text-nocta-400 dark:placeholder:text-nocta-500"
              />
            </div>
          )}

          {/* Options list */}
            <div
             role="listbox"
             id={`${comboboxId}-listbox`}
             className="max-h-60 overflow-auto py-1 flex flex-col gap-1"
           >
            {filteredOptions.length === 0 ? (
                             <div className="px-3 py-2 text-sm text-nocta-500 dark:text-nocta-400 text-center mx-1">
                 {emptyMessage}
               </div>
            ) : (
              filteredOptions.map((option, index) => (
                                 <div
                   key={option.value}
                   ref={(el) => { optionRefs.current[index] = el; }}
                   role="option"
                   aria-selected={option.value === value}
                   className={cn('relative flex cursor-pointer select-none items-center justify-between px-3 py-2 text-sm outline-none mx-1 rounded-md hover:bg-nocta-100 dark:hover:bg-nocta-800', highlightedIndex === index ? 'bg-nocta-100 dark:bg-nocta-800' : '', option.value === value ? 'bg-nocta-100 dark:bg-nocta-800 font-medium' : '', option.disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '', 'transition-colors duration-150')}
                   onClick={() => !option.disabled && handleValueChange(option.value)}
                 >
                  <span className="flex-1">{option.label}</span>
                  {option.value === value && (
                    <svg className="w-4 h-4 text-nocta-600 dark:text-nocta-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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