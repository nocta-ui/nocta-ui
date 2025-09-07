"use client";

import type React from "react";
import { Input } from "./input";

export const DefaultInputDemo: React.FC = () => {
	return (
		<div className="my-6">
			<Input placeholder="Enter your email" />
		</div>
	);
};

export const InputWithLabelDemo: React.FC = () => {
	return (
		<div className="my-6">
			<Input
				label="Email Address"
				placeholder="Enter your email"
				type="email"
			/>
		</div>
	);
};

export const InputWithHelperTextDemo: React.FC = () => {
	return (
		<div className="my-6">
			<Input
				label="Username"
				placeholder="Enter your username"
				helperText="Choose a unique username between 3-20 characters"
			/>
		</div>
	);
};

export const VariantsDemo: React.FC = () => {
	return (
		<div className="my-6 space-y-4">
			<Input
				label="Default Input"
				placeholder="Default variant"
				variant="default"
			/>
			<Input
				label="Error Input"
				placeholder="Error variant"
				variant="error"
				errorMessage="This field is required"
			/>
			<Input
				label="Success Input"
				placeholder="Success variant"
				variant="success"
				successMessage="Valid input"
			/>
		</div>
	);
};

export const SizesDemo: React.FC = () => {
	return (
		<div className="my-6 space-y-4">
			<Input label="Small Input" placeholder="Small size" size="sm" />
			<Input label="Medium Input" placeholder="Medium size" size="md" />
			<Input label="Large Input" placeholder="Large size" size="lg" />
		</div>
	);
};

export const LeftIconDemo: React.FC = () => {
	return (
		<div className="my-6 space-y-4">
			<Input
				label="Search"
				placeholder="Search for anything..."
				leftIcon={
					<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
				}
			/>
			<Input
				label="Email"
				placeholder="Enter your email"
				type="email"
				leftIcon={
					<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
						/>
					</svg>
				}
			/>
		</div>
	);
};

export const RightIconDemo: React.FC = () => {
	return (
		<div className="my-6 space-y-4">
			<Input
				label="Password"
				placeholder="Enter your password"
				type="password"
				rightIcon={
					<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
				}
			/>
		</div>
	);
};

export const DisabledStateDemo: React.FC = () => {
	return (
		<div className="my-6 space-y-4">
			<Input
				label="Disabled Input"
				placeholder="This input is disabled"
				disabled
			/>
			<Input
				label="Disabled with Icon"
				placeholder="Disabled with icon"
				disabled
				leftIcon={
					<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
						/>
					</svg>
				}
			/>
		</div>
	);
};

export const ReadOnlyStateDemo: React.FC = () => {
	return (
		<div className="my-6">
			<Input
				label="Read Only Input"
				value="This value cannot be changed"
				readOnly
				helperText="This field is read-only"
				className="w-56"
			/>
		</div>
	);
};

export const CustomContainerDemo: React.FC = () => {
	return (
		<div className="my-6">
			<Input
				containerClassName="max-w-xs mx-auto"
				className="text-center"
				label="Centered Input"
				placeholder="Centered text"
			/>
		</div>
	);
};
