import { Section } from '@/components/section';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';

const faq = [
	{
		question: 'What is Nocta UI?',
		answer:
			'Nocta UI is a React component library built with a copy-paste philosophy. Instead of shipping as a package, it provides source code you add directly to your project via a CLI.',
	},
	{
		question: 'Is Nocta UI accessible?',
		answer:
			'Yes. Accessibility is a core principle of Nocta UI. Interactive components are built on top of @ariakit/react, ensuring proper focus management, keyboard navigation, and WAI-ARIA compliance.',
	},
	{
		question: 'Can I customize the components?',
		answer:
			'Absolutely. Since components are copied into your project, you have full control to adjust styling, behavior, or structure however you like.',
	},
	{
		question: 'Does Nocta UI work with my framework?',
		answer:
			'Yes. It is React-focused and optimized for Next.js, Vite and React Router projects. The CLI automatically detects your framework and configures everything for you.',
	},
	{
		question: 'What kind of support is available?',
		answer:
			'You can find clear documentation, usage guides, and examples on the official website. Contributions and issue tracking are available on GitHub.',
	},
];

export const FAQ = () => (
	<Section className="grid divide-y divide-dashed divide-border lg:grid-cols-2 lg:divide-x lg:divide-y-0">
		<div className="px-6 py-10 md:py-14">
			<h4 className="font-regular max-w-xl text-left text-3xl tracking-tighter md:text-5xl">
				Frequently Asked Questions
			</h4>
		</div>

		<Accordion
			type="single"
			collapsible
			className="w-full divide-dashed divide-border"
		>
			{faq.map((item, index) => (
				<AccordionItem
					key={`${item.question}-${index}`}
					value={`index-${index}`}
				>
					<AccordionTrigger className="rounded-none px-4 hover:bg-background-muted hover:no-underline data-[state=open]:bg-background-muted">
						{item.question}
					</AccordionTrigger>
					<AccordionContent className="transform-all p-4 duration-300">
						{item.answer}
					</AccordionContent>
				</AccordionItem>
			))}
		</Accordion>
	</Section>
);
