'use client';

import type React from 'react';
import { Button } from '@/registry/ui/button';
import {
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
	DialogSurface,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/registry/ui/dialog';

export const SimpleDialogDemo: React.FC = () => {
	return (
		<div className="my-6">
			<Dialog>
				<DialogTrigger asChild>
					<Button>Open Dialog</Button>
				</DialogTrigger>
				<DialogSurface>
					<DialogHeader>
						<DialogTitle>Welcome</DialogTitle>
						<DialogDescription>
							This is a basic dialog example with a title and description.
						</DialogDescription>
					</DialogHeader>
					<DialogContent>
						<p className="text-sm text-foreground/70">
							Dialog content goes here. You can add any components or content
							you need.
						</p>
					</DialogContent>
				</DialogSurface>
			</Dialog>
		</div>
	);
};

export const DialogWithActionsDemo: React.FC = () => {
	return (
		<div className="my-6">
			<Dialog>
				<DialogTrigger asChild>
					<Button variant="secondary">Delete Item</Button>
				</DialogTrigger>
				<DialogSurface showClose={false}>
					<DialogHeader>
						<DialogTitle>Confirm Deletion</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete this item?
						</DialogDescription>
					</DialogHeader>
					<DialogContent>
						<p className="text-sm text-foreground/70">
							This will permanently remove <strong>Project Alpha</strong> and
							all associated data.
						</p>
					</DialogContent>
					<DialogFooter>
						<DialogActions>
							<DialogClose>
									Cancel
							</DialogClose>
							<Button variant="default">
								Delete
							</Button>
						</DialogActions>
					</DialogFooter>
				</DialogSurface>
			</Dialog>
		</div>
	);
};

export const DialogSizesDemo: React.FC = () => {
	return (
		<div className="my-6 flex flex-wrap gap-3">
			<Dialog>
				<DialogTrigger asChild>
					<Button size="sm" variant="ghost">
						Small
					</Button>
				</DialogTrigger>
				<DialogSurface size="sm">
					<DialogHeader>
						<DialogTitle>Small Dialog</DialogTitle>
						<DialogDescription>
							This is a small dialog example.
						</DialogDescription>
					</DialogHeader>
					<DialogContent>
						<p className="text-sm text-foreground/70">
							Compact dialog for simple interactions.
						</p>
					</DialogContent>
				</DialogSurface>
			</Dialog>

			<Dialog>
				<DialogTrigger asChild>
					<Button size="sm" variant="ghost">
						Medium
					</Button>
				</DialogTrigger>
				<DialogSurface size="md">
					<DialogHeader>
						<DialogTitle>Medium Dialog</DialogTitle>
						<DialogDescription>
							This is a medium dialog example.
						</DialogDescription>
					</DialogHeader>
					<DialogContent>
						<p className="text-sm text-foreground/70">
							Standard dialog size for most use cases.
						</p>
					</DialogContent>
				</DialogSurface>
			</Dialog>

			<Dialog>
				<DialogTrigger asChild>
					<Button size="sm" variant="ghost">
						Large
					</Button>
				</DialogTrigger>
				<DialogSurface size="lg">
					<DialogHeader>
						<DialogTitle>Large Dialog</DialogTitle>
						<DialogDescription>
							This is a large dialog example.
						</DialogDescription>
					</DialogHeader>
					<DialogContent>
						<p className="text-sm text-foreground/70">
							Larger dialog for complex forms or detailed content.
						</p>
					</DialogContent>
				</DialogSurface>
			</Dialog>
			<Dialog>
				<DialogTrigger asChild>
					<Button size="sm" variant="ghost">
						Extra Large
					</Button>
				</DialogTrigger>
				<DialogSurface size="xl">
					<DialogHeader>
						<DialogTitle>Extra Large Dialog</DialogTitle>
						<DialogDescription>
							This is an extra large dialog example.
						</DialogDescription>
					</DialogHeader>
					<DialogContent>
						<p className="text-sm text-foreground/70">
							Extra Large dialog for complex content.
						</p>
					</DialogContent>
				</DialogSurface>
			</Dialog>
		</div>
	);
};
