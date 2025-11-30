'use client';

import React from 'react';

import { OTPInput } from '@/registry/ui/otp-input';

export const OTPInputDemo: React.FC = () => {
	const [value, setValue] = React.useState('');
	const [status, setStatus] = React.useState<'idle' | 'success' | 'error'>('idle');

	const variant =
		status === 'error' ? 'error' : status === 'success' ? 'success' : 'default';

	const helperText =
		status === 'idle'
			? 'Enter the 6-digit code.'
			: undefined;

	return (
		<div className="my-6 max-w-md space-y-4">
			<OTPInput
				length={6}
				value={value}
				onChange={(nextValue) => {
					setValue(nextValue);
					if (nextValue.length === 6) {
						setStatus('success');
					} else if (status !== 'idle') {
						setStatus('idle');
					}
				}}
				variant={variant}
				label="One-time password"
				helperText={helperText}
				successMessage={
					status === 'success' ? 'Code captured successfully.' : undefined
				}
				autoComplete="one-time-code"
			/>
		</div>
	);
};
