import { GitHubLogoIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { Button } from '@/app/components/ui/button';
import { fetchGitHubStars } from '@/lib/github';

const GITHUB_REPO_URL = 'https://github.com/nocta-ui/nocta-ui';

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
		  asChild
			className="bg-card hover:bg-card-muted"
			size="md"
			variant="secondary"
		>
  		<Link
  			className="flex items-center whitespace-nowrap"
  			href={GITHUB_REPO_URL}
  			target="_blank"
  			rel="noreferrer"
  		>
        <GitHubLogoIcon aria-hidden="true" className="h-5 w-5" />
    		<span className="font-medium">GitHub</span>

    		<span className="h-4 w-px bg-border mx-1" aria-hidden="true" />

    		<span className="text-xs font-medium text-foreground/80">
   			{formatStars(stars)}
    		</span>
  		</Link>
		</Button>
	);
};
