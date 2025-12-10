'use client';

import type React from 'react';
import { useState } from 'react';
import { Slider } from '@nocta/registry/ui/slider';

export const BasicSliderDemo: React.FC = () => {
	const [value, setValue] = useState(50);

	return (
		<div className="my-6 w-48">
			<Slider
				value={value}
				onChange={setValue}
				label="Basic slider"
				showLabel
				aria-label="Basic slider"
			/>
		</div>
	);
};

export const WithValueDemo: React.FC = () => {
	const [value, setValue] = useState(42);

	return (
		<div className="my-6 w-48">
			<Slider
				value={value}
				onChange={setValue}
				label="Slider with value display"
				showLabel
				showValue
				variant="default"
				aria-label="Slider with value display"
			/>
		</div>
	);
};

export const CustomRangeDemo: React.FC = () => {
	const [temperature, setTemperature] = useState(22);
	const [volume, setVolume] = useState(7);

	return (
		<div className="my-6 w-48 space-y-6">
			<div className="flex flex-col space-y-2">
				<Slider
					min={16}
					max={30}
					step={0.5}
					value={temperature}
					onChange={setTemperature}
					label="Temperature (16°C - 30°C)"
					showLabel
					showValue
					formatValue={(val) => `${val}°C`}
					variant="default"
					aria-label="Temperature slider"
				/>
			</div>

			<div className="flex flex-col space-y-2">
				<Slider
					min={0}
					max={10}
					value={volume}
					onChange={setVolume}
					label="Volume (0 - 10)"
					showLabel
					showValue
					aria-label="Volume slider"
				/>
			</div>
		</div>
	);
};

export const DisabledDemo: React.FC = () => {
	return (
		<div className="my-6 w-48 space-y-4">
			<div className="flex flex-col space-y-2">
				<Slider
					value={60}
					disabled
					label="Disabled slider"
					showLabel
					aria-label="Disabled slider"
				/>
			</div>
		</div>
	);
};

export const StepDemo: React.FC = () => {
	const [value, setValue] = useState(20);

	return (
		<div className="my-6 w-56">
			<div className="flex flex-col space-y-2">
				<Slider
					min={0}
					max={100}
					step={5}
					value={value}
					onChange={setValue}
					label="Stepped slider"
					showLabel
					showValue
					variant="default"
					aria-label="Stepped slider"
				/>
			</div>
		</div>
	);
};

export const VerticalDemo: React.FC = () => {
	const [value1, setValue1] = useState(30);

	return (
		<div className="my-6">
			<div className="flex items-center gap-8">
				<div className="flex h-48 flex-col items-center gap-2">
					<Slider
						orientation="vertical"
						value={value1}
						onChange={setValue1}
						variant="default"
						className="h-full"
						label="Vertical slider"
						showLabel
						showValue
						aria-label="Vertical slider"
					/>
				</div>
			</div>
		</div>
	);
};
