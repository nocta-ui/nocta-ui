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
	if (value === 'preview') icon = <EyeOpenIcon className="h-4 w-4" />;
	if (value === 'code') icon = <CodeIcon className="h-4 w-4" />;

	return (
		<TabsTrigger
			value={value}
			className={cn(
				'group relative flex !w-auto items-center gap-2 rounded-sm px-2 py-1 text-xs font-medium transition-all duration-200 ease-in-out sm:text-sm',
				'bg-transparent border border-transparent !text-foreground/60 hover:!text-foreground data-[active-item]:border-border/60 data-[active-item]:!bg-[#F6F6F8] dark:data-[active-item]:!bg-[#18181A] data-[active-item]:!text-foreground data-[active-item]:!shadow-none',
			)}
		>
			{icon && (
				<span
					className={cn(
						'transition-colors',
						isActive
							? 'text-foreground'
							: 'text-foreground/60 group-hover:text-foreground',
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
						: 'text-foreground/60 group-hover:text-foreground',
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
		<div className="not-prose relative z-0 mb-16 text-sm outline-none">
			<Tabs
				value={activeTab}
				onValueChange={handleTabChange}
				size="sm"
				className="relative overflow-hidden rounded-lg border border-fd-border bg-background"
			>
				<TabsList
					className={cn(
						'flex w-full items-center justify-start border-b border-fd-border bg-card-muted/50 dark:bg-card-muted/30 px-2 py-2',
						'!flex !rounded-none !shadow-none',
					)}
				>
					<div className="bg-background border border-border/60 flex gap-1 p-1 rounded-md">
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

				<div className="relative overflow-hidden">
					<div
						className={cn(
							'relative transition-opacity duration-200 ease-in-out',
							activeTab === 'code' &&
								'overflow-y-visible [&_figure]:my-0 [&_figure>div]:border-0 [&_figure>div]:rounded-none',
						)}
					>
						<div
							className={cn(
								'flex w-full items-center overflow-x-auto md:justify-center',
								justify === 'center' ? 'justify-center' : 'justify-start',
								activeTab !== 'code' ? 'p-4 md:p-16' : '',
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
