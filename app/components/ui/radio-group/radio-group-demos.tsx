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
		<RadioGroup
			value={theme}
			onValueChange={(v) => setTheme(v as string)}
			aria-label="Theme"
		>
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
		<RadioGroup
			value={plan}
			onValueChange={(v) => setPlan(v as string)}
			aria-label="Pricing plans"
		>
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
			onValueChange={(v) => setAlignment(v as string)}
			className="flex flex-row gap-4"
			aria-label="Alignment"
		>
			<RadioGroupItem value="start" label="Start" />
			<RadioGroupItem value="center" label="Center" />
			<RadioGroupItem value="end" label="End" />
		</RadioGroup>
	);
};
