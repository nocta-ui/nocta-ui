"use client";

import { cn } from "fumadocs-ui/utils/cn";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface DocsTabProps {
	children?: React.ReactNode;
	title: string;
	value: string;
	isActive?: boolean;
	onClick?: (value: string) => void;
}

const DocsTab = ({
	children,
	title,
	value,
	isActive = false,
	onClick,
}: DocsTabProps) => {
	if (onClick) {
		return (
			<button
				onClick={() => onClick(value)}
				className={cn(
					"relative px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ease-out group",
					isActive
						? "bg-nocta-100 dark:bg-nocta-950 text-fd-foreground shadow-sm ring-1 ring-fd-border/20"
						: "text-fd-muted-foreground hover:text-fd-foreground hover:bg-fd-secondary/50 hover:shadow-sm",
					"hover:scale-[1.02] active:scale-[0.98]",
				)}
			>
				<span className="relative z-10">{title}</span>
				{isActive && (
					<div className="absolute bottom-0 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-fd-primary/60 transition-all duration-300" />
				)}
			</button>
		);
	}

	return <>{children}</>;
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
	const [isTransitioning, setIsTransitioning] = useState(false);
	const contentRef = useRef<HTMLDivElement>(null);
	const wrapperRef = useRef<HTMLDivElement>(null);
	const [height, setHeight] = useState<number | "auto">("auto");

	const tabs = React.Children.toArray(children).filter(
		(child): child is React.ReactElement<DocsTabProps> =>
			React.isValidElement(child) && typeof child.type !== "string",
	);

	const activeContent = tabs.find((tab) => tab.props.value === activeTab);

	const measureHeight = useCallback(() => {
		if (wrapperRef.current && contentRef.current) {
			const naturalHeight = wrapperRef.current.scrollHeight;
			const containerPadding = 12;
			setHeight(naturalHeight + containerPadding);
		}
	}, []);

	useEffect(() => {
		const timer = setTimeout(measureHeight, 10);
		return () => clearTimeout(timer);
	}, [activeTab, measureHeight]);

	useEffect(() => {
		if (!wrapperRef.current) return;

		const resizeObserver = new ResizeObserver(() => {
			measureHeight();
		});

		resizeObserver.observe(wrapperRef.current);

		return () => resizeObserver.disconnect();
	}, [measureHeight]);

	const handleTabChange = (value: string) => {
		if (value === activeTab) return;

		setIsTransitioning(true);

		setTimeout(() => {
			setActiveTab(value);
			setTimeout(() => {
				setIsTransitioning(false);
			}, 150);
		}, 150);
	};

	return (
		<div className="not-prose group relative my-4 rounded-lg border bg-nocta-200 dark:bg-nocta-900 text-sm outline-none">
			<div className="flex items-center gap-2 px-4 py-1.5">
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
				className="transition-all duration-300 ease-in-out p-1 relative"
				style={{
					height: height === "auto" ? "auto" : `${height}px`,
				}}
			>
				<div className="absolute inset-1 border rounded-md bg-nocta-50 dark:bg-nocta-950 z-0"></div>
				<div
					ref={wrapperRef}
					className={cn(
						"p-4 bg-nocta-50 dark:bg-nocta-950 rounded-md border transition-opacity duration-150 ease-in-out relative",
						isTransitioning ? "opacity-0" : "opacity-100",
					)}
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
