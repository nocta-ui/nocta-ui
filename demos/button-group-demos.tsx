'use client';

import * as React from 'react';
import {
	CaretDownIcon,
} from '@radix-ui/react-icons';

import { ButtonGroup, ButtonGroupItem } from '@/registry/ui/button-group';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/registry/ui/dropdown-menu';

export const BasicButtonGroupDemo: React.FC = () => {
	return (
		<div className="my-6 flex flex-col gap-4">
			<DropdownMenu>
				<ButtonGroup>
					<ButtonGroupItem>Overview</ButtonGroupItem>
					<ButtonGroupItem>Analytics</ButtonGroupItem>
					<ButtonGroupItem asChild>
						<DropdownMenuTrigger className="flex w-full items-center justify-center gap-1.5">
							<CaretDownIcon aria-hidden="true" className="size-4" />
						</DropdownMenuTrigger>
					</ButtonGroupItem>
				</ButtonGroup>
				<DropdownMenuContent>
					<DropdownMenuItem>Monthly report</DropdownMenuItem>
					<DropdownMenuItem>Quarterly breakdown</DropdownMenuItem>
					<DropdownMenuItem>Custom export…</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};


export const ButtonGroupSizesDemo: React.FC = () => {
	return (
		<div className="my-6 flex flex-col gap-4">
			<ButtonGroup size="sm">
				<ButtonGroupItem>Daily</ButtonGroupItem>
				<ButtonGroupItem>Weekly</ButtonGroupItem>
				<ButtonGroupItem>Monthly</ButtonGroupItem>
			</ButtonGroup>
			<ButtonGroup size="md">
				<ButtonGroupItem>Daily</ButtonGroupItem>
				<ButtonGroupItem>Weekly</ButtonGroupItem>
				<ButtonGroupItem>Monthly</ButtonGroupItem>
			</ButtonGroup>
			<ButtonGroup size="lg">
				<ButtonGroupItem>Daily</ButtonGroupItem>
				<ButtonGroupItem>Weekly</ButtonGroupItem>
				<ButtonGroupItem>Monthly</ButtonGroupItem>
			</ButtonGroup>
		</div>
	);
};
