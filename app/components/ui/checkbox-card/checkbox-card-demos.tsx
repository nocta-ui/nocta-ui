'use client';

import type React from 'react';
import { useState } from 'react';
import { Icons } from '@/app/components/ui/icons/icons';
import { CheckboxCard } from './checkbox-card';

export const BasicCheckboxCardDemo: React.FC = () => {
	const [isChecked, setIsChecked] = useState(true);

	return (
		<div className="max-w-md">
			<CheckboxCard
				title="Weekly product summary"
				description="Receive a concise recap of the most important product metrics every Monday at 9:00 AM."
				helper="Adjust delivery preferences anytime in notification settings."
				checked={isChecked}
				onCheckedChange={setIsChecked}
			/>
		</div>
	);
};

const integrationOptions = [
	{
		id: 'notion',
		title: 'Notion',
		description:
			'Push tasks and project updates directly into linked workspaces.',
		meta: 'Beta',
	},
	{
		id: 'slack',
		title: 'Slack',
		description: 'Send channel notifications whenever critical events happen.',
		helper: 'Requires workspace admin permissions.',
	},
	{
		id: 'figma',
		title: 'Figma',
		description:
			'Keep your design system components in sync with your product data.',
	},
	{
		id: 'github',
		title: 'GitHub',
		description:
			'Mirror issues, pull requests and code reviews from selected repositories.',
	},
];

export const CheckboxCardGroupDemo: React.FC = () => {
	const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([
		'slack',
	]);

	const handleToggle = (id: string) => (next: boolean) => {
		setSelectedIntegrations((prev) => {
			const isSelected = prev.includes(id);
			if (next && !isSelected) {
				return [...prev, id];
			}
			if (!next && isSelected) {
				return prev.filter((item) => item !== id);
			}
			return prev;
		});
	};

	return (
		<div className="grid gap-4 md:grid-cols-2">
			{integrationOptions.map((integration) => (
				<CheckboxCard
					key={integration.id}
					title={integration.title}
					description={integration.description}
					meta={integration.meta}
					helper={integration.helper}
					checked={selectedIntegrations.includes(integration.id)}
					onCheckedChange={handleToggle(integration.id)}
				/>
			))}
		</div>
	);
};

const planOptions = [
	{
		id: 'starter',
		title: 'Starter',
		description: 'For teams starting to collaborate on product delivery.',
		meta: '$19/mo',
		media: <Icons.Info className="h-5 w-5" aria-hidden="true" />,
		benefits: [
			'Unlimited viewers',
			'Backlog prioritisation',
			'Ready-to-ship checklist',
		],
	},
	{
		id: 'growth',
		title: 'Growth',
		description: 'Scale collaboration with advanced workflow automations.',
		meta: '$39/mo',
		media: <Icons.Success className="h-5 w-5" aria-hidden="true" />,
		benefits: [
			'Advanced automations',
			'Priority support',
			'Unlimited integrations',
		],
		badge: 'Popular',
	},
	{
		id: 'enterprise',
		title: 'Enterprise',
		description:
			'Security, governance and dedicated onboarding for large organisations.',
		meta: 'Custom',
		media: <Icons.Warning className="h-5 w-5" aria-hidden="true" />,
		benefits: [
			'Unlimited workspaces',
			'Single sign-on (SSO)',
			'Dedicated success manager',
		],
	},
];
