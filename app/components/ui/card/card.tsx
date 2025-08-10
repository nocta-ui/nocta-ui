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
				className="relative p-[1px] bg-linear-to-b from-nocta-300 dark:from-nocta-100/20 to-transparent rounded-xl w-fit"
			>
				<div
					className={cn(
						"bg-nocta-100 dark:bg-nocta-900 rounded-xl shadow-sm dark:shadow-lg transition-all duration-300 ease-out backdrop-blur-sm overflow-hidden not-prose",
						className,
					)}
					{...props}
				>
					{children}
				</div>
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
			className={cn(
				"px-6 py-5 border-b border-nocta-200 dark:border-nocta-800/50 not-prose",
				className,
			)}
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
				"text-lg font-semibold text-nocta-900 dark:text-nocta-100 tracking-tight leading-tight not-prose",
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
				"text-sm text-nocta-600 dark:text-nocta-400 leading-relaxed mt-1 not-prose",
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
		<div className={cn("px-6 py-5 not-prose text-sm", className)} {...props}>
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
				"px-6 py-4 bg-nocta-200/50 dark:bg-nocta-800/50 border-t border-nocta-200 dark:border-nocta-800/50 flex items-center justify-end not-prose",
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
