'use client';

import type React from 'react';
import { useState } from 'react';
import { Combobox, type ComboboxOption } from '@/registry/ui/combobox';

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
				<label className="text-sm font-medium text-foreground/70">
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
					<p className="text-xs text-foreground/70">
						Selected: {frameworks.find((f) => f.value === value)?.label}
					</p>
				)}
			</div>
		</div>
	);
};

export const ComboboxVariantsDemo: React.FC = () => {
	return (
		<div className="my-6 space-y-6">
			<div className="flex flex-col space-y-2">
				<label className="text-sm font-medium text-foreground/70">
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
				<label className="text-sm font-medium text-foreground/70">Error</label>
				<Combobox
					options={frameworks}
					placeholder="Error variant"
					variant="error"
					className="w-[200px]"
				/>
				<p className="text-xs text-destructive/90">This field is required</p>
			</div>

			<div className="flex flex-col space-y-2">
				<label className="text-sm font-medium text-foreground/70">
					Success
				</label>
				<Combobox
					options={frameworks}
					placeholder="Success Variant"
					variant="success"
					className="w-[200px]"
				/>
				<p className="text-xs text-success/90">Selection confirmed</p>
			</div>
		</div>
	);
};

export const ComboboxSizesDemo: React.FC = () => {
	return (
		<div className="my-6 space-y-6">
			<div className="flex flex-col space-y-2">
				<label className="text-sm font-medium text-foreground/70">Small</label>
				<Combobox
					options={frameworks}
					size="sm"
					placeholder="Small combobox"
					className="w-[200px]"
				/>
			</div>

			<div className="flex flex-col space-y-2">
				<label className="text-sm font-medium text-foreground/70">Medium</label>
				<Combobox
					options={frameworks}
					size="md"
					placeholder="Medium combobox"
					className="w-[200px]"
				/>
			</div>

			<div className="flex flex-col space-y-2">
				<label className="text-sm font-medium text-foreground/70">Large</label>
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
				<label className="text-sm font-medium text-foreground/70">
					Clearable (Default)
				</label>
				<Combobox
					options={frameworks}
					defaultValue="react"
					placeholder="Select framework..."
					clearable={true}
					className="w-[200px]"
				/>
				<p className="text-xs text-foreground/70">
					X button appears when value is selected
				</p>
			</div>

			<div className="flex flex-col space-y-2">
				<label className="text-sm font-medium text-foreground/70">
					Non-clearable
				</label>
				<Combobox
					options={frameworks}
					defaultValue="vue"
					className="w-[200px]"
					placeholder="Select framework..."
					clearable={false}
				/>
				<p className="text-xs text-foreground/70">No clear button shown</p>
			</div>
		</div>
	);
};

export const DisabledOptionsDemo: React.FC = () => {
	return (
		<div className="my-6">
			<div className="flex flex-col space-y-2">
				<label className="text-sm font-medium text-foreground/70">
					Programming Languages
				</label>
				<Combobox
					options={languages}
					placeholder="Select a language..."
					searchPlaceholder="Search languages..."
					className="w-[200px]"
				/>
				<p className="text-xs text-foreground/70">
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
				<label className="text-sm font-medium text-foreground/70">
					Disabled Combobox
				</label>
				<Combobox
					options={frameworks}
					defaultValue="react"
					disabled={true}
					className="w-[200px]"
				/>
				<p className="text-xs text-foreground/70">
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
				<label className="text-sm font-medium text-foreground/70">
					Custom Empty Message
				</label>
				<Combobox
					options={limitedOptions}
					placeholder="Search for options..."
					searchPlaceholder="Try typing 'test'..."
					emptyMessage="😔 No matching options found. Try different keywords."
					className="w-[200px]"
				/>
				<p className="text-xs text-foreground/70">
					Type something that doesn&apos;t match to see custom message
				</p>
			</div>
		</div>
	);
};
