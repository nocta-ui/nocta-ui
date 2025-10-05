'use client';
import Image from 'next/image';
import { Section } from '@/components/section';

export const Description = () => {
	return (
		<Section className="relative flex flex-col items-start md:items-center justify-between gap-8 p-6 py-8 sm:flex-row sm:gap-16 md:py-10">
			<p className="text-foreground/70 sm:max-w-xs">
				Nocta UI is an accessible component library built on Ariakit and
				Tailwind CSS with a dedicated CLI for building modern interfaces.
			</p>
			<div className="flex gap-6 items-center justify-center">
				<Image
					className="hidden dark:block w-20 sm:w-[140px]"
					src="/icons/ariakit-dark.svg"
					alt="Ariakit logo"
					width={140}
					height={140}
				/>
				<Image
					className="block dark:hidden w-20 sm:w-[140px]"
					src="/icons/ariakit-light.svg"
					alt="Ariakit logo"
					width={140}
					height={140}
				/>
				<Image
					className="hidden dark:block w-32 sm:w-[220px]"
					src="/icons/tailwind-dark.svg"
					alt="Tailwind logo"
					width={220}
					height={220}
				/>
				<Image
					className="block dark:hidden w-32 sm:w-[220px]"
					src="/icons/tailwind-light.svg"
					alt="Tailwind logo"
					width={220}
					height={220}
				/>
			</div>
		</Section>
	);
};
