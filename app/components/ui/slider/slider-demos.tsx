'use client';

import type React from 'react';
import { useState } from 'react';
import { Slider } from './slider';

export const BasicSliderDemo: React.FC = () => {
	const [value, setValue] = useState(50);

	return (
		<div className="my-6 w-48">
			<Slider value={value} onChange={setValue} aria-label="Basic slider" />
		</div>
	);
};

export const SecondarySliderDemo: React.FC = () => {
	const [value, setValue] = useState(25);

	return (
		<div className="my-6 w-48">
			<Slider
				variant="secondary"
				value={value}
				onChange={setValue}
				aria-label="Secondary slider"
			/>
		</div>
	);
};

export const SizesDemo: React.FC = () => {
	const [smallValue, setSmallValue] = useState(25);
	const [mediumValue, setMediumValue] = useState(50);
	const [largeValue, setLargeValue] = useState(75);

	return (
		<div className="my-6 w-48 space-y-6">
			<div className="flex flex-col space-y-2">
				<label className="text-sm font-medium text-foreground/70">Small</label>
				<Slider
					size="sm"
					value={smallValue}
					onChange={setSmallValue}
					aria-label="Small size slider"
				/>
			</div>
			<div className="flex flex-col space-y-2">
				<label className="text-sm font-medium text-foreground/70">Medium</label>
				<Slider
					size="md"
					value={mediumValue}
					onChange={setMediumValue}
					aria-label="Medium size slider"
				/>
			</div>
			<div className="flex flex-col space-y-2">
				<label className="text-sm font-medium text-foreground/70">Large</label>
				<Slider
					size="lg"
					value={largeValue}
					onChange={setLargeValue}
					aria-label="Large size slider"
				/>
			</div>
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
				<label className="text-sm font-medium text-foreground/70">
					Temperature (16°C - 30°C)
				</label>
				<Slider
					min={16}
					max={30}
					step={0.5}
					value={temperature}
					onChange={setTemperature}
					showValue
					formatValue={(val) => `${val}°C`}
					variant="default"
					aria-label="Temperature slider"
				/>
			</div>
			<div className="flex flex-col space-y-2">
				<label className="text-sm font-medium text-foreground/70">
					Volume (0 - 10)
				</label>
				<Slider
					min={0}
					max={10}
					value={volume}
					onChange={setVolume}
					showValue
					variant="secondary"
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
				<label className="text-sm font-medium text-foreground/45 dark:text-foreground/45">
					Disabled Slider
				</label>
				<Slider value={60} disabled aria-label="Disabled slider" />
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
	const [value2, setValue2] = useState(70);

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
						aria-label="Vertical slider 1"
					/>
					<span className="text-xs text-foreground/70 mt-2">Default</span>
				</div>
				<div className="flex h-48 flex-col items-center gap-2">
					<Slider
						orientation="vertical"
						value={value2}
						onChange={setValue2}
						variant="secondary"
						size="lg"
						className="h-full"
						aria-label="Vertical slider 2"
					/>
					<span className="text-xs text-foreground/70 mt-2">
						Secondary Large
					</span>
				</div>
			</div>
		</div>
	);
};

export const PriceRangeDemo: React.FC = () => {
	const [budget, setBudget] = useState(2500);

	return (
		<div className="my-6 w-48">
			<div className="rounded-lg bg-card p-4">
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<h3 className="text-sm font-medium text-foreground">
							Budget Range
						</h3>
						<span className="text-sm font-medium text-foreground/70">
							${budget.toLocaleString()}
						</span>
					</div>
					<Slider
						min={500}
						max={10000}
						step={100}
						value={budget}
						onChange={setBudget}
						variant="default"
						size="lg"
						aria-label="Budget range slider"
					/>
					<div className="flex justify-between text-xs text-foreground/45 dark:text-foreground/45">
						<span>$500</span>
						<span>$10,000</span>
					</div>
				</div>
			</div>
		</div>
	);
};
