import { GitHubLogoIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import type React from 'react';
import { Button } from '@nocta/registry/ui/button';

export default function CTA(): React.ReactElement {
	return (
		<section className="relative overflow-hidden">
			<div className="mx-auto flex max-w-5xl flex-col items-start md:items-center justify-center md:border-x border-dashed border-fd-border p-6 md:p-10 lg:p-14 text-center">
				<h2 className="text-left md:text-center font-medium text-xl md:text-2xl text-foreground tracking-tight max-w-2xl">
					Enjoying Nocta UI? Help us grow.
				</h2>

				<p className="text-left md:text-center mt-2 max-w-xl mx-auto text-base text-foreground/70 leading-relaxed text-balance">
					Starring the repository on GitHub keeps the project healthy and shows
					the community that Nocta UI matters to you.
				</p>

				<div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
					<Button
						size="md"
						asChild
						variant="secondary"
						className="group gap-2 hover:bg-card-muted dark:bg-background dark:hover:bg-card"
					>
						<Link
							href="https://github.com/nocta-ui/nocta-ui"
							target="_blank"
							className="flex items-center gap-2"
						>
							{' '}
							<GitHubLogoIcon aria-hidden="true" className="h-5 w-5" />
							Give Nocta UI a Star
						</Link>
					</Button>
				</div>
			</div>
		</section>
	);
}
