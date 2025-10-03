'use client';

import type React from 'react';
import { Button } from '../button';
import { type ToastPosition, toast } from './toast';

export const BasicToastDemo: React.FC = () => {
	return (
		<div className="my-6">
			<BasicToastExample />
		</div>
	);
};

const BasicToastExample: React.FC = () => {
	const showToast = () => {
		toast({
			title: 'Success!',
			description: 'Your changes have been saved.',
		});
	};

	return <Button onClick={showToast}>Show Toast</Button>;
};

export const ToastVariantsDemo: React.FC = () => {
	return (
		<div className="my-6">
			<ToastVariantsExample />
		</div>
	);
};

const ToastVariantsExample: React.FC = () => {
	const showDefault = () => {
		toast({
			title: 'Information',
			description: 'This is a default toast notification.',
		});
	};

	const showSuccess = () => {
		toast.success({
			title: 'Success!',
			description: 'Your operation completed successfully.',
		});
	};

	const showWarning = () => {
		toast.warning({
			title: 'Warning',
			description: 'Please check your input before continuing.',
		});
	};

	const showError = () => {
		toast.error({
			title: 'Error',
			description: 'Something went wrong. Please try again.',
		});
	};

	return (
		<div className="flex flex-wrap gap-3">
			<Button onClick={showDefault} variant="ghost" size="sm">
				Default
			</Button>
			<Button onClick={showSuccess} variant="ghost" size="sm">
				Success
			</Button>
			<Button onClick={showWarning} variant="ghost" size="sm">
				Warning
			</Button>
			<Button onClick={showError} variant="ghost" size="sm">
				Error
			</Button>
		</div>
	);
};

export const ToastWithActionsDemo: React.FC = () => {
	return (
		<div className="my-6">
			<ToastWithActionsExample />
		</div>
	);
};

const ToastWithActionsExample: React.FC = () => {
	const showToast = () => {
		toast({
			title: 'Update Available',
			description: 'A new version of the app is ready to install.',
			action: {
				label: 'Update',
				onClick: () => console.log('Update clicked!'),
			},
		});
	};

	return <Button onClick={showToast}>Show Toast with Action</Button>;
};

export const StackedToastsDemo: React.FC = () => {
	return (
		<div className="my-6">
			<StackedToastsExample />
		</div>
	);
};

const StackedToastsExample: React.FC = () => {
	const showMultiple = () => {
		toast({
			title: 'First Toast',
			description: 'This is the first notification.',
		});

		setTimeout(() => {
			toast.success({
				title: 'Second Toast',
				description: 'This is the second notification.',
			});
		}, 500);

		setTimeout(() => {
			toast.warning({
				title: 'Third Toast',
				description: 'This is the third notification.',
			});
		}, 1000);

		setTimeout(() => {
			toast.error({
				title: 'Fourth Toast',
				description: 'This will push the first one out!',
			});
		}, 1500);
	};

	return (
		<Button onClick={showMultiple} variant="secondary">
			Show Multiple Toasts
		</Button>
	);
};

export const PersistentToastDemo: React.FC = () => {
	return (
		<div className="my-6">
			<PersistentToastExample />
		</div>
	);
};

const PersistentToastExample: React.FC = () => {
	const showToast = () => {
		toast({
			title: 'Important Notice',
			description: 'This toast will remain visible until manually closed.',
			duration: 0,
		});
	};

	return (
		<Button onClick={showToast} variant="secondary">
			Show Persistent Toast
		</Button>
	);
};

export const CustomDurationDemo: React.FC = () => {
	return (
		<div className="my-6">
			<CustomDurationExample />
		</div>
	);
};

const CustomDurationExample: React.FC = () => {
	const showToast = () => {
		toast({
			title: 'Quick Toast',
			description: 'This toast will close in 2 seconds.',
			duration: 2000,
		});
	};

	return (
		<Button onClick={showToast} variant="ghost">
			Show Quick Toast (2s)
		</Button>
	);
};

export const DismissAllDemo: React.FC = () => {
	return (
		<div className="my-6">
			<DismissAllExample />
		</div>
	);
};

const DismissAllExample: React.FC = () => {
	const showMultiple = () => {
		toast({ title: 'Toast 1', description: 'First notification' });
		toast.success({
			title: 'Toast 2',
			description: 'Second notification',
		});
		toast.warning({
			title: 'Toast 3',
			description: 'Third notification',
		});
	};

	return (
		<div className="flex gap-3">
			<Button onClick={showMultiple} variant="secondary" size="sm">
				Show Multiple
			</Button>
			<Button onClick={toast.dismissAll} variant="ghost" size="sm">
				Dismiss All
			</Button>
		</div>
	);
};

export const ToastPositionsDemo: React.FC = () => {
	return (
		<div className="my-6">
			<ToastPositionsExample />
		</div>
	);
};

const ToastPositionsExample: React.FC = () => {
	const positions = [
		{ key: 'top-left', label: 'Top Left' },
		{ key: 'top-center', label: 'Top Center' },
		{ key: 'top-right', label: 'Top Right' },
		{ key: 'bottom-left', label: 'Bottom Left' },
		{ key: 'bottom-center', label: 'Bottom Center' },
		{ key: 'bottom-right', label: 'Bottom Right' },
	];

	return (
		<div className="flex flex-col items-center space-y-4">
			<div className="mb-4 text-sm text-foreground/70">
				Click the buttons to see toasts appear in different positions:
			</div>

			<div className="grid max-w-md grid-cols-3 gap-2">
				{positions.map((position) => (
					<Button
						key={position.key}
						onClick={() =>
							toast({
								title: position.label,
								description: `Toast positioned at ${position.key}`,
								position: position.key as ToastPosition,
								variant: 'default',
							})
						}
						variant="secondary"
						size="sm"
					>
						{position.label}
					</Button>
				))}
			</div>

			<div className="mt-4 rounded-lg bg-card p-3 text-sm">
				<strong>Available positions:</strong> top-left, top-center, top-right,
				bottom-left, bottom-center, bottom-right
			</div>
		</div>
	);
};
