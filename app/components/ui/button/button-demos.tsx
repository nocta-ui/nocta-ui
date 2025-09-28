'use client';

import { DownloadIcon, GearIcon, PlusIcon } from '@radix-ui/react-icons';
import type React from 'react';

import { Button } from './button';

export const PrimaryButtonDemo: React.FC = () => {
	return (
		<div className="my-6">
			<Button>Get Started</Button>
		</div>
	);
};

export const SecondaryButtonDemo: React.FC = () => {
	return (
		<div className="my-6">
			<Button variant="secondary">Learn More</Button>
		</div>
	);
};

export const GhostButtonDemo: React.FC = () => {
	return (
		<div className="my-6">
			<Button variant="ghost">Cancel</Button>
		</div>
	);
};

export const IconButtonDemo: React.FC = () => {
	return (
		<div className="my-6 flex flex-wrap gap-3">
			<Button variant="icon" size="sm">
				<PlusIcon className="h-4 w-4" />
			</Button>
			<Button variant="icon" size="md">
				<DownloadIcon className="h-5 w-5" />
			</Button>
			<Button variant="icon" size="lg">
				<GearIcon className="h-6 w-6" />
			</Button>
		</div>
	);
};

export const SizesDemo: React.FC = () => {
	return (
		<div className="my-6 flex flex-wrap items-center gap-3">
			<Button size="sm">Small</Button>
			<Button size="md">Medium</Button>
			<Button size="lg">Large</Button>
		</div>
	);
};
