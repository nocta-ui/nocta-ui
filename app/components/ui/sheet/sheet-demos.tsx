'use client';

import React from 'react';
import { Badge } from '../badge';
import { Button } from '../button';
import { Input } from '../input';
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from './sheet';

export const BasicSheetDemo: React.FC = () => {
	return (
		<div className="my-6">
			<Sheet>
				<SheetTrigger asChild>
					<Button>Open Sheet</Button>
				</SheetTrigger>
				<SheetContent>
					<SheetHeader>
						<SheetTitle>Sheet Title</SheetTitle>
						<SheetDescription>This is a basic sheet panel.</SheetDescription>
					</SheetHeader>
					<div className="flex-1 p-4">
						<p className="text-sm text-foreground/70">
							Sheet content goes here. You can add any components or content you
							need.
						</p>
					</div>
					<SheetFooter>
						<SheetClose>Close</SheetClose>
					</SheetFooter>
				</SheetContent>
			</Sheet>
		</div>
	);
};

export const SheetSidesDemo: React.FC = () => {
	return (
		<div className="my-6 flex flex-wrap gap-3">
			<Sheet>
				<SheetTrigger asChild>
					<Button variant="secondary">Left Side</Button>
				</SheetTrigger>
				<SheetContent side="left">
					<SheetHeader>
						<SheetTitle>Left Sheet</SheetTitle>
						<SheetDescription>
							This sheet slides in from the left side.
						</SheetDescription>
					</SheetHeader>
					<div className="flex-1 p-4">
						<p className="text-sm text-foreground/70">
							Content for left-side sheet.
						</p>
					</div>
				</SheetContent>
			</Sheet>

			<Sheet>
				<SheetTrigger asChild>
					<Button variant="secondary">Right Side</Button>
				</SheetTrigger>
				<SheetContent side="right">
					<SheetHeader>
						<SheetTitle>Right Sheet</SheetTitle>
						<SheetDescription>
							This sheet slides in from the right side.
						</SheetDescription>
					</SheetHeader>
					<div className="flex-1 p-4">
						<p className="text-sm text-foreground/70">
							Content for right-side sheet.
						</p>
					</div>
				</SheetContent>
			</Sheet>

			<Sheet>
				<SheetTrigger asChild>
					<Button variant="secondary">Top Side</Button>
				</SheetTrigger>
				<SheetContent side="top">
					<SheetHeader>
						<SheetTitle>Top Sheet</SheetTitle>
						<SheetDescription>
							This sheet slides in from the top.
						</SheetDescription>
					</SheetHeader>
					<div className="flex-1 p-4">
						<p className="text-sm text-foreground/70">Content for top sheet.</p>
					</div>
				</SheetContent>
			</Sheet>

			<Sheet>
				<SheetTrigger asChild>
					<Button variant="secondary">Bottom Side</Button>
				</SheetTrigger>
				<SheetContent side="bottom">
					<SheetHeader>
						<SheetTitle>Bottom Sheet</SheetTitle>
						<SheetDescription>
							This sheet slides in from the bottom.
						</SheetDescription>
					</SheetHeader>
					<div className="flex-1 p-4">
						<p className="text-sm text-foreground/70">
							Content for bottom sheet.
						</p>
					</div>
				</SheetContent>
			</Sheet>
		</div>
	);
};

export const SheetSizesDemo: React.FC = () => {
	return (
		<div className="my-6 flex flex-wrap gap-3">
			<Sheet>
				<SheetTrigger asChild>
					<Button variant="ghost" size="sm">
						Small
					</Button>
				</SheetTrigger>
				<SheetContent size="sm">
					<SheetHeader>
						<SheetTitle>Small Sheet</SheetTitle>
						<SheetDescription>
							This is a small-sized sheet (320px width).
						</SheetDescription>
					</SheetHeader>
					<div className="flex-1 p-4">
						<p className="text-sm text-foreground/70">
							Compact content for small sheet.
						</p>
					</div>
				</SheetContent>
			</Sheet>

			<Sheet>
				<SheetTrigger asChild>
					<Button variant="ghost" size="sm">
						Medium
					</Button>
				</SheetTrigger>
				<SheetContent size="md">
					<SheetHeader>
						<SheetTitle>Medium Sheet</SheetTitle>
						<SheetDescription>
							This is a medium-sized sheet (384px width).
						</SheetDescription>
					</SheetHeader>
					<div className="flex-1 p-4">
						<p className="text-sm text-foreground/70">
							Standard content for medium sheet.
						</p>
					</div>
				</SheetContent>
			</Sheet>

			<Sheet>
				<SheetTrigger asChild>
					<Button variant="ghost" size="sm">
						Large
					</Button>
				</SheetTrigger>
				<SheetContent size="lg">
					<SheetHeader>
						<SheetTitle>Large Sheet</SheetTitle>
						<SheetDescription>
							This is a large-sized sheet (448px width).
						</SheetDescription>
					</SheetHeader>
					<div className="flex-1 p-4">
						<p className="text-sm text-foreground/70">
							Expanded content for large sheet.
						</p>
					</div>
				</SheetContent>
			</Sheet>

			<Sheet>
				<SheetTrigger asChild>
					<Button variant="ghost" size="sm">
						Extra Large
					</Button>
				</SheetTrigger>
				<SheetContent size="xl">
					<SheetHeader>
						<SheetTitle>Extra Large Sheet</SheetTitle>
						<SheetDescription>
							This is an extra large sheet (512px width).
						</SheetDescription>
					</SheetHeader>
					<div className="flex-1 p-4">
						<p className="text-sm text-foreground/70">
							Wide content for extra large sheet.
						</p>
					</div>
				</SheetContent>
			</Sheet>
		</div>
	);
};

export const ResizableSheetDemo: React.FC = () => {
	return (
		<div className="my-6 flex gap-4">
			<Sheet>
				<SheetTrigger asChild>
					<Button variant="secondary">Resizable Sheet</Button>
				</SheetTrigger>
				<SheetContent resizable size="lg">
					<SheetHeader>
						<SheetTitle>Resizable Panel</SheetTitle>
						<SheetDescription>
							Drag the edge of the sheet to adjust its width.
						</SheetDescription>
					</SheetHeader>
					<div className="flex-1 space-y-3 p-4">
						<p className="text-sm text-foreground/70">
							Resizable sheets are great for side panels that need more room
							when working with complex forms or data views.
						</p>
						<div className="rounded-lg border border-border/60 bg-card p-3 text-xs text-foreground/70">
							Try dragging the divider to find the width that works for your
							layout.
						</div>
					</div>
					<SheetFooter>
						<SheetClose>Close</SheetClose>
						<Button>Save layout</Button>
					</SheetFooter>
				</SheetContent>
			</Sheet>
			<Sheet>
				<SheetTrigger asChild>
					<Button variant="secondary">Resizable / AllowShrink Sheet</Button>
				</SheetTrigger>
				<SheetContent resizable allowShrink size="lg">
					<SheetHeader>
						<SheetTitle>Resizable Panel</SheetTitle>
						<SheetDescription>
							Drag the edge of the sheet to adjust its width.
						</SheetDescription>
					</SheetHeader>
					<div className="flex-1 space-y-3 p-4">
						<p className="text-sm text-foreground/70">
							Resizable sheets are great for side panels that need more room
							when working with complex forms or data views.
						</p>
						<div className="rounded-lg border border-border/60 bg-card p-3 text-xs text-foreground/70">
							Try dragging the divider to find the width that works for your
							layout.
						</div>
					</div>
					<SheetFooter>
						<SheetClose>Close</SheetClose>
						<Button>Save layout</Button>
					</SheetFooter>
				</SheetContent>
			</Sheet>
		</div>
	);
};

export const FormSheetDemo: React.FC = () => {
	return (
		<div className="my-6">
			<Sheet>
				<SheetTrigger asChild>
					<Button>Edit Profile</Button>
				</SheetTrigger>
				<SheetContent>
					<SheetHeader>
						<SheetTitle>Edit Profile</SheetTitle>
						<SheetDescription>
							Make changes to your profile here. Click save when you're done.
						</SheetDescription>
					</SheetHeader>
					<div className="flex-1 space-y-4 p-4">
						<Input
							label="Name"
							placeholder="Enter your name"
							containerClassName="w-full"
							className="w-full"
						/>
						<Input
							label="Email"
							type="email"
							placeholder="Enter your email"
							containerClassName="w-full"
							className="w-full"
						/>
						<Input
							label="Username"
							placeholder="Enter your username"
							containerClassName="w-full"
							className="w-full"
						/>
						<div className="flex flex-col space-y-2">
							<div className="block text-sm font-medium text-foreground/70">
								Status
							</div>
							<div className="flex gap-2">
								<Badge variant="success">Active</Badge>
								<Badge variant="secondary">Premium</Badge>
							</div>
						</div>
					</div>
					<SheetFooter>
						<SheetClose>Cancel</SheetClose>
						<Button>Save Changes</Button>
					</SheetFooter>
				</SheetContent>
			</Sheet>
		</div>
	);
};

export const ControlledSheetDemo: React.FC = () => {
	const [open, setOpen] = React.useState(false);

	return (
		<div className="my-6 space-y-4">
			<div className="flex gap-2">
				<Button onClick={() => setOpen(true)}>Open Sheet (Controlled)</Button>
				<Button variant="secondary" onClick={() => setOpen(false)}>
					Close Sheet
				</Button>
				<Badge variant={open ? 'success' : 'secondary'}>
					{open ? 'Open' : 'Closed'}
				</Badge>
			</div>

			<Sheet open={open} onOpenChange={setOpen}>
				<SheetContent>
					<SheetHeader>
						<SheetTitle>Controlled Sheet</SheetTitle>
						<SheetDescription>
							This sheet is controlled by external state. You can open and close
							it programmatically.
						</SheetDescription>
					</SheetHeader>
					<div className="flex-1 p-4">
						<p className="text-sm text-foreground/70">
							This sheet's open state is managed by the parent component. You
							can control when it opens and closes from outside the Sheet
							component.
						</p>
						<div className="mt-4 rounded-lg bg-card p-3">
							<p className="font-mono text-xs text-foreground/70">
								Current state: {open ? 'open' : 'closed'}
							</p>
						</div>
					</div>
					<SheetFooter>
						<SheetClose>Close</SheetClose>
					</SheetFooter>
				</SheetContent>
			</Sheet>
		</div>
	);
};
