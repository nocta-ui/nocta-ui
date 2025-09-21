"use client";

import type React from "react";
import {
	EnvelopeClosedIcon,
	EyeOpenIcon,
	MagnifyingGlassIcon,
	PersonIcon,
} from "@radix-ui/react-icons";

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
				leftIcon={<MagnifyingGlassIcon aria-hidden="true" className="h-4 w-4" />}
			/>
			<Input
				label="Email"
				placeholder="Enter your email"
				type="email"
				leftIcon={<EnvelopeClosedIcon aria-hidden="true" className="h-4 w-4" />}
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
				rightIcon={<EyeOpenIcon aria-hidden="true" className="h-4 w-4" />}
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
				leftIcon={<PersonIcon aria-hidden="true" className="h-4 w-4" />}
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
