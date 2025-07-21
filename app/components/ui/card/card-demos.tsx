"use client";

import type React from "react";
import { Button } from "../button";
import {
	Card,
	CardActions,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "./card";

export const SimpleCardDemo: React.FC = () => {
	return (
		<div className="my-6">
			<Card className="max-w-md">
				<CardHeader>
					<CardTitle>Getting Started</CardTitle>
					<CardDescription>
						Learn how to use the Card component in your projects
					</CardDescription>
				</CardHeader>
				<CardContent>
					<p>
						This is a basic card example showing the fundamental structure and
						styling.
					</p>
				</CardContent>
			</Card>
		</div>
	);
};

export const CardWithActionsDemo: React.FC = () => {
	return (
		<div className="my-6">
			<Card className="max-w-md">
				<CardHeader>
					<CardTitle>Project Settings</CardTitle>
					<CardDescription>
						Manage your project configuration and preferences
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						<div className="flex items-center justify-between">
							<span className="text-sm font-medium text-nocta-700 dark:text-nocta-300">
								Status
							</span>
							<span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
								Active
							</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-sm font-medium text-nocta-700 dark:text-nocta-300">
								Members
							</span>
							<span className="text-sm text-nocta-600 dark:text-nocta-400">
								12
							</span>
						</div>
					</div>
				</CardContent>
				<CardFooter>
					<CardActions>
						<Button variant="ghost" size="sm">
							Cancel
						</Button>
						<Button variant="primary" size="sm">
							Save Changes
						</Button>
					</CardActions>
				</CardFooter>
			</Card>
		</div>
	);
};

export const NotificationCardDemo: React.FC = () => {
	return (
		<div className="my-6">
			<Card className="max-w-md">
				<CardHeader>
					<div className="flex items-start space-x-3">
						<div className="w-2 h-2 rounded-full mt-2 bg-black dark:bg-white"></div>
						<div className="flex-1">
							<CardTitle>System Update</CardTitle>
							<CardDescription>A new version is available</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<p className="text-sm">
						Version 2.1.0 includes performance improvements and bug fixes.
						Update now to get the latest features.
					</p>
				</CardContent>
			</Card>
		</div>
	);
};

export const StatsCardDemo: React.FC = () => {
	return (
		<div className="my-6">
			<Card className="w-md">
				<CardHeader>
					<CardTitle>Analytics Overview</CardTitle>
					<CardDescription>Key metrics for this month</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-2 gap-4">
						<div className="text-center">
							<div className="text-2xl font-bold text-nocta-900 dark:text-nocta-100">
								2.4k
							</div>
							<div className="text-xs text-nocta-600 dark:text-nocta-400 uppercase tracking-wide">
								Users
							</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-nocta-900 dark:text-nocta-100">
								98%
							</div>
							<div className="text-xs text-nocta-600 dark:text-nocta-400 uppercase tracking-wide">
								Uptime
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};
