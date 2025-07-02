'use client';

import React, { useState } from 'react';
import { Combobox, ComboboxOption } from './combobox';

// Sample data
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

const countries: ComboboxOption[] = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'es', label: 'Spain' },
  { value: 'it', label: 'Italy' },
  { value: 'pl', label: 'Poland' },
  { value: 'jp', label: 'Japan' },
  { value: 'au', label: 'Australia' },
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
      <div className="space-y-2">
        <label className="text-sm font-medium text-nocta-700 dark:text-nocta-300">
          Framework
        </label>
        <Combobox
          options={frameworks}
          value={value}
          onValueChange={setValue}
          placeholder="Select a framework..."
          searchPlaceholder="Search frameworks..."
        />
        {value && (
          <p className="text-xs text-nocta-600 dark:text-nocta-400">
            Selected: {frameworks.find(f => f.value === value)?.label}
          </p>
        )}
      </div>
    </div>
  );
};

export const VariantsDemo: React.FC = () => {
  return (
    <div className="my-6 space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-nocta-700 dark:text-nocta-300">
          Default
        </label>
        <Combobox
          options={frameworks}
          placeholder="Default variant"
          variant="default"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-nocta-700 dark:text-nocta-300">
          Error
        </label>
        <Combobox
          options={frameworks}
          placeholder="Error variant"
          variant="error"
        />
        <p className="text-xs text-red-600 dark:text-red-400">
          This field is required
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-nocta-700 dark:text-nocta-300">
          Success
        </label>
        <Combobox
          options={frameworks}
          defaultValue="react"
          variant="success"
        />
        <p className="text-xs text-green-600 dark:text-green-400">
          Selection confirmed
        </p>
      </div>
    </div>
  );
};

export const SizesDemo: React.FC = () => {
  return (
    <div className="my-6 space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-nocta-700 dark:text-nocta-300">
          Small
        </label>
        <Combobox
          options={frameworks}
          size="sm"
          placeholder="Small combobox"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-nocta-700 dark:text-nocta-300">
          Medium
        </label>
        <Combobox
          options={frameworks}
          size="md"
          placeholder="Medium combobox"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-nocta-700 dark:text-nocta-300">
          Large
        </label>
        <Combobox
          options={frameworks}
          size="lg"
          placeholder="Large combobox"
        />
      </div>
    </div>
  );
};

export const SearchableDemo: React.FC = () => {
  return (
    <div className="my-6 space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-nocta-700 dark:text-nocta-300">
          Searchable (Default)
        </label>
        <Combobox
          options={countries}
          placeholder="Search for a country..."
          searchPlaceholder="Type to search..."
        />
        <p className="text-xs text-nocta-600 dark:text-nocta-400">
          Type to filter options
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-nocta-700 dark:text-nocta-300">
          Non-searchable
        </label>
        <Combobox
          options={countries}
          placeholder="Select a country..."
          searchable={false}
        />
        <p className="text-xs text-nocta-600 dark:text-nocta-400">
          Dropdown only, no search
        </p>
      </div>
    </div>
  );
};

export const ClearableDemo: React.FC = () => {
  return (
    <div className="my-6 space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-nocta-700 dark:text-nocta-300">
          Clearable (Default)
        </label>
        <Combobox
          options={frameworks}
          defaultValue="react"
          placeholder="Select framework..."
          clearable={true}
        />
        <p className="text-xs text-nocta-600 dark:text-nocta-400">
          X button appears when value is selected
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-nocta-700 dark:text-nocta-300">
          Non-clearable
        </label>
        <Combobox
          options={frameworks}
          defaultValue="vue"
          placeholder="Select framework..."
          clearable={false}
        />
        <p className="text-xs text-nocta-600 dark:text-nocta-400">
          No clear button shown
        </p>
      </div>
    </div>
  );
};

export const DisabledOptionsDemo: React.FC = () => {
  return (
    <div className="my-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-nocta-700 dark:text-nocta-300">
          Programming Languages
        </label>
        <Combobox
          options={languages}
          placeholder="Select a language..."
          searchPlaceholder="Search languages..."
        />
        <p className="text-xs text-nocta-600 dark:text-nocta-400">
          Some options are disabled (e.g., PHP)
        </p>
      </div>
    </div>
  );
};

export const DisabledComboboxDemo: React.FC = () => {
  return (
    <div className="my-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-nocta-700 dark:text-nocta-300">
          Disabled Combobox
        </label>
        <Combobox
          options={frameworks}
          defaultValue="react"
          disabled={true}
        />
        <p className="text-xs text-nocta-600 dark:text-nocta-400">
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
      <div className="space-y-2">
        <label className="text-sm font-medium text-nocta-700 dark:text-nocta-300">
          Custom Empty Message
        </label>
        <Combobox
          options={limitedOptions}
          placeholder="Search for options..."
          searchPlaceholder="Try typing 'test'..."
          emptyMessage="😔 No matching options found. Try different keywords."
        />
        <p className="text-xs text-nocta-600 dark:text-nocta-400">
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
        <div className="space-y-2">
          <label className="text-sm font-medium text-nocta-700 dark:text-nocta-300">
            Controlled Combobox
          </label>
          <Combobox
            options={frameworks}
            value={selectedFramework}
            onValueChange={setSelectedFramework}
            placeholder="Select framework..."
          />
        </div>

        <div className="p-3 bg-nocta-50 dark:bg-nocta-900 rounded-lg">
          <p className="text-sm font-medium text-nocta-900 dark:text-nocta-100">
            Current value: {selectedFramework || 'None'}
          </p>
          <div className="mt-2 space-x-2">
            <button
              onClick={() => setSelectedFramework('vue')}
              className="px-2 py-1 text-xs bg-nocta-200 dark:bg-nocta-800 rounded hover:bg-nocta-300 dark:hover:bg-nocta-700"
            >
              Set Vue.js
            </button>
            <button
              onClick={() => setSelectedFramework('')}
              className="px-2 py-1 text-xs bg-nocta-200 dark:bg-nocta-800 rounded hover:bg-nocta-300 dark:hover:bg-nocta-700"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 