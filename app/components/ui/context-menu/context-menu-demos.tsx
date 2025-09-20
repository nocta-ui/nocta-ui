"use client";

import type React from "react";
import { useState } from "react";
import { buttonVariants } from "@/app/components/ui/button";
import { cn } from "@/lib/utils";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
	ContextMenuTrigger,
} from "./context-menu";

export const BasicContextMenuDemo: React.FC = () => {
	const [lastAction, setLastAction] = useState<string>("");

	return (
		<div className="my-6 w-full max-w-md flex flex-col justify-center items-center space-y-4">
			<div className="text-sm text-primary-muted text-center">
				Right-click on the area below to open the context menu
			</div>

			<ContextMenu>
				<ContextMenuTrigger
					className={cn(buttonVariants({ variant: "secondary", size: "md" }))}
				>
					Right-click here
				</ContextMenuTrigger>
				<ContextMenuContent>
					<ContextMenuItem onClick={() => setLastAction("Cut")}>
						<svg
							className="w-4 h-4 mr-2"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z"
							/>
						</svg>
						Cut
					</ContextMenuItem>
					<ContextMenuItem onClick={() => setLastAction("Copy")}>
						<svg
							className="w-4 h-4 mr-2"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
							/>
						</svg>
						Copy
					</ContextMenuItem>
					<ContextMenuItem onClick={() => setLastAction("Paste")}>
						<svg
							className="w-4 h-4 mr-2"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
							/>
						</svg>
						Paste
					</ContextMenuItem>
				</ContextMenuContent>
			</ContextMenu>

			{lastAction && (
				<div className="text-sm text-primary-muted text-center">
					Last action: <span className="font-medium">{lastAction}</span>
				</div>
			)}
		</div>
	);
};

export const ContextMenuWithSeparatorDemo: React.FC = () => {
	return (
		<div className="my-6 w-full max-w-md flex flex-col justify-center items-center space-y-4">
			<div className="text-sm text-primary-muted text-center">
				Context menu with separators
			</div>

			<ContextMenu>
				<ContextMenuTrigger
					className={cn(buttonVariants({ variant: "secondary", size: "md" }))}
				>
					Right-click for menu with separators
				</ContextMenuTrigger>
				<ContextMenuContent>
					<ContextMenuItem>
						<svg
							className="w-4 h-4 mr-2"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
							/>
						</svg>
						Edit
					</ContextMenuItem>
					<ContextMenuItem>
						<svg
							className="w-4 h-4 mr-2"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
							/>
						</svg>
						Duplicate
					</ContextMenuItem>

					<ContextMenuSeparator />

					<ContextMenuItem>
						<svg
							className="w-4 h-4 mr-2"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
							/>
						</svg>
						Bookmark
					</ContextMenuItem>
					<ContextMenuItem>
						<svg
							className="w-4 h-4 mr-2"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
							/>
						</svg>
						Share
					</ContextMenuItem>

					<ContextMenuSeparator />

					<ContextMenuItem destructive>
						<svg
							className="w-4 h-4 mr-2"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
							/>
						</svg>
						Delete
					</ContextMenuItem>
				</ContextMenuContent>
			</ContextMenu>
		</div>
	);
};

export const ContextMenuWithSubmenuDemo: React.FC = () => {
	return (
		<div className="my-6 w-full max-w-md flex flex-col justify-center items-center space-y-4">
			<div className="text-sm text-primary-muted text-center">
				Context menu with submenu
			</div>

			<ContextMenu>
				<ContextMenuTrigger
					className={cn(buttonVariants({ variant: "secondary", size: "md" }))}
				>
					Right-click for submenu example
				</ContextMenuTrigger>
				<ContextMenuContent>
					<ContextMenuItem>
						<svg
							className="w-4 h-4 mr-2"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 6v6m0 0v6m0-6h6m-6 0H6"
							/>
						</svg>
						New
					</ContextMenuItem>

					<ContextMenuSub>
						<ContextMenuSubTrigger>
							<svg
								className="w-4 h-4 mr-2"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
								/>
							</svg>
							Export As
						</ContextMenuSubTrigger>
						<ContextMenuSubContent>
							<ContextMenuItem>
								<svg
									className="w-4 h-4 mr-2"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									aria-hidden="true"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
									/>
								</svg>
								PDF
							</ContextMenuItem>
							<ContextMenuItem>
								<svg
									className="w-4 h-4 mr-2"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									aria-hidden="true"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
									/>
								</svg>
								Excel
							</ContextMenuItem>
							<ContextMenuItem>
								<svg
									className="w-4 h-4 mr-2"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									aria-hidden="true"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
									/>
								</svg>
								Image
							</ContextMenuItem>
						</ContextMenuSubContent>
					</ContextMenuSub>

					<ContextMenuSeparator />

					<ContextMenuItem>
						<svg
							className="w-4 h-4 mr-2"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
							/>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
							/>
						</svg>
						Settings
					</ContextMenuItem>
				</ContextMenuContent>
			</ContextMenu>
		</div>
	);
};

export const DisabledContextMenuDemo: React.FC = () => {
	return (
		<div className="my-6 w-full max-w-md flex flex-col justify-center items-center space-y-4">
			<div className="text-sm text-primary-muted text-center">
				Disabled context menu and items
			</div>

			<div className="space-y-4">
				<ContextMenu>
					<ContextMenuTrigger
						disabled
						className={cn(buttonVariants({ variant: "secondary", size: "md" }))}
					>
						Context menu disabled
					</ContextMenuTrigger>
					<ContextMenuContent>
						<ContextMenuItem>This won't show</ContextMenuItem>
					</ContextMenuContent>
				</ContextMenu>

				<ContextMenu>
					<ContextMenuTrigger
						className={cn(buttonVariants({ variant: "secondary", size: "md" }))}
					>
						Some items disabled
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

export const FileContextMenuDemo: React.FC = () => {
	const [files] = useState([
		{ name: "document.pdf", type: "pdf", size: "2.4 MB" },
		{ name: "image.jpg", type: "image", size: "1.8 MB" },
		{ name: "project.zip", type: "archive", size: "15.2 MB" },
	]);

	const getFileIcon = (type: string) => {
		switch (type) {
			case "pdf":
				return (
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
					/>
				);
			case "image":
				return (
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
					/>
				);
			case "archive":
				return (
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"
					/>
				);
			default:
				return (
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
					/>
				);
		}
	};

	return (
		<div className="my-6 w-full max-w-md mx-auto space-y-4">
			<div className="text-sm text-primary-muted text-center">
				File manager context menu example
			</div>

			<div className="flex flex-col space-y-2">
				{files.map((file, index) => (
					<ContextMenu key={index}>
						<ContextMenuTrigger>
							<div className="flex items-center gap-3 p-3 border border-border rounded-md bg-background transition-all duration-200 ease-in-out cursor-context-menu">
								<svg
									className="w-5 h-5 text-foreground-subtle"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									aria-hidden="true"
								>
									{getFileIcon(file.type)}
								</svg>
								<div className="flex-1 min-w-0">
									<div className="text-sm font-medium text-foreground truncate">
										{file.name}
									</div>
									<div className="text-xs text-foreground-subtle">
										{file.size}
									</div>
								</div>
							</div>
						</ContextMenuTrigger>
						<ContextMenuContent>
							<ContextMenuItem>
								<svg
									className="w-4 h-4 mr-2"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									aria-hidden="true"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
									/>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
									/>
								</svg>
								Open
							</ContextMenuItem>
							<ContextMenuItem>
								<svg
									className="w-4 h-4 mr-2"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									aria-hidden="true"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
									/>
								</svg>
								Rename
							</ContextMenuItem>
							<ContextMenuSeparator />
							<ContextMenuItem>
								<svg
									aria-hidden="true"
									className="w-4 h-4 mr-2"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
									/>
								</svg>
								Copy
							</ContextMenuItem>
							<ContextMenuItem>
								<svg
									aria-hidden="true"
									className="w-4 h-4 mr-2"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
									/>
								</svg>
								Share
							</ContextMenuItem>
							<ContextMenuSeparator />
							<ContextMenuItem>
								<svg
									aria-hidden="true"
									className="w-4 h-4 mr-2"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
									/>
								</svg>
								Properties
							</ContextMenuItem>
						</ContextMenuContent>
					</ContextMenu>
				))}
			</div>
		</div>
	);
};
