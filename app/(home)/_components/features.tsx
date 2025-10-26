import {
	AccessibilityIcon,
	CodeIcon,
	LayersIcon,
	MagicWandIcon,
} from '@radix-ui/react-icons';
import Image from 'next/image';
import type { ComponentType } from 'react';

type FeatureHighlight = {
	title: string;
	description: string;
	icon: ComponentType<{ className?: string }>;
};

const featureHighlights: FeatureHighlight[] = [
	{
		title: 'Accessible by default',
		description:
			'Built on top of Ariakit so focus states, keyboard navigation, and ARIA labels are taken care of on day one.',
		icon: AccessibilityIcon,
	},
	{
		title: 'Dedicated CLI workflow',
		description:
			'Copy ready-to-ship components straight into your repo. No lock-in, no waiting on package updates.',
		icon: CodeIcon,
	},
	{
		title: 'Composable building blocks',
		description:
			'Layer components together without rewrites. Start with the defaults, extend when you need to.',
		icon: LayersIcon,
	},
	{
		title: 'Modern, minimal styling',
		description:
			'Thoughtful spacing, motion, and state styles that feel at home in any contemporary product UI.',
		icon: MagicWandIcon,
	},
];

const installCommands = [
	'npx nocta-ui init',
	'npx nocta-ui add button card badge',
];

export default function Features() {
	return (
		<section className="relative overflow-hidden">
			<div className="mx-auto grid max-w-5xl grid-cols-1 md:border-x border-dashed border-fd-border md:grid-cols-2">
				<div className="border-t border-dashed border-fd-border p-6 sm:border-t-0 sm:border-r">
					<FeatureList />
				</div>

				<div className="space-y-6 p-6">
					<InstallSnippet />
					<TechStack />
				</div>
			</div>
		</section>
	);
}

function FeatureList() {
	return (
		<div className="grid gap-6">
			{featureHighlights.map(({ title, description, icon: Icon }) => (
				<div key={title} className="flex items-start gap-4">
					<span className="flex size-10 shrink-0 items-center justify-center rounded-md border border-border shadow-sm bg-card text-foreground">
						<Icon className="h-5 w-5" aria-hidden />
					</span>

					<div className="space-y-1">
						<h3 className="text-lg font-medium text-foreground">{title}</h3>
						<p className="text-sm text-foreground/70">{description}</p>
					</div>
				</div>
			))}
		</div>
	);
}

function InstallSnippet() {
	return (
		<div className="space-y-4">
			<p className="text-xs font-medium uppercase tracking-widest text-foreground/45">
				Install with one command
			</p>

			<div className="space-y-2">
				{installCommands.map((command) => (
					<CommandLine key={command}>{command}</CommandLine>
				))}
			</div>

			<p className="text-sm text-foreground/70">
				The CLI pulls accessible, production-ready components straight into your
				project - no packages, no lock-in.
			</p>
		</div>
	);
}

function CommandLine({ children }: { children: string }) {
	return (
		<code className="block rounded-md border border-border shadow-sm bg-card px-4 py-3 text-left font-mono text-sm text-foreground">
			{children}
		</code>
	);
}

function TechStack() {
	return (
		<div className="space-y-4">
			<p className="text-xs uppercase font-medium tracking-widest text-foreground/45">
				Built with
			</p>

			<div className="flex flex-wrap items-center gap-6">
				<Image
					className="hidden dark:block w-20 md:w-[100px]"
					src="/icons/ariakit-dark.svg"
					alt="Ariakit logo"
					width={140}
					height={140}
				/>
				<Image
					className="block dark:hidden w-20 md:w-[100px]"
					src="/icons/ariakit-light.svg"
					alt="Ariakit logo"
					width={140}
					height={140}
				/>
				<Image
					className="hidden dark:block w-32 md:w-[160px]"
					src="/icons/tailwind-dark.svg"
					alt="Tailwind logo"
					width={220}
					height={220}
				/>
				<Image
					className="block dark:hidden w-32 md:w-[160px]"
					src="/icons/tailwind-light.svg"
					alt="Tailwind logo"
					width={220}
					height={220}
				/>
			</div>

			<p className="text-sm text-foreground/60">
				Ariakit handles accessibility primitives while Tailwind keeps styling
				iterative and flexible.
			</p>
		</div>
	);
}
