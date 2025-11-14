'use client';

import {
	AccessibilityIcon,
	CodeIcon,
	LayersIcon,
	MagicWandIcon,
} from '@radix-ui/react-icons';
import Image from 'next/image';
import {
	useRef,
	type HTMLAttributes,
	type ComponentType,
} from 'react';
import { cn } from 'fumadocs-ui/utils/cn';

import { useCopyButton } from 'fumadocs-ui/utils/use-copy-button';

type FeatureHighlight = {
	title: string;
	description: string;
	icon: ComponentType<{ className?: string }>;
};

interface CopyButtonProps extends HTMLAttributes<HTMLButtonElement> {
	className?: string;
	onCopy: () => void;
}

interface IconProps extends React.SVGProps<SVGSVGElement> {
	size?: number | string;
}

const Check: React.FC<IconProps> = ({
	size = 24,
	className = '',
	...props
}) => {
	return (
		<svg
			aria-hidden={true}
			xmlns="http://www.w3.org/2000/svg"
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}
			{...props}
		>
			<path d="M20 6 9 17l-5-5" />
		</svg>
	);
};

const Copy: React.FC<IconProps> = ({
	size = 24,
	className = '',
	...props
}) => {
	return (
		<svg
			aria-hidden={true}
			xmlns="http://www.w3.org/2000/svg"
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}
			{...props}
		>
			<rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
			<path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
		</svg>
	);
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
	'npx @nocta-ui/cli init',
	'npx @nocta-ui/cli add button card badge',
];


function CopyButton({ className, onCopy, ...props }: CopyButtonProps) {
	const [checked, onClick] = useCopyButton(onCopy);

	return (
		<button
			type="button"
			className={cn(
				'inline-flex items-center justify-center text-foreground/70 rounded-md p-2 text-sm font-medium focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
				'hover:bg-card-muted hover:text-foreground transition-all',
				'[&_svg]:size-3.5 cursor-pointer',
				!checked && '[@media(hover:hover)]:opacity-100',
				className,
			)}
			aria-label={checked ? 'Copied Text' : 'Copy Text'}
			onClick={onClick}
			{...props}
		>
			<Check className={cn('transition-transform', !checked && 'scale-0')} />
			<Copy
				className={cn('absolute transition-transform', checked && 'scale-0')}
			/>
		</button>
	);
}


function CommandLine({ children }: { children: string }) {
	const [first, ...restParts] = children.trim().split(/\s+/);
	const rest = restParts.join(' ');

	const areaRef = useRef<HTMLDivElement>(null);

	const onCopy = () => {
		if (!areaRef.current) return;

		const clone = areaRef.current.cloneNode(true) as HTMLDivElement;

		clone.querySelectorAll('.nd-copy-ignore').forEach((node) => {
			node.remove();
		});

		void navigator.clipboard.writeText(clone.textContent ?? '');
	};

	return (
		<div className="relative">
			<CopyButton
				className="absolute top-2 right-2 z-2 backdrop-blur-md"
				onCopy={onCopy}
			/>
			<div
				ref={areaRef}
				className="relative block rounded-md border border-border bg-card px-4 py-3 pr-10 text-left shadow-sm shadow-card font-mono text-[13px] leading-relaxed text-sm"
			>
				<span className="text-[#6F42C1] dark:text-[#B392F0]">{first}</span>{' '}
				<span className="text-[#032F62] dark:text-[#9ECBFF]">{rest}</span>
			</div>
		</div>
	);
}


export default function Features() {
	return (
		<section className="relative overflow-hidden">
			<div className="mx-auto grid max-w-5xl grid-cols-1 border-dashed border-fd-border md:grid-cols-2 md:border-x">
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
					<span className="relative flex size-10 shrink-0 items-center justify-center rounded-md border border-border bg-card text-foreground shadow-sm shadow-card">
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

function TechStack() {
	return (
		<div className="space-y-4">
			<p className="text-xs font-medium uppercase tracking-widest text-foreground/45">
				Built with
			</p>

			<div className="flex flex-wrap items-center gap-6">
				<Image
					className="hidden w-20 dark:block md:w-25"
					src="/icons/ariakit-dark.svg"
					alt="Ariakit logo"
					width={140}
					height={140}
				/>
				<Image
					className="block w-20 dark:hidden md:w-25"
					src="/icons/ariakit-light.svg"
					alt="Ariakit logo"
					width={140}
					height={140}
				/>
				<Image
					className="hidden w-32 dark:block md:w-40"
					src="/icons/tailwind-dark.svg"
					alt="Tailwind logo"
					width={220}
					height={220}
				/>
				<Image
					className="block w-32 dark:hidden md:w-40"
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
