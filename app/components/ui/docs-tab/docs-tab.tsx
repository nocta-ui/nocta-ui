'use client';

import { cn } from 'fumadocs-ui/utils/cn';
import React, { useRef, useState } from 'react';

interface DocsTabProps {
	children?: React.ReactNode;
	title: string;
	value: string;
	isActive?: boolean;
	onClick?: (value: string) => void;
}

const DocsTab = ({ title, value, isActive = false, onClick }: DocsTabProps) => {
	return (
		<button
			type="button"
			onClick={() => onClick?.(value)}
			className={cn(
				'group relative cursor-pointer rounded-lg py-1.5 text-sm font-medium transition-all duration-200 ease-in-out',
				isActive
					? 'text-foreground hover:contrast-110'
					: 'text-foreground-subtle hover:text-foreground-muted',
			)}
		>
			<span className="relative z-10">{title}</span>
		</button>
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
	const wrapperRef = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);

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
		<div className="not-prose group relative z-0 mb-16 text-sm outline-none">
			<div className="relative flex items-center gap-4 px-1.5 py-1.5">
				{tabs.map((tab) => (
					<DocsTab
						key={tab.props.value}
						title={tab.props.title}
						value={tab.props.value}
						isActive={activeTab === tab.props.value}
						onClick={handleTabChange}
					/>
				))}
			</div>

			<div ref={contentRef} className="relative">
				{activeTab !== 'code' && (
					<div className="absolute inset-2 z-0 rounded-lg border border-dashed border-border bg-fd-background"></div>
				)}
				<div
					ref={wrapperRef}
					className={`relative p-1 transition-opacity duration-300 ease-in-out ${activeTab === 'code' ? 'overflow-y-visible' : ''}`}
				>
					<div
						className={`flex w-full justify-${justify} items-center overflow-x-auto md:justify-center ${activeTab !== 'code' ? 'p-4 md:p-8' : ''} ${activeTab === 'code' ? '-mb-16' : ''}`}
					>
						{activeContent?.props.children}
					</div>
				</div>
			</div>
		</div>
	);
};

export { DocsTab, DocsTabs };
