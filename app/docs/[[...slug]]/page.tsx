import { createRelativeLink } from "fumadocs-ui/mdx";
import { DocsBody, DocsPage } from "fumadocs-ui/page";
import { notFound } from "next/navigation";
import { LLMCopyButton, ViewOptions } from "@/app/page-options";
import { source } from "@/lib/source";
import { getMDXComponents } from "@/mdx-components";

export default async function Page(props: {
	params: Promise<{ slug?: string[] }>;
}) {
	const params = await props.params;
	const page = source.getPage(params.slug);
	if (!page) notFound();

	const MDXContent = page.data.body;

	const { toc, lastModified } = page.data;

	return (
		<DocsPage
			toc={toc}
			lastUpdate={lastModified ? new Date(lastModified) : undefined}
			tableOfContent={{
				style: "normal",
			}}
		>
			<h1 className="text-[1.75em] font-semibold -mb-4">{page.data.title}</h1>
			<p className="text-lg text-fd-muted-foreground">
				{page.data.description}
			</p>
			<div className="flex flex-row gap-2 items-center border-b pt-2 pb-6">
				<LLMCopyButton markdownUrl={`/api/mdx?path=${page.url}`} />
				<ViewOptions
					markdownUrl={`/api/mdx?path=${page.url}`}
					githubUrl={`https://github.com/66HEX/nocta-ui/tree/main/content/docs/${page.file.path}`}
				/>
			</div>
			<DocsBody className="">
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
