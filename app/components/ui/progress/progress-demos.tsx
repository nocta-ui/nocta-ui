"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Progress } from "./progress";

export const BasicProgressDemo: React.FC = () => {
	return (
		<div className="my-6 space-y-4 w-64">
			<Progress value={65} showLabel aria-label="Basic progress" />
		</div>
	);
};

export const VariantsDemo: React.FC = () => {
	return (
		<div className="my-6 space-y-4 w-64">
			<Progress
				value={60}
				variant="default"
				showLabel
				aria-label="Default progress"
			/>
			<Progress
				value={75}
				variant="success"
				showLabel
				aria-label="Success progress"
			/>
			<Progress
				value={45}
				variant="warning"
				showLabel
				aria-label="Warning progress"
			/>
			<Progress
				value={30}
				variant="destructive"
				showLabel
				aria-label="Error progress"
			/>
		</div>
	);
};

export const SizesDemo: React.FC = () => {
	return (
		<div className="my-6 space-y-4 w-64">
			<div>
				<span className="text-sm text-primary-muted mb-2 block">Small</span>
				<Progress value={50} size="sm" />
			</div>
			<div>
				<span className="text-sm text-primary-muted mb-2 block">Medium</span>
				<Progress value={65} size="md" />
			</div>
			<div>
				<span className="text-sm text-primary-muted mb-2 block">Large</span>
				<Progress value={80} size="lg" />
			</div>
		</div>
	);
};

export const AnimatedDemo: React.FC = () => {
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		const timer = setInterval(() => {
			setProgress((prev) => {
				if (prev >= 100) {
					return 0;
				}
				return prev + 10;
			});
		}, 500);

		return () => clearInterval(timer);
	}, []);

	return (
		<div className="my-6 space-y-4 w-64">
			<Progress
				value={progress}
				variant="success"
				showLabel
				aria-label="Animated progress"
			/>
		</div>
	);
};

export const CustomMaxDemo: React.FC = () => {
	return (
		<div className="my-6 space-y-4 w-64">
			<Progress value={15} max={20} showLabel aria-label="Custom max value" />
			<Progress
				value={250}
				max={500}
				variant="warning"
				showLabel
				aria-label="Large max value"
			/>
		</div>
	);
};

export const WithoutLabelDemo: React.FC = () => {
	return (
		<div className="my-6 space-y-4 w-64">
			<Progress value={40} />
			<Progress value={70} variant="success" />
			<Progress value={85} variant="warning" />
		</div>
	);
};
