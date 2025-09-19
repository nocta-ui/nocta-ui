"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const sliderVariants = cva(
	"relative cursor-pointer rounded-full select-none touch-none focus:outline-none focus-visible:ring-1 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed not-prose focus-visible:ring-offset-ring-offset/50",
	{
		variants: {
			orientation: {
				horizontal: "w-full",
				vertical: "h-full",
			},
		},
		defaultVariants: {
			orientation: "horizontal",
		},
	},
);

const trackVariants = cva(
	"relative rounded-full overflow-hidden bg-background-muted border border-border-muted shadow-inner",
	{
		variants: {
			size: {
				sm: "h-1 w-full",
				md: "h-2 w-full",
				lg: "h-3 w-full",
			},
			orientation: {
				horizontal: "",
				vertical: "",
			},
		},
		compoundVariants: [
			{
				size: "sm",
				orientation: "vertical",
				class: "w-1 h-full",
			},
			{
				size: "md",
				orientation: "vertical",
				class: "w-2 h-full",
			},
			{
				size: "lg",
				orientation: "vertical",
				class: "w-3 h-full",
			},
		],
		defaultVariants: {
			size: "md",
			orientation: "horizontal",
		},
	},
);

const fillVariants = cva("absolute rounded-full ", {
	variants: {
		variant: {
			default: "bg-foreground-subtle",
			secondary: "bg-foreground-subtle/50",
		},
		size: {
			sm: "h-1",
			md: "h-2",
			lg: "h-3",
		},
		orientation: {
			horizontal: "left-0 top-0",
			vertical: "bottom-0 left-0",
		},
	},
	compoundVariants: [
		{
			size: "sm",
			orientation: "vertical",
			class: "w-1",
		},
		{
			size: "md",
			orientation: "vertical",
			class: "w-2",
		},
		{
			size: "lg",
			orientation: "vertical",
			class: "w-3",
		},
	],
	defaultVariants: {
		variant: "default",
		size: "md",
		orientation: "horizontal",
	},
});

const thumbVariants = cva(
	"absolute rounded-full transform origin-center shadow-sm hover:shadow-xs",
	{
		variants: {
			variant: {
				default: "bg-foreground-muted dark:bg-foreground border border-muted/50",
				secondary: "bg-background-muted border border-border",
			},
			size: {
				sm: "w-4 h-4",
				md: "w-5 h-5",
				lg: "w-6 h-6",
			},
			orientation: {
				horizontal: "top-1/2 -translate-y-1/2",
				vertical: "left-1/2 -translate-x-1/2",
			},
			disabled: {
				true: "cursor-not-allowed opacity-60",
				false: "cursor-grab active:cursor-grabbing",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "md",
			orientation: "horizontal",
			disabled: false,
		},
	},
);

export interface SliderProps
	extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">,
		VariantProps<typeof sliderVariants> {
	value?: number;
	defaultValue?: number;
	min?: number;
	max?: number;
	step?: number;
	disabled?: boolean;
	size?: "sm" | "md" | "lg";
	variant?: "default" | "secondary";
	showValue?: boolean;
	formatValue?: (value: number) => string;
	getValueText?: (value: number) => string;
	onChange?: (value: number) => void;
	onValueCommit?: (value: number) => void;
	className?: string;
	trackClassName?: string;
	thumbClassName?: string;
	"aria-label"?: string;
	"aria-labelledby"?: string;
}

export const Slider: React.FC<SliderProps> = ({
	value: controlledValue,
	defaultValue = 0,
	min = 0,
	max = 100,
	step = 1,
	disabled = false,
	size = "md",
	variant = "default",
	orientation = "horizontal",
	showValue = false,
	formatValue = (value) => value.toString(),
	getValueText,
	onChange,
	onValueCommit,
	className = "",
	trackClassName = "",
	thumbClassName = "",
	"aria-label": ariaLabel,
	"aria-labelledby": ariaLabelledBy,
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
			const clientX =
				"touches" in event ? event.touches[0].clientX : event.clientX;
			const clientY =
				"touches" in event ? event.touches[0].clientY : event.clientY;

			if (orientation === "horizontal") {
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
				case "ArrowLeft":
				case "ArrowDown":
					event.preventDefault();
					newValue = currentValue - step;
					break;
				case "ArrowRight":
				case "ArrowUp":
					event.preventDefault();
					newValue = currentValue + step;
					break;
				case "Home":
					event.preventDefault();
					newValue = min;
					break;
				case "End":
					event.preventDefault();
					newValue = max;
					break;
				case "PageDown":
					event.preventDefault();
					newValue = currentValue - step * 10;
					break;
				case "PageUp":
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

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("touchmove", handleTouchMove);
		document.addEventListener("mouseup", handleMouseUp);
		document.addEventListener("touchend", handleTouchEnd);

		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("touchmove", handleTouchMove);
			document.removeEventListener("mouseup", handleMouseUp);
			document.removeEventListener("touchend", handleTouchEnd);
		};
	}, [
		isDragging,
		handleMouseMove,
		handleTouchMove,
		handleMouseUp,
		handleTouchEnd,
	]);

	const currentOrientation = orientation || "horizontal";
	const currentSize = size || "md";
	const currentVariant = variant || "default";

	const percentage = getPercentage(currentValue);

	const fillStyle =
		currentOrientation === "horizontal"
			? { width: `${percentage}%` }
			: { height: `${percentage}%` };

	const thumbStyle =
		currentOrientation === "horizontal"
			? { left: `${percentage}%`, transform: "translateX(-50%)" }
			: { bottom: `${percentage}%`, transform: "translateY(50%)" };

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
						"mb-2 text-sm text-primary-muted",
						currentOrientation === "vertical" ? "mb-0 mr-2" : "",
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
						isDragging && "ring-2 ring-ring/10",
						thumbClassName,
					)}
					style={thumbStyle}
				/>
			</div>
		</div>
	);
};
