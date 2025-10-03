'use client';

import type React from 'react';
import { useState } from 'react';
import { Checkbox } from './checkbox';

export const BasicCheckboxDemo: React.FC = () => {
	const [isChecked, setIsChecked] = useState(false);

	return <Checkbox checked={isChecked} onCheckedChange={setIsChecked} />;
};

export const SizesDemo: React.FC = () => {
	const [states, setStates] = useState({
		sm: true,
		md: true,
		lg: true,
	});

	const handleChange = (size: keyof typeof states) => (checked: boolean) => {
		setStates((prev) => ({ ...prev, [size]: checked }));
	};

	return (
		<div className="flex items-center gap-6">
			<div className="flex items-center gap-2">
				<Checkbox
					size="sm"
					checked={states.sm}
					onCheckedChange={handleChange('sm')}
				/>
				<span className="text-sm">Small</span>
			</div>
			<div className="flex items-center gap-2">
				<Checkbox
					size="md"
					checked={states.md}
					onCheckedChange={handleChange('md')}
				/>
				<span className="text-sm">Medium</span>
			</div>
			<div className="flex items-center gap-2">
				<Checkbox
					size="lg"
					checked={states.lg}
					onCheckedChange={handleChange('lg')}
				/>
				<span className="text-sm">Large</span>
			</div>
		</div>
	);
};

export const LabeledCheckboxDemo: React.FC = () => {
	const [states, setStates] = useState({
		notifications: false,
		marketing: true,
	});

	const handleChange = (field: keyof typeof states) => (checked: boolean) => {
		setStates((prev) => ({ ...prev, [field]: checked }));
	};

	return (
		<div className="space-y-4">
			<div className="flex items-start gap-3">
				<Checkbox
					id="option1"
					checked={states.notifications}
					onCheckedChange={handleChange('notifications')}
				/>
				<div>
					<label
						htmlFor="option1"
						className="cursor-pointer text-sm font-medium"
					>
						Enable notifications
					</label>
					<p className="mt-1 text-xs text-foreground/70">
						Receive email notifications about your account activity
					</p>
				</div>
			</div>
			<div className="flex items-start gap-3">
				<Checkbox
					id="option2"
					checked={states.marketing}
					onCheckedChange={handleChange('marketing')}
				/>
				<div>
					<label
						htmlFor="option2"
						className="cursor-pointer text-sm font-medium"
					>
						Marketing emails
					</label>
					<p className="mt-1 text-xs text-foreground/70">
						Get updates about new features and special offers
					</p>
				</div>
			</div>
		</div>
	);
};

export const CustomStylingDemo: React.FC = () => {
	const [states, setStates] = useState({
		scaled: true,
		rounded: true,
		shadow: false,
	});

	const handleChange = (type: keyof typeof states) => (checked: boolean) => {
		setStates((prev) => ({ ...prev, [type]: checked }));
	};

	return (
		<div className="flex items-center gap-4">
			<div className="flex items-center gap-2">
				<Checkbox
					className="scale-125"
					checked={states.scaled}
					onCheckedChange={handleChange('scaled')}
				/>
				<span className="text-sm">Scaled (1.25x)</span>
			</div>
			<div className="flex items-center gap-2">
				<Checkbox
					className="rounded-full"
					checked={states.rounded}
					onCheckedChange={handleChange('rounded')}
				/>
				<span className="text-sm">Rounded</span>
			</div>
			<div className="flex items-center gap-2">
				<Checkbox
					className="shadow-sm"
					checked={states.shadow}
					onCheckedChange={handleChange('shadow')}
				/>
				<span className="text-sm">With shadow</span>
			</div>
		</div>
	);
};
