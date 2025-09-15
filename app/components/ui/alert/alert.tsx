import { cva, type VariantProps } from "class-variance-authority";
import React from "react";
import { cn } from "@/lib/utils";

const alertVariants = cva(
	"relative rounded-lg border border-border-muted px-4 py-3 flex items-start gap-3 transition-all duration-200 ease-in-out w-fit shadow-lg not-prose",
	{
		variants: {
			variant: {
				default:
					"border-border-muted bg-background text-primary-muted [&>svg]:text-primary-muted overflow-hidden",
				destructive:
					"border-red-200 dark:border-red-800/50 bg-red-50 dark:bg-red-950/50 text-red-900 dark:text-red-100 [&>svg]:text-red-600 dark:[&>svg]:text-red-400",
				warning:
					"border-yellow-200 dark:border-yellow-800/50 bg-yellow-50 dark:bg-yellow-950/50 text-yellow-900 dark:text-yellow-100 [&>svg]:text-yellow-600 dark:[&>svg]:text-yellow-400",
				success:
					"border-green-200 dark:border-green-800/50 bg-green-50 dark:bg-green-950/50 text-green-900 dark:text-green-100 [&>svg]:text-green-600 dark:[&>svg]:text-green-400",
			},
			size: {
				default: "px-4 py-3",
				sm: "px-3 py-2",
				lg: "px-6 py-4",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

const alertTitleVariants = cva(
	"mb-1 font-medium leading-none tracking-tight not-prose",
	{
		variants: {
			size: {
				default: "text-sm",
				sm: "text-xs",
				lg: "text-base",
			},
		},
		defaultVariants: {
			size: "default",
		},
	},
);

const alertDescriptionVariants = cva(
	"[&_p]:leading-relaxed opacity-90 not-prose",
	{
		variants: {
			size: {
				default: "text-xs",
				sm: "text-xs",
				lg: "text-sm",
			},
		},
		defaultVariants: {
			size: "default",
		},
	},
);

export interface AlertProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof alertVariants> {
	className?: string;
	children: React.ReactNode;
}

export interface AlertTitleProps
	extends React.HTMLAttributes<HTMLHeadingElement>,
		VariantProps<typeof alertTitleVariants> {
	children: React.ReactNode;
	className?: string;
	as?: React.ElementType;
}

export interface AlertDescriptionProps
	extends React.HTMLAttributes<HTMLParagraphElement>,
		VariantProps<typeof alertDescriptionVariants> {
	children: React.ReactNode;
	className?: string;
}

export interface AlertIconProps {
	children: React.ReactNode;
	className?: string;
}

export const Alert: React.FC<AlertProps> = ({
	variant,
	size,
	className,
	children,
	...props
}) => {
	return (
		<div
			role="alert"
			className={cn(alertVariants({ variant, size }), className)}
			{...props}
		>
			{React.Children.map(children, (child, index) => {
				if (React.isValidElement(child) && child.type === AlertIcon) {
					return child;
				}
				if (
					index === 0 &&
					React.isValidElement(child) &&
					child.type === AlertIcon
				) {
					return child;
				}
				return null;
			})}
			<div className="flex flex-col min-w-0 flex-1">
				{React.Children.map(children, (child) => {
					if (React.isValidElement(child) && child.type !== AlertIcon) {
						return child;
					}
					return null;
				})}
			</div>
		</div>
	);
};

export const AlertTitle: React.FC<AlertTitleProps> = ({
	children,
	className,
	size,
	as: Component = "h5",
	...props
}) => {
	return React.createElement(
		Component,
		{
			className: cn(alertTitleVariants({ size }), className),
			...props,
		},
		children,
	);
};

export const AlertDescription: React.FC<AlertDescriptionProps> = ({
	children,
	className,
	size,
	...props
}) => {
	return (
		<div
			className={cn(alertDescriptionVariants({ size }), className)}
			{...props}
		>
			{children}
		</div>
	);
};

export const AlertIcon: React.FC<AlertIconProps> = ({
	children,
	className = "",
}) => {
	return (
		<div
			aria-hidden="true"
			className={cn("w-4 h-4 flex-shrink-0 mt-0.5", className)}
		>
			{children}
		</div>
	);
};
