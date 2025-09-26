"use client";

import type React from "react";
import { Button } from "../button";
import { Spinner } from "../spinner";
import {
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./dialog";

export const SimpleDialogDemo: React.FC = () => {
	return (
		<div className="my-6">
			<Dialog>
				<DialogTrigger asChild>
					<Button>Open Dialog</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Welcome</DialogTitle>
						<DialogDescription>
							This is a basic dialog example with a title and description.
						</DialogDescription>
					</DialogHeader>
					<div className="p-4">
						<p className="text-sm text-foreground-muted">
							Dialog content goes here. You can add any components or content
							you need.
						</p>
					</div>
				</DialogContent>
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
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Confirm Deletion</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete this item?
						</DialogDescription>
					</DialogHeader>
					<div className="p-4">
						<p className="text-sm text-foreground-muted">
							This will permanently remove <strong>Project Alpha</strong> and
							all associated data.
						</p>
					</div>
					<DialogFooter>
						<DialogActions>
							<DialogClose asChild>
								<Button variant="ghost" size="sm">
									Cancel
								</Button>
							</DialogClose>
							<Button variant="primary" size="sm">
								Delete
							</Button>
						</DialogActions>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export const SizesDemo: React.FC = () => {
	return (
		<div className="my-6 flex flex-wrap gap-3">
			<Dialog>
				<DialogTrigger asChild>
					<Button size="sm" variant="ghost">
						Small
					</Button>
				</DialogTrigger>
				<DialogContent size="sm">
					<DialogHeader>
						<DialogTitle>Small Dialog</DialogTitle>
						<DialogDescription>
							This is a small dialog example.
						</DialogDescription>
					</DialogHeader>
					<div className="p-4">
						<p className="text-sm text-foreground-muted">
							Compact dialog for simple interactions.
						</p>
					</div>
				</DialogContent>
			</Dialog>

			<Dialog>
				<DialogTrigger asChild>
					<Button size="sm" variant="ghost">
						Medium
					</Button>
				</DialogTrigger>
				<DialogContent size="md">
					<DialogHeader>
						<DialogTitle>Medium Dialog</DialogTitle>
						<DialogDescription>
							This is a medium dialog example.
						</DialogDescription>
					</DialogHeader>
					<div className="p-4">
						<p className="text-sm text-foreground-muted">
							Standard dialog size for most use cases.
						</p>
					</div>
				</DialogContent>
			</Dialog>

			<Dialog>
				<DialogTrigger asChild>
					<Button size="sm" variant="ghost">
						Large
					</Button>
				</DialogTrigger>
				<DialogContent size="lg">
					<DialogHeader>
						<DialogTitle>Large Dialog</DialogTitle>
						<DialogDescription>
							This is a large dialog example.
						</DialogDescription>
					</DialogHeader>
					<div className="p-4">
						<p className="text-sm text-foreground-muted">
							Larger dialog for complex forms or detailed content.
						</p>
					</div>
				</DialogContent>
			</Dialog>
			<Dialog>
				<DialogTrigger asChild>
					<Button size="sm" variant="ghost">
						Extra Large
					</Button>
				</DialogTrigger>
				<DialogContent size="xl">
					<DialogHeader>
						<DialogTitle>Extra Large Dialog</DialogTitle>
						<DialogDescription>
							This is an extra large dialog example.
						</DialogDescription>
					</DialogHeader>
					<div className="p-4">
						<p className="text-sm text-foreground-muted">
							Extra Large dialog for complex content.
						</p>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export const WithoutCloseButtonDemo: React.FC = () => {
	return (
		<div className="my-6">
			<Dialog>
				<DialogTrigger asChild>
					<Button variant="secondary">Processing...</Button>
				</DialogTrigger>
				<DialogContent showClose={false} size="sm">
					<DialogHeader>
						<DialogTitle>Processing Request</DialogTitle>
						<DialogDescription>
							Please wait while we process your request...
						</DialogDescription>
					</DialogHeader>
					<div className="px-6 py-8 text-center">
						<Spinner />
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
};
