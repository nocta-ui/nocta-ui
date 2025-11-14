'use client';

import type React from 'react';

import { Separator } from './separator';

export const BasicSeparatorDemo: React.FC = () => {
	return (
		<div className="relative my-6 space-y-4 rounded-lg border border-border bg-card p-4 shadow-md shadow-card">
			<div>
				<p className="text-sm font-medium text-foreground">Project Status</p>
				<p className="text-sm text-foreground/70">
					Track the latest updates from the team.
				</p>
			</div>
			<Separator />
			<div className="grid gap-1 text-sm">
				<p className="font-medium text-foreground">Next milestone</p>
				<p className="text-foreground/70">QA sign-off on Tuesday</p>
			</div>
		</div>
	);
};

export const VerticalSeparatorDemo: React.FC = () => {
	return (
		<div className="relative my-6 flex items-center gap-4 rounded-lg border border-border bg-card p-2 text-sm shadow-md shadow-card text-foreground font-medium">
			<span>Overview</span>
			<Separator orientation="vertical" className="h-5" decorative />
			<span>Billing</span>
			<Separator orientation="vertical" className="h-5" decorative />
			<span>Automation</span>
		</div>
	);
};

export const VariantsSeparatorDemo: React.FC = () => {
	return (
		<div className="relative my-6 space-y-4 rounded-lg border border-border bg-card shadow-md shadow-card p-4">
			<div className="space-y-2 text-sm">
				<p className="font-medium text-foreground">Default Divider</p>
				<p className="text-muted-foreground">
				  Use the default separator for clear and balanced section breaks.
				</p>
			</div>
			<Separator variant="default" />
			<div className="space-y-2 text-sm">
				<p className="font-medium text-foreground">Subtle Divider</p>
				<p className="text-muted-foreground">
					Use muted separators to softly separate dense content.
				</p>
			</div>
			<Separator variant="muted" />
		</div>
	);
};
