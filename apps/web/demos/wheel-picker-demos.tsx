'use client';

import * as React from 'react';
import { WheelPicker, WheelPickerGroup, WheelPickerItem } from '@nocta/registry/ui/wheel-picker';

export const DefaultWheelPickerDemo: React.FC = () => {
	const [value, setValue] = React.useState<string>('June');
	const months = [
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
	];

	return (
		<div className="my-6 max-w-[220px] flex flex-col justify-center items-center">
			<WheelPicker value={value} onValueChange={setValue} aria-label="Month">
				{months.map((m) => (
					<WheelPickerItem key={m} value={m}>
						{m}
					</WheelPickerItem>
				))}
			</WheelPicker>
			<p className="mt-3 text-sm text-foreground/70">Selected: {value}</p>
		</div>
	);
};

export const SizesWheelPickerDemo: React.FC = () => {
	const numbers = Array.from({ length: 16 }, (_, i) => (i + 1).toString());
	const fallbackNumber = numbers[0] ?? '1';
	const smallDefault = numbers[5] ?? fallbackNumber;
	const mediumDefault = numbers[7] ?? fallbackNumber;
	const largeDefault = numbers[9] ?? fallbackNumber;
	return (
		<div className="my-6 grid grid-cols-3 gap-6 max-sm:grid-cols-1">
			<div>
				<p className="mb-2 text-sm font-medium text-foreground/70">Small</p>
				<WheelPicker
					size="sm"
					defaultValue={smallDefault}
					aria-label="Small size"
				>
					{numbers.map((n) => (
						<WheelPickerItem key={n} value={n}>
							{n}
						</WheelPickerItem>
					))}
				</WheelPicker>
			</div>

			<div>
				<p className="mb-2 text-sm font-medium text-foreground/70">Medium</p>
				<WheelPicker
					size="md"
					defaultValue={mediumDefault}
					aria-label="Medium size"
				>
					{numbers.map((n) => (
						<WheelPickerItem key={n} value={n}>
							{n}
						</WheelPickerItem>
					))}
				</WheelPicker>
			</div>

			<div>
				<p className="mb-2 text-sm font-medium text-foreground/70">Large</p>
				<WheelPicker
					size="lg"
					defaultValue={largeDefault}
					aria-label="Large size"
				>
					{numbers.map((n) => (
						<WheelPickerItem key={n} value={n}>
							{n}
						</WheelPickerItem>
					))}
				</WheelPicker>
			</div>
		</div>
	);
};

export const InfiniteWheelPickerDemo: React.FC = () => {
	const hours = Array.from({ length: 12 }, (_, i) =>
		((i + 1) % 12 || 12).toString().padStart(2, '0'),
	);
	const [hour, setHour] = React.useState<string>('08');

	return (
		<div className="my-6 flex flex-col gap-6 max-w-[360px]">
			<div className="flex gap-6">
				<WheelPicker
					infinite
					value={hour}
					onValueChange={setHour}
					aria-label="Hour"
				>
					{hours.map((h) => (
						<WheelPickerItem key={h} value={h}>
							{h}
						</WheelPickerItem>
					))}
				</WheelPicker>
			</div>
			<p className="text-sm text-foreground/70">
				Selected time: {hour}:{'00'}
			</p>
		</div>
	);
};

export const GroupedWheelPickerDemo: React.FC = () => {
	const months = [
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
	];
	const days = Array.from({ length: 31 }, (_, i) =>
		(i + 1).toString().padStart(2, '0'),
	);
	const years = Array.from({ length: 11 }, (_, i) => (2020 + i).toString());
	const fallbackMonth = months[0] ?? 'January';
	const fallbackYear = years[0] ?? '2020';
	const fallbackDay = days[0] ?? '01';
	const initialMonth = months[new Date().getMonth()] ?? fallbackMonth;
	const initialYear = years[4] ?? fallbackYear;
	const [month, setMonth] = React.useState<string>(initialMonth);
	const [day, setDay] = React.useState<string>(
		days[new Date().getDate() - 1] ?? fallbackDay,
	);
	const [year, setYear] = React.useState<string>(initialYear);

	return (
		<div className="my-6 flex max-w-[420px] flex-col items-center gap-4">
			<WheelPickerGroup size="md" className="w-full">
				<WheelPicker
					className="w-28"
					value={month}
					onValueChange={setMonth}
					aria-label="Month"
				>
					{months.map((m) => (
						<WheelPickerItem key={m} value={m}>
							{m}
						</WheelPickerItem>
					))}
				</WheelPicker>
				<WheelPicker
					className="w-10"
					value={day}
					onValueChange={setDay}
					aria-label="Day"
				>
					{days.map((d) => (
						<WheelPickerItem key={d} value={d}>
							{d}
						</WheelPickerItem>
					))}
				</WheelPicker>
				<WheelPicker
					className="w-24"
					value={year}
					onValueChange={setYear}
					aria-label="Year"
				>
					{years.map((y) => (
						<WheelPickerItem key={y} value={y}>
							{y}
						</WheelPickerItem>
					))}
				</WheelPicker>
			</WheelPickerGroup>
			<p className="text-sm text-foreground/70">
				Selected date: {month} {day}, {year}
			</p>
		</div>
	);
};
