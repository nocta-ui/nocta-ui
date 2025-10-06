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
						d="M12 0C13.0265 0 14.0227 0.129607 14.9736 0.37207L19 9V2.25586C22.0271 4.43433 24 7.98574 24 12C24 18.6274 18.6274 24 12 24C10.9731 24 9.97671 23.8696 9.02539 23.627L5 15V21.7432C1.97313 19.5647 0 16.0141 0 12C0 5.37258 5.37258 0 12 0ZM12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5Z"
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
