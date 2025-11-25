import Header from './_components/header';
import {
	TemplateShowcase,
	type TemplateShowcaseItem,
} from './_components/template-showcase';

const templates: TemplateShowcaseItem[] = [
	{
		badge: 'Portfolio',
		title: 'Nocta Portfolio Template',
		description:
			'A modern, production-ready portfolio featuring SSR, smooth animations, a working contact form, and an MDX-powered blog — perfect for creatives who want a polished online presence.',
		previewUrl: 'https://nocta-portfolio.vercel.app/',
		sourceUrl: 'https://github.com/nocta-ui/nocta-portfolio',
		image: {
			src: '/templates/portfolio/portfolio-1.webp',
			alt: 'Nocta Portfolio Template preview',
		},
	},
	{
		badge: 'Coming Soon',
		title: 'Untitled Release',
		description:
			'Something new is emerging within the Nocta ecosystem. No name, no details — just a signal that something quietly powerful is taking shape.',
		previewUrl: '#',
		sourceUrl: '#',
		image: {
			src: '/templates/placeholder-1.webp',
			alt: 'Teaser for an unrevealed template',
		},
		isDisabled: true,
	},
];

export default function Templates() {
	return (
		<>
			<Header />
			<TemplateShowcase items={templates} />
		</>
	);
}
