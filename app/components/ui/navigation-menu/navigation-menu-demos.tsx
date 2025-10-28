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
					<NavigationMenuGroup label="Featured">
						<NavigationMenuLink
							href="#"
							label={
								<span className="flex items-center gap-2">
									<RocketIcon aria-hidden="true" className="h-4 w-4" />
									Nocta Studio
								</span>
							}
							description="Design, preview, and publish beautiful dashboards with live data."
						/>
						<NavigationMenuLink
							href="#"
							label={
								<span className="flex items-center gap-2">
									<LightningBoltIcon aria-hidden="true" className="h-4 w-4" />
									Automations
								</span>
							}
							description="Coordinate multi-step customer journeys with conditional logic."
						/>
					</NavigationMenuGroup>
					<NavigationMenuGroup label="Resources">
						<NavigationMenuLink
							href="#"
							label={
								<span className="flex items-center gap-2">
									<FileTextIcon aria-hidden="true" className="h-4 w-4" />
									Release notes
								</span>
							}
							description="Stay up to date with our latest capabilities and improvements."
						/>
						<NavigationMenuLink
							href="#"
							label={
								<span className="flex items-center gap-2">
									<LayersIcon aria-hidden="true" className="h-4 w-4" />
									Templates
								</span>
							}
							description="Jump-start new ideas with ready-made templates for common scenarios."
						/>
					</NavigationMenuGroup>
				</NavigationMenuItem>

				<NavigationMenuItem label="Developers">
					<NavigationMenuGroup label="Build">
						<NavigationMenuLink
							href="#"
							label={
								<span className="flex items-center gap-2">
									<CodeIcon aria-hidden="true" className="h-4 w-4" />
									API Reference
								</span>
							}
							description="Explore the full API surface with interactive examples."
						/>
						<NavigationMenuLink
							href="#"
							label={
								<span className="flex items-center gap-2">
									<LayersIcon aria-hidden="true" className="h-4 w-4" />
									Component SDK
								</span>
							}
							description="Embed Nocta UI components directly inside your application."
						/>
					</NavigationMenuGroup>
					<NavigationMenuGroup label="Support">
						<NavigationMenuLink
							href="#"
							label={
								<span className="flex items-center gap-2">
									<ChatBubbleIcon aria-hidden="true" className="h-4 w-4" />
									Developer community
								</span>
							}
							description="Ask questions, share patterns, and learn from other builders."
						/>
						<NavigationMenuLink
							href="#"
							label={
								<span className="flex items-center gap-2">
									<ArrowRightIcon aria-hidden="true" className="h-4 w-4" />
									Quickstart tutorials
								</span>
							}
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
