'use client';

import type React from 'react';
import {
	Popover,
	PopoverContent,
	PopoverDescription,
	PopoverHeading,
	PopoverTrigger,
} from '@nocta/registry/ui/popover';

export const BasicPopoverDemo: React.FC = () => {
	return (
		<div className="my-6 flex justify-center">
			<Popover>
				<PopoverTrigger>Open Popover</PopoverTrigger>
				<PopoverContent>
					<div className="flex flex-col space-y-1 max-w-xs">
						<PopoverHeading>About this feature</PopoverHeading>
						<PopoverDescription>
							This is a popover component that can contain any content you want.
						</PopoverDescription>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
};
