"use client";

import type React from "react";
import { Textarea } from "./textarea";

export const DefaultTextareaDemo: React.FC = () => {
	return (
		<div className="my-6 w-96">
			<Textarea placeholder="Enter your message..." />
		</div>
	);
};

export const TextareaWithLabelDemo: React.FC = () => {
	return (
		<div className="my-6 w-96">
			<Textarea label="Message" placeholder="Type your message here..." />
		</div>
	);
};

export const TextareaWithHelperTextDemo: React.FC = () => {
	return (
		<div className="my-6 w-96">
			<Textarea
				label="Description"
				placeholder="Describe your project..."
				helperText="Provide a detailed description of your project goals and requirements"
			/>
		</div>
	);
};

export const VariantsDemo: React.FC = () => {
	return (
		<div className="my-6 space-y-4 w-96">
			<Textarea
				label="Default Textarea"
				placeholder="Default variant"
				variant="default"
			/>
			<Textarea
				label="Error Textarea"
				placeholder="Error variant"
				variant="error"
				errorMessage="Description is required"
			/>
			<Textarea
				label="Success Textarea"
				placeholder="Success variant"
				variant="success"
				successMessage="Description looks good!"
			/>
		</div>
	);
};

export const SizesDemo: React.FC = () => {
	return (
		<div className="my-6 space-y-4 w-96">
			<Textarea
				label="Small Textarea"
				placeholder="Small size"
				size="sm"
				rows={3}
			/>
			<Textarea
				label="Medium Textarea"
				placeholder="Medium size"
				size="md"
				rows={4}
			/>
			<Textarea
				label="Large Textarea"
				placeholder="Large size"
				size="lg"
				rows={5}
			/>
		</div>
	);
};

export const ResizeOptionsDemo: React.FC = () => {
	return (
		<div className="my-6 space-y-4 w-96">
			<Textarea
				label="No Resize"
				placeholder="This textarea cannot be resized"
				resize="none"
				helperText="Resize is disabled"
			/>
			<Textarea
				label="Vertical Resize Only"
				placeholder="This textarea can only be resized vertically"
				resize="vertical"
				helperText="Can be resized vertically"
			/>
			<Textarea
				label="Horizontal Resize Only"
				placeholder="This textarea can only be resized horizontally"
				resize="horizontal"
				helperText="Can be resized horizontally"
			/>
			<Textarea
				label="Both Directions"
				placeholder="This textarea can be resized in both directions"
				resize="both"
				helperText="Can be resized in both directions"
			/>
		</div>
	);
};

export const RowsDemo: React.FC = () => {
	return (
		<div className="my-6 space-y-4 w-96">
			<Textarea
				label="2 Rows"
				placeholder="Compact textarea with 2 rows"
				rows={2}
			/>
			<Textarea
				label="4 Rows (Default)"
				placeholder="Standard textarea with 4 rows"
				rows={4}
			/>
			<Textarea
				label="8 Rows"
				placeholder="Large textarea with 8 rows for longer content"
				rows={8}
			/>
		</div>
	);
};

export const DisabledStateDemo: React.FC = () => {
	return (
		<div className="my-6 space-y-4 w-96">
			<Textarea
				label="Disabled Textarea"
				placeholder="This textarea is disabled"
				disabled
			/>
			<Textarea
				label="Disabled with Value"
				value="This content cannot be edited"
				disabled
				helperText="This field is disabled"
			/>
		</div>
	);
};

export const ReadOnlyStateDemo: React.FC = () => {
	return (
		<div className="my-6 w-96">
			<Textarea
				label="Read Only Textarea"
				value="This content is read-only and cannot be modified by the user. It's useful for displaying pre-filled information that shouldn't be changed."
				readOnly
				helperText="This field is read-only"
				rows={3}
			/>
		</div>
	);
};

export const MaxLengthDemo: React.FC = () => {
	return (
		<div className="my-6 w-96">
			<Textarea
				label="Limited Character Count"
				placeholder="Type your bio (max 250 characters)..."
				maxLength={250}
				helperText="Maximum 250 characters allowed"
				rows={4}
			/>
		</div>
	);
};

export const CustomContainerDemo: React.FC = () => {
	return (
		<div className="my-6 w-96">
			<Textarea
				containerClassName="max-w-md flex flex-col items-center"
				label="Centered Textarea"
				placeholder="This textarea is centered with max width"
				helperText="Custom container styling applied"
			/>
		</div>
	);
};
