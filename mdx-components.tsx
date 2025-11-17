import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/app/components/ui/popover';
import { Pre, CodeBlock as CustomCodeBlock } from '@/components/codeblock';
import { DocsTabs } from '@/components/docs-tab';
import { TokenTable } from '@/components/token-table';
import { TypeTable } from '@/components/type-table';

const Wrap = (Tag: any, className: string) => (props: any) => (
	<Tag className={className} {...props} />
);

function CustomTable({ children, ...props }: any) {
  return (
    <div className="relative border border-border shadow-sm h-fit card-highlight rounded-lg">
      <table {...props} className="border-none mb-0 mt-0">
        {children}
      </table>
    </div>
  );
}

export function getMDXComponents(components?: MDXComponents): MDXComponents {
	return {
		...defaultMdxComponents,
		h1: Wrap('h1', 'scroll-m-20 text-3xl font-medium mt-6 mb-4'),
		h2: Wrap(
			'h2',
			'scroll-m-20 pb-2 text-2xl font-medium first:mt-0 mt-8 mb-3',
		),
		h3: Wrap('h3', 'scroll-m-20 text-xl font-medium mt-6 mb-2'),
		h4: Wrap('h4', 'scroll-m-20 text-xl font-medium mt-4 mb-2'),
		h5: Wrap('h5', 'scroll-m-20 text-lg font-medium mt-3 mb-1'),
		h6: Wrap('h6', 'scroll-m-20 text-base font-medium mt-2 mb-1'),
		p: Wrap('p', 'leading-7 [&:not(:first-child)]:mt-4 text-foreground/70'),
		ul: Wrap('ul', 'my-6 ml-6 list-disc [&>li]:mt-2 marker:text-foreground/70'),
		ol: Wrap(
			'ol',
			'my-6 ml-6 list-decimal [&>li]:mt-2 marker:text-foreground/70',
		),
		li: Wrap('li', 'leading-7 text-foreground/70'),
		th: Wrap('th', 'bg-card-muted/30'),
		tr: Wrap('tr', 'bg-card'),
    table: CustomTable,
		DocsTabs,
		Popover,
		PopoverTrigger,
		PopoverContent,
		TypeTable,
		TokenTable,
		pre: ({ ref: _ref, ...props }) => (
			<CustomCodeBlock {...props}>
				<Pre>{props.children}</Pre>
			</CustomCodeBlock>
		),
		...components,
	};
}
