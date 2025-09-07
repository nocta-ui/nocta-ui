"use client";

import { cn } from "fumadocs-ui/utils/cn";
import gsap from "gsap";
import React, { useCallback, useEffect, useRef, useState } from "react";

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
			onClick={() => onClick?.(value)}
			className={cn(
				"relative px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ease-out group",
				isActive
					? "bg-linear-to-b from-nocta-900 to-nocta-700 dark:from-nocta-700 dark:to-nocta-700/50 hover:contrast-115 text-nocta-100 dark:text-nocta-100"
					: "text-fd-muted-foreground hover:text-fd-foreground hover:bg-fd-secondary/50 hover:shadow-sm",
				"hover:scale-[1.02] active:scale-[0.97]",
			)}
		>
			<span className="relative z-10">{title}</span>
			{isActive && (
				<span className="absolute bottom-0 left-0 right-0 mx-auto block h-0.5 w-6 rounded-full bg-fd-primary/60" />
			)}
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

	const animateContent = useCallback(() => {
		if (!wrapperRef.current) return;

		const el = wrapperRef.current;

		gsap.fromTo(
			el,
			{ autoAlpha: 0, y: 10, height: "auto" },
			{
				autoAlpha: 1,
				y: 0,
				duration: 0.35,
				ease: "power2.out",
			},
		);
	}, []);

	useEffect(() => {
		animateContent();
	}, [activeTab, animateContent]);

	const handleTabChange = (value: string) => {
		if (value !== activeTab) {
			setActiveTab(value);
		}
	};

	return (
		<div className="not-prose group relative my-4 rounded-lg border bg-nocta-200/50 dark:bg-nocta-900 text-sm outline-none z-0">
			<div className="flex items-center gap-2 px-4 py-1.5 relative">
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

			<div
				ref={contentRef}
				className="transition-all duration-200 ease-in-out p-1 relative"
			>
				<div className="absolute inset-1 border rounded-md bg-nocta-100 dark:bg-nocta-950/50 z-0"></div>
				<div
					ref={wrapperRef}
					className="p-4 rounded-md border relative bg-transparent"
				>
					<div
						className={`w-full flex justify-${justify} md:justify-center items-center overflow-x-auto md:overflow-visible`}
					>
						{activeContent?.props.children}
					</div>
				</div>
			</div>
		</div>
	);
};

export { DocsTab, DocsTabs };
