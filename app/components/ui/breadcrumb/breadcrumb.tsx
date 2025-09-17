"use client";

import { cva } from "class-variance-authority";
import React from "react";
import { cn } from "@/lib/utils";

const breadcrumbVariants = cva("flex items-center not-prose", {
	variants: {
		size: {
			sm: "text-xs",
			md: "text-sm",
			lg: "text-base",
		},
	},
	defaultVariants: {
		size: "md",
	},
});

const breadcrumbListVariants = cva("flex flex-wrap items-center not-prose", {
	variants: {
		size: {
			sm: "gap-1",
			md: "gap-1.5",
			lg: "gap-2",
		},
	},
	defaultVariants: {
		size: "md",
	},
});

const breadcrumbItemVariants = cva("inline-flex items-center", {
	variants: {
		size: {
			sm: "gap-1",
			md: "gap-1.5",
			lg: "gap-2",
		},
	},
	defaultVariants: {
		size: "md",
	},
});

const breadcrumbLinkVariants = cva(
	[
		"inline-flex items-center transition-colors duration-200 ease-in-out",
		"focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-offset-ring-offset/50 focus-visible:ring-ring/50",
		"focus-visible:border-border rounded-md",
	],
	{
		variants: {
			variant: {
				default: [
					"text-primary-muted/80",
					"hover:text-foreground",
					"underline-offset-4 hover:underline",
				],
				ghost: [
					"text-primary-muted/80",
					"hover:text-foreground",
					"hover:bg-background",
					"px-2 py-1 rounded-md",
				],
			},
			size: {
				sm: "text-xs",
				md: "text-sm",
				lg: "text-base",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "md",
		},
	},
);

const breadcrumbPageVariants = cva("text-foreground font-medium", {
	variants: {
		size: {
			sm: "text-xs",
			md: "text-sm",
			lg: "text-base",
		},
	},
	defaultVariants: {
		size: "md",
	},
});

const breadcrumbSeparatorVariants = cva("text-foreground-subtle select-none", {
	variants: {
		size: {
			sm: "text-xs",
			md: "text-sm",
			lg: "text-base",
		},
	},
	defaultVariants: {
		size: "md",
	},
});

export interface BreadcrumbProps
	extends Omit<React.ComponentPropsWithoutRef<"nav">, "size"> {
	size?: "sm" | "md" | "lg";
	separator?: React.ReactNode;
	className?: string;
}

export interface BreadcrumbListProps
	extends Omit<React.ComponentPropsWithoutRef<"ol">, "size"> {
	size?: "sm" | "md" | "lg";
	className?: string;
}

export interface BreadcrumbItemProps
	extends Omit<React.ComponentPropsWithoutRef<"li">, "size"> {
	size?: "sm" | "md" | "lg";
	className?: string;
}

export interface BreadcrumbLinkProps
	extends Omit<React.ComponentPropsWithoutRef<"a">, "size"> {
	variant?: "default" | "ghost";
	size?: "sm" | "md" | "lg";
	className?: string;
	asChild?: boolean;
}

export interface BreadcrumbPageProps
	extends Omit<React.ComponentPropsWithoutRef<"span">, "size"> {
	size?: "sm" | "md" | "lg";
	className?: string;
}

export interface BreadcrumbSeparatorProps
	extends Omit<React.ComponentPropsWithoutRef<"li">, "size"> {
	size?: "sm" | "md" | "lg";
	className?: string;
	children?: React.ReactNode;
}

export interface BreadcrumbEllipsisProps
	extends React.ComponentPropsWithoutRef<"span"> {
	className?: string;
}

const BreadcrumbContext = React.createContext<{
	size?: "sm" | "md" | "lg";
	separator?: React.ReactNode;
}>({
	size: undefined,
	separator: undefined,
});

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
	size = "md",
	separator = "/",
	className,
	children,
	...props
}) => {
	return (
		<BreadcrumbContext.Provider value={{ size, separator }}>
			<nav
				aria-label="Breadcrumb"
				className={cn(breadcrumbVariants({ size }), className)}
				{...props}
			>
				{children}
			</nav>
		</BreadcrumbContext.Provider>
	);
};

export const BreadcrumbList: React.FC<BreadcrumbListProps> = ({
	size,
	className,
	children,
	...props
}) => {
	const context = React.useContext(BreadcrumbContext);
	const effectiveSize = size ?? context.size ?? "md";

	return (
		<ol
			className={cn(breadcrumbListVariants({ size: effectiveSize }), className)}
			{...props}
		>
			{children}
		</ol>
	);
};

export const BreadcrumbItem: React.FC<BreadcrumbItemProps> = ({
	size,
	className,
	children,
	...props
}) => {
	const context = React.useContext(BreadcrumbContext);
	const effectiveSize = size ?? context.size ?? "md";

	return (
		<li
			className={cn(breadcrumbItemVariants({ size: effectiveSize }), className)}
			{...props}
		>
			{children}
		</li>
	);
};

export const BreadcrumbLink: React.FC<BreadcrumbLinkProps> = ({
	variant = "default",
	size,
	className,
	children,
	...props
}) => {
	const context = React.useContext(BreadcrumbContext);
	const effectiveSize = size ?? context.size ?? "md";

	return (
		<a
			className={cn(
				breadcrumbLinkVariants({ variant, size: effectiveSize }),
				className,
			)}
			{...props}
		>
			{children}
		</a>
	);
};

export const BreadcrumbPage: React.FC<BreadcrumbPageProps> = ({
	size,
	className,
	children,
	...props
}) => {
	const context = React.useContext(BreadcrumbContext);
	const effectiveSize = size ?? context.size ?? "md";

	return (
		<span
			aria-current="page"
			className={cn(breadcrumbPageVariants({ size: effectiveSize }), className)}
			{...props}
		>
			{children}
		</span>
	);
};

export const BreadcrumbSeparator: React.FC<BreadcrumbSeparatorProps> = ({
	size,
	className,
	children,
	...props
}) => {
	const context = React.useContext(BreadcrumbContext);
	const effectiveSize = size ?? context.size ?? "md";
	const separator = children ?? context.separator ?? "/";

	return (
		<li
			role="presentation"
			aria-hidden="true"
			className={cn(
				breadcrumbSeparatorVariants({ size: effectiveSize }),
				className,
			)}
			{...props}
		>
			{separator}
		</li>
	);
};

export const BreadcrumbEllipsis: React.FC<BreadcrumbEllipsisProps> = ({
	className,
	...props
}) => {
	return (
		<span
			className={cn("flex h-9 w-9 items-center justify-center", className)}
			{...props}
		>
			<span className="sr-only">More</span>
			<span
				role="presentation"
				aria-hidden="true"
				className="flex h-9 w-9 items-center justify-center"
			>
				<svg
					aria-hidden="true"
					className="h-4 w-4"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M5 12h.01M12 12h.01M19 12h.01"
					/>
				</svg>
			</span>
		</span>
	);
};
