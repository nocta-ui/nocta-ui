import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/app/components/ui/accordion';

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
			'If you’re using React - absolutely. It’s optimized for Next.js, Vite, Tanstack Start and React Router, and the CLI auto-detects your setup so you can start fast.',
	},
	{
		question: 'What kind of support is available?',
		answer:
			'You’ll find clear documentation, usage guides, and examples on the official website. Issues and feedback are welcome on GitHub.',
	},
];

export const FAQ = () => (
	<section className="relative overflow-hidden">
		<div className="mx-auto max-w-5xl md:border-x border-dashed border-fd-border p-6 text-center">
			<h2 className="text-left font-medium text-xl md:text-2xl text-foreground tracking-tight max-w-2xl">
				Frequently Asked Questions
			</h2>

			<p className="text-left mt-2 max-w-lg text-base text-foreground/70 leading-relaxed text-balance">
				We know you’ve got questions — probably the same ones everyone else had.
				Let’s save you some time.
			</p>

			<div className="mt-8 text-left">
				<Accordion variant="card" type="single" className="space-y-3">
					{faq.map((item, index) => (
						<AccordionItem
							key={`${item.question}-${index}`}
							value={`index-${index}`}
						>
							<AccordionTrigger className="text-base">
								{item.question}
							</AccordionTrigger>
							<AccordionContent>{item.answer}</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</div>
		</div>
	</section>
);
