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
			'A React component library built on a copy-paste philosophy. Instead of installing packages, you get clean, accessible source code - added straight to your project via the CLI.',
	},
	{
		question: 'Is Nocta UI accessible?',
		answer:
			'Yep. Accessibility isn’t an afterthought here. Components are built on top of @ariakit/react, so focus, keyboard navigation, and ARIA are all taken care of.',
	},
	{
		question: 'Can I customize the components?',
		answer:
			'Completely. Since everything lives in your codebase, you can tweak styles, behavior, or structure however you want - no overrides or weird hacks.',
	},
	{
		question: 'Does Nocta UI work with my framework?',
		answer:
			'If you’re using React - absolutely. It’s optimized for Next.js, Vite, and React Router, and the CLI auto-detects your setup so you can start fast.',
	},
	{
		question: 'What kind of support is available?',
		answer:
			'You’ll find clear documentation, usage guides, and examples on the official website. Issues and feedback are welcome on GitHub.',
	},
];

export const FAQ = () => (
	<Section className="grid divide-y divide-dashed divide-border lg:grid-cols-2 lg:divide-x lg:divide-y-0">
		<div className="px-6 py-10 md:py-14 gap-2">
			<h4 className="font-regular max-w-xl text-left text-3xl md:text-4xl">
				Frequently Asked Questions
			</h4>
			<p className="text-foreground/70 mt-4 max-w-md text-lg">
				We know you’ve got questions - probably the same ones everyone else had.
				Let’s save you some time.
			</p>
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
					<AccordionTrigger className="rounded-none px-4 hover:bg-card-muted dark:hover:bg-card hover:no-underline data-[state=open]:bg-card-muted dark:data-[state=open]:bg-card text-foreground">
						{item.question}
					</AccordionTrigger>
					<AccordionContent className="transform-all p-4 duration-300 text-foreground/70">
						{item.answer}
					</AccordionContent>
				</AccordionItem>
			))}
		</Accordion>
	</Section>
);
