'use client';

import {
	BookmarkIcon,
	CardStackIcon,
	FileTextIcon,
	GearIcon,
	ImageIcon,
	Pencil1Icon,
	PersonIcon,
	PlusIcon,
	Share1Icon,
	StackIcon,
	TableIcon,
	TrashIcon,
	UploadIcon,
} from '@radix-ui/react-icons';
import type React from 'react';
import { useState } from 'react';

import { buttonVariants } from '@nocta/registry/ui/button';
import { cn } from '@/lib/utils';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from '@nocta/registry/ui/dropdown-menu';

export const BasicDropdownMenuDemo: React.FC = () => {
	const [lastAction, setLastAction] = useState<string>('');

	return (
		<div className="my-6 flex w-full max-w-md flex-col items-center justify-center space-y-4">
			<DropdownMenu>
				<DropdownMenuTrigger
					className={cn(buttonVariants({ variant: 'secondary', size: 'md' }))}
				>
					Open dropdown
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem onClick={() => setLastAction('Profile')}>
						<PersonIcon aria-hidden="true" />
						Profile
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setLastAction('Billing')}>
						<CardStackIcon aria-hidden="true" />
						Billing
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setLastAction('Settings')}>
						<GearIcon aria-hidden="true" />
						Settings
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			{lastAction && (
				<div className="text-center text-sm text-foreground/70">
					Last action: <span className="font-medium">{lastAction}</span>
				</div>
			)}
		</div>
	);
};

export const DropdownMenuWithSeparatorDemo: React.FC = () => {
	return (
		<div className="my-6 flex w-full max-w-md flex-col items-center justify-center space-y-4">
			<DropdownMenu>
				<DropdownMenuTrigger
					className={cn(buttonVariants({ variant: 'secondary', size: 'md' }))}
				>
					Open menu with separators
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem>
						<Pencil1Icon aria-hidden="true" />
						Edit
					</DropdownMenuItem>
					<DropdownMenuItem>
						<StackIcon aria-hidden="true" />
						Duplicate
					</DropdownMenuItem>

					<DropdownMenuSeparator />

					<DropdownMenuItem>
						<BookmarkIcon aria-hidden="true" />
						Bookmark
					</DropdownMenuItem>
					<DropdownMenuItem>
						<Share1Icon aria-hidden="true" />
						Share
					</DropdownMenuItem>

					<DropdownMenuSeparator />

					<DropdownMenuItem destructive>
						<TrashIcon aria-hidden="true" />
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};

export const DropdownMenuWithSubmenuDemo: React.FC = () => {
	return (
		<div className="my-6 flex w-full max-w-md flex-col items-center justify-center space-y-4">
			<DropdownMenu>
				<DropdownMenuTrigger
					className={cn(buttonVariants({ variant: 'secondary', size: 'md' }))}
				>
					Open submenu example
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem>
						<PlusIcon aria-hidden="true" />
						New item
					</DropdownMenuItem>

					<DropdownMenuSub>
						<DropdownMenuSubTrigger>
							<UploadIcon aria-hidden="true" />
							Export as
						</DropdownMenuSubTrigger>
						<DropdownMenuSubContent>
							<DropdownMenuItem>
								<FileTextIcon aria-hidden="true" />
								PDF
							</DropdownMenuItem>
							<DropdownMenuItem>
								<TableIcon aria-hidden="true" />
								Excel
							</DropdownMenuItem>
							<DropdownMenuItem>
								<ImageIcon aria-hidden="true" />
								Image
							</DropdownMenuItem>
						</DropdownMenuSubContent>
					</DropdownMenuSub>

					<DropdownMenuSeparator />

					<DropdownMenuItem>
						<GearIcon aria-hidden="true" />
						Preferences
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};

export const DisabledDropdownMenuDemo: React.FC = () => {
	return (
		<div className="my-6 flex w-full max-w-md flex-col items-center justify-center space-y-4">
			<div className="space-y-4">
				<DropdownMenu>
					<DropdownMenuTrigger
						disabled
						className={cn(buttonVariants({ variant: 'secondary', size: 'md' }))}
					>
						Dropdown disabled
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem>This will not show</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>

				<DropdownMenu>
					<DropdownMenuTrigger
						className={cn(buttonVariants({ variant: 'secondary', size: 'md' }))}
					>
						Partially disabled items
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem>Enabled item</DropdownMenuItem>
						<DropdownMenuItem disabled>Disabled item</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>Another enabled item</DropdownMenuItem>
						<DropdownMenuItem disabled>Another disabled item</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
};
