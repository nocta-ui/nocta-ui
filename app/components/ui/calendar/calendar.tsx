'use client'

import * as Ariakit from '@ariakit/react'
import { cva, type VariantProps } from 'class-variance-authority'
import React, { useCallback, useMemo, useState } from 'react'
import { Icons } from '@/app/components/ui/icons/icons'
import { cn } from '@/lib/utils'

const calendarVariants = cva(
  [
    'rounded-lg bg-background',
    'shadow-md',
    'transition-all duration-200 ease-in-out',
    'overflow-hidden',
    'not-prose',
    'text-xs',
    'w-fit',
    'max-w-sm',
  ],
  {
    variants: {
      disabled: {
        true: 'opacity-50 cursor-not-allowed',
        false: '',
      },
    },
    defaultVariants: {
      disabled: false,
    },
  }
)

const dayButtonVariants = cva(
  [
    'text-center',
    'rounded-md',
    'transition-colors',
    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-offset-ring-offset/50 not-prose focus-visible:ring-ring/50 focus-visible:border-border',
    'w-8',
    'h-8',
    'text-xs',
    'flex',
    'items-center',
    'justify-center',
  ],
  {
    variants: {
      state: {
        default: 'hover:bg-background-muted text-foreground-muted',
        selected: 'bg-foreground text-background',
        today: 'bg-background-muted text-foreground',
        disabled: 'opacity-50 cursor-not-allowed line-through',
        outsideMonth: 'text-foreground-subtle',
      },
      interaction: {
        enabled: 'cursor-pointer',
        disabled: 'cursor-not-allowed',
      },
    },
    defaultVariants: {
      state: 'default',
      interaction: 'enabled',
    },
  }
)

const DAYS_IN_WEEK = 7
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export interface CalendarProps
  extends Omit<
      React.HTMLAttributes<HTMLDivElement>,
      'onChange' | 'defaultValue'
    >,
    Omit<VariantProps<typeof calendarVariants>, 'disabled'> {
  value?: Date
  defaultValue?: Date
  onChange?: (date: Date | undefined) => void
  disabled?: boolean
  disabledDates?: Date[] | ((date: Date) => boolean)
  minDate?: Date
  maxDate?: Date
  showWeekNumbers?: boolean
  showOutsideDays?: boolean
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  formatMonth?: (date: Date) => string
  formatWeekday?: (date: Date) => string
  'aria-label'?: string
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
  className = '',
  'aria-label': ariaLabel,
  ...props
}) => {
  const [internalValue, setInternalValue] = useState<Date | undefined>(
    defaultValue
  )
  const [currentMonth, setCurrentMonth] = useState(() => {
    return controlledValue || defaultValue || new Date()
  })

  const isControlled = controlledValue !== undefined
  const selectedDate = isControlled ? controlledValue : internalValue
  const headingId = React.useId()

  const isSameDay = useCallback((date1: Date, date2: Date) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    )
  }, [])

  const isSameMonth = useCallback((date1: Date, date2: Date) => {
    return (
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    )
  }, [])

  const isDateDisabled = useCallback(
    (date: Date) => {
      if (disabled) return true

      if (minDate && date < minDate) return true
      if (maxDate && date > maxDate) return true

      if (disabledDates) {
        if (typeof disabledDates === 'function') {
          return disabledDates(date)
        }
        return disabledDates.some((disabledDate) =>
          isSameDay(date, disabledDate)
        )
      }

      return false
    },
    [disabled, minDate, maxDate, disabledDates, isSameDay]
  )

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()

    const firstDayOfMonth = new Date(year, month, 1)
    const lastDayOfMonth = new Date(year, month + 1, 0)

    const startDate = new Date(firstDayOfMonth)
    startDate.setDate(
      startDate.getDate() - ((firstDayOfMonth.getDay() - weekStartsOn + 7) % 7)
    )

    const endDate = new Date(lastDayOfMonth)
    const daysToAdd = 6 - ((lastDayOfMonth.getDay() - weekStartsOn + 7) % 7)
    endDate.setDate(endDate.getDate() + daysToAdd)

    const days: Date[] = []
    const current = new Date(startDate)

    while (current <= endDate) {
      days.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }

    return days
  }, [currentMonth, weekStartsOn])

  const goToPreviousMonth = useCallback(() => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    )
  }, [])

  const goToNextMonth = useCallback(() => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    )
  }, [])

  const goToToday = useCallback(() => {
    const today = new Date()
    setCurrentMonth(today)

    if (!isDateDisabled(today)) {
      if (!isControlled) {
        setInternalValue(today)
      }
      onChange?.(today)
    }
  }, [isControlled, isDateDisabled, onChange])

  const getISOWeekNumber = useCallback((date: Date) => {
    const d = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    )
    const dayNum = d.getUTCDay() || 7
    d.setUTCDate(d.getUTCDate() + 4 - dayNum)
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
  }, [])

  const handleDateSelect = useCallback(
    (date: Date) => {
      if (isDateDisabled(date)) return

      if (!isControlled) {
        setInternalValue(date)
      }

      onChange?.(date)
    },
    [isDateDisabled, isControlled, onChange]
  )

  const weekdays = useMemo(() => {
    const days = []
    for (let i = 0; i < DAYS_IN_WEEK; i++) {
      const dayIndex = (weekStartsOn + i) % DAYS_IN_WEEK
      const date = new Date(2023, 0, dayIndex + 1)
      const dayName = formatWeekday(date)
      days.push(dayName.slice(0, 2))
    }
    return days
  }, [weekStartsOn, formatWeekday])

  const focusDateISO = useMemo(() => {
    const toISO = (d: Date) => d.toISOString().split('T')[0]
    const isVisible = (d: Date) =>
      showOutsideDays || isSameMonth(d, currentMonth)

    if (selectedDate) {
      const found = calendarDays.find(
        (d) => isVisible(d) && isSameDay(d, selectedDate) && !isDateDisabled(d)
      )
      if (found) return toISO(found)
    }

    const today = new Date()
    const todayInView = calendarDays.find(
      (d) => isVisible(d) && isSameDay(d, today) && !isDateDisabled(d)
    )
    if (todayInView) return toISO(todayInView)

    const firstEnabledCurrentMonth = calendarDays.find(
      (d) => isSameMonth(d, currentMonth) && isVisible(d) && !isDateDisabled(d)
    )
    if (firstEnabledCurrentMonth) return toISO(firstEnabledCurrentMonth)

    const firstEnabledAny = calendarDays.find(
      (d) => isVisible(d) && !isDateDisabled(d)
    )
    return firstEnabledAny ? toISO(firstEnabledAny) : undefined
  }, [
    calendarDays,
    currentMonth,
    isDateDisabled,
    isSameDay,
    isSameMonth,
    selectedDate,
    showOutsideDays,
  ])

  const composite = Ariakit.useCompositeStore({
    orientation: 'horizontal',
    focusLoop: false,
  })

  React.useEffect(() => {
    if (focusDateISO) {
      composite.setActiveId(`d-${focusDateISO}`)
    }
  }, [composite, focusDateISO])

  return (
    <div
      className={cn(
        calendarVariants({
          disabled,
        }),
        'border-border relative overflow-hidden border border-none dark:border-solid',
        className
      )}
      {...props}
    >
      <div className={cn('flex items-center justify-between', 'px-4 pt-4')}>
        <button
          type="button"
          onClick={goToPreviousMonth}
          disabled={disabled}
          className={cn(
            'text-foreground-muted hover:bg-background focus-visible:ring-offset-ring-offset/50 not-prose focus-visible:ring-ring/50 focus-visible:border-border cursor-pointer rounded-md transition-colors focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
            'p-1.5'
          )}
          aria-label="Previous month"
        >
          <Icons.ChevronLeft aria-hidden="true" className="h-4 w-4" />
        </button>

        <div className="flex items-center space-x-3">
          <h2
            id={headingId}
            aria-live="polite"
            aria-atomic="true"
            className={cn('text-foreground font-semibold', 'text-sm')}
          >
            {formatMonth(currentMonth)}
          </h2>
          <button
            type="button"
            onClick={goToToday}
            disabled={disabled}
            className={cn(
              'bg-background hover:bg-background-muted text-foreground-muted focus-visible:ring-offset-ring-offset/50 not-prose focus-visible:ring-ring/50 focus-visible:border-border cursor-pointer rounded-md transition-colors focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
              'px-2 py-1 text-xs'
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
            'text-foreground-muted hover:bg-background focus-visible:ring-offset-ring-offset/50 not-prose focus-visible:ring-ring/50 focus-visible:border-border cursor-pointer rounded-md transition-colors focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
            'p-1.5'
          )}
          aria-label="Next month"
        >
          <Icons.ChevronRight aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>

      <div className="p-4">
        <div
          className={cn(
            'mb-3 grid',
            showWeekNumbers ? 'grid-cols-8' : 'grid-cols-7',
            'gap-1'
          )}
        >
          {showWeekNumbers && (
            <div
              className={cn(
                'text-foreground-subtle flex items-center justify-center text-center font-medium',
                'h-8 w-8 text-xs'
              )}
            >
              Wk
            </div>
          )}
          {weekdays.map((day) => {
            return (
              <div
                key={day}
                className={cn(
                  'text-foreground-subtle flex items-center justify-center text-center font-medium',
                  'h-8 w-8 text-xs'
                )}
              >
                {day}
              </div>
            )
          })}
        </div>

        <Ariakit.Composite
          store={composite}
          role="grid"
          {...(ariaLabel
            ? { ['aria-label']: ariaLabel }
            : { ['aria-labelledby']: headingId })}
          className="space-y-1"
        >
          {Array.from(
            { length: Math.ceil(calendarDays.length / DAYS_IN_WEEK) },
            (_, weekIndex) => (
              <Ariakit.CompositeRow
                key={
                  calendarDays[weekIndex * DAYS_IN_WEEK]
                    .toISOString()
                    .split('T')[0]
                }
                className={cn(
                  'grid',
                  showWeekNumbers ? 'grid-cols-8' : 'grid-cols-7',
                  'gap-1'
                )}
              >
                {showWeekNumbers && (
                  <div
                    className={cn(
                      'text-foreground-subtle flex items-center justify-center text-center',
                      'h-8 w-8 text-xs'
                    )}
                  >
                    {getISOWeekNumber(calendarDays[weekIndex * DAYS_IN_WEEK])}
                  </div>
                )}
                {calendarDays
                  .slice(
                    weekIndex * DAYS_IN_WEEK,
                    (weekIndex + 1) * DAYS_IN_WEEK
                  )
                  .map((date, _dayIndex) => {
                    const isSelected =
                      selectedDate && isSameDay(date, selectedDate)
                    const isCurrentMonth = isSameMonth(date, currentMonth)
                    const isToday = isSameDay(date, new Date())
                    const isDisabled = isDateDisabled(date)
                    const shouldShow = showOutsideDays || isCurrentMonth

                    if (!shouldShow) {
                      return (
                        <div key={date.toISOString()} className="h-8 w-8" />
                      )
                    }

                    return (
                      <Ariakit.CompositeItem
                        id={`d-${date.toISOString().split('T')[0]}`}
                        key={date.toISOString()}
                        onClick={() => handleDateSelect(date)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            handleDateSelect(date)
                          }
                        }}
                        role="gridcell"
                        aria-selected={Boolean(isSelected)}
                        aria-disabled={isDisabled || undefined}
                        data-date={date.toISOString().split('T')[0]}
                        className={cn(
                          dayButtonVariants({
                            state: isSelected
                              ? 'selected'
                              : isToday
                                ? 'today'
                                : isDisabled
                                  ? 'disabled'
                                  : !isCurrentMonth
                                    ? 'outsideMonth'
                                    : 'default',
                            interaction: isDisabled ? 'disabled' : 'enabled',
                          })
                        )}
                        aria-label={`${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`}
                        aria-current={isToday ? 'date' : undefined}
                      >
                        {date.getDate()}
                      </Ariakit.CompositeItem>
                    )
                  })}
              </Ariakit.CompositeRow>
            )
          )}
        </Ariakit.Composite>
      </div>
    </div>
  )
}
