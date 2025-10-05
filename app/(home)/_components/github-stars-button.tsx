import { GitHubLogoIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { Button } from '@/app/components/ui/button';
import { fetchGitHubStars } from '@/lib/github';

const GITHUB_REPO_URL = 'https://github.com/66HEX/nocta-ui';

const formatStars = (stars: number | null) => {
	if (stars === null) return '—';
	return new Intl.NumberFormat('en-US', {
		notation: 'compact',
		maximumFractionDigits: 1,
	}).format(stars);
};

export const GithubStarsButton = async () => {
	const stars = await fetchGitHubStars();

	return (
		<Button
			className="group bg-background hover:bg-card transition-colors"
			size="md"
			variant="secondary"
		>
			<Link
				className="flex items-center gap-3 whitespace-nowrap"
				href={GITHUB_REPO_URL}
				target="_blank"
				rel="noreferrer"
			>
				<GitHubLogoIcon aria-hidden="true" className="h-5 w-5" />
				<span className="font-medium">GitHub</span>

				<span className="h-4 w-px bg-border" aria-hidden="true" />

				<span className="rounded-sm border border-border bg-card px-2 py-0.5 text-xs font-medium text-foreground/80 transition-colors group-hover:bg-card-muted">
					{formatStars(stars)}
				</span>
			</Link>
		</Button>
	);
};
