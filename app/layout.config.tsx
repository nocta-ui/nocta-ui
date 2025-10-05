import type { LinkItemType } from 'fumadocs-ui/layouts/links';
import type { BaseLayoutProps } from '@/components/layout/shared';

export const title = 'Nocta UI';
export const description = 'Modern React Component Library';
export const owner = 'Nocta UI';

export const baseOptions: BaseLayoutProps = {
	nav: {
		title: (
			<div className="flex items-center justify-center gap-1.5 text-foreground">
				<svg
					aria-hidden="true"
					width="22"
					height="22"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M12 0C13.1157 0 14.1948 0.155574 15.2197 0.44043L19.5 9V2.63574C22.2423 4.83496 24 8.21128 24 12C24 18.6274 18.6274 24 12 24C11.0893 24 10.2032 23.8944 9.35059 23.7021L5 15V21.7432C1.97313 19.5647 0 16.0141 0 12C0 5.37258 5.37258 0 12 0ZM12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5Z"
						fill="currentColor"
					/>
				</svg>
				<p className="text-foreground text-sm leading-relaxed font-bold">
					NOCTA UI
				</p>
			</div>
		),
	},
	githubUrl: 'https://github.com/66HEX/nocta-ui',
};

export const linkItems: LinkItemType[] = [
	{
		text: 'Documentation',
		url: '/docs',
		active: 'url',
	},
];

export const postsPerPage = 5;
