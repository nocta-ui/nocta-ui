import { GitHubLogoIcon, ReaderIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import type React from 'react';
import { Button } from '@/app/components/ui/button';
import { Section } from '@/components/section';

export default function CTA(): React.ReactElement {
	return (
		<Section className="relative grid gap-8 px-4 py-10 sm:grid-cols-2 md:py-14 lg:px-6 lg:py-16">
			<h2 className="font-regular max-w-xl text-3xl md:text-5xl text-foreground">
				Build Faster with Nocta UI
			</h2>

			<div className="flex w-full items-center">
				<div className="max-w-xl space-y-4">
					<p className="text-sm text-foreground/70 md:text-base">
						Nocta UI is an accessible component library with a dedicated CLI,
						designed to help you create modern interfaces with ease.
					</p>
					<div className="flex flex-row gap-3">
						<Button size="md">
							<Link className="flex gap-2" href="/docs">
								<ReaderIcon aria-hidden="true" className="mr-2 h-5 w-5" /> Read
								Documentation
							</Link>
						</Button>
						<Button
							size="md"
							className="group gap-2  hover:bg-card-muted dark:bg-background dark:hover:bg-card"
							variant="secondary"
						>
							<Link
								className="flex gap-2"
								href="https://github.com/66HEX/nocta-ui"
								target="_blank"
							>
								<GitHubLogoIcon aria-hidden="true" className="mr-2 h-5 w-5" />{' '}
								View on GitHub
							</Link>
						</Button>
					</div>
				</div>
			</div>
		</Section>
	);
}
