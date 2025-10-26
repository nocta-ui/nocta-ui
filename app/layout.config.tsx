import {
	CodeIcon,
	GlobeIcon,
	LayersIcon,
	LightningBoltIcon,
	MixerHorizontalIcon,
	ReaderIcon,
	RocketIcon,
	ShuffleIcon,
	StackIcon,
} from '@radix-ui/react-icons';
import type { LinkItemType } from 'fumadocs-ui/layouts/links';
import type { BaseLayoutProps } from '@/components/layout/shared';

export const title = 'Nocta UI';
export const description = 'Modern React Component Library';
export const owner = 'Nocta UI';

export const baseOptions: BaseLayoutProps = {
	nav: {
		title: (
			<div className="flex items-center justify-center gap-1.5 text-foreground">
				<svg
					aria-hidden="true"
					width="22"
					height="22"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M12 0C13.0265 0 14.0227 0.129607 14.9736 0.37207L19 9V2.25586C22.0271 4.43433 24 7.98574 24 12C24 18.6274 18.6274 24 12 24C10.9731 24 9.97671 23.8696 9.02539 23.627L5 15V21.7432C1.97313 19.5647 0 16.0141 0 12C0 5.37258 5.37258 0 12 0ZM12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5Z"
						fill="currentColor"
					/>
				</svg>
				<p className="text-foreground text-sm leading-relaxed font-bold">
					NOCTA UI
				</p>
			</div>
		),
	},
	githubUrl: 'https://github.com/nocta-ui/nocta-ui',
};

export const linkItems: LinkItemType[] = [
	{
		type: 'menu',
		text: 'Getting Started',
		url: '/docs/quick-start',
		active: 'nested-url',
		items: [
			{
				text: 'Introduction',
				url: '/docs',
				icon: (
					<ReaderIcon
						aria-hidden="true"
						className="size-4 text-foreground/70"
					/>
				),
				description: 'Learn the Nocta UI philosophy and copy-paste workflow.',
			},
			{
				text: 'Quick Start',
				url: '/docs/quick-start',
				icon: (
					<LightningBoltIcon
						aria-hidden="true"
						className="size-4 text-foreground/70"
					/>
				),
				description:
					'Follow the guided checklist to install and explore components.',
			},
			{
				text: 'CLI Guide',
				url: '/docs/cli-guide/init',
				icon: (
					<CodeIcon aria-hidden="true" className="size-4 text-foreground/70" />
				),
				description:
					'Discover CLI commands to scaffold workspaces and add UI kits.',
			},
		],
	},
	{
		type: 'menu',
		text: 'Framework Setup',
		url: '/docs/nextjs',
		active: 'nested-url',
		items: [
			{
				text: 'Next.js',
				url: '/docs/nextjs',
				icon: (
					<GlobeIcon aria-hidden="true" className="size-4 text-foreground/70" />
				),
				description: 'Configure Nocta UI inside a modern Next.js project.',
			},
			{
				text: 'Vite',
				url: '/docs/vite',
				icon: (
					<LightningBoltIcon
						aria-hidden="true"
						className="size-4 text-foreground/70"
					/>
				),
				description: 'Add Nocta UI to a fast Vite + React toolchain.',
			},
			{
				text: 'React Router',
				url: '/docs/reactrouter',
				icon: (
					<ShuffleIcon
						aria-hidden="true"
						className="size-4 text-foreground/70"
					/>
				),
				description: 'Wire up components with the latest React Router starter.',
			},
			{
				text: 'TanStack Start',
				url: '/docs/tanstack',
				icon: (
					<StackIcon aria-hidden="true" className="size-4 text-foreground/70" />
				),
				description: 'Integrate Nocta UI with TanStack’s fullstack framework.',
			},
		],
	},
	{
		text: 'Design Tokens',
		url: '/docs/design-tokens',
		active: 'url',
		icon: <MixerHorizontalIcon aria-hidden="true" className="size-4" />,
	},
];
