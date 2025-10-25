'use client';

import {
	FontBoldIcon,
	FontItalicIcon,
	UnderlineIcon,
} from '@radix-ui/react-icons';
import * as React from 'react';
import { ToggleGroup, ToggleGroupItem } from './toggle-group';

export const BasicToggleGroupDemo: React.FC = () => {
	const [value, setValue] = React.useState<string[]>(['daily']);

	return (
		<div className="space-y-3">
			<ToggleGroup single value={value} onValueChange={setValue}>
				<ToggleGroupItem value="daily">Daily</ToggleGroupItem>
				<ToggleGroupItem value="weekly">Weekly</ToggleGroupItem>
				<ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
			</ToggleGroup>

			<p className="text-sm text-foreground/70">
				Selected:{' '}
				{value.length > 0 && value[0]
					? value[0].charAt(0).toUpperCase() + value[0].slice(1)
					: 'None'}
			</p>
		</div>
	);
};

export const MultipleToggleGroupDemo: React.FC = () => {
	const [values, setValues] = React.useState<string[]>(['email']);

	return (
		<div className="space-y-3 w-50">
			<ToggleGroup value={values} onValueChange={setValues}>
				<ToggleGroupItem value="email">Email</ToggleGroupItem>
				<ToggleGroupItem value="sms">SMS</ToggleGroupItem>
				<ToggleGroupItem value="push">Push</ToggleGroupItem>
			</ToggleGroup>

			<p className="text-sm text-foreground/70">
				Active channels:{' '}
				{values.length > 0 ? values.join(', ') : 'None selected'}
			</p>
		</div>
	);
};

export const ToggleGroupWithIconsDemo: React.FC = () => {
	const [formats, setFormats] = React.useState<string[]>(['bold']);

	return (
		<ToggleGroup
			value={formats}
			onValueChange={setFormats}
			size="sm"
			className="w-fit"
		>
			<ToggleGroupItem value="bold" aria-label="Bold">
				<FontBoldIcon className="h-4 w-4" aria-hidden="true" />
			</ToggleGroupItem>
			<ToggleGroupItem value="italic" aria-label="Italic">
				<FontItalicIcon className="h-4 w-4" aria-hidden="true" />
			</ToggleGroupItem>
			<ToggleGroupItem value="underline" aria-label="Underline">
				<UnderlineIcon className="h-4 w-4" aria-hidden="true" />
			</ToggleGroupItem>
		</ToggleGroup>
	);
};

export const ToggleGroupSizesDemo: React.FC = () => {
	const [values, setValues] = React.useState({
		sm: ['left'],
		md: ['center'],
		lg: ['right'],
	});

	const handleChange = (size: keyof typeof values) => (newValues: string[]) => {
		setValues((prev) => ({ ...prev, [size]: newValues }));
	};

	return (
		<div className="flex flex-col items-start gap-6">
			<div className="flex flex-col gap-2">
				<p className="text-sm font-medium text-foreground/70">Small</p>
				<ToggleGroup
					single
					size="sm"
					value={values.sm}
					onValueChange={handleChange('sm')}
				>
					<ToggleGroupItem value="left">Left</ToggleGroupItem>
					<ToggleGroupItem value="center">Center</ToggleGroupItem>
					<ToggleGroupItem value="right">Right</ToggleGroupItem>
				</ToggleGroup>
			</div>

			<div className="flex flex-col gap-2">
				<p className="text-sm font-medium text-foreground/70">Medium</p>
				<ToggleGroup
					single
					size="md"
					value={values.md}
					onValueChange={handleChange('md')}
				>
					<ToggleGroupItem value="left">Left</ToggleGroupItem>
					<ToggleGroupItem value="center">Center</ToggleGroupItem>
					<ToggleGroupItem value="right">Right</ToggleGroupItem>
				</ToggleGroup>
			</div>

			<div className="flex flex-col gap-2">
				<p className="text-sm font-medium text-foreground/70">Large</p>
				<ToggleGroup
					single
					size="lg"
					value={values.lg}
					onValueChange={handleChange('lg')}
				>
					<ToggleGroupItem value="left">Left</ToggleGroupItem>
					<ToggleGroupItem value="center">Center</ToggleGroupItem>
					<ToggleGroupItem value="right">Right</ToggleGroupItem>
				</ToggleGroup>
			</div>
		</div>
	);
};
