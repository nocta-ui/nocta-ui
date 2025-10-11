import { createRelativeLink } from 'fumadocs-ui/mdx';
import { notFound } from 'next/navigation';
import { DocsBody, DocsPage } from '@/components/layout/page';
import { LLMCopyButton, ViewOptions } from '@/components/page-options';
import { source } from '@/lib/source';
import { getMDXComponents } from '@/mdx-components';

export default async function Page(props: {
	params: Promise<{ slug?: string[] }>;
}) {
	const params = await props.params;
	const page = source.getPage(params.slug);
	if (!page) notFound();

	const MDXContent = page.data.body;
	const { toc, lastModified } = page.data;

	const formattedDate = lastModified
		? new Date(lastModified).toLocaleDateString('en-EN', {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
			})
		: null;

	return (
		<DocsPage
			toc={toc}
			lastUpdate={lastModified ? new Date(lastModified) : undefined}
			tableOfContent={{
				style: 'clerk',
			}}
		>
			{formattedDate && (
				<p className="text-sm text-foreground/35">
					Last Modified: {formattedDate}
				</p>
			)}
			<h1 className="mb-0 text-3xl font-medium text-foreground">
				{page.data.title}
			</h1>
			<p className="text-lg font-normal text-foreground/70">
				{page.data.description}
			</p>

			<div className="flex flex-wrap items-center justify-between border-b border-fd-border pt-2 pb-6">
				<div className="flex flex-row items-center gap-2">
					<LLMCopyButton markdownUrl={`/api/mdx?path=${page.url}`} />
					<ViewOptions
						markdownUrl={`/api/mdx?path=${page.url}`}
						githubUrl={`https://github.com/66HEX/nocta-ui/tree/main/content/docs/${page.file.path}`}
					/>
				</div>
			</div>

			<DocsBody>
				<MDXContent
					components={getMDXComponents({
						a: createRelativeLink(source, page),
					})}
				/>
			</DocsBody>
		</DocsPage>
	);
}

export async function generateStaticParams() {
	return source.generateParams();
}

export async function generateMetadata(props: {
	params: Promise<{ slug?: string[] }>;
}) {
	const params = await props.params;
	const page = source.getPage(params.slug);
	if (!page) notFound();

	return {
		title: page.data.title,
		description: page.data.description,
	};
}
