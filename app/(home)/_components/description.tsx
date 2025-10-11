'use client';
import Image from 'next/image';
import { Section } from '@/components/section';

export const Description = () => {
	return (
		<Section className="relative flex flex-col items-start md:items-center justify-between gap-8 p-6 py-8 sm:flex-row sm:gap-16 md:py-10">
			<p className="text-foreground/70 sm:max-w-sm">
				Built on Ariakit for accessibility and Tailwind for style - Nocta UI
				brings them together with a CLI that actually makes sense.{' '}
			</p>
			<div className="flex gap-6 items-center justify-center">
				<Image
					className="hidden dark:block w-20 lg:w-[140px] md:w-[100px]"
					src="/icons/ariakit-dark.svg"
					alt="Ariakit logo"
					width={140}
					height={140}
				/>
				<Image
					className="block dark:hidden w-20 lg:w-[140px] md:w-[100px]"
					src="/icons/ariakit-light.svg"
					alt="Ariakit logo"
					width={140}
					height={140}
				/>
				<Image
					className="hidden dark:block w-32 lg:w-[220px] md:w-[160px]"
					src="/icons/tailwind-dark.svg"
					alt="Tailwind logo"
					width={220}
					height={220}
				/>
				<Image
					className="block dark:hidden w-32 lg:w-[220px] md:w-[160px]"
					src="/icons/tailwind-light.svg"
					alt="Tailwind logo"
					width={220}
					height={220}
				/>
			</div>
		</Section>
	);
};
