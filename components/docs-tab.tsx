'use client';

import { CodeIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import { cn } from 'fumadocs-ui/utils/cn';
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/app/components/ui/tabs';

interface DocsTabProps {
	children?: React.ReactNode;
	title: string;
	value: string;
	isActive?: boolean;
}

const DocsTab = ({ title, value, isActive = false }: DocsTabProps) => {
	let icon: React.ReactNode = null;
	if (value === 'preview') icon = <EyeOpenIcon className="size-4" />;
	if (value === 'code') icon = <CodeIcon className="size-4" />;

	return (
		<TabsTrigger
			value={value}
			className={cn(
				'group relative flex items-center gap-2 rounded-sm px-2 py-1 text-xs font-medium sm:text-sm',
				'bg-transparent border border-transparent text-foreground/70! hover:text-foreground! data-active-item:bg-card-muted! dark:data-active-item:bg-card-muted! data-active-item:text-foreground! data-active-item:shadow-none! data-active-item:border-fd-border data-active-item:shadow-card!',
				'transition-[background-color,color] ease-out-quad duration-100'
			)}
		>
			{icon && (
				<span
					className={cn(
						'transition-[color] ease-out-quad duration-100',
						isActive
							? 'text-foreground'
							: 'text-foreground/70 group-hover:text-foreground',
					)}
				>
					{icon}
				</span>
			)}
			<span
				className={cn(
					'relative z-10 transition-colors',
					isActive
						? 'text-foreground'
						: 'text-foreground/70 group-hover:text-foreground',
				)}
			>
				{title}
			</span>
		</TabsTrigger>
	);
};

interface DocsTabsProps {
	children: React.ReactNode;
	defaultValue?: string;
	justify?: 'center' | 'start';
}

const DocsTabs = ({
	children,
	defaultValue = 'preview',
	justify = 'center',
}: DocsTabsProps) => {
	const [activeTab, setActiveTab] = useState(defaultValue);

	const tabs = React.Children.toArray(children).filter(
		(child): child is React.ReactElement<DocsTabProps> =>
			React.isValidElement(child) && typeof child.type !== 'string',
	);

	const activeContent = tabs.find((tab) => tab.props.value === activeTab);

	const handleTabChange = (value: string) => {
		if (value !== activeTab) {
			setActiveTab(value);
		}
	};

	return (
		<div className="not-prose relative z-0 mb-16 text-sm outline-none border border-border shadow-card rounded-lg shadow-sm">
			<Tabs
				value={activeTab}
				onValueChange={handleTabChange}
				size="sm"
				className="relative overflow-hidden rounded-lg"
			>
				<TabsList
					className={cn(
						'flex w-full items-center justify-start p-1 bg-card',
						'flex! rounded-none! shadow-none! border-none',
					)}
				>
					<div className="bg-background flex gap-1 p-1 rounded-md w-full justify-evenly">
						{tabs.map((tab) => (
							<DocsTab
								key={tab.props.value}
								title={tab.props.title}
								value={tab.props.value}
								isActive={activeTab === tab.props.value}
							/>
						))}
					</div>
				</TabsList>

				<div className="relative overflow-hidden bg-card p-1">
					<div
						className={cn(
							'relative bg-background rounded-md border border-fd-border overflow-hidden',
							activeTab === 'code' &&
								'overflow-y-visible [&_figure]:my-0 [&_figure>div]:border-0 [&_figure>div]:rounded-md [&_figure>div]:before:content-none! [&_figure>div]:before:shadow-none!',
						)}
					>
						<div
							className={cn(
								'flex w-full items-center overflow-x-auto md:justify-center isolate',
								justify === 'center' ? 'justify-center' : 'justify-start',
								activeTab !== 'code' ? 'p-4 md:p-16 has-[.sidebar]:p-0' : '',
							)}
						>
							{activeContent?.props.children}
						</div>
					</div>
				</div>
			</Tabs>
		</div>
	);
};

export { DocsTab, DocsTabs };
