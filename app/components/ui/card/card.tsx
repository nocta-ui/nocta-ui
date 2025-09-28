import React from 'react';
import { cn } from '@/lib/utils';

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
	({ children, className = '', ...props }, ref) => {
		return (
			<div
				ref={ref}
				className={cn(
					'not-prose relative overflow-hidden rounded-lg border border-none bg-background shadow-md dark:border-solid',
					className,
				)}
				{...props}
			>
				{children}
			</div>
		);
	},
);

Card.displayName = 'Card';

export const CardHeader: React.FC<CardHeaderProps> = ({
	children,
	className = '',
	...props
}) => {
	return (
		<div className={cn('not-prose px-4 pt-4', className)} {...props}>
			{children}
		</div>
	);
};

export const CardTitle: React.FC<CardTitleProps> = ({
	children,
	className = '',
	as: Component = 'h3',
	...props
}) => {
	return React.createElement(
		Component,
		{
			className: cn(
				'not-prose text-base leading-tight font-semibold text-foreground',
				className,
			),
			...props,
		},
		children,
	);
};

export const CardDescription: React.FC<CardDescriptionProps> = ({
	children,
	className = '',
	...props
}) => {
	return (
		<p
			className={cn(
				'not-prose mt-1 text-sm leading-relaxed text-foreground-muted/80',
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
	className = '',
	...props
}) => {
	return (
		<div
			className={cn('not-prose text-md p-4 text-foreground-muted', className)}
			{...props}
		>
			{children}
		</div>
	);
};

export const CardFooter: React.FC<CardFooterProps> = ({
	children,
	className = '',
	...props
}) => {
	return (
		<div
			className={cn(
				'not-prose flex items-center justify-end border-t border-border/60 bg-background-muted/50 p-4 dark:bg-background-muted/30',
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
	className = '',
	...props
}) => {
	return (
		<div
			className={cn('not-prose flex items-center gap-2', className)}
			{...props}
		>
			{children}
		</div>
	);
};
