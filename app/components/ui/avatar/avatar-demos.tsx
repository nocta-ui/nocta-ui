'use client';

import type React from 'react';
import { useState } from 'react';
import { Avatar } from './avatar';

export const BasicAvatarDemo: React.FC = () => {
	return (
		<div className="flex items-center gap-4">
			<Avatar
				src="https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp2/user-02_mlqqqt.png"
				alt="John Doe"
			/>
			<Avatar fallback="JD" />
			<Avatar />
		</div>
	);
};

export const SizesDemo: React.FC = () => {
	return (
		<div className="flex items-center gap-4">
			<Avatar
				size="xs"
				src="https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp2/user-02_mlqqqt.png"
				alt="John Doe"
			/>
			<Avatar
				size="sm"
				src="https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp2/user-02_mlqqqt.png"
				alt="John Doe"
			/>
			<Avatar
				size="md"
				src="https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp2/user-02_mlqqqt.png"
				alt="John Doe"
			/>
			<Avatar
				size="lg"
				src="https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp2/user-02_mlqqqt.png"
				alt="John Doe"
			/>
			<Avatar
				size="xl"
				src="https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp2/user-02_mlqqqt.png"
				alt="John Doe"
			/>
			<Avatar
				size="2xl"
				src="https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp2/user-02_mlqqqt.png"
				alt="John Doe"
			/>
		</div>
	);
};

export const VariantsDemo: React.FC = () => {
	return (
		<div className="flex items-center gap-4">
			<Avatar
				variant="circle"
				src="https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp2/user-02_mlqqqt.png"
				alt="John Doe"
			/>
			<Avatar
				variant="square"
				src="https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp2/user-02_mlqqqt.png"
				alt="John Doe"
			/>
			<Avatar variant="circle" fallback="JD" />
			<Avatar variant="square" fallback="JD" />
		</div>
	);
};

export const StatusDemo: React.FC = () => {
	return (
		<div className="flex items-center gap-4">
			<Avatar
				src="https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp2/user-02_mlqqqt.png"
				alt="John Doe"
				status="online"
			/>
			<Avatar
				src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
				alt="Jane Smith"
				status="away"
			/>
			<Avatar
				src="https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
				alt="Mike Johnson"
				status="busy"
			/>
			<Avatar fallback="AB" status="offline" />
		</div>
	);
};

export const FallbackDemo: React.FC = () => {
	return (
		<div className="flex items-center gap-4">
			<Avatar
				src="https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp2/user-02_mlqqqt.png"
				alt="John Doe"
			/>
			<Avatar src="https://invalid-url.jpg" fallback="JD" alt="John Doe" />
			<Avatar fallback="Sarah Connor" />
			<Avatar fallback="AB" />
			<Avatar />
		</div>
	);
};

export const GroupDemo: React.FC = () => {
	return (
		<div className="flex items-center">
			<Avatar
				src="https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp2/user-02_mlqqqt.png"
				alt="John Doe"
				className="ring-1 ring-ring-offset"
			/>
			<Avatar
				src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
				alt="Jane Smith"
				className="-ml-2 ring-1 ring-ring-offset"
			/>
			<Avatar
				src="https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
				alt="Mike Johnson"
				className="-ml-2 ring-1 ring-ring-offset"
			/>
			<Avatar fallback="AB" className="-ml-2 ring-1 ring-ring-offset" />
			<div className="-ml-2 flex h-10 w-10 items-center justify-center rounded-full bg-card text-xs font-medium text-foreground/70 ring-1 ring-ring-offset">
				+5
			</div>
		</div>
	);
};

export const CustomStylingDemo: React.FC = () => {
	return (
		<div className="my-6 flex items-center gap-4">
			<Avatar
				src="https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp2/user-02_mlqqqt.png"
				alt="John Doe"
				className="ring-4 ring-blue-500/50"
			/>
			<Avatar
				fallback="JD"
				className="bg-gradient-to-br from-purple-500 to-pink-500 text-card"
			/>
			<Avatar
				src="https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp2/user-02_mlqqqt.png"
				alt="John Doe"
				className="grayscale transition-all duration-150 hover:grayscale-0"
			/>
		</div>
	);
};

export const ClickHandlersDemo: React.FC = () => {
	const [message, setMessage] = useState<string>('');

	const handleAvatarClick = (name: string) => {
		setMessage(`${name} avatar clicked!`);
		setTimeout(() => setMessage(''), 2000);
	};

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-center gap-4">
				<Avatar
					src="https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp2/user-02_mlqqqt.png"
					alt="John Doe"
					className="cursor-pointer transition-all hover:ring-1 hover:ring-neutral-300"
					onClick={() => handleAvatarClick('John Doe')}
				/>
				<Avatar
					fallback="JS"
					className="cursor-pointer transition-transform hover:scale-110"
					onClick={() => handleAvatarClick('Jane Smith')}
				/>
			</div>
			{message && (
				<div className="text-sm font-medium text-success/90">{message}</div>
			)}
		</div>
	);
};
