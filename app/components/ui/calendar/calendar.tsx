"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type React from "react";
import { useCallback, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

const hasBackgroundColor = (className: string = "") => {
	return /bg-(?!linear|gradient|none)\w+/.test(className);
};

const calendarVariants = cva(
	[
		"rounded-xl",
		"shadow-md dark:shadow-lg",
		"transition-all duration-300 ease-out",
		"backdrop-blur-sm",
		"overflow-hidden",
		"not-prose",
		"text-xs",
		"w-fit",
		"max-w-sm",
	],
	{
		variants: {
			disabled: {
				true: "opacity-50 cursor-not-allowed",
				false: "",
			},
			hasCustomBackground: {
				true: "",
				false: "bg-nocta-100 dark:bg-nocta-900",
			},
		},
		defaultVariants: {
			disabled: false,
			hasCustomBackground: false,
		},
	},
);

const dayButtonVariants = cva(
	[
		"text-center",
		"rounded-md",
		"transition-colors",
		"focus:outline-none",
		"focus:ring-2",
		"focus:ring-nocta-500/50",
		"w-8",
		"h-8",
		"text-xs",
		"flex",
		"items-center",
		"justify-center",
	],
	{
		variants: {
			state: {
				default:
					"hover:bg-nocta-300 dark:hover:bg-nocta-700 text-nocta-700 dark:text-nocta-300",
				selected:
					"bg-nocta-950 dark:bg-nocta-50 text-nocta-50 dark:text-nocta-900",
				today:
					"bg-nocta-200 dark:bg-nocta-800 text-nocta-900 dark:text-nocta-100",
				disabled: "opacity-50 cursor-not-allowed",
				outsideMonth: "text-nocta-400 dark:text-nocta-600",
			},
			interaction: {
				enabled: "cursor-pointer",
				disabled: "cursor-not-allowed",
			},
		},
		defaultVariants: {
			state: "default",
			interaction: "enabled",
		},
	},
);

const DAYS_IN_WEEK = 7;
const MONTHS = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export interface CalendarProps
	extends Omit<
			React.HTMLAttributes<HTMLDivElement>,
			"onChange" | "defaultValue"
		>,
		Omit<VariantProps<typeof calendarVariants>, "disabled"> {
	value?: Date;
	defaultValue?: Date;
	onChange?: (date: Date | undefined) => void;
	disabled?: boolean;
	disabledDates?: Date[] | ((date: Date) => boolean);
	minDate?: Date;
	maxDate?: Date;
	showWeekNumbers?: boolean;
	showOutsideDays?: boolean;
	weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday, 1 = Monday, etc.
	formatMonth?: (date: Date) => string;
	formatWeekday?: (date: Date) => string;
	"aria-label"?: string;
}

export const Calendar: React.FC<CalendarProps> = ({
	value: controlledValue,
	defaultValue,
	onChange,
	disabled = false,
	disabledDates,
	minDate,
	maxDate,
	showWeekNumbers = false,
	showOutsideDays = true,
	weekStartsOn = 0,
	formatMonth = (date) => `${MONTHS[date.getMonth()]} ${date.getFullYear()}`,
	formatWeekday = (date) => WEEKDAYS[date.getDay()],
	className = "",
	"aria-label": ariaLabel,
	...props
}) => {
	const [internalValue, setInternalValue] = useState<Date | undefined>(
		defaultValue,
	);
	const [currentMonth, setCurrentMonth] = useState(() => {
		return controlledValue || defaultValue || new Date();
	});

	const isControlled = controlledValue !== undefined;
	const selectedDate = isControlled ? controlledValue : internalValue;
	const shouldOverrideBackground = hasBackgroundColor(className);

	const isSameDay = useCallback((date1: Date, date2: Date) => {
		return (
			date1.getDate() === date2.getDate() &&
			date1.getMonth() === date2.getMonth() &&
			date1.getFullYear() === date2.getFullYear()
		);
	}, []);

	const isSameMonth = useCallback((date1: Date, date2: Date) => {
		return (
			date1.getMonth() === date2.getMonth() &&
			date1.getFullYear() === date2.getFullYear()
		);
	}, []);

	const isDateDisabled = useCallback(
		(date: Date) => {
			if (disabled) return true;

			if (minDate && date < minDate) return true;
			if (maxDate && date > maxDate) return true;

			if (disabledDates) {
				if (typeof disabledDates === "function") {
					return disabledDates(date);
				}
				return disabledDates.some((disabledDate) =>
					isSameDay(date, disabledDate),
				);
			}

			return false;
		},
		[disabled, minDate, maxDate, disabledDates, isSameDay],
	);

	const calendarDays = useMemo(() => {
		const year = currentMonth.getFullYear();
		const month = currentMonth.getMonth();

		const firstDayOfMonth = new Date(year, month, 1);
		const lastDayOfMonth = new Date(year, month + 1, 0);

		const startDate = new Date(firstDayOfMonth);
		startDate.setDate(
			startDate.getDate() - ((firstDayOfMonth.getDay() - weekStartsOn + 7) % 7),
		);

		const endDate = new Date(lastDayOfMonth);
		const daysToAdd = 6 - ((lastDayOfMonth.getDay() - weekStartsOn + 7) % 7);
		endDate.setDate(endDate.getDate() + daysToAdd);

		const days: Date[] = [];
		const current = new Date(startDate);

		while (current <= endDate) {
			days.push(new Date(current));
			current.setDate(current.getDate() + 1);
		}

		return days;
	}, [currentMonth, weekStartsOn]);

	const goToPreviousMonth = useCallback(() => {
		setCurrentMonth(
			(prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
		);
	}, []);

	const goToNextMonth = useCallback(() => {
		setCurrentMonth(
			(prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
		);
	}, []);

	const goToToday = useCallback(() => {
		const today = new Date();
		setCurrentMonth(today);
	}, []);

	const getISOWeekNumber = useCallback((date: Date) => {
		const d = new Date(
			Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
		);
		const dayNum = d.getUTCDay() || 7;
		d.setUTCDate(d.getUTCDate() + 4 - dayNum);
		const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
		return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
	}, []);

	const handleDateSelect = useCallback(
		(date: Date) => {
			if (isDateDisabled(date)) return;

			if (!isControlled) {
				setInternalValue(date);
			}

			onChange?.(date);
		},
		[isDateDisabled, isControlled, onChange],
	);

	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent, date: Date) => {
			if (disabled) return;

			let newDate: Date | null = null;

			switch (event.key) {
				case "ArrowLeft":
					event.preventDefault();
					newDate = new Date(date);
					newDate.setDate(date.getDate() - 1);
					break;
				case "ArrowRight":
					event.preventDefault();
					newDate = new Date(date);
					newDate.setDate(date.getDate() + 1);
					break;
				case "ArrowUp":
					event.preventDefault();
					newDate = new Date(date);
					newDate.setDate(date.getDate() - 7);
					break;
				case "ArrowDown":
					event.preventDefault();
					newDate = new Date(date);
					newDate.setDate(date.getDate() + 7);
					break;
				case "Home":
					event.preventDefault();
					newDate = new Date(date.getFullYear(), date.getMonth(), 1);
					break;
				case "End":
					event.preventDefault();
					newDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
					break;
				case "Enter":
				case " ":
					event.preventDefault();
					handleDateSelect(date);
					return;
			}

			if (newDate && !isDateDisabled(newDate)) {
				if (!isSameMonth(newDate, currentMonth)) {
					setCurrentMonth(newDate);
				}

				// Focus the new date button
				const newDateButton = document.querySelector(
					`[data-date="${newDate.toISOString().split("T")[0]}"]`,
				) as HTMLButtonElement;
				newDateButton?.focus();
			}
		},
		[disabled, handleDateSelect, isDateDisabled, isSameMonth, currentMonth],
	);

	const weekdays = useMemo(() => {
		const days = [];
		for (let i = 0; i < DAYS_IN_WEEK; i++) {
			const dayIndex = (weekStartsOn + i) % DAYS_IN_WEEK;
			const date = new Date(2023, 0, dayIndex + 1); // Use a known Sunday (Jan 1, 2023)
			const dayName = formatWeekday(date);
			days.push(dayName.slice(0, 2));
		}
		return days;
	}, [weekStartsOn, formatWeekday]);

	return (
		<div className="relative p-[1px] bg-linear-to-b from-nocta-200 dark:from-nocta-100/20 to-transparent rounded-xl w-fit">
			<div
				className={cn(
				calendarVariants({
					disabled,
					hasCustomBackground: shouldOverrideBackground,
				}),
				className,
			)}
				role="application"
				aria-label={ariaLabel || "Calendar"}
				{...props}
			>
				<div
					className={cn(
					"flex items-center justify-between border-b border-nocta-100 dark:border-nocta-800/50",
					"px-4 py-3",
				)}
				>
					<button
						type="button"
						onClick={goToPreviousMonth}
						disabled={disabled}
						className={cn(
						"rounded-md hover:bg-nocta-100 dark:hover:bg-nocta-900 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed transition-colors",
						"p-1.5",
					)}
						aria-label="Previous month"
					>
						<svg
							className="w-4 h-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M15 19l-7-7 7-7"
							/>
						</svg>
					</button>

					<div className="flex items-center space-x-3">
						<h2
							className={cn(
								"font-semibold text-nocta-900 dark:text-nocta-100",
								"text-sm",
							)}
						>
							{formatMonth(currentMonth)}
						</h2>
						<button
							type="button"
							onClick={goToToday}
							disabled={disabled}
							className={cn(
								"rounded-md bg-nocta-100 dark:bg-nocta-900 hover:bg-nocta-200 dark:hover:bg-nocta-800 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed transition-colors",
								"px-2 py-1 text-xs",
							)}
						>
							Today
						</button>
					</div>

					<button
						type="button"
						onClick={goToNextMonth}
						disabled={disabled}
						className={cn(
						"rounded-md hover:bg-nocta-100 dark:hover:bg-nocta-900 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed transition-colors",
						"p-1.5",
					)}
						aria-label="Next month"
					>
						<svg
							className="w-4 h-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 5l7 7-7 7"
							/>
						</svg>
					</button>
				</div>

				<div className="px-4 py-3">
					<div
						className={cn(
						"grid mb-3",
						showWeekNumbers ? "grid-cols-8" : "grid-cols-7",
						"gap-1",
					)}
					>
						{showWeekNumbers && (
							<div
								className={cn(
									"font-medium text-nocta-500 dark:text-nocta-400 text-center flex items-center justify-center",
									"text-xs w-8 h-8",
								)}
							>
								Wk
							</div>
						)}
						{weekdays.map((day, index) => (
							<div
								key={index}
								className={cn(
									"font-medium text-nocta-500 dark:text-nocta-400 text-center flex items-center justify-center",
									"text-xs w-8 h-8",
								)}
							>
								{day}
							</div>
						))}
					</div>

					<div className="space-y-1">
						{Array.from(
							{ length: Math.ceil(calendarDays.length / DAYS_IN_WEEK) },
							(_, weekIndex) => (
								<div
									key={weekIndex}
									className={cn(
									"grid",
									showWeekNumbers ? "grid-cols-8" : "grid-cols-7",
									"gap-1",
								)}
								>
									{showWeekNumbers && (
										<div
											className={cn(
											"text-nocta-400 dark:text-nocta-500 text-center flex items-center justify-center",
											"text-xs w-8 h-8",
										)}
										>
											{getISOWeekNumber(calendarDays[weekIndex * DAYS_IN_WEEK])}
										</div>
									)}
									{calendarDays
										.slice(
											weekIndex * DAYS_IN_WEEK,
											(weekIndex + 1) * DAYS_IN_WEEK,
										)
										.map((date, dayIndex) => {
											const isSelected =
												selectedDate && isSameDay(date, selectedDate);
											const isCurrentMonth = isSameMonth(date, currentMonth);
											const isToday = isSameDay(date, new Date());
											const isDisabled = isDateDisabled(date);
											const shouldShow = showOutsideDays || isCurrentMonth;

											if (!shouldShow) {
												return (
															<div
																key={dayIndex}
																className="w-8 h-8"
															/>
														);
											}

											return (
												<button
													key={dayIndex}
													type="button"
													onClick={() => handleDateSelect(date)}
													onKeyDown={(e) => handleKeyDown(e, date)}
													disabled={isDisabled}
													data-date={date.toISOString().split("T")[0]}
													className={cn(
																dayButtonVariants({
																	state: isSelected
																		? "selected"
																		: isToday
																			? "today"
																			: isDisabled
																				? "disabled"
																				: !isCurrentMonth
																					? "outsideMonth"
																					: "default",
																	interaction: isDisabled ? "disabled" : "enabled",
																}),
															)}
													aria-label={`${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`}
													aria-pressed={isSelected}
													aria-current={isToday ? "date" : undefined}
												>
													{date.getDate()}
												</button>
											);
										})}
								</div>
							),
						)}
					</div>
				</div>
			</div>
		</div>
	);
};
