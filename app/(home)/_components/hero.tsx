import { ReaderIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Section } from '@/components/section';
import { GithubStarsButton } from './github-stars-button';

const Hero = () => (
	<Section className="relative h-[65vh] w-full overflow-hidden px-4 py-16 sm:px-16 sm:py-24 md:h-[70vh] md:py-32">
		<div
			className="absolute inset-0 h-[650px] md:h-[850px] w-full
		[background:radial-gradient(125%_125%_at_50%_10%,var(--color-background)_40%,oklch(0.28_0.005_290)_300%)]
		dark:[background:radial-gradient(125%_125%_at_50%_10%,var(--color-background)_40%,oklch(0.997_0.05_290)_300%)]
		"
		></div>
		<div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center gap-8 z-10 p-6 bg-dashed">
			<Badge
				variant="default"
				size="md"
				className="group gap-4 bg-background border border-border rounded-sm text-foreground"
			>
				React + Ariakit + Tailwind, minus the boilerplate.
			</Badge>
			<div className="flex flex-col gap-4">
				<h1 className="max-w-3xl text-center font-medium text-foreground text-4xl md:text-6xl">
					Own the Code.
					<br />
					Shape the Experience.
				</h1>
				<p className="max-w-2xl text-center text-lg text-foreground/70 leading-relaxed md:text-xl">
					Stop wrestling with versions and APIs. Nocta UI lets you copy clean,
					accessible React components built on Ariakit and Tailwind — ready to
					ship and easy to make yours.{' '}
				</p>
			</div>
			<div className="flex flex-col-reverse md:flex-row gap-3">
				<GithubStarsButton />
				<Button className="group gap-4">
					<Link className="flex gap-2" href="/docs">
						<ReaderIcon aria-hidden="true" className="mr-2 h-5 w-5" /> Read
						Documentation
					</Link>
				</Button>
			</div>
		</div>
	</Section>
);

export default Hero;
