"use client";

import type React from "react";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export const BasicPopoverDemo: React.FC = () => {
	return (
		<div className="my-6 flex justify-center">
			<Popover>
				<PopoverTrigger>Open Popover</PopoverTrigger>
				<PopoverContent>
					<div className="flex flex-col space-y-2">
						<h4 className="font-medium text-sm">About this feature</h4>
						<p className="text-sm text-foreground-muted">
							This is a popover component that can contain any content you want.
						</p>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
};

export const ControlledDemo: React.FC = () => {
	const [open, setOpen] = useState(false);

	return (
		<div className="my-6 space-y-4">
			<div className="flex gap-2 justify-center">
				<button
					type="button"
					onClick={() => setOpen(true)}
					className="px-3 py-1 text-sm bg-success/10 border border-success/40 text-success/90 rounded hover:opacity-80 duration-200 ease-in-out"
				>
					Open
				</button>
				<button
					type="button"
					onClick={() => setOpen(false)}
					className="px-3 py-1 text-sm bg-error/10 border border-error/40 text-error/80 rounded hover:opacity-80 duration-200 ease-in-out"
				>
					Close
				</button>
				<span className="px-3 py-1 text-sm bg-background text-foreground rounded">
					State: {open ? "Open" : "Closed"}
				</span>
			</div>
			<div className="flex gap-4 justify-center">
				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger>Controlled Popover</PopoverTrigger>
					<PopoverContent>
						<div className="flex flex-col space-y-2">
							<h4 className="font-medium text-sm">Controlled State</h4>
							<p className="text-sm text-foreground-muted">
								This popover&apos;s state is controlled externally.
							</p>
							<button
								type="button"
								onClick={() => setOpen(false)}
								className="px-2 py-1 text-xs bg-background rounded hover:bg-foreground-muted/10 duration-200 ease-in-out"
							>
								Close from inside
							</button>
						</div>
					</PopoverContent>
				</Popover>
			</div>
		</div>
	);
};
