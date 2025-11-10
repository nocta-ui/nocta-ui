'use client';

import {
	ArrowRightIcon,
	ChatBubbleIcon,
	CodeIcon,
	FileTextIcon,
	LayersIcon,
	LightningBoltIcon,
	RocketIcon,
} from '@radix-ui/react-icons';
import type React from 'react';
import {
	NavigationMenu,
	NavigationMenuGroup,
	NavigationMenuItem,
	NavigationMenuLink,
} from './navigation-menu';

export const BasicNavigationMenuDemo: React.FC = () => {
	return (
		<div className="my-6 flex w-full max-w-3xl flex-col items-center gap-4">
			<NavigationMenu>
				<NavigationMenuItem label="Product">
					<NavigationMenuGroup>
						<NavigationMenuLink
							href="#"
							className='relative min-h-36 flex flex-col items-start justify-end bg-[radial-gradient(125%_125%_at_50%_0%,#F1F2F5_50%,#6D31BA_70%)] dark:bg-[radial-gradient(125%_125%_at_50%_0%,#09090B_50%,#7B42C9_70%)]'
						>
						  <span className='font-medium text-lg text-card dark:text-foreground'>
								Nocta UI
							</span>
							<span className='text-sm text-card-muted/70 dark:text-foreground/70'>
								Modern, accessible React components built with TypeScript and Tailwind CSS.
							</span>
						</NavigationMenuLink>
					</NavigationMenuGroup>
					<NavigationMenuGroup>
						<NavigationMenuLink
							href="#"
							label={"Release notes"}
							description="Stay up to date with our latest capabilities and improvements."
						/>
						<NavigationMenuLink
							href="#"
							label={"Templates"}
							description="Jump-start new ideas with ready-made templates for common scenarios."
						/>
						<NavigationMenuLink
              href="#"
              label={"Changelog"}
              description="See what’s new, improved, or fixed in the latest version."
            />
					</NavigationMenuGroup>
				</NavigationMenuItem>

				<NavigationMenuItem label="Developers">
					<NavigationMenuGroup>
						<NavigationMenuLink
							href="#"
							label={"API Reference"}
							description="Explore the full API surface with interactive examples."
						/>
						<NavigationMenuLink
							href="#"
							label={"Component SDK"}
							description="Embed Nocta UI components directly inside your application."
						/>
					</NavigationMenuGroup>
					<NavigationMenuGroup>
						<NavigationMenuLink
							href="#"
							label={"Developer Community"}
							description="Ask questions, share patterns, and learn from other builders."
						/>
						<NavigationMenuLink
							href="#"
							label={"Quickstart tutorials"}
							description="Ship your first integration in under 10 minutes."
						/>
					</NavigationMenuGroup>
				</NavigationMenuItem>

				<NavigationMenuItem label="Pricing" href="#" />
			</NavigationMenu>

			<p className="text-sm text-foreground/70">
				Hover or focus an item to preview its nested content.
			</p>
		</div>
	);
};
