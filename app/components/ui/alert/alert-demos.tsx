"use client";

import type React from "react";
import { Alert, AlertDescription, AlertTitle } from "./alert";

export const DefaultAlertDemo: React.FC = () => {
	return (
		<div className="my-6">
			<Alert>
				<AlertTitle>Information</AlertTitle>
				<AlertDescription>
					This is a default alert with an information message.
				</AlertDescription>
			</Alert>
		</div>
	);
};

export const SimpleAlertDemo: React.FC = () => {
	return (
		<div className="my-6">
			<Alert showIcon={false}>
				<AlertDescription>
					A simple alert without title or icon.
				</AlertDescription>
			</Alert>
		</div>
	);
};

export const VariantsDemo: React.FC = () => {
	return (
		<div className="my-6 space-y-4">
			<Alert variant="default">
				<AlertTitle>Default Alert</AlertTitle>
				<AlertDescription>
					This is the default variant for general information.
				</AlertDescription>
			</Alert>

			<Alert variant="destructive">
				<AlertTitle>Error</AlertTitle>
				<AlertDescription>
					Something went wrong. Please try again later.
				</AlertDescription>
			</Alert>

			<Alert variant="warning">
				<AlertTitle>Warning</AlertTitle>
				<AlertDescription>
					Please review your settings before proceeding.
				</AlertDescription>
			</Alert>

			<Alert variant="success">
				<AlertTitle>Success</AlertTitle>
				<AlertDescription>
					Your changes have been saved successfully.
				</AlertDescription>
			</Alert>
		</div>
	);
};

export const AlertWithoutIconsDemo: React.FC = () => {
	return (
		<div className="my-6 space-y-4">
			<Alert showIcon={false} variant="default">
				<AlertTitle>System Maintenance</AlertTitle>
				<AlertDescription>
					We will be performing scheduled maintenance on Sunday at 2:00 AM UTC.
				</AlertDescription>
			</Alert>

			<Alert showIcon={false} variant="destructive">
				<AlertTitle>Account Suspended</AlertTitle>
				<AlertDescription>
					Your account has been temporarily suspended. Contact support for
					assistance.
				</AlertDescription>
			</Alert>
		</div>
	);
};

export const FormValidationDemo: React.FC = () => {
	return (
		<div className="my-6 space-y-4">
			<Alert variant="destructive">
				<AlertTitle>Validation Error</AlertTitle>
				<AlertDescription>
					Please fix the following errors:
					<ul className="mt-2 list-disc list-inside">
						<li>Email address is required</li>
						<li>Password must be at least 8 characters</li>
					</ul>
				</AlertDescription>
			</Alert>

			<Alert variant="success">
				<AlertTitle>Form Submitted</AlertTitle>
				<AlertDescription>
					Thank you! Your form has been submitted successfully.
				</AlertDescription>
			</Alert>
		</div>
	);
};

export const SystemNotificationsDemo: React.FC = () => {
	return (
		<div className="my-6 space-y-4">
			<Alert variant="warning">
				<AlertTitle>Storage Almost Full</AlertTitle>
				<AlertDescription>
					You are using 95% of your storage quota. Consider upgrading your plan
					or deleting old files.
				</AlertDescription>
			</Alert>

			<Alert variant="default">
				<AlertTitle>New Feature Available</AlertTitle>
				<AlertDescription>
					Check out our new dashboard analytics feature in the Settings panel.
				</AlertDescription>
			</Alert>
		</div>
	);
};
