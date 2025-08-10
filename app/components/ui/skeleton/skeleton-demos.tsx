"use client";

import type React from "react";
import { Skeleton } from "./skeleton";

export const BasicSkeletonDemo: React.FC = () => {
	return (
		<div className="my-6 w-96">
			<Skeleton />
		</div>
	);
};

export const PulseSkeletonDemo: React.FC = () => {
	return (
		<div className="my-6 w-96">
			<Skeleton variant="pulse" />
		</div>
	);
};

export const SizesDemo: React.FC = () => {
	return (
		<div className="my-6 space-y-4 w-96">
			<div className="flex flex-col space-y-2">
				<label className="text-sm font-medium text-nocta-700 dark:text-nocta-300">
					Small
				</label>
				<Skeleton size="sm" />
			</div>
			<div className="flex flex-col space-y-2">
				<label className="text-sm font-medium text-nocta-700 dark:text-nocta-300">
					Medium
				</label>
				<Skeleton size="md" />
			</div>
			<div className="flex flex-col space-y-2">
				<label className="text-sm font-medium text-nocta-700 dark:text-nocta-300">
					Large
				</label>
				<Skeleton size="lg" />
			</div>
		</div>
	);
};

export const ShapesDemo: React.FC = () => {
	return (
		<div className="my-6 space-y-4 w-96">
			<div className="flex flex-col space-y-2">
				<label className="text-sm font-medium text-nocta-700 dark:text-nocta-300">
					Rectangle
				</label>
				<Skeleton shape="rectangle" width="12rem" height="3rem" />
			</div>
			<div className="flex flex-col space-y-2">
				<label className="text-sm font-medium text-nocta-700 dark:text-nocta-300">
					Circle
				</label>
				<Skeleton shape="circle" size="lg" />
			</div>
			<div className="flex flex-col space-y-2">
				<label className="text-sm font-medium text-nocta-700 dark:text-nocta-300">
					Text (Single Line)
				</label>
				<Skeleton shape="text" width="10rem" />
			</div>
			<div className="flex flex-col space-y-2">
				<label className="text-sm font-medium text-nocta-700 dark:text-nocta-300">
					Text (Multiple Lines)
				</label>
				<Skeleton shape="text" lines={3} />
			</div>
		</div>
	);
};

export const TextLinesDemo: React.FC = () => {
	return (
		<div className="my-6 space-y-4 w-96">
			<div className="flex flex-col space-y-2">
				<label className="text-sm font-medium text-nocta-700 dark:text-nocta-300">
					2 Lines
				</label>
				<Skeleton shape="text" lines={2} />
			</div>
			<div className="flex flex-col space-y-2">
				<label className="text-sm font-medium text-nocta-700 dark:text-nocta-300">
					4 Lines
				</label>
				<Skeleton shape="text" lines={4} />
			</div>
			<div className="flex flex-col space-y-2">
				<label className="text-sm font-medium text-nocta-700 dark:text-nocta-300">
					6 Lines
				</label>
				<Skeleton shape="text" lines={6} />
			</div>
		</div>
	);
};

export const CustomSizeDemo: React.FC = () => {
	return (
		<div className="my-6 space-y-4 w-96">
			<div className="flex flex-col space-y-2">
				<label className="text-sm font-medium text-nocta-700 dark:text-nocta-300">
					Custom Rectangle
				</label>
				<Skeleton width="200px" height="60px" />
			</div>
			<div className="flex flex-col space-y-2">
				<label className="text-sm font-medium text-nocta-700 dark:text-nocta-300">
					Custom Circle
				</label>
				<Skeleton shape="circle" width="80px" height="80px" />
			</div>
			<div className="flex flex-col space-y-2">
				<label className="text-sm font-medium text-nocta-700 dark:text-nocta-300">
					Custom Text
				</label>
				<Skeleton shape="text" width="150px" height="20px" />
			</div>
		</div>
	);
};

export const CardSkeletonDemo: React.FC = () => {
	return (
		<div className="my-6 w-96">
			<div className="max-w-sm p-4 border border-nocta-200 dark:border-nocta-700 rounded-lg">
				<div className="space-y-4">
					<div className="flex items-center space-x-3">
						<Skeleton shape="circle" size="md" />
						<div className="flex-1">
							<Skeleton shape="text" width="60%" className="mb-2" />
							<Skeleton shape="text" width="40%" size="sm" />
						</div>
					</div>
					<Skeleton width="100%" height="160px" />
					<Skeleton shape="text" lines={3} />
				</div>
			</div>
		</div>
	);
};

export const ArticleSkeletonDemo: React.FC = () => {
	return (
		<div className="my-6 w-96">
			<div className="max-w-md space-y-4">
				<Skeleton width="100%" height="200px" />
				<Skeleton shape="text" width="80%" size="lg" />
				<Skeleton shape="text" lines={4} />
				<div className="flex items-center space-x-3 pt-4">
					<Skeleton shape="circle" size="sm" />
					<Skeleton shape="text" width="120px" size="sm" />
				</div>
			</div>
		</div>
	);
};

export const TableSkeletonDemo: React.FC = () => {
	return (
		<div className="my-6 w-96">
			<div className="space-y-3">
				{Array.from({ length: 5 }, (_, index) => (
					<div key={index} className="flex items-center space-x-4">
						<Skeleton shape="circle" size="sm" />
						<Skeleton width="120px" height="16px" />
						<Skeleton width="80px" height="16px" />
						<Skeleton width="100px" height="16px" />
					</div>
				))}
			</div>
		</div>
	);
};
