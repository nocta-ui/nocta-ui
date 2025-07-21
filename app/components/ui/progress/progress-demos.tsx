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
				<span className="text-sm text-nocta-600 dark:text-nocta-400 mb-2 block">
					Small
				</span>
				<Progress value={50} size="sm" />
			</div>
			<div>
				<span className="text-sm text-nocta-600 dark:text-nocta-400 mb-2 block">
					Medium
				</span>
				<Progress value={65} size="md" />
			</div>
			<div>
				<span className="text-sm text-nocta-600 dark:text-nocta-400 mb-2 block">
					Large
				</span>
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

export const FileUploadDemo: React.FC = () => {
	const [uploadProgress, setUploadProgress] = useState(0);
	const [isUploading, setIsUploading] = useState(false);

	const simulateUpload = () => {
		setIsUploading(true);
		setUploadProgress(0);

		const timer = setInterval(() => {
			setUploadProgress((prev) => {
				if (prev >= 100) {
					setIsUploading(false);
					clearInterval(timer);
					return 100;
				}
				return prev + Math.random() * 15;
			});
		}, 200);
	};

	return (
		<div className="my-6 space-y-4 w-64">
			<div className="border border-nocta-300 dark:border-nocta-700 rounded-lg p-4">
				<div className="flex items-center justify-between mb-3">
					<span className="text-sm font-medium text-nocta-900 dark:text-nocta-100">
						document.pdf
					</span>
					<span className="text-xs text-nocta-500 dark:text-nocta-400">
						2.4 MB
					</span>
				</div>

				<Progress
					value={uploadProgress}
					variant={uploadProgress === 100 ? "success" : "default"}
					showLabel
					aria-label="File upload progress"
				/>

				<button
					onClick={simulateUpload}
					disabled={isUploading}
					className="mt-3 px-3 py-1.5 text-sm bg-linear-to-b from-nocta-900 to-nocta-700 dark:from-white dark:to-nocta-300 text-nocta-50 dark:text-nocta-900 rounded-md hover:bg-nocta-900 dark:hover:bg-nocta-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
				>
					{isUploading
						? "Uploading..."
						: uploadProgress === 100
							? "Upload Complete"
							: "Start Upload"}
				</button>
			</div>
		</div>
	);
};
