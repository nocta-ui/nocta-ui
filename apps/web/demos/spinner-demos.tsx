'use client';

import React from 'react';
import { Spinner } from '@nocta/registry/ui/spinner';

export const BasicSpinnerDemo: React.FC = () => {
	return (
		<div className="my-6">
			<Spinner />
		</div>
	);
};

export const SpinnerSizesDemo: React.FC = () => {
	return (
		<div className="my-6 flex flex-wrap items-center gap-6">
			<div className="flex flex-col items-center gap-2">
				<Spinner size="sm" />
				<span className="text-xs text-foreground/70">Small</span>
			</div>
			<div className="flex flex-col items-center gap-2">
				<Spinner size="md" />
				<span className="text-xs text-foreground/70">Medium</span>
			</div>
			<div className="flex flex-col items-center gap-2">
				<Spinner size="lg" />
				<span className="text-xs text-foreground/70">Large</span>
			</div>
		</div>
	);
};
