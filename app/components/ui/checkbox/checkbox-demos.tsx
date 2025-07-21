"use client";

import type React from "react";
import { useState } from "react";
import { Checkbox } from "./checkbox";

export const BasicCheckboxDemo: React.FC = () => {
	const [isChecked, setIsChecked] = useState(false);

	return <Checkbox checked={isChecked} onCheckedChange={setIsChecked} />;
};

export const VariantsDemo: React.FC = () => {
	const [states, setStates] = useState({
		default: true,
		success: true,
		warning: true,
		destructive: true,
	});

	const handleChange = (variant: keyof typeof states) => (checked: boolean) => {
		setStates((prev) => ({ ...prev, [variant]: checked }));
	};

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-3">
				<Checkbox
					variant="default"
					checked={states.default}
					onCheckedChange={handleChange("default")}
				/>
				<span className="text-sm">Default</span>
			</div>
			<div className="flex items-center gap-3">
				<Checkbox
					variant="success"
					checked={states.success}
					onCheckedChange={handleChange("success")}
				/>
				<span className="text-sm">Success</span>
			</div>
			<div className="flex items-center gap-3">
				<Checkbox
					variant="warning"
					checked={states.warning}
					onCheckedChange={handleChange("warning")}
				/>
				<span className="text-sm">Warning</span>
			</div>
			<div className="flex items-center gap-3">
				<Checkbox
					variant="destructive"
					checked={states.destructive}
					onCheckedChange={handleChange("destructive")}
				/>
				<span className="text-sm">Destructive</span>
			</div>
		</div>
	);
};

export const SizesDemo: React.FC = () => {
	const [states, setStates] = useState({
		sm: true,
		md: true,
		lg: true,
	});

	const handleChange = (size: keyof typeof states) => (checked: boolean) => {
		setStates((prev) => ({ ...prev, [size]: checked }));
	};

	return (
		<div className="flex items-center gap-6">
			<div className="flex items-center gap-2">
				<Checkbox
					size="sm"
					checked={states.sm}
					onCheckedChange={handleChange("sm")}
				/>
				<span className="text-sm">Small</span>
			</div>
			<div className="flex items-center gap-2">
				<Checkbox
					size="md"
					checked={states.md}
					onCheckedChange={handleChange("md")}
				/>
				<span className="text-sm">Medium</span>
			</div>
			<div className="flex items-center gap-2">
				<Checkbox
					size="lg"
					checked={states.lg}
					onCheckedChange={handleChange("lg")}
				/>
				<span className="text-sm">Large</span>
			</div>
		</div>
	);
};

export const FormDemo: React.FC = () => {
	const [formData, setFormData] = useState({
		terms: false,
		newsletter: true,
		notifications: false,
	});

	const handleChange = (field: keyof typeof formData) => (checked: boolean) => {
		setFormData((prev) => ({ ...prev, [field]: checked }));
	};

	return (
		<div className="space-y-4 p-4 border rounded-lg dark:border-nocta-700">
			<h3 className="font-medium not-prose">Account Settings</h3>
			<div className="space-y-3">
				<div className="flex items-center gap-3">
					<Checkbox
						checked={formData.terms}
						onCheckedChange={handleChange("terms")}
						variant="default"
					/>
					<label className="text-sm cursor-pointer">
						I agree to the terms and conditions
					</label>
				</div>
				<div className="flex items-center gap-3">
					<Checkbox
						checked={formData.newsletter}
						onCheckedChange={handleChange("newsletter")}
						variant="success"
					/>
					<label className="text-sm cursor-pointer">
						Subscribe to newsletter
					</label>
				</div>
				<div className="flex items-center gap-3">
					<Checkbox
						checked={formData.notifications}
						onCheckedChange={handleChange("notifications")}
						variant="warning"
					/>
					<label className="text-sm cursor-pointer">
						Enable push notifications
					</label>
				</div>
			</div>
		</div>
	);
};

export const LabeledCheckboxDemo: React.FC = () => {
	const [states, setStates] = useState({
		notifications: false,
		marketing: true,
	});

	const handleChange = (field: keyof typeof states) => (checked: boolean) => {
		setStates((prev) => ({ ...prev, [field]: checked }));
	};

	return (
		<div className="space-y-4">
			<div className="flex items-start gap-3">
				<Checkbox
					id="option1"
					checked={states.notifications}
					onCheckedChange={handleChange("notifications")}
				/>
				<div>
					<label
						htmlFor="option1"
						className="text-sm font-medium cursor-pointer"
					>
						Enable notifications
					</label>
					<p className="text-xs text-nocta-600 dark:text-nocta-400 mt-1">
						Receive email notifications about your account activity
					</p>
				</div>
			</div>
			<div className="flex items-start gap-3">
				<Checkbox
					id="option2"
					variant="success"
					checked={states.marketing}
					onCheckedChange={handleChange("marketing")}
				/>
				<div>
					<label
						htmlFor="option2"
						className="text-sm font-medium cursor-pointer"
					>
						Marketing emails
					</label>
					<p className="text-xs text-nocta-600 dark:text-nocta-400 mt-1">
						Get updates about new features and special offers
					</p>
				</div>
			</div>
		</div>
	);
};

export const DisabledStateDemo: React.FC = () => {
	return (
		<div className="my-6 space-y-4">
			<div className="flex items-center gap-3">
				<Checkbox disabled={false} />
				<span className="text-sm">Enabled (unchecked)</span>
			</div>
			<div className="flex items-center gap-3">
				<Checkbox checked={true} disabled={false} />
				<span className="text-sm">Enabled (checked)</span>
			</div>
			<div className="flex items-center gap-3">
				<Checkbox disabled={true} />
				<span className="text-sm">Disabled (unchecked)</span>
			</div>
			<div className="flex items-center gap-3">
				<Checkbox checked={true} disabled={true} />
				<span className="text-sm">Disabled (checked)</span>
			</div>
		</div>
	);
};

export const CustomStylingDemo: React.FC = () => {
	const [states, setStates] = useState({
		scaled: true,
		rounded: true,
		shadow: false,
	});

	const handleChange = (type: keyof typeof states) => (checked: boolean) => {
		setStates((prev) => ({ ...prev, [type]: checked }));
	};

	return (
		<div className="flex items-center gap-4">
			<div className="flex items-center gap-2">
				<Checkbox
					className="scale-125"
					checked={states.scaled}
					onCheckedChange={handleChange("scaled")}
				/>
				<span className="text-sm">Scaled (1.25x)</span>
			</div>
			<div className="flex items-center gap-2">
				<Checkbox
					className="rounded-full"
					checked={states.rounded}
					onCheckedChange={handleChange("rounded")}
				/>
				<span className="text-sm">Rounded</span>
			</div>
			<div className="flex items-center gap-2">
				<Checkbox
					className="shadow-lg"
					checked={states.shadow}
					onCheckedChange={handleChange("shadow")}
				/>
				<span className="text-sm">With shadow</span>
			</div>
		</div>
	);
};
