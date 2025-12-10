'use client';

import type React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@nocta/registry/ui/alert';

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

export const AlertVariantsDemo: React.FC = () => {
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
