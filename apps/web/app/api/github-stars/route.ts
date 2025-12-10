import { NextResponse } from 'next/server';
import { fetchGitHubStars } from '@/lib/github';

export const revalidate = 3600;
const CACHE_CONTROL_HEADER = 's-maxage=3600';

export async function GET() {
	try {
		const stars = await fetchGitHubStars();

		if (stars === null) {
			return NextResponse.json(
				{ error: 'Failed to fetch GitHub repository data' },
				{ status: 502 },
			);
		}

		return NextResponse.json(
			{ stars },
			{
				headers: {
					'Cache-Control': CACHE_CONTROL_HEADER,
				},
			},
		);
	} catch (error) {
		console.error('GitHub stars API error:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		);
	}
}
