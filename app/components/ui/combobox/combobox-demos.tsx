'use client';

import type React from 'react';
import { useState } from 'react';
import { Combobox, type ComboboxOption } from './combobox';

const frameworks: ComboboxOption[] = [
	{ value: 'next', label: 'Next.js' },
	{ value: 'react', label: 'React' },
	{ value: 'vue', label: 'Vue.js' },
	{ value: 'angular', label: 'Angular' },
	{ value: 'svelte', label: 'Svelte' },
	{ value: 'nuxt', label: 'Nuxt.js' },
	{ value: 'gatsby', label: 'Gatsby' },
	{ value: 'remix', label: 'Remix' },
];

const languages: ComboboxOption[] = [
	{ value: 'js', label: 'JavaScript' },
	{ value: 'ts', label: 'TypeScript' },
	{ value: 'py', label: 'Python' },
	{ value: 'java', label: 'Java' },
	{ value: 'csharp', label: 'C#' },
	{ value: 'cpp', label: 'C++' },
	{ value: 'go', label: 'Go' },
	{ value: 'rust', label: 'Rust' },
	{ value: 'php', label: 'PHP', disabled: true },
	{ value: 'ruby', label: 'Ruby' },
];

export const BasicComboboxDemo: React.FC = () => {
	const [value, setValue] = useState('');

	return (
		<div className="my-6">
			<div className="flex flex-col space-y-2">
				<label className="text-sm font-medium text-foreground-muted">
					Framework
				</label>
				<Combobox
					options={frameworks}
					value={value}
					onValueChange={setValue}
					placeholder="Select a framework..."
					searchPlaceholder="Search frameworks..."
					className="w-[200px]"
				/>
				{value && (
					<p className="text-xs text-foreground-muted">
						Selected: {frameworks.find((f) => f.value === value)?.label}
					</p>
				)}
			</div>
		</div>
	);
};

export const VariantsDemo: React.FC = () => {
	return (
		<div className="my-6 space-y-6">
			<div className="flex flex-col space-y-2">
				<label className="text-sm font-medium text-foreground-muted">
					Default
				</label>
				<Combobox
					options={frameworks}
					placeholder="Default variant"
					variant="default"
					className="w-[200px]"
				/>
			</div>

			<div className="flex flex-col space-y-2">
				<label className="text-sm font-medium text-foreground-muted">
					Error
				</label>
				<Combobox
					options={frameworks}
					placeholder="Error variant"
					variant="error"
					className="w-[200px]"
				/>
				<p className="text-xs text-error/90">This field is required</p>
			</div>

			<div className="flex flex-col space-y-2">
				<label className="text-sm font-medium text-foreground-muted">
					Success
				</label>
				<Combobox
					options={frameworks}
					defaultValue="react"
					variant="success"
					className="w-[200px]"
				/>
				<p className="text-xs text-success/90">Selection confirmed</p>
			</div>
		</div>
	);
};

export const SizesDemo: React.FC = () => {
	return (
		<div className="my-6 space-y-6">
			<div className="flex flex-col space-y-2">
				<label className="text-sm font-medium text-foreground-muted">
					Small
				</label>
				<Combobox
					options={frameworks}
					size="sm"
					placeholder="Small combobox"
					className="w-[200px]"
				/>
			</div>

			<div className="flex flex-col space-y-2">
				<label className="text-sm font-medium text-foreground-muted">
					Medium
				</label>
				<Combobox
					options={frameworks}
					size="md"
					placeholder="Medium combobox"
					className="w-[200px]"
				/>
			</div>

			<div className="flex flex-col space-y-2">
				<label className="text-sm font-medium text-foreground-muted">
					Large
				</label>
				<Combobox
					options={frameworks}
					size="lg"
					placeholder="Large combobox"
					className="w-[200px]"
				/>
			</div>
		</div>
	);
};

export const ClearableDemo: React.FC = () => {
	return (
		<div className="my-6 space-y-6">
			<div className="flex flex-col space-y-2">
				<label className="text-sm font-medium text-foreground-muted">
					Clearable (Default)
				</label>
				<Combobox
					options={frameworks}
					defaultValue="react"
					placeholder="Select framework..."
					clearable={true}
					className="w-[200px]"
				/>
				<p className="text-xs text-foreground-muted">
					X button appears when value is selected
				</p>
			</div>

			<div className="flex flex-col space-y-2">
				<label className="text-sm font-medium text-foreground-muted">
					Non-clearable
				</label>
				<Combobox
					options={frameworks}
					defaultValue="vue"
					className="w-[200px]"
					placeholder="Select framework..."
					clearable={false}
				/>
				<p className="text-xs text-foreground-muted">No clear button shown</p>
			</div>
		</div>
	);
};

export const DisabledOptionsDemo: React.FC = () => {
	return (
		<div className="my-6">
			<div className="flex flex-col space-y-2">
				<label className="text-sm font-medium text-foreground-muted">
					Programming Languages
				</label>
				<Combobox
					options={languages}
					placeholder="Select a language..."
					searchPlaceholder="Search languages..."
					className="w-[200px]"
				/>
				<p className="text-xs text-foreground-muted">
					Some options are disabled (e.g., PHP)
				</p>
			</div>
		</div>
	);
};

export const DisabledComboboxDemo: React.FC = () => {
	return (
		<div className="my-6">
			<div className="flex flex-col space-y-2">
				<label className="text-sm font-medium text-foreground-muted">
					Disabled Combobox
				</label>
				<Combobox
					options={frameworks}
					defaultValue="react"
					disabled={true}
					className="w-[200px]"
				/>
				<p className="text-xs text-foreground-muted">
					Entire combobox is disabled
				</p>
			</div>
		</div>
	);
};

export const CustomMessagesDemo: React.FC = () => {
	const limitedOptions: ComboboxOption[] = [
		{ value: 'option1', label: 'Option 1' },
		{ value: 'option2', label: 'Option 2' },
	];

	return (
		<div className="my-6">
			<div className="flex flex-col space-y-2">
				<label className="text-sm font-medium text-foreground-muted">
					Custom Empty Message
				</label>
				<Combobox
					options={limitedOptions}
					placeholder="Search for options..."
					searchPlaceholder="Try typing 'test'..."
					emptyMessage="😔 No matching options found. Try different keywords."
					className="w-[200px]"
				/>
				<p className="text-xs text-foreground-muted">
					Type something that doesn&apos;t match to see custom message
				</p>
			</div>
		</div>
	);
};

export const ControlledDemo: React.FC = () => {
	const [selectedFramework, setSelectedFramework] = useState('react');

	return (
		<div className="my-6">
			<div className="space-y-4">
				<div className="flex flex-col space-y-2">
					<label className="text-sm font-medium text-foreground-muted">
						Controlled Combobox
					</label>
					<Combobox
						options={frameworks}
						value={selectedFramework}
						onValueChange={setSelectedFramework}
						placeholder="Select framework..."
						className="w-[200px]"
					/>
				</div>

				<div className="rounded-lg bg-background p-3">
					<p className="text-sm font-medium text-foreground">
						Current value: {selectedFramework || 'None'}
					</p>
					<div className="mt-2 space-x-2">
						<button
							onClick={() => setSelectedFramework('vue')}
							className="rounded bg-background-muted px-2 py-1 text-xs hover:bg-background-elevated"
						>
							Set Vue.js
						</button>
						<button
							onClick={() => setSelectedFramework('')}
							className="rounded bg-background-muted px-2 py-1 text-xs hover:bg-background-elevated"
						>
							Clear
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
