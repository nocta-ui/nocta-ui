'use client';

import React from 'react';
import { Button } from '@nocta/registry/ui/button';
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetSurface,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@nocta/registry/ui/sheet';

export const BasicSheetDemo: React.FC = () => {
	return (
		<div className="my-6">
			<Sheet>
				<SheetTrigger asChild>
					<Button>Open Sheet</Button>
				</SheetTrigger>
				<SheetSurface>
					<SheetHeader>
						<SheetTitle>Sheet Title</SheetTitle>
						<SheetDescription>This is a basic sheet panel.</SheetDescription>
					</SheetHeader>
					<SheetContent>
						<p className="text-sm text-foreground/70">
							Sheet content goes here. You can add any components or content you
							need.
						</p>
					</SheetContent>
					<SheetFooter>
						<SheetClose>Close</SheetClose>
					</SheetFooter>
				</SheetSurface>
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
				<SheetSurface side="left">
					<SheetHeader>
						<SheetTitle>Left Sheet</SheetTitle>
						<SheetDescription>
							This sheet slides in from the left side.
						</SheetDescription>
					</SheetHeader>
					<SheetContent>
						<p className="text-sm text-foreground/70">
							Content for left-side sheet.
						</p>
					</SheetContent>
				</SheetSurface>
			</Sheet>

			<Sheet>
				<SheetTrigger asChild>
					<Button variant="secondary">Right Side</Button>
				</SheetTrigger>
				<SheetSurface side="right">
					<SheetHeader>
						<SheetTitle>Right Sheet</SheetTitle>
						<SheetDescription>
							This sheet slides in from the right side.
						</SheetDescription>
					</SheetHeader>
					<SheetContent>
						<p className="text-sm text-foreground/70">
							Content for right-side sheet.
						</p>
					</SheetContent>
				</SheetSurface>
			</Sheet>

			<Sheet>
				<SheetTrigger asChild>
					<Button variant="secondary">Top Side</Button>
				</SheetTrigger>
				<SheetSurface side="top">
					<SheetHeader>
						<SheetTitle>Top Sheet</SheetTitle>
						<SheetDescription>
							This sheet slides in from the top.
						</SheetDescription>
					</SheetHeader>
					<SheetContent>
						<p className="text-sm text-foreground/70">Content for top sheet.</p>
					</SheetContent>
				</SheetSurface>
			</Sheet>

			<Sheet>
				<SheetTrigger asChild>
					<Button variant="secondary">Bottom Side</Button>
				</SheetTrigger>
				<SheetSurface side="bottom">
					<SheetHeader>
						<SheetTitle>Bottom Sheet</SheetTitle>
						<SheetDescription>
							This sheet slides in from the bottom.
						</SheetDescription>
					</SheetHeader>
					<SheetContent>
						<p className="text-sm text-foreground/70">
							Content for bottom sheet.
						</p>
					</SheetContent>
				</SheetSurface>
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
				<SheetSurface size="sm">
					<SheetHeader>
						<SheetTitle>Small Sheet</SheetTitle>
						<SheetDescription>
							This is a small-sized sheet (320px width).
						</SheetDescription>
					</SheetHeader>
					<SheetContent>
						<p className="text-sm text-foreground/70">
							Compact content for small sheet.
						</p>
					</SheetContent>
				</SheetSurface>
			</Sheet>

			<Sheet>
				<SheetTrigger asChild>
					<Button variant="ghost" size="sm">
						Medium
					</Button>
				</SheetTrigger>
				<SheetSurface size="md">
					<SheetHeader>
						<SheetTitle>Medium Sheet</SheetTitle>
						<SheetDescription>
							This is a medium-sized sheet (384px width).
						</SheetDescription>
					</SheetHeader>
					<SheetContent>
						<p className="text-sm text-foreground/70">
							Standard content for medium sheet.
						</p>
					</SheetContent>
				</SheetSurface>
			</Sheet>

			<Sheet>
				<SheetTrigger asChild>
					<Button variant="ghost" size="sm">
						Large
					</Button>
				</SheetTrigger>
				<SheetSurface size="lg">
					<SheetHeader>
						<SheetTitle>Large Sheet</SheetTitle>
						<SheetDescription>
							This is a large-sized sheet (448px width).
						</SheetDescription>
					</SheetHeader>
					<SheetContent>
						<p className="text-sm text-foreground/70">
							Expanded content for large sheet.
						</p>
					</SheetContent>
				</SheetSurface>
			</Sheet>

			<Sheet>
				<SheetTrigger asChild>
					<Button variant="ghost" size="sm">
						Extra Large
					</Button>
				</SheetTrigger>
				<SheetSurface size="xl">
					<SheetHeader>
						<SheetTitle>Extra Large Sheet</SheetTitle>
						<SheetDescription>
							This is an extra large sheet (512px width).
						</SheetDescription>
					</SheetHeader>
					<SheetContent>
						<p className="text-sm text-foreground/70">
							Wide content for extra large sheet.
						</p>
					</SheetContent>
				</SheetSurface>
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
				<SheetSurface resizable size="lg">
					<SheetHeader>
						<SheetTitle>Resizable Panel</SheetTitle>
						<SheetDescription>
							Drag the edge of the sheet to adjust its width.
						</SheetDescription>
					</SheetHeader>
					<SheetContent className="space-y-3">
						<p className="text-sm text-foreground/70">
							Resizable sheets are great for side panels that need more room
							when working with complex forms or data views.
						</p>
						<div className="rounded-lg border border-border/60 bg-card p-3 text-xs text-foreground/70">
							Try dragging the divider to find the width that works for your
							layout.
						</div>
					</SheetContent>
					<SheetFooter>
						<SheetClose>Close</SheetClose>
						<Button>Save layout</Button>
					</SheetFooter>
				</SheetSurface>
			</Sheet>
			<Sheet>
				<SheetTrigger asChild>
					<Button variant="secondary">Resizable / AllowShrink Sheet</Button>
				</SheetTrigger>
				<SheetSurface resizable allowShrink size="lg">
					<SheetHeader>
						<SheetTitle>Resizable Panel</SheetTitle>
						<SheetDescription>
							Drag the edge of the sheet to adjust its width.
						</SheetDescription>
					</SheetHeader>
					<SheetContent className="space-y-3">
						<p className="text-sm text-foreground/70">
							Resizable sheets are great for side panels that need more room
							when working with complex forms or data views.
						</p>
						<div className="rounded-lg border border-border/60 bg-card p-3 text-xs text-foreground/70">
							Try dragging the divider to find the width that works for your
							layout.
						</div>
					</SheetContent>
					<SheetFooter>
						<SheetClose>Close</SheetClose>
						<Button>Save layout</Button>
					</SheetFooter>
				</SheetSurface>
			</Sheet>
		</div>
	);
};
