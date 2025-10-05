'use client';

import {
	AccessibilityIcon,
	CodeIcon,
	LayersIcon,
	MagicWandIcon,
} from '@radix-ui/react-icons';
import { cva } from 'class-variance-authority';
import { Section } from '@/components/section';

const featureItemVariants = cva(
	'group flex flex-col justify-between gap-10 p-6 transition-colors duration-300 ease-in-out hover:bg-card-muted dark:hover:bg-card sm:gap-22 md:gap-34 lg:gap-46',
	{
		variants: {
			size: {
				sm: '',
				lg: 'lg:col-span-2',
			},
		},
		defaultVariants: {
			size: 'sm',
		},
	},
);

const features = [
	{
		id: 1,
		Icon: AccessibilityIcon,
		title: 'Accessible by Default',
		description:
			'Every component is built with accessibility in mind, following best practices and standards.',
		size: 'lg',
	},
	{
		id: 2,
		Icon: CodeIcon,
		title: 'Dedicated CLI',
		description:
			'Set up and customize your project quickly with a simple, developer-friendly command line tool.',
		size: 'sm',
	},
	{
		id: 3,
		Icon: LayersIcon,
		title: 'Composable Components',
		description:
			'A collection of flexible components designed to be combined and extended for any project.',
		size: 'sm',
	},
	{
		id: 4,
		Icon: MagicWandIcon,
		title: 'Modern Design',
		description:
			'Clean, minimal and consistent UI elements ready to use in modern applications.',
		size: 'lg',
	},
];

const Features = () => (
	<Section className="relative w-full pt-10">
		<div className="flex flex-col gap-10">
			<div className="flex flex-col gap-2 px-6">
				<h2 className="font-regular max-w-xl text-left text-3xl md:text-5xl text-foreground">
					Why Nocta UI?
				</h2>
				<p className="max-w-xl text-left text-lg leading-relaxed text-foreground/70 lg:max-w-lg">
					A modern and accessible UI library with tools that help you build
					beautiful interfaces faster.
				</p>
			</div>

			<div className="w-full border-t border-dashed border-border">
				<div className="grid grid-cols-1 divide-x divide-y divide-dashed divide-border text-left sm:grid-cols-2 lg:grid-cols-3 [&>*:last-child]:border-b-0 sm:[&>*:nth-last-child(-n+2)]:border-b-0 lg:[&>*:nth-last-child(-n+2)]:border-b-0 [&>*:nth-child(n)]:sm:[&>*:nth-child(2n)]:border-r-0 [&>*:nth-child(n)]:lg:[&>*:nth-child(3n)]:border-r-0 [&>*:nth-child(2)]:border-r-0">
					{features.map((feature) => (
						<div
							key={feature.id}
							className={featureItemVariants({
								size: feature.size as 'sm' | 'lg',
							})}
						>
							<feature.Icon className="h-8 w-8 stroke-1" />
							<div className="flex flex-col">
								<h3 className="text-xl text-foreground">{feature.title}</h3>
								<p className="max-w-xs text-base text-foreground/70">
									{feature.description}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	</Section>
);

export default Features;
