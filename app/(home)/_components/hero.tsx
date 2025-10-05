import { ReaderIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Section } from '@/components/section';
import { GithubStarsButton } from './github-stars-button';

const Hero = () => (
	<Section className="relative h-[60vh] w-full overflow-hidden px-4 py-16 sm:px-16 sm:py-24 md:h-[70vh] md:py-32">
		<div
			className="absolute inset-0 h-[600px] md:h-[800px] w-full
		[background:radial-gradient(125%_125%_at_50%_10%,var(--color-background)_40%,oklch(0.78_0.22_290)_300%)]
		dark:[background:radial-gradient(125%_125%_at_50%_10%,var(--color-background)_40%,oklch(0.42_0.2_290)_300%)]
		"
		></div>
		<div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center gap-8 z-10 bg-dashed p-6">
			<Badge
				variant="default"
				size="md"
				className="group gap-4 bg-background border border-border rounded-sm text-foreground/70"
			>
				A lightweight React component library
			</Badge>
			<div className="flex flex-col gap-4">
				<h1 className="max-w-3xl text-center font-medium text-foreground text-4xl md:text-6xl">
					Own the Code.
					<br />
					Shape the Experience.
				</h1>
				<p className="max-w-2xl text-center text-lg text-foreground/70 leading-relaxed md:text-xl">
					Nocta UI gives you modern, accessible components — copied directly
					into your project. No packages. No version conflicts. Just clean,
					modifiable code built for React and Tailwind.
				</p>
			</div>
			<div className="flex flex-col md:flex-row gap-3">
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
