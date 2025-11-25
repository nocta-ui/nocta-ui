import Link from 'next/link';
import { Badge } from '@/registry/ui/badge';
import { Button } from '@/registry/ui/button';
import { GithubStarsButton } from './github-stars-button';

export default function Hero() {
	return (
		<div className="relative overflow-hidden mx-auto w-full">
			<div className="relative z-10 mx-auto max-w-5xl flex flex-col items-center gap-3 text-center px-6 py-16 mt-16">
				<Badge variant="secondary" size="md">
					React + Ariakit + Tailwind, minus the boilerplate.
				</Badge>

				<h1 className="text-balance text-3xl font-medium text-foreground tracking-tight md:text-4xl">
					Own the Code.
					<br />
					Shape the Experience.
				</h1>

				<p className="text-balance text-lg text-foreground/70 max-w-2xl leading-relaxed">
					Own your code with clean, accessible components built on Tailwind and
					Ariakit — no packages, no versioning pain.
				</p>

				<div className="flex w-full flex-row items-center gap-3 justify-center">
					<Button
						variant="default"
						size="md"
						asChild
					>
					  <Link href="/docs"> Get Started</Link>
					</Button>
					<GithubStarsButton />
				</div>
			</div>
		</div>
	);
}
