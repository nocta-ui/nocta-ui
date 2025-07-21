"use client";

import type React from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./select";

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

export const SizesDemo: React.FC = () => {
	return (
		<div className="my-6 space-y-4">
			<div>
				<label className="block text-sm font-medium text-nocta-700 dark:text-nocta-300 mb-1.5">
					Small
				</label>
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
				<label className="block text-sm font-medium text-nocta-700 dark:text-nocta-300 mb-1.5">
					Medium
				</label>
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
				<label className="block text-sm font-medium text-nocta-700 dark:text-nocta-300 mb-1.5">
					Large
				</label>
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

export const DisabledStateDemo: React.FC = () => {
	return (
		<div className="my-6 space-y-4">
			<Select disabled>
				<SelectTrigger className="w-[180px]">
					<SelectValue placeholder="Disabled select" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="option1">Option 1</SelectItem>
					<SelectItem value="option2">Option 2</SelectItem>
				</SelectContent>
			</Select>

			<Select>
				<SelectTrigger className="w-[180px]">
					<SelectValue placeholder="Some disabled items" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="option1">Option 1</SelectItem>
					<SelectItem value="option2" disabled>
						Option 2 (disabled)
					</SelectItem>
					<SelectItem value="option3">Option 3</SelectItem>
					<SelectItem value="option4" disabled>
						Option 4 (disabled)
					</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
};
