const GITHUB_REPO_URL = 'https://api.github.com/repos/66HEX/nocta-ui';
const CACHE_SECONDS = 60 * 60; // 1 hour

export const githubCacheSeconds = CACHE_SECONDS;

export const fetchGitHubStars = async (): Promise<number | null> => {
	const headers: Record<string, string> = {
		Accept: 'application/vnd.github+json',
		'User-Agent': 'nocta-ui-app',
	};

	if (process.env.GITHUB_TOKEN) {
		headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
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
