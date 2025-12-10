'use client';

import type React from 'react';
import { useState } from 'react';
import { Checkbox } from '@nocta/registry/ui/checkbox';

export const BasicCheckboxDemo: React.FC = () => {
	const [isChecked, setIsChecked] = useState(false);

	return <Checkbox checked={isChecked} onCheckedChange={setIsChecked} />;
};

export const CheckboxSizesDemo: React.FC = () => {
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
