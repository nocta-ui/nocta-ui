'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

const sliderVariants = cva(
	'relative cursor-pointer touch-none rounded-full select-none transition-shadow ease-out-quad duration-100 focus-visible:ring-1 focus-visible:ring-ring/50 focus-visible:ring-offset-1 focus-visible:ring-offset-ring-offset/50 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
	{
		variants: {
			orientation: {
				horizontal: 'w-full',
				vertical: 'h-full',
			},
		},
		defaultVariants: {
			orientation: 'horizontal',
		},
	},
);

const trackVariants = cva(
	'relative overflow-hidden rounded-full border border-border/60 bg-card-muted shadow-inner',
	{
		variants: {
			size: {
				sm: 'h-1 w-full',
				md: 'h-2 w-full',
				lg: 'h-3 w-full',
			},
			orientation: {
				horizontal: '',
				vertical: '',
			},
		},
		compoundVariants: [
			{
				size: 'sm',
				orientation: 'vertical',
				class: 'h-full w-1',
			},
			{
				size: 'md',
				orientation: 'vertical',
				class: 'h-full w-2',
			},
			{
				size: 'lg',
				orientation: 'vertical',
				class: 'h-full w-3',
			},
		],
		defaultVariants: {
			size: 'md',
			orientation: 'horizontal',
		},
	},
);

const fillVariants = cva('absolute rounded-full', {
	variants: {
		variant: {
			default: 'bg-foreground/30',
			secondary: 'bg-foreground/15',
		},
		size: {
			sm: 'h-1',
			md: 'h-2',
			lg: 'h-3',
		},
		orientation: {
			horizontal: 'top-0 left-0',
			vertical: 'bottom-0 left-0',
		},
	},
	compoundVariants: [
		{
			size: 'sm',
			orientation: 'vertical',
			class: 'w-1',
		},
		{
			size: 'md',
			orientation: 'vertical',
			class: 'w-2',
		},
		{
			size: 'lg',
			orientation: 'vertical',
			class: 'w-3',
		},
	],
	defaultVariants: {
		variant: 'default',
		size: 'md',
		orientation: 'horizontal',
	},
});

const thumbVariants = cva('absolute origin-center rounded-full shadow-md', {
	variants: {
		variant: {
			default: 'border-border/60 border bg-foreground',
			secondary: 'border border-border bg-card',
		},
		size: {
			sm: 'h-4 w-4',
			md: 'h-5 w-5',
			lg: 'h-6 w-6',
		},
		orientation: {
			horizontal: 'top-1/2 -translate-y-1/2',
			vertical: 'left-1/2 -translate-x-1/2',
		},
		disabled: {
			true: 'cursor-not-allowed opacity-50',
			false: 'cursor-grab active:cursor-grabbing',
		},
	},
	defaultVariants: {
		variant: 'default',
		size: 'md',
		orientation: 'horizontal',
		disabled: false,
	},
});

export interface SliderProps
	extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>,
		VariantProps<typeof sliderVariants> {
	value?: number;
	defaultValue?: number;
	min?: number;
	max?: number;
	step?: number;
	disabled?: boolean;
	size?: 'sm' | 'md' | 'lg';
	variant?: 'default' | 'secondary';
	showValue?: boolean;
	formatValue?: (value: number) => string;
	getValueText?: (value: number) => string;
	onChange?: (value: number) => void;
	onValueCommit?: (value: number) => void;
	className?: string;
	trackClassName?: string;
	thumbClassName?: string;
	'aria-label'?: string;
	'aria-labelledby'?: string;
}

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
	getValueText,
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

	const clampValue = useCallback(
		(val: number) => {
			return Math.max(min, Math.min(max, val));
		},
		[min, max],
	);

	const roundToStep = useCallback(
		(val: number) => {
			return Math.round(val / step) * step;
		},
		[step],
	);

	const getPercentage = useCallback(
		(val: number) => {
			return ((val - min) / (max - min)) * 100;
		},
		[min, max],
	);

	const getValueFromPercentage = useCallback(
		(percentage: number) => {
			const val = (percentage / 100) * (max - min) + min;
			return roundToStep(clampValue(val));
		},
		[min, max, roundToStep, clampValue],
	);

	const getPositionFromEvent = useCallback(
		(event: MouseEvent | TouchEvent) => {
			if (!sliderRef.current) return 0;

			const rect = sliderRef.current.getBoundingClientRect();
			const firstTouch =
				'touches' in event && event.touches.length > 0
					? event.touches[0]
					: null;
			const clientX =
				firstTouch?.clientX ?? ('clientX' in event ? event.clientX : 0);
			const clientY =
				firstTouch?.clientY ?? ('clientY' in event ? event.clientY : 0);

			if (orientation === 'horizontal') {
				return ((clientX - rect.left) / rect.width) * 100;
			} else {
				return ((rect.bottom - clientY) / rect.height) * 100;
			}
		},
		[orientation],
	);

	const handleValueChange = useCallback(
		(newValue: number) => {
			const clampedValue = clampValue(newValue);

			if (!isControlled) {
				setInternalValue(clampedValue);
			}

			onChange?.(clampedValue);
		},
		[isControlled, onChange, clampValue],
	);

	const handleMouseDown = useCallback(
		(event: React.MouseEvent) => {
			if (disabled) return;

			event.preventDefault();
			setIsDragging(true);

			sliderRef.current?.focus();

			const percentage = getPositionFromEvent(event.nativeEvent);
			const newValue = getValueFromPercentage(percentage);
			handleValueChange(newValue);
		},
		[disabled, getPositionFromEvent, getValueFromPercentage, handleValueChange],
	);

	const handleTouchStart = useCallback(
		(event: React.TouchEvent) => {
			if (disabled) return;

			event.preventDefault();
			setIsDragging(true);

			sliderRef.current?.focus();

			const percentage = getPositionFromEvent(event.nativeEvent);
			const newValue = getValueFromPercentage(percentage);
			handleValueChange(newValue);
		},
		[disabled, getPositionFromEvent, getValueFromPercentage, handleValueChange],
	);

	const handleMouseMove = useCallback(
		(event: MouseEvent) => {
			if (!isDragging || disabled) return;

			event.preventDefault();
			const percentage = getPositionFromEvent(event);
			const newValue = getValueFromPercentage(percentage);
			handleValueChange(newValue);
		},
		[
			isDragging,
			disabled,
			getPositionFromEvent,
			getValueFromPercentage,
			handleValueChange,
		],
	);

	const handleTouchMove = useCallback(
		(event: TouchEvent) => {
			if (!isDragging || disabled) return;

			event.preventDefault();
			const percentage = getPositionFromEvent(event);
			const newValue = getValueFromPercentage(percentage);
			handleValueChange(newValue);
		},
		[
			isDragging,
			disabled,
			getPositionFromEvent,
			getValueFromPercentage,
			handleValueChange,
		],
	);

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

	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent) => {
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
		},
		[disabled, currentValue, step, min, max, handleValueChange, clampValue],
	);

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
	}, [
		isDragging,
		handleMouseMove,
		handleTouchMove,
		handleMouseUp,
		handleTouchEnd,
	]);

	const currentOrientation = orientation || 'horizontal';
	const currentSize = size || 'md';
	const currentVariant = variant || 'default';

	const percentage = getPercentage(currentValue);

	const fillStyle =
		currentOrientation === 'horizontal'
			? { width: `${percentage}%` }
			: { height: `${percentage}%` };

	const thumbStyle =
		currentOrientation === 'horizontal'
			? { left: `${percentage}%`, transform: 'translateX(-50%)' }
			: { bottom: `${percentage}%`, transform: 'translateY(50%)' };

	return (
		<div
			className={cn(
				sliderVariants({ orientation: currentOrientation }),
				className,
			)}
			{...props}
		>
			{showValue && (
				<div
					className={cn(
						'mb-2 text-sm text-foreground/70',
						currentOrientation === 'vertical' ? 'mr-2 mb-0' : '',
					)}
				>
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
				aria-valuetext={
					getValueText
						? getValueText(currentValue)
						: formatValue?.(currentValue)
				}
				aria-orientation={currentOrientation}
				aria-label={ariaLabel}
				aria-labelledby={ariaLabelledBy}
				aria-disabled={disabled}
				className={cn(sliderVariants({ orientation: currentOrientation }))}
				onMouseDown={handleMouseDown}
				onTouchStart={handleTouchStart}
				onKeyDown={handleKeyDown}
				onBlur={() => onValueCommit?.(currentValue)}
			>
				<div
					className={cn(
						trackVariants({
							size: currentSize,
							orientation: currentOrientation,
						}),
						trackClassName,
					)}
				>
					<div
						className={cn(
							fillVariants({
								variant: currentVariant,
								size: currentSize,
								orientation: currentOrientation,
							}),
						)}
						style={fillStyle}
					/>
				</div>

				<div
					ref={thumbRef}
					className={cn(
						thumbVariants({
							variant: currentVariant,
							size: currentSize,
							orientation: currentOrientation,
							disabled: disabled,
						}),
						isDragging && 'ring-2 ring-ring/10',
						thumbClassName,
					)}
					style={thumbStyle}
				/>
			</div>
		</div>
	);
};
