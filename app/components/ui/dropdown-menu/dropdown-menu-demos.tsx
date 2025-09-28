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

import { buttonVariants } from '@/app/components/ui/button';
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
} from './dropdown-menu';

export const BasicDropdownMenuDemo: React.FC = () => {
	const [lastAction, setLastAction] = useState<string>('');

	return (
		<div className="my-6 flex w-full max-w-md flex-col items-center justify-center space-y-4">
			<div className="text-center text-sm text-foreground-muted">
				Click the button below to open the dropdown menu
			</div>

			<DropdownMenu>
				<DropdownMenuTrigger
					className={cn(buttonVariants({ variant: 'secondary', size: 'md' }))}
				>
					Open dropdown
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem onClick={() => setLastAction('Profile')}>
						<PersonIcon aria-hidden="true" className="mr-2 h-4 w-4" />
						Profile
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setLastAction('Billing')}>
						<CardStackIcon aria-hidden="true" className="mr-2 h-4 w-4" />
						Billing
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setLastAction('Settings')}>
						<GearIcon aria-hidden="true" className="mr-2 h-4 w-4" />
						Settings
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			{lastAction && (
				<div className="text-center text-sm text-foreground-muted">
					Last action: <span className="font-medium">{lastAction}</span>
				</div>
			)}
		</div>
	);
};

export const DropdownMenuWithSeparatorDemo: React.FC = () => {
	return (
		<div className="my-6 flex w-full max-w-md flex-col items-center justify-center space-y-4">
			<div className="text-center text-sm text-foreground-muted">
				Dropdown menu with separators
			</div>

			<DropdownMenu>
				<DropdownMenuTrigger
					className={cn(buttonVariants({ variant: 'secondary', size: 'md' }))}
				>
					Open menu with separators
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem>
						<Pencil1Icon aria-hidden="true" className="mr-2 h-4 w-4" />
						Edit
					</DropdownMenuItem>
					<DropdownMenuItem>
						<StackIcon aria-hidden="true" className="mr-2 h-4 w-4" />
						Duplicate
					</DropdownMenuItem>

					<DropdownMenuSeparator />

					<DropdownMenuItem>
						<BookmarkIcon aria-hidden="true" className="mr-2 h-4 w-4" />
						Bookmark
					</DropdownMenuItem>
					<DropdownMenuItem>
						<Share1Icon aria-hidden="true" className="mr-2 h-4 w-4" />
						Share
					</DropdownMenuItem>

					<DropdownMenuSeparator />

					<DropdownMenuItem destructive>
						<TrashIcon aria-hidden="true" className="mr-2 h-4 w-4" />
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
			<div className="text-center text-sm text-foreground-muted">
				Dropdown menu with submenu
			</div>

			<DropdownMenu>
				<DropdownMenuTrigger
					className={cn(buttonVariants({ variant: 'secondary', size: 'md' }))}
				>
					Open submenu example
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem>
						<PlusIcon aria-hidden="true" className="mr-2 h-4 w-4" />
						New item
					</DropdownMenuItem>

					<DropdownMenuSub>
						<DropdownMenuSubTrigger>
							<UploadIcon aria-hidden="true" className="mr-2 h-4 w-4" />
							Export as
						</DropdownMenuSubTrigger>
						<DropdownMenuSubContent>
							<DropdownMenuItem>
								<FileTextIcon aria-hidden="true" className="mr-2 h-4 w-4" />
								PDF
							</DropdownMenuItem>
							<DropdownMenuItem>
								<TableIcon aria-hidden="true" className="mr-2 h-4 w-4" />
								Excel
							</DropdownMenuItem>
							<DropdownMenuItem>
								<ImageIcon aria-hidden="true" className="mr-2 h-4 w-4" />
								Image
							</DropdownMenuItem>
						</DropdownMenuSubContent>
					</DropdownMenuSub>

					<DropdownMenuSeparator />

					<DropdownMenuItem>
						<GearIcon aria-hidden="true" className="mr-2 h-4 w-4" />
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
			<div className="text-center text-sm text-foreground-muted">
				Disabled dropdown menu and items
			</div>

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
