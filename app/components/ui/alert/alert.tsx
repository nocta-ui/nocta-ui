import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

import { Icons } from '@/app/components/ui/icons/icons';
import { cn } from '@/lib/utils';

const alertVariants = cva(
	'not-prose relative flex w-fit items-start gap-3 rounded-lg border border-none px-4 py-3 shadow-sm transition-all duration-200 ease-in-out dark:border-solid',
	{
		variants: {
			variant: {
				default:
					'overflow-hidden border-border bg-background text-foreground-muted [&_[data-slot=alert-icon]]:text-foreground-muted',
				destructive:
					'border-border bg-background text-error/90 [&_[data-slot=alert-icon]]:text-error/90',
				warning:
					'border-border bg-background text-warning/90 [&_[data-slot=alert-icon]]:text-warning/90',
				success:
					'border-border bg-background text-success/90 [&_[data-slot=alert-icon]]:text-success/90',
			},
			size: {
				default: 'px-4 py-3',
				sm: 'px-3 py-2',
				lg: 'px-6 py-4',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	},
);

const alertTitleVariants = cva('not-prose mb-1 leading-none font-semibold', {
	variants: {
		size: {
			default: 'text-sm',
			sm: 'text-xs',
			lg: 'text-base',
		},
	},
	defaultVariants: {
		size: 'default',
	},
});

const alertDescriptionVariants = cva(
	'not-prose text-foreground-muted/80 opacity-90 [&_p]:leading-relaxed',
	{
		variants: {
			size: {
				default: 'text-xs',
				sm: 'text-xs',
				lg: 'text-sm',
			},
		},
		defaultVariants: {
			size: 'default',
		},
	},
);

type AlertVariant = NonNullable<VariantProps<typeof alertVariants>['variant']>;

type IconComponent = typeof Icons.Info;

const variantIconMap: Record<AlertVariant, IconComponent> = {
	default: Icons.Info,
	destructive: Icons.X,
	warning: Icons.Warning,
	success: Icons.Success,
};

export interface AlertProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof alertVariants> {
	className?: string;
	children: React.ReactNode;
	showIcon?: boolean;
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
	showIcon = true,
	...props
}) => {
	const variantKey = (variant ?? 'default') as AlertVariant;
	const DefaultIcon = variantIconMap[variantKey] ?? Icons.Info;

	const childrenArray = React.Children.toArray(children);
	const iconIndex = childrenArray.findIndex(
		(child) => React.isValidElement(child) && child.type === AlertIcon,
	);

	const contentChildren = childrenArray.filter(
		(_, index) => index !== iconIndex,
	);

	let iconElement: React.ReactNode | null = null;

	if (showIcon && iconIndex !== -1) {
		iconElement = childrenArray[iconIndex];
	} else if (showIcon && DefaultIcon) {
		iconElement = (
			<div
				aria-hidden="true"
				data-slot="alert-icon"
				className="mt-0.5 flex h-4 w-4 shrink-0 text-current"
			>
				<DefaultIcon aria-hidden="true" className="h-4 w-4" />
			</div>
		);
	}

	return (
		<div
			role="alert"
			className={cn(alertVariants({ variant, size }), className)}
			{...props}
		>
			{iconElement}
			<div className="flex min-w-0 flex-1 flex-col">{contentChildren}</div>
		</div>
	);
};

export const AlertTitle: React.FC<AlertTitleProps> = ({
	children,
	className,
	size,
	as: Component = 'h5',
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
	className = '',
}) => {
	return (
		<div
			aria-hidden="true"
			data-slot="alert-icon"
			className={cn('mt-0.5 flex h-4 w-4 shrink-0 text-current', className)}
		>
			{children}
		</div>
	);
};
