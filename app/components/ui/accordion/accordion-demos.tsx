"use client";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "./accordion";

export function BasicAccordionDemo() {
	return (
		<div className="w-full max-w-md mx-auto my-6 relative">
			<Accordion>
				<AccordionItem value="item-1">
					<AccordionTrigger>What is Nocta UI?</AccordionTrigger>
					<AccordionContent>
						Nocta UI is a modern React component library built with performance
						and accessibility in mind.
					</AccordionContent>
				</AccordionItem>

				<AccordionItem value="item-2">
					<AccordionTrigger>How to install?</AccordionTrigger>
					<AccordionContent>
						You can install components using our CLI:{" "}
						<code>npx nocta-ui add accordion</code>
					</AccordionContent>
				</AccordionItem>

				<AccordionItem value="item-3">
					<AccordionTrigger>Does it support dark mode?</AccordionTrigger>
					<AccordionContent>
						Yes! All components in Nocta UI have full dark mode support with
						automatic switching.
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	);
}

export function CardAccordionDemo() {
	return (
		<div className="w-full max-w-lg mx-auto my-6 relative">
			<Accordion variant="card" className="space-y-3">
				<AccordionItem value="account">
					<AccordionTrigger>Account Settings</AccordionTrigger>
					<AccordionContent>
						Manage your profile, change email address and password.
					</AccordionContent>
				</AccordionItem>

				<AccordionItem value="security">
					<AccordionTrigger>Security</AccordionTrigger>
					<AccordionContent>
						Enable two-factor authentication and manage your login sessions.
					</AccordionContent>
				</AccordionItem>

				<AccordionItem value="preferences">
					<AccordionTrigger>Preferences</AccordionTrigger>
					<AccordionContent>
						Customize the interface theme, language, and notification settings.
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	);
}

export function MultipleAccordionDemo() {
	return (
		<div className="w-full max-w-md mx-auto my-6 relative">
			<Accordion>
				<AccordionItem value="react">
					<AccordionTrigger>React Basics</AccordionTrigger>
					<AccordionContent>
						Learn the fundamentals of React - components, props, state and
						lifecycle.
					</AccordionContent>
				</AccordionItem>

				<AccordionItem value="typescript">
					<AccordionTrigger>TypeScript Integration</AccordionTrigger>
					<AccordionContent>
						How to use TypeScript with React for better type safety.
					</AccordionContent>
				</AccordionItem>

				<AccordionItem value="testing">
					<AccordionTrigger>Testing Components</AccordionTrigger>
					<AccordionContent>
						Writing unit and integration tests for React components.
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	);
}

export function SizeAccordionDemo() {
	return (
		<div className="w-full max-w-md mx-auto space-y-8 my-6 flex flex-col">
			<div className="flex flex-col gap-4">
				<div>
					<Accordion size="sm">
						<AccordionItem value="small">
							<AccordionTrigger>Small question</AccordionTrigger>
							<AccordionContent>Short answer in small size.</AccordionContent>
						</AccordionItem>
					</Accordion>
				</div>

				<div>
					<Accordion size="md">
						<AccordionItem value="medium">
							<AccordionTrigger>Standard question</AccordionTrigger>
							<AccordionContent>
								Standard answer in default size.
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</div>

				<div>
					<Accordion size="lg">
						<AccordionItem value="large">
							<AccordionTrigger>
								Large question requiring more space
							</AccordionTrigger>
							<AccordionContent>
								More detailed answer in larger size, which can contain more
								content and details requiring additional space.
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</div>
			</div>
		</div>
	);
}
