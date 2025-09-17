"use client";

import { cn } from "fumadocs-ui/utils/cn";
import React, { useRef, useState } from "react";

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
				"relative py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out group",
				isActive
					? "hover:contrast-110 text-foreground"
					: "text-fd-muted-foreground hover:text-fd-foreground",
			)}
		>
			<span className="relative z-10">{title}</span>
		</button>
	);
};

interface DocsTabsProps {
	children: React.ReactNode;
	defaultValue?: string;
	justify?: "center" | "start";
}

const DocsTabs = ({
	children,
	defaultValue = "preview",
	justify = "center",
}: DocsTabsProps) => {
	const [activeTab, setActiveTab] = useState(defaultValue);
	const wrapperRef = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);

	const tabs = React.Children.toArray(children).filter(
		(child): child is React.ReactElement<DocsTabProps> =>
			React.isValidElement(child) && typeof child.type !== "string",
	);

	const activeContent = tabs.find((tab) => tab.props.value === activeTab);

	const handleTabChange = (value: string) => {
		if (value !== activeTab) {
			setActiveTab(value);
		}
	};

	return (
		<div className="not-prose group relative text-sm outline-none z-0 mb-16">
			<div className="flex items-center gap-4 px-1.5 py-1.5 relative">
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
				{activeTab !== "code" && (
					<div className="absolute inset-2 border rounded-xl bg-white dark:bg-neutral-950/50 z-0"></div>
				)}
				<div
					ref={wrapperRef}
					className={`relative p-1 transition-opacity duration-300 ease-in-out ${activeTab === "code" ? " overflow-y-visible" : ""}`}
				>
					<div
						className={`w-full flex justify-${justify} md:justify-center items-center overflow-x-auto md:overflow-x-visible ${activeTab !== "code" ? "py-0 px-4 md:py-16 md:px-8" : ""} ${activeTab === "code" ? " -mb-16" : ""}`}
					>
						{activeContent?.props.children}
					</div>
				</div>
			</div>
		</div>
	);
};

export { DocsTab, DocsTabs };
