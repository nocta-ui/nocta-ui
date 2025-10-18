import { GitHubLogoIcon, ReaderIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import type React from 'react';
import { Button } from '@/app/components/ui/button';

export default function CTA(): React.ReactElement {
	return (
		<section className="relative overflow-hidden">
			<div className="mx-auto flex max-w-5xl flex-col items-center justify-center md:border-x border-dashed border-fd-border p-6 md:p-10 lg:p-14 text-center">
				<h2 className="text-left md:text-center font-medium text-xl md:text-2xl text-foreground max-w-2xl">
					Ready to build something that just works?
				</h2>

				<p className="text-left md:text-center mt-2 max-w-xl mx-auto text-base text-foreground/70">
					Nocta UI gives you accessible, polished components and a CLI that
					saves you hours — no hacks, no headaches.
				</p>

				<div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
					<Button size="md">
						<Link href="/docs" className="flex items-center gap-2">
							<ReaderIcon aria-hidden="true" className="h-5 w-5" />
							Read Documentation
						</Link>
					</Button>

					<Button
						size="md"
						variant="secondary"
						className="group gap-2 hover:bg-card-muted dark:bg-background dark:hover:bg-card"
					>
						<Link
							href="https://github.com/nocta-ui/nocta-ui"
							target="_blank"
							className="flex items-center gap-2"
						>
							<GitHubLogoIcon aria-hidden="true" className="h-5 w-5" />
							View on GitHub
						</Link>
					</Button>
				</div>
			</div>
		</section>
	);
}
