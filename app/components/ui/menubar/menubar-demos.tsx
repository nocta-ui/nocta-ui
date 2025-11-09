'use client';

import {
	CopyIcon,
	DotsHorizontalIcon,
	EnterIcon,
	FilePlusIcon,
	OpenInNewWindowIcon,
	ReloadIcon,
	ScissorsIcon,
	Share1Icon,
} from '@radix-ui/react-icons';
import { useState } from 'react';
import {
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarSeparator,
	MenubarSub,
	MenubarSubContent,
	MenubarSubTrigger,
	MenubarTrigger,
} from './menubar';

export const BasicMenubarDemo: React.FC = () => {
	const [lastAction, setLastAction] = useState<string>('No action selected');

	return (
		<div className="my-6 flex w-full max-w-2xl flex-col items-center gap-4">
			<Menubar>
				<MenubarMenu>
					<MenubarTrigger>File</MenubarTrigger>
					<MenubarContent>
						<MenubarItem onClick={() => setLastAction('New project')}>
							<FilePlusIcon aria-hidden="true" />
							New project
						</MenubarItem>
						<MenubarItem onClick={() => setLastAction('Open file')}>
							<OpenInNewWindowIcon
								aria-hidden="true"

							/>
							Open file
						</MenubarItem>
						<MenubarItem onClick={() => setLastAction('Save')}>
							<EnterIcon aria-hidden="true" />
							Save
						</MenubarItem>
						<MenubarSeparator />
						<MenubarSub>
							<MenubarSubTrigger>
								<Share1Icon aria-hidden="true" />
								Share
							</MenubarSubTrigger>
							<MenubarSubContent>
								<MenubarItem onClick={() => setLastAction('Share to email')}>
									Email
								</MenubarItem>
								<MenubarItem onClick={() => setLastAction('Share to teams')}>
									Teams
								</MenubarItem>
								<MenubarItem onClick={() => setLastAction('Copy link')}>
									Copy link
								</MenubarItem>
							</MenubarSubContent>
						</MenubarSub>
						<MenubarSeparator />
						<MenubarItem
							destructive
							onClick={() => setLastAction('Close window')}
						>
							Close window
						</MenubarItem>
					</MenubarContent>
				</MenubarMenu>

				<MenubarMenu>
					<MenubarTrigger>Edit</MenubarTrigger>
					<MenubarContent>
						<MenubarItem onClick={() => setLastAction('Undo')}>
							<ReloadIcon aria-hidden="true" />
							Undo
						</MenubarItem>
						<MenubarItem onClick={() => setLastAction('Redo')}>
							<ReloadIcon
								aria-hidden="true"
								className="mr-2 h-4 w-4 rotate-180"
							/>
							Redo
						</MenubarItem>
						<MenubarSeparator />
						<MenubarItem onClick={() => setLastAction('Cut')}>
							<ScissorsIcon aria-hidden="true" />
							Cut
						</MenubarItem>
						<MenubarItem onClick={() => setLastAction('Copy')}>
							<CopyIcon aria-hidden="true" />
							Copy
						</MenubarItem>
						<MenubarItem onClick={() => setLastAction('Paste')}>
							<DotsHorizontalIcon aria-hidden="true" />
							Paste
						</MenubarItem>
					</MenubarContent>
				</MenubarMenu>
			</Menubar>

			<p className="text-sm text-foreground/70">
				Last action: <span className="font-medium">{lastAction}</span>
			</p>
		</div>
	);
};

export const MenubarDisabledDemo: React.FC = () => {
	return (
		<div className="my-6 flex w-full max-w-2xl flex-col items-center gap-4">
			<Menubar>
				<MenubarMenu>
					<MenubarTrigger>File</MenubarTrigger>
					<MenubarContent>
						<MenubarItem>New file</MenubarItem>
						<MenubarItem disabled>Save (synced)</MenubarItem>
						<MenubarSeparator />
						<MenubarItem>Export</MenubarItem>
						<MenubarItem disabled>Close (background task)</MenubarItem>
					</MenubarContent>
				</MenubarMenu>

				<MenubarMenu>
					<MenubarTrigger disabled>Team</MenubarTrigger>
				</MenubarMenu>
			</Menubar>
		</div>
	);
};
