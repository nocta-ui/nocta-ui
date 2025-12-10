'use client';

import {
	BookmarkIcon,
	ClipboardIcon,
	CopyIcon,
	FileTextIcon,
	GearIcon,
	ImageIcon,
	Pencil1Icon,
	PlusIcon,
	ScissorsIcon,
	Share1Icon,
	StackIcon,
	TableIcon,
	TrashIcon,
	UploadIcon,
} from '@radix-ui/react-icons';
import type React from 'react';
import { useState } from 'react';
import { buttonVariants } from '@/registry/ui/button';
import { cn } from '@/lib/utils';
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
	ContextMenuTrigger,
} from '@/registry/ui/context-menu';

export const BasicContextMenuDemo: React.FC = () => {
	const [lastAction, setLastAction] = useState<string>('');

	return (
		<div className="my-6 flex w-full max-w-md flex-col items-center justify-center space-y-4">
			<ContextMenu>
				<ContextMenuTrigger
					className={cn(buttonVariants({ variant: 'secondary', size: 'md' }))}
				>
					Right-click here
				</ContextMenuTrigger>
				<ContextMenuContent>
					<ContextMenuItem onClick={() => setLastAction('Cut')}>
						<ScissorsIcon aria-hidden="true" />
						Cut
					</ContextMenuItem>
					<ContextMenuItem onClick={() => setLastAction('Copy')}>
						<CopyIcon aria-hidden="true" />
						Copy
					</ContextMenuItem>
					<ContextMenuItem onClick={() => setLastAction('Paste')}>
						<ClipboardIcon aria-hidden="true" />
						Paste
					</ContextMenuItem>
				</ContextMenuContent>
			</ContextMenu>

			{lastAction && (
				<div className="text-center text-sm text-foreground/70">
					Last action: <span className="font-medium">{lastAction}</span>
				</div>
			)}
		</div>
	);
};

export const ContextMenuWithSeparatorDemo: React.FC = () => {
	return (
		<div className="my-6 flex w-full max-w-md flex-col items-center justify-center space-y-4">
			<ContextMenu>
				<ContextMenuTrigger
					className={cn(buttonVariants({ variant: 'secondary', size: 'md' }))}
				>
					Right-click for menu with separators
				</ContextMenuTrigger>
				<ContextMenuContent>
					<ContextMenuItem>
						<Pencil1Icon aria-hidden="true" />
						Edit
					</ContextMenuItem>
					<ContextMenuItem>
						<StackIcon aria-hidden="true" />
						Duplicate
					</ContextMenuItem>

					<ContextMenuSeparator />

					<ContextMenuItem>
						<BookmarkIcon aria-hidden="true" />
						Bookmark
					</ContextMenuItem>
					<ContextMenuItem>
						<Share1Icon aria-hidden="true" />
						Share
					</ContextMenuItem>

					<ContextMenuSeparator />

					<ContextMenuItem destructive>
						<TrashIcon aria-hidden="true" />
						Delete
					</ContextMenuItem>
				</ContextMenuContent>
			</ContextMenu>
		</div>
	);
};

export const ContextMenuWithSubmenuDemo: React.FC = () => {
	return (
		<div className="my-6 flex w-full max-w-md flex-col items-center justify-center space-y-4">
			<ContextMenu>
				<ContextMenuTrigger
					className={cn(buttonVariants({ variant: 'secondary', size: 'md' }))}
				>
					Right-click for submenu example
				</ContextMenuTrigger>
				<ContextMenuContent>
					<ContextMenuItem>
						<PlusIcon aria-hidden="true" />
						New
					</ContextMenuItem>

					<ContextMenuSub>
						<ContextMenuSubTrigger>
							<UploadIcon aria-hidden="true" />
							Export As
						</ContextMenuSubTrigger>
						<ContextMenuSubContent>
							<ContextMenuItem>
								<FileTextIcon aria-hidden="true" />
								PDF
							</ContextMenuItem>
							<ContextMenuItem>
								<TableIcon aria-hidden="true" />
								Excel
							</ContextMenuItem>
							<ContextMenuItem>
								<ImageIcon aria-hidden="true" />
								Image
							</ContextMenuItem>
						</ContextMenuSubContent>
					</ContextMenuSub>

					<ContextMenuSeparator />

					<ContextMenuItem>
						<GearIcon aria-hidden="true" />
						Settings
					</ContextMenuItem>
				</ContextMenuContent>
			</ContextMenu>
		</div>
	);
};

export const DisabledContextMenuDemo: React.FC = () => {
	return (
		<div className="my-6 flex w-full max-w-md flex-col items-center justify-center space-y-4">
			<div className="space-y-4">
				<ContextMenu>
					<ContextMenuTrigger
						disabled
						className={cn(buttonVariants({ variant: 'secondary', size: 'md' }))}
					>
						Context menu disabled
					</ContextMenuTrigger>
					<ContextMenuContent>
						<ContextMenuItem>This won't show</ContextMenuItem>
					</ContextMenuContent>
				</ContextMenu>

				<ContextMenu>
					<ContextMenuTrigger
						className={cn(buttonVariants({ variant: 'secondary', size: 'md' }))}
					>
						Context menu with some items disabled
					</ContextMenuTrigger>
					<ContextMenuContent>
						<ContextMenuItem>Available Item</ContextMenuItem>
						<ContextMenuItem disabled>Disabled Item</ContextMenuItem>
						<ContextMenuSeparator />
						<ContextMenuItem>Another Available Item</ContextMenuItem>
						<ContextMenuItem disabled>Another Disabled Item</ContextMenuItem>
					</ContextMenuContent>
				</ContextMenu>
			</div>
		</div>
	);
};
