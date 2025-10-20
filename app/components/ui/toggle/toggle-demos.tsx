'use client';

import {
	FontBoldIcon,
	FontItalicIcon,
	UnderlineIcon,
} from '@radix-ui/react-icons';
import * as React from 'react';
import { Toggle } from './toggle';

export const BasicToggleDemo: React.FC = () => {
	const [enabled, setEnabled] = React.useState(false);

	return (
		<div className="flex items-center gap-3">
			<Toggle pressed={enabled} onPressedChange={setEnabled}>
				{enabled ? 'Notifications on' : 'Notifications off'}
			</Toggle>
			<span className="text-sm text-foreground/70">
				Click to toggle notifications
			</span>
		</div>
	);
};

export const ToggleSizesDemo: React.FC = () => {
	const [states, setStates] = React.useState({
		sm: false,
		md: true,
		lg: false,
	});

	const handleChange = (size: keyof typeof states) => (next: boolean) => {
		setStates((prev) => ({ ...prev, [size]: next }));
	};

	return (
		<div className="flex items-center gap-4">
			<Toggle
				size="sm"
				pressed={states.sm}
				onPressedChange={handleChange('sm')}
			>
				Small
			</Toggle>
			<Toggle
				size="md"
				pressed={states.md}
				onPressedChange={handleChange('md')}
			>
				Medium
			</Toggle>
			<Toggle
				size="lg"
				pressed={states.lg}
				onPressedChange={handleChange('lg')}
			>
				Large
			</Toggle>
		</div>
	);
};

export const IconToggleDemo: React.FC = () => {
	const [styles, setStyles] = React.useState({
		bold: true,
		italic: false,
		underline: false,
	});

	return (
		<div className="flex items-center gap-2">
			<Toggle
				variant="default"
				size="sm"
				aria-label="Toggle bold"
				pressed={styles.bold}
				onPressedChange={(next) =>
					setStyles((prev) => ({ ...prev, bold: next }))
				}
			>
				<FontBoldIcon className="h-4 w-4" aria-hidden="true" />
			</Toggle>
			<Toggle
				variant="default"
				size="sm"
				aria-label="Toggle italic"
				pressed={styles.italic}
				onPressedChange={(next) =>
					setStyles((prev) => ({ ...prev, italic: next }))
				}
			>
				<FontItalicIcon className="h-4 w-4" aria-hidden="true" />
			</Toggle>
			<Toggle
				variant="default"
				size="sm"
				aria-label="Toggle underline"
				pressed={styles.underline}
				onPressedChange={(next) =>
					setStyles((prev) => ({ ...prev, underline: next }))
				}
			>
				<UnderlineIcon className="h-4 w-4" aria-hidden="true" />
			</Toggle>
		</div>
	);
};
