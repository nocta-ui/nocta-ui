'use client';

import type React from 'react';
import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

export const BasicPopoverDemo: React.FC = () => {
	return (
		<div className="my-6 flex justify-center">
			<Popover>
				<PopoverTrigger>Open Popover</PopoverTrigger>
				<PopoverContent>
					<div className="flex flex-col space-y-2">
						<h4 className="text-sm font-medium">About this feature</h4>
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
			<div className="flex justify-center gap-2">
				<button
					type="button"
					onClick={() => setOpen(true)}
					className="rounded border border-success/40 bg-success/10 px-3 py-1 text-sm text-success/90 duration-200 ease-in-out hover:opacity-80"
				>
					Open
				</button>
				<button
					type="button"
					onClick={() => setOpen(false)}
					className="rounded border border-error/40 bg-error/10 px-3 py-1 text-sm text-error/80 duration-200 ease-in-out hover:opacity-80"
				>
					Close
				</button>
				<span className="rounded bg-background px-3 py-1 text-sm text-foreground">
					State: {open ? 'Open' : 'Closed'}
				</span>
			</div>
			<div className="flex justify-center gap-4">
				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger>Controlled Popover</PopoverTrigger>
					<PopoverContent>
						<div className="flex flex-col space-y-2">
							<h4 className="text-sm font-medium">Controlled State</h4>
							<p className="text-sm text-foreground-muted">
								This popover&apos;s state is controlled externally.
							</p>
							<button
								type="button"
								onClick={() => setOpen(false)}
								className="rounded bg-background px-2 py-1 text-xs duration-200 ease-in-out hover:bg-foreground-muted/10"
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
