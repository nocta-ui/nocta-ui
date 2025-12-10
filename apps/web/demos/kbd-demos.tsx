'use client';

import type React from 'react';

import { Kbd } from '@nocta/registry/ui/kbd';

export const KbdDefaultDemo: React.FC = () => {
	return (
		<div className="my-6 inline-flex flex-wrap items-center gap-2 text-sm text-foreground/70">
			<span>Press</span>
			<Kbd>Ctrl</Kbd>
			<span>+</span>
			<Kbd>K</Kbd>
			<span>to open search</span>
		</div>
	);
};

export const KbdSizesDemo: React.FC = () => {
	return (
		<div className="my-6 flex flex-wrap items-center gap-3">
			<Kbd size="sm">Tab</Kbd>
			<Kbd size="md">Shift</Kbd>
			<Kbd size="lg">Space</Kbd>
		</div>
	);
};
