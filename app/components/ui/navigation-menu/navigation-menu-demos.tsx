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
							label={"Nocta Studio"}
							description="Design, preview, and publish beautiful dashboards with live data."
						/>
						<NavigationMenuLink
							href="#"
							label={"Automations"}
							description="Coordinate multi-step customer journeys with conditional logic."
						/>
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
