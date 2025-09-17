"use client";

import { Section } from "@/components/section";

export const Description = () => {
	return (
		<Section className="relative flex flex-col items-center justify-between gap-8 p-6 py-8 sm:flex-row sm:gap-16 md:py-10">
			<p className="text-foreground-muted sm:max-w-xs">
				Nocta UI is an accessible component library with a dedicated CLI for
				building modern interfaces.
			</p>
		</Section>
	);
};
