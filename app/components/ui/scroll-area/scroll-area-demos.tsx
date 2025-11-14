'use client';

import type React from 'react';

import { ScrollArea } from './scroll-area';

const notifications = [
	{
		id: 1,
		title: 'Product launch',
		description: 'Your scheduled release is locked for tomorrow at 9:00 AM.',
		time: '2m ago',
	},
	{
		id: 2,
		title: 'New mention',
		description:
			'Marta mentioned you in #design-system: "Do we have copy for the hero?"',
		time: '18m ago',
	},
	{
		id: 3,
		title: 'Automations',
		description: 'Segment "High intent leads" added 34 people during the night.',
		time: '1h ago',
	},
	{
		id: 4,
		title: 'Invoice ready',
		description: 'Your November invoice is available in the billing portal.',
		time: '3h ago',
	},
	{
		id: 5,
		title: 'New comment',
		description:
			'"This reads so smooth, let\'s push to prod." - Leon on Landing Page',
		time: '5h ago',
	},
	{
		id: 6,
		title: 'System update',
		description: 'Scheduled maintenance on December 12th between 01:00 - 02:00 UTC.',
		time: '1d ago',
	},
];

const frameworks = [
	'Next.js',
	'Expo',
	'Replit',
	'Remix',
	'SolidStart',
	'Gatsby',
	'Astro',
	'SvelteKit',
	'Nuxt',
	'Qwik',
	'Analog',
];

export const ScrollAreaBasicDemo: React.FC = () => {
	return (
		<ScrollArea className="my-6 h-64 w-full max-w-md">
			<div className="space-y-4">
				{notifications.map((notification) => (
					<div
						key={notification.id}
						className="relative rounded-lg border border-border bg-card px-4 py-3 shadow-md shadow-card"
					>
						<div className="flex items-center justify-between text-sm font-medium text-foreground">
							<span className="leading-none">{notification.title}</span>
							<span className="leading-none text-foreground/45 text-xs">
								{notification.time}
							</span>
						</div>
						<p className="mt-1 text-xs leading-relaxed text-foreground/70">
							{notification.description}
						</p>
					</div>
				))}
			</div>
		</ScrollArea>
	);
};

export const ScrollAreaHorizontalDemo: React.FC = () => {
	return (
		<ScrollArea className="my-6 w-full max-w-xl" type="scroll" direction="horizontal">
			<div className="flex w-max gap-3 whitespace-nowrap text-xs font-medium p-3">
				{frameworks.map((framework) => (
					<div
						key={framework}
						className="relative rounded-full border border-border bg-card px-2 py-0.5 shadow-sm shadow-card"
					>
						{framework}
					</div>
				))}
			</div>
		</ScrollArea>
	);
};
