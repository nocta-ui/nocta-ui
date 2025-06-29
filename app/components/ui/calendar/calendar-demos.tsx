'use client';

import React, { useState } from 'react';
import { Calendar } from './calendar';

export const BasicCalendarDemo: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  return (
    <div className="my-6">
      <Calendar 
      variant='default'
        value={selectedDate}
        onChange={setSelectedDate}
      />
    </div>
  );
};



export const VariantsDemo: React.FC = () => {
  const [defaultDate, setDefaultDate] = useState<Date | undefined>();
  const [compactDate, setCompactDate] = useState<Date | undefined>();

  return (
    <div className="my-6 space-y-8">
      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Default</label>
        <Calendar 
          variant="default"
          value={defaultDate}
          onChange={setDefaultDate}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Compact</label>
        <Calendar 
          variant="compact"
          value={compactDate}
          onChange={setCompactDate}
        />
      </div>
    </div>
  );
};

export const SizesDemo: React.FC = () => {
  const [smallDate, setSmallDate] = useState<Date | undefined>();
  const [mediumDate, setMediumDate] = useState<Date | undefined>();
  const [largeDate, setLargeDate] = useState<Date | undefined>();

  return (
    <div className="my-6 space-y-8">
      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Small</label>
        <Calendar 
          size="sm"
          value={smallDate}
          onChange={setSmallDate}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Medium</label>
        <Calendar 
          size="md"
          value={mediumDate}
          onChange={setMediumDate}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Large</label>
        <Calendar 
          size="lg"
          value={largeDate}
          onChange={setLargeDate}
        />
      </div>
    </div>
  );
};

export const WeekStartsOnMondayDemo: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  return (
    <div className="my-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Week Starts on Monday
        </label>
        <Calendar 
          weekStartsOn={1}
          value={selectedDate}
          onChange={setSelectedDate}
        />
      </div>
    </div>
  );
};

export const WithWeekNumbersDemo: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  return (
    <div className="my-6 w-120">
      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
          With Week Numbers
        </label>
        <Calendar 
          showWeekNumbers
          value={selectedDate}
          onChange={setSelectedDate}
        />
      </div>
    </div>
  );
};

export const DisabledDatesDemo: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  // Disable weekends (Saturday = 6, Sunday = 0)
  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  // Disable specific dates
  const disabledDates = [
    new Date(2024, 11, 25), // Christmas
    new Date(2024, 0, 1),   // New Year
  ];

  return (
    <div className="my-6 space-y-8">
      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Disabled Weekends
        </label>
        <Calendar 
          disabledDates={isWeekend}
          value={selectedDate}
          onChange={setSelectedDate}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Disabled Specific Dates
        </label>
        <Calendar 
          disabledDates={disabledDates}
          value={selectedDate}
          onChange={setSelectedDate}
        />
      </div>
    </div>
  );
};

export const DateRangeDemo: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const today = new Date();
  const minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const maxDate = new Date(today.getFullYear(), today.getMonth() + 2, today.getDate());

  return (
    <div className="my-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
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
  );
};

export const CustomFormattingDemo: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const formatMonth = (date: Date) => {
    const month = date.toLocaleDateString('en-US', { month: 'long' });
    const year = date.getFullYear();
    return `${month} ${year}`;
  };

  const formatWeekday = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  };

  return (
    <div className="my-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
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
  );
};

export const DisabledCalendarDemo: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  return (
    <div className="my-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-500 dark:text-neutral-500">
          Disabled Calendar
        </label>
        <Calendar 
          disabled
          value={selectedDate}
          onChange={setSelectedDate}
        />
      </div>
    </div>
  );
};

export const EventCalendarDemo: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      console.log('Selected date:', date.toLocaleDateString());
    }
  };

  return (
    <div className="my-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Event Calendar
          </label>
          <Calendar 
            value={selectedDate}
            onChange={handleDateSelect}
          />
        </div>
        {selectedDate && (
          <div className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              Selected: <span className="font-medium">{selectedDate.toLocaleDateString()}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}; 