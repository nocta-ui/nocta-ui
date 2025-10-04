'use client';

import type React from 'react';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from './select';

export const DefaultSelectDemo: React.FC = () => {
	return (
		<div className="my-6">
			<Select>
				<SelectTrigger className="w-[180px]">
					<SelectValue placeholder="Select a fruit" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="apple">Apple</SelectItem>
					<SelectItem value="banana">Banana</SelectItem>
					<SelectItem value="orange">Orange</SelectItem>
					<SelectItem value="grape">Grape</SelectItem>
					<SelectItem value="pineapple">Pineapple</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
};

export const VariantsDemo: React.FC = () => {
	return (
		<div className="my-6 space-y-6">
			<div className="flex flex-col space-y-2">
				<p className="text-sm font-medium text-foreground/70">Default</p>
				<Select variant="default">
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Default variant" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="apple">Apple</SelectItem>
						<SelectItem value="banana">Banana</SelectItem>
						<SelectItem value="orange">Orange</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div className="flex flex-col space-y-2">
				<p className="text-sm font-medium text-foreground/70">Error</p>
				<Select variant="error">
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Error variant" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="apple">Apple</SelectItem>
						<SelectItem value="banana">Banana</SelectItem>
						<SelectItem value="orange">Orange</SelectItem>
					</SelectContent>
				</Select>
				<p className="text-xs text-error/90">Please select an option</p>
			</div>

			<div className="flex flex-col space-y-2">
				<p className="text-sm font-medium text-foreground/70">Success</p>
				<Select variant="success" defaultValue="orange">
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Success variant" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="apple">Apple</SelectItem>
						<SelectItem value="banana">Banana</SelectItem>
						<SelectItem value="orange">Orange</SelectItem>
					</SelectContent>
				</Select>
				<p className="text-xs text-success/90">Looks good!</p>
			</div>
		</div>
	);
};

export const SizesDemo: React.FC = () => {
	return (
		<div className="my-6 space-y-4">
			<div>
				<p className="mb-1.5 block text-sm font-medium text-foreground/70">
					Small
				</p>
				<Select size="sm">
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Small select" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="option1">Option 1</SelectItem>
						<SelectItem value="option2">Option 2</SelectItem>
						<SelectItem value="option3">Option 3</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div>
				<p className="mb-1.5 block text-sm font-medium text-foreground/70">
					Medium
				</p>
				<Select size="md">
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Medium select" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="option1">Option 1</SelectItem>
						<SelectItem value="option2">Option 2</SelectItem>
						<SelectItem value="option3">Option 3</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div>
				<p className="mb-1.5 block text-sm font-medium text-foreground/70">
					Large
				</p>
				<Select size="lg">
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Large select" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="option1">Option 1</SelectItem>
						<SelectItem value="option2">Option 2</SelectItem>
						<SelectItem value="option3">Option 3</SelectItem>
					</SelectContent>
				</Select>
			</div>
		</div>
	);
};
