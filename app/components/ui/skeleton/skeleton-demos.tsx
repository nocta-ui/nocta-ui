'use client';

import type React from 'react';
import { Skeleton } from './skeleton';

export const BasicSkeletonDemo: React.FC = () => {
	return (
		<div className="my-6 w-96">
			<Skeleton />
		</div>
	);
};

export const ShimmerSkeletonDemo: React.FC = () => {
	return (
		<div className="my-6 w-96">
			<Skeleton variant="shimmer" />
		</div>
	);
};

export const SizesDemo: React.FC = () => {
	return (
		<div className="my-6 w-96 space-y-4">
			<div className="flex flex-col space-y-2">
				<label className="text-sm font-medium text-foreground/70">Small</label>
				<Skeleton size="sm" />
			</div>
			<div className="flex flex-col space-y-2">
				<label className="text-sm font-medium text-foreground/70">Medium</label>
				<Skeleton size="md" />
			</div>
			<div className="flex flex-col space-y-2">
				<label className="text-sm font-medium text-foreground/70">Large</label>
				<Skeleton size="lg" />
			</div>
		</div>
	);
};

export const ShapesDemo: React.FC = () => {
	return (
		<div className="my-6 w-96 space-y-4">
			<div className="flex flex-col space-y-2">
				<label className="text-sm font-medium text-foreground/70">
					Rectangle
				</label>
				<Skeleton shape="rectangle" width="12rem" height="3rem" />
			</div>
			<div className="flex flex-col space-y-2">
				<label className="text-sm font-medium text-foreground/70">Circle</label>
				<Skeleton shape="circle" size="lg" />
			</div>
			<div className="flex flex-col space-y-2">
				<label className="text-sm font-medium text-foreground/70">
					Text (Single Line)
				</label>
				<Skeleton shape="text" width="10rem" />
			</div>
			<div className="flex flex-col space-y-2">
				<label className="text-sm font-medium text-foreground/70">
					Text (Multiple Lines)
				</label>
				<Skeleton shape="text" lines={3} />
			</div>
		</div>
	);
};

export const TextLinesDemo: React.FC = () => {
	return (
		<div className="my-6 w-96 space-y-4">
			<div className="flex flex-col space-y-2">
				<label className="text-sm font-medium text-foreground/70">
					2 Lines
				</label>
				<Skeleton shape="text" lines={2} />
			</div>
			<div className="flex flex-col space-y-2">
				<label className="text-sm font-medium text-foreground/70">
					4 Lines
				</label>
				<Skeleton shape="text" lines={4} />
			</div>
			<div className="flex flex-col space-y-2">
				<label className="text-sm font-medium text-foreground/70">
					6 Lines
				</label>
				<Skeleton shape="text" lines={6} />
			</div>
		</div>
	);
};

export const CustomSizeDemo: React.FC = () => {
	return (
		<div className="my-6 w-96 space-y-4">
			<div className="flex flex-col space-y-2">
				<label className="text-sm font-medium text-foreground/70">
					Custom Rectangle
				</label>
				<Skeleton width="200px" height="60px" />
			</div>
			<div className="flex flex-col space-y-2">
				<label className="text-sm font-medium text-foreground/70">
					Custom Circle
				</label>
				<Skeleton shape="circle" width="80px" height="80px" />
			</div>
			<div className="flex flex-col space-y-2">
				<label className="text-sm font-medium text-foreground/70">
					Custom Text
				</label>
				<Skeleton shape="text" width="150px" height="20px" />
			</div>
		</div>
	);
};
