import { cn } from 'fumadocs-ui/utils/cn';
import Image from 'next/image';
import { Badge } from '@/registry/ui/badge';
import { Button } from '@/registry/ui/button';
import { Card } from '@/registry/ui/card';

export type TemplateShowcaseItem = {
	badge: string;
	title: string;
	description: string;
	previewUrl: string;
	sourceUrl: string;
	isDisabled?: boolean;
	image: {
		src: string;
		alt: string;
	};
};

type TemplateShowcaseProps = {
	items: TemplateShowcaseItem[];
};

export function TemplateShowcase({ items }: TemplateShowcaseProps) {
	return (
		<section className="relative overflow-hidden">
			<div className="mx-auto w-full max-w-5xl md:border-x border-dashed border-fd-border divide-y">
				{items.map((template, index) => (
					<TemplateRow
						key={template.title}
						template={template}
						isReversed={index % 2 === 1}
					/>
				))}
			</div>
		</section>
	);
}

type TemplateRowProps = {
	template: TemplateShowcaseItem;
	isReversed: boolean;
};

function TemplateRow({ template, isReversed }: TemplateRowProps) {
	const mobileContentPlacement = isReversed ? 'row-start-1 md:row-auto' : '';
	const mobilePreviewPlacement = isReversed ? 'row-start-2 md:row-auto' : '';

	const content = (
		<div
			className={cn('space-y-3 h-full p-6', 'max-w-xl', mobileContentPlacement)}
		>
			<Badge variant="secondary" size="md">
				{template.badge}
			</Badge>
			<h2 className="text-left font-medium text-xl md:text-2xl text-foreground tracking-tight max-w-2xl">
				{template.title}
			</h2>
			<p className="text-left mt-2 max-w-lg text-base text-foreground/70 leading-relaxed text-balance">
				{template.description}
			</p>
			<div className="flex flex-wrap gap-3 mt-6">
				<TemplateActionButton
					label="Preview"
					href={template.previewUrl}
					variant="default"
					disabled={template.isDisabled ?? false}
				/>
				<TemplateActionButton
					label="Source Code"
					href={template.sourceUrl}
					disabled={template.isDisabled ?? false}
				/>
			</div>
		</div>
	);

	const preview = (
		<div className={cn('p-6', mobilePreviewPlacement)}>
			<Card>
				<Image
					src={template.image.src}
					alt={template.image.alt}
					width={1200}
					height={800}
					preload={true}
					className="w-full object-cover rounded-lg"
					sizes="(min-width: 1024px) 600px, (min-width: 768px) 80vw, 100vw"
				/>
			</Card>
		</div>
	);

	return (
		<article className="grid items-center md:grid-cols-2 md:divide-x divide-fd-border divide-dashed">
			{isReversed ? (
				<>
					{preview}
					{content}
				</>
			) : (
				<>
					{content}
					{preview}
				</>
			)}
		</article>
	);
}

type TemplateActionButtonProps = {
	label: string;
	href: string;
	disabled?: boolean;
	variant?: 'default' | 'secondary';
};

function TemplateActionButton({
	label,
	href,
	disabled,
	variant = 'secondary',
}: TemplateActionButtonProps) {
	if (disabled) {
		return (
			<Button variant={variant} size="md" disabled>
				{label}
			</Button>
		);
	}

	return (
		<Button variant={variant} size="md" asChild>
			<a target="_blank" rel="noopener noreferrer" href={href}>
				{label}
			</a>
		</Button>
	);
}
