const GITHUB_REPO_URL = 'https://api.github.com/repos/nocta-ui/nocta-ui';
const CACHE_SECONDS = 60 * 60; // 1 hour

export const githubCacheSeconds = CACHE_SECONDS;

type GitHubHeaders = {
	Accept: string;
	'User-Agent': string;
	Authorization?: string;
};

export const fetchGitHubStars = async (): Promise<number | null> => {
	const headers: GitHubHeaders = {
		Accept: 'application/vnd.github+json',
		'User-Agent': 'nocta-ui-app',
	};

	const token = process.env.GITHUB_TOKEN;
	if (token) {
		headers.Authorization = `Bearer ${token}`;
	}

	const response = await fetch(GITHUB_REPO_URL, {
		headers,
		next: { revalidate: CACHE_SECONDS },
	});

	if (!response.ok) {
		return null;
	}

	const data = (await response.json()) as { stargazers_count?: number };
	if (
		typeof data.stargazers_count === 'number' &&
		Number.isFinite(data.stargazers_count)
	) {
		return data.stargazers_count;
	}

	return null;
};
