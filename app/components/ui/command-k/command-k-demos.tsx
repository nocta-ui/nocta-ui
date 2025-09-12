"use client";

import React from "react";
import { Button } from "../button";
import { toast } from "../toast";
import { CommandK, type CommandKItem } from "./command-k";

const IconSearch = (
	<svg
		className="w-4 h-4"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="m21 21-4.35-4.35M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16z"
		/>
	</svg>
);

const IconFolder = (
	<svg
		className="w-4 h-4"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M3 7h5l2 2h11v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"
		/>
	</svg>
);

const IconFile = (
	<svg
		className="w-4 h-4"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
		/>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M14 2v6h6"
		/>
	</svg>
);

const IconCog = (
	<svg
		className="w-4 h-4"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
		/>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.65 1.65 0 0 0 15 19.4a1.65 1.65 0 0 0-1 .6 1.65 1.65 0 0 0-.33 1.82l-.03.08a2 2 0 1 1-3.28 0l-.03-.08A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82-.33l-.08.03a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-.6-1 1.65 1.65 0 0 0-1.82-.33l-.08.03a2 2 0 1 1 0-3.28l.08.03A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06A2 2 0 1 1 7.04 4.3l.06.06A1.65 1.65 0 0 0 9 4.6 1.65 1.65 0 0 0 10 4a1.65 1.65 0 0 0 .33-1.82l.03-.08a2 2 0 1 1 3.28 0l.03.08A1.65 1.65 0 0 0 15 4.6c.37 0 .72-.12 1.02-.32l.06-.06A2 2 0 1 1 18.9 7.04l-.06.06c-.2.3-.32.65-.32 1.02 0 .37.12.72.32 1.02l.06.06A2 2 0 1 1 19.7 15l-.06-.06a1.65 1.65 0 0 0-.24-.24z"
		/>
	</svg>
);

export const BasicCommandKDemo: React.FC = () => {
	const [open, setOpen] = React.useState(false);

	const items: CommandKItem[] = [
		{
			label: "Search docs",
			group: "Navigation",
			description: "Go to documentation",
			icon: IconSearch,
			shortcut: ["S"],
		},
		{
			label: "Open settings",
			group: "Navigation",
			description: "Application preferences",
			icon: IconCog,
			shortcut: ["O"],
		},
		{
			label: "New file",
			group: "Actions",
			description: "Create an untitled file",
			icon: IconFile,
			shortcut: ["Shift", "F"],
		},
		{
			label: "New folder",
			group: "Actions",
			description: "Create a folder",
			icon: IconFolder,
			shortcut: ["Shift", "G"],
		},
	];

	return (
		<div className="my-6 flex items-center gap-3">
			<Button onClick={() => setOpen(true)}>Open Command Palette</Button>
			<span className="text-sm text-primary-muted">Or press ⌘K / Ctrl+K</span>

			<CommandK
				items={items}
				open={open}
				onOpenChange={setOpen}
				size="lg"
				onSelect={(it) => {
					toast.success({
						title: "Command executed",
						description: `Selected: ${it.label}`,
					});
				}}
			/>
		</div>
	);
};
