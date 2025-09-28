'use client'

import type React from 'react'
import { useState } from 'react'
import { Calendar } from './calendar'

export const BasicCalendarDemo: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()

  return (
    <div className="my-6">
      <Calendar value={selectedDate} onChange={setSelectedDate} />
    </div>
  )
}

export const WeekStartsOnMondayDemo: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()

  return (
    <div className="my-6">
      <div className="flex flex-col space-y-2">
        <label className="text-foreground-muted text-sm font-medium">
          Week Starts on Monday
        </label>
        <Calendar
          weekStartsOn={1}
          value={selectedDate}
          onChange={setSelectedDate}
        />
      </div>
    </div>
  )
}

export const WithWeekNumbersDemo: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()

  return (
    <div className="my-6">
      <div className="flex flex-col space-y-2">
        <label className="text-foreground-muted text-sm font-medium">
          With Week Numbers
        </label>
        <Calendar
          showWeekNumbers
          value={selectedDate}
          onChange={setSelectedDate}
        />
      </div>
    </div>
  )
}

export const DisabledDatesDemo: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()

  const isWeekend = (date: Date) => {
    const day = date.getDay()
    return day === 0 || day === 6
  }

  return (
    <div className="my-6 space-y-8">
      <div className="flex flex-col space-y-2">
        <label className="text-foreground-muted text-sm font-medium">
          Disabled Weekends
        </label>
        <Calendar
          disabledDates={isWeekend}
          value={selectedDate}
          onChange={setSelectedDate}
        />
      </div>
    </div>
  )
}

export const DateRangeDemo: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()

  const today = new Date()
  const minDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  )
  const maxDate = new Date(
    today.getFullYear(),
    today.getMonth() + 2,
    today.getDate()
  )

  return (
    <div className="my-6">
      <div className="flex flex-col space-y-2">
        <label className="text-foreground-muted text-sm font-medium">
          Date Range (Today to +2 months)
        </label>
        <Calendar
          minDate={minDate}
          maxDate={maxDate}
          value={selectedDate}
          onChange={setSelectedDate}
        />
      </div>
    </div>
  )
}

export const CustomFormattingDemo: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()

  const formatMonth = (date: Date) => {
    const month = date.toLocaleDateString('en-US', { month: 'long' })
    const year = date.getFullYear()
    return `${month} ${year}`
  }

  const formatWeekday = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()
  }

  return (
    <div className="my-6">
      <div className="flex flex-col space-y-2">
        <label className="text-foreground-muted text-sm font-medium">
          Custom Formatting
        </label>
        <Calendar
          formatMonth={formatMonth}
          formatWeekday={formatWeekday}
          value={selectedDate}
          onChange={setSelectedDate}
        />
      </div>
    </div>
  )
}

export const DisabledCalendarDemo: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  return (
    <div className="my-6">
      <div className="flex flex-col space-y-2">
        <label className="text-foreground-subtle dark:text-foreground-subtle text-sm font-medium">
          Disabled Calendar
        </label>
        <Calendar disabled value={selectedDate} onChange={setSelectedDate} />
      </div>
    </div>
  )
}

export const EventCalendarDemo: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    if (date) {
      console.log('Selected date:', date.toLocaleDateString())
    }
  }

  return (
    <div className="my-6">
      <div className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label className="text-foreground-muted text-sm font-medium">
            Event Calendar
          </label>
          <Calendar value={selectedDate} onChange={handleDateSelect} />
        </div>
        {selectedDate && (
          <div className="bg-background rounded-lg p-3">
            <p className="text-foreground-muted text-sm">
              Selected:{' '}
              <span className="font-medium">
                {selectedDate.toLocaleDateString()}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
