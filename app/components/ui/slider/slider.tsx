'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface SliderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'primary' | 'secondary';
  orientation?: 'horizontal' | 'vertical';
  showValue?: boolean;
  formatValue?: (value: number) => string;
  onChange?: (value: number) => void;
  onValueCommit?: (value: number) => void;
  className?: string;
  trackClassName?: string;
  thumbClassName?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
}

// Slider Component
export const Slider: React.FC<SliderProps> = ({
  value: controlledValue,
  defaultValue = 0,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  size = 'md',
  variant = 'default',
  orientation = 'horizontal',
  showValue = false,
  formatValue = (value) => value.toString(),
  onChange,
  onValueCommit,
  className = '',
  trackClassName = '',
  thumbClassName = '',
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...props
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  // Clamp value to min/max bounds
  const clampValue = useCallback((val: number) => {
    return Math.max(min, Math.min(max, val));
  }, [min, max]);

  // Round value to nearest step
  const roundToStep = useCallback((val: number) => {
    return Math.round(val / step) * step;
  }, [step]);

  // Calculate percentage from value
  const getPercentage = useCallback((val: number) => {
    return ((val - min) / (max - min)) * 100;
  }, [min, max]);

  // Calculate value from percentage
  const getValueFromPercentage = useCallback((percentage: number) => {
    const val = (percentage / 100) * (max - min) + min;
    return roundToStep(clampValue(val));
  }, [min, max, roundToStep, clampValue]);

  // Get position from mouse/touch event
  const getPositionFromEvent = useCallback((event: MouseEvent | TouchEvent) => {
    if (!sliderRef.current) return 0;

    const rect = sliderRef.current.getBoundingClientRect();
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;

    if (orientation === 'horizontal') {
      return ((clientX - rect.left) / rect.width) * 100;
    } else {
      return ((rect.bottom - clientY) / rect.height) * 100;
    }
  }, [orientation]);

  // Handle value change
  const handleValueChange = useCallback((newValue: number) => {
    const clampedValue = clampValue(newValue);
    
    if (!isControlled) {
      setInternalValue(clampedValue);
    }
    
    onChange?.(clampedValue);
  }, [isControlled, onChange, clampValue]);

  // Handle mouse/touch events
  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    if (disabled) return;
    
    event.preventDefault();
    setIsDragging(true);
    
    const percentage = getPositionFromEvent(event.nativeEvent);
    const newValue = getValueFromPercentage(percentage);
    handleValueChange(newValue);
  }, [disabled, getPositionFromEvent, getValueFromPercentage, handleValueChange]);

  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    if (disabled) return;
    
    event.preventDefault();
    setIsDragging(true);
    
    const percentage = getPositionFromEvent(event.nativeEvent);
    const newValue = getValueFromPercentage(percentage);
    handleValueChange(newValue);
  }, [disabled, getPositionFromEvent, getValueFromPercentage, handleValueChange]);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!isDragging || disabled) return;
    
    event.preventDefault();
    const percentage = getPositionFromEvent(event);
    const newValue = getValueFromPercentage(percentage);
    handleValueChange(newValue);
  }, [isDragging, disabled, getPositionFromEvent, getValueFromPercentage, handleValueChange]);

  const handleTouchMove = useCallback((event: TouchEvent) => {
    if (!isDragging || disabled) return;
    
    event.preventDefault();
    const percentage = getPositionFromEvent(event);
    const newValue = getValueFromPercentage(percentage);
    handleValueChange(newValue);
  }, [isDragging, disabled, getPositionFromEvent, getValueFromPercentage, handleValueChange]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;
    
    setIsDragging(false);
    onValueCommit?.(currentValue);
  }, [isDragging, onValueCommit, currentValue]);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging) return;
    
    setIsDragging(false);
    onValueCommit?.(currentValue);
  }, [isDragging, onValueCommit, currentValue]);

  // Keyboard handling
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (disabled) return;

    let newValue = currentValue;
    
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        event.preventDefault();
        newValue = currentValue - step;
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        event.preventDefault();
        newValue = currentValue + step;
        break;
      case 'Home':
        event.preventDefault();
        newValue = min;
        break;
      case 'End':
        event.preventDefault();
        newValue = max;
        break;
      case 'PageDown':
        event.preventDefault();
        newValue = currentValue - step * 10;
        break;
      case 'PageUp':
        event.preventDefault();
        newValue = currentValue + step * 10;
        break;
      default:
        return;
    }
    
    handleValueChange(clampValue(newValue));
  }, [disabled, currentValue, step, min, max, handleValueChange, clampValue]);

  // Mouse/touch event listeners
  useEffect(() => {
    if (!isDragging) return;

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, handleMouseMove, handleTouchMove, handleMouseUp, handleTouchEnd]);

  const baseStyles = `
    relative cursor-pointer select-none touch-none focus:outline-none focus-visible:ring-2 
    focus-visible:ring-offset-2 focus-visible:ring-offset-white/50 dark:focus-visible:ring-offset-neutral-900/50
    disabled:opacity-50 disabled:cursor-not-allowed not-prose
  `;

  const orientationStyles = {
    horizontal: 'w-full',
    vertical: 'h-full'
  };

  const trackBaseStyles = `
    relative bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden
  `;

  const trackSizes = {
    sm: orientation === 'horizontal' ? 'h-1 w-full' : 'w-1 h-full',
    md: orientation === 'horizontal' ? 'h-2 w-full' : 'w-2 h-full', 
    lg: orientation === 'horizontal' ? 'h-3 w-full' : 'w-3 h-full'
  };

  const fillVariants = {
    default: 'bg-neutral-600 dark:bg-neutral-400',
    primary: 'bg-neutral-900 dark:bg-neutral-100',
    secondary: 'bg-neutral-500 dark:bg-neutral-500'
  };

  const thumbSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const thumbVariants = {
    default: 'bg-white dark:bg-neutral-200 border-2 border-neutral-600 dark:border-neutral-400',
    primary: 'bg-white dark:bg-neutral-900 border-2 border-neutral-900 dark:border-neutral-100',
    secondary: 'bg-white dark:bg-neutral-200 border-2 border-neutral-500 dark:border-neutral-500'
  };

  const percentage = getPercentage(currentValue);
  
  const fillStyle = orientation === 'horizontal' 
    ? { width: `${percentage}%` }
    : { height: `${percentage}%` };
    
  const thumbStyle = orientation === 'horizontal'
    ? { left: `${percentage}%`, transform: 'translateX(-50%)' }
    : { bottom: `${percentage}%`, transform: 'translateY(50%)' };

  return (
    <div className={cn(orientationStyles[orientation], className)} {...props}>
      {showValue && (
        <div className={cn('mb-2 text-sm text-neutral-700 dark:text-neutral-300', orientation === 'vertical' ? 'mb-0 mr-2' : '')}>
          {formatValue(currentValue)}
        </div>
      )}
      
      <div
        ref={sliderRef}
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={currentValue}
        aria-orientation={orientation}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-disabled={disabled}
        className={cn(baseStyles, orientationStyles[orientation], 'focus-visible:ring-neutral-500/50 dark:focus-visible:ring-neutral-400/50')}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onKeyDown={handleKeyDown}
      >
        {/* Track */}
        <div className={`
          ${trackBaseStyles}
          ${trackSizes[size]}
          ${trackClassName}
        `}>
          
        {/* Fill */}
        <div
          className={cn(
            'absolute rounded-full',
            fillVariants[variant],
            trackSizes[size],
            orientation === 'horizontal' ? 'left-0 top-0' : 'bottom-0 left-0',
            !isDragging ? 'transition-all duration-200 ease-out' : ''
          )}
          style={fillStyle}
        />
        </div>
        
        {/* Thumb */}
        <div
          ref={thumbRef}
          className={cn(
            'absolute rounded-full shadow-lg transform origin-center hover:scale-110 active:scale-105',
            thumbSizes[size],
            thumbVariants[variant],
            isDragging ? 'scale-105' : '',
            disabled ? 'cursor-not-allowed' : 'cursor-grab active:cursor-grabbing',
            thumbClassName,
            orientation === 'horizontal' ? 'top-1/2 -translate-y-1/2' : 'left-1/2 -translate-x-1/2',
            !isDragging ? 'transition-all duration-200 ease-out' : ''
          )}
          style={thumbStyle}
        />
      </div>
    </div>
  );
}; 