'use client';

import type React from 'react';
import { useState } from 'react';
import { RadioGroup, RadioGroupItem } from './radio-group';

const options = [
	{ value: 'light', label: 'Light' },
	{ value: 'dark', label: 'Dark' },
	{ value: 'system', label: 'System' },
];

export const BasicRadioGroupDemo: React.FC = () => {
	const [theme, setTheme] = useState('system');

	return (
		<RadioGroup value={theme} onValueChange={setTheme} aria-label="Theme">
			{options.map((option) => (
				<RadioGroupItem
					key={option.value}
					value={option.value}
					label={option.label}
				/>
			))}
		</RadioGroup>
	);
};

export const DescriptiveRadioGroupDemo: React.FC = () => {
	const [plan, setPlan] = useState('pro');

	return (
		<RadioGroup value={plan} onValueChange={setPlan} aria-label="Pricing plans">
			<RadioGroupItem
				value="starter"
				label="Starter"
				description="Basic plan for personal projects"
			/>
			<RadioGroupItem
				value="pro"
				label="Pro"
				description="Advanced features for growing teams"
			/>
			<RadioGroupItem
				value="enterprise"
				label="Enterprise"
				description="Full access with dedicated support"
			/>
		</RadioGroup>
	);
};

export const HorizontalRadioGroupDemo: React.FC = () => {
	const [alignment, setAlignment] = useState('center');

	return (
		<RadioGroup
			value={alignment}
			onValueChange={setAlignment}
			className="flex flex-row gap-4"
			aria-label="Alignment"
		>
			<RadioGroupItem value="start" label="Start" />
			<RadioGroupItem value="center" label="Center" />
			<RadioGroupItem value="end" label="End" />
		</RadioGroup>
	);
};

export const SizesRadioGroupDemo: React.FC = () => {
	const [values, setValues] = useState({ sm: 'sm', md: 'md', lg: 'lg' });

	const handleChange = (key: keyof typeof values) => (next: string) => {
		setValues((prev) => ({ ...prev, [key]: next as 'sm' | 'md' | 'lg' }));
	};

	return (
		<div className="flex flex-col gap-6">
			<RadioGroup
				value={values.sm}
				onValueChange={handleChange('sm')}
				aria-label="Small size"
			>
				<RadioGroupItem value="sm" label="Small" />
				<RadioGroupItem value="md" label="Medium" />
				<RadioGroupItem value="lg" label="Large" />
			</RadioGroup>

			<RadioGroup
				value={values.md}
				onValueChange={handleChange('md')}
				aria-label="Medium size"
			>
				<RadioGroupItem value="sm" label="Small" />
				<RadioGroupItem value="md" label="Medium" />
				<RadioGroupItem value="lg" label="Large" />
			</RadioGroup>

			<RadioGroup
				value={values.lg}
				onValueChange={handleChange('lg')}
				aria-label="Large size"
			>
				<RadioGroupItem value="sm" label="Small" />
				<RadioGroupItem value="md" label="Medium" />
				<RadioGroupItem value="lg" label="Large" />
			</RadioGroup>
		</div>
	);
};
