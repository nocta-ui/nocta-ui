import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
	className?: string;
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
	className?: string;
}

export interface CardTitleProps {
	children: React.ReactNode;
	className?: string;
	as?: React.ElementType;
}

export interface CardDescriptionProps
	extends React.HTMLAttributes<HTMLParagraphElement> {
	children: React.ReactNode;
	className?: string;
}

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
	className?: string;
}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
	className?: string;
}

export interface CardActionsProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
	className?: string;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
	({ children, className = "", ...props }, ref) => {
		return (
			<div
				ref={ref}
				className={cn(
					"relative bg-background border border-border rounded-lg shadow-sm overflow-hidden not-prose",
					className,
				)}
				{...props}
			>
				{children}
			</div>
		);
	},
);

Card.displayName = "Card";

export const CardHeader: React.FC<CardHeaderProps> = ({
	children,
	className = "",
	...props
}) => {
	return (
		<div
			className={cn("p-4 not-prose border-b border-border-muted", className)}
			{...props}
		>
			{children}
		</div>
	);
};

export const CardTitle: React.FC<CardTitleProps> = ({
	children,
	className = "",
	as: Component = "h3",
	...props
}) => {
	return React.createElement(
		Component,
		{
			className: cn(
				"text-base font-semibold text-foreground tracking-tight leading-tight not-prose",
				className,
			),
			...props,
		},
		children,
	);
};

export const CardDescription: React.FC<CardDescriptionProps> = ({
	children,
	className = "",
	...props
}) => {
	return (
		<p
			className={cn(
				"text-sm text-foreground-muted/80 leading-relaxed mt-1 not-prose",
				className,
			)}
			{...props}
		>
			{children}
		</p>
	);
};

export const CardContent: React.FC<CardContentProps> = ({
	children,
	className = "",
	...props
}) => {
	return (
		<div
			className={cn("p-4 not-prose text-md text-foreground-muted", className)}
			{...props}
		>
			{children}
		</div>
	);
};

export const CardFooter: React.FC<CardFooterProps> = ({
	children,
	className = "",
	...props
}) => {
	return (
		<div
			className={cn(
				"p-4 bg-background-muted/50 dark:bg-background-muted/30 border-t border-border-muted flex items-center justify-end not-prose",
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
};

export const CardActions: React.FC<CardActionsProps> = ({
	children,
	className = "",
	...props
}) => {
	return (
		<div
			className={cn("flex items-center gap-2 not-prose", className)}
			{...props}
		>
			{children}
		</div>
	);
};
