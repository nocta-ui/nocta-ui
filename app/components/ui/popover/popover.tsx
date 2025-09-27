"use client";

import * as Ariakit from "@ariakit/react";
import { cva, type VariantProps } from "class-variance-authority";
import React from "react";
import { cn } from "@/lib/utils";

const popoverTriggerVariants = cva(
	"inline-flex items-center justify-center rounded-md shadow-sm border border-none dark:border-solid focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-offset-ring-offset/50 not-prose focus-visible:ring-ring/50 focus-visible:border-border transition-colors duration-200 not-prose cursor-pointer",
	{
		variants: {
			variant: {
				default:
					"border-border bg-background text-foreground hover:bg-background-muted/50",
			},
			size: {
				sm: "px-2 py-1 text-xs",
				md: "px-3 py-2 text-sm",
				lg: "px-4 py-3 text-base",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "md",
		},
	},
);

const popoverContentVariants = cva(
	"w-fit min-w-[8rem] max-w-[var(--popover-available-width,_theme(spacing.80))] rounded-lg bg-background-muted p-4 shadow-md not-prose relative text-foreground overflow-hidden border border-none dark:border-solid border-border",
	{
		variants: {
			size: {
				sm: "p-2 text-sm",
				md: "p-4 text-sm",
				lg: "p-6 text-base",
			},
		},
		defaultVariants: {
			size: "md",
		},
	},
);

const popoverMotion =
	"transform will-change-transform duration-200 ease-in-out transition opacity-0 scale-95 translate-y-1 data-[enter]:opacity-100 data-[enter]:scale-100 data-[enter]:translate-y-0 data-[leave]:opacity-0 data-[leave]:scale-95 data-[leave]:translate-y-1";

export interface PopoverProps {
	children: React.ReactNode;
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export interface PopoverTriggerProps
	extends VariantProps<typeof popoverTriggerVariants> {
	children: React.ReactNode;
	asChild?: boolean;
	className?: string;
}

export interface PopoverContentProps
	extends VariantProps<typeof popoverContentVariants> {
	children: React.ReactNode;
	className?: string;
	portal?: boolean;
	fixed?: boolean;
}

const PopoverStoreContext = React.createContext<Ariakit.PopoverStore | null>(
	null,
);

export const Popover: React.FC<PopoverProps> = ({
	children,
	open,
	defaultOpen = false,
	onOpenChange,
}) => {
	const store = Ariakit.usePopoverStore({
		open,
		defaultOpen,
		setOpen: onOpenChange,
	});

	return (
		<PopoverStoreContext.Provider value={store}>
			<Ariakit.PopoverProvider store={store}>
				<div className="relative not-prose">{children}</div>
			</Ariakit.PopoverProvider>
		</PopoverStoreContext.Provider>
	);
};

export const PopoverTrigger: React.FC<PopoverTriggerProps> = ({
	children,
	asChild = false,
	className = "",
	variant = "default",
	size = "md",
}) => {
	const store = React.useContext(PopoverStoreContext);
	if (!store) throw new Error("PopoverTrigger must be used within <Popover>");

	if (asChild && React.isValidElement(children)) {
		const child = children as React.ReactElement<{ className?: string }>;
		const merged = React.cloneElement(child, {
			className: cn(
				child.props.className,
				popoverTriggerVariants({ variant, size }),
				"font-medium",
				className,
			),
		});

		return <Ariakit.PopoverDisclosure render={merged} />;
	}

	return (
		<Ariakit.PopoverDisclosure
			className={cn(
				popoverTriggerVariants({ variant, size }),
				"font-medium",
				className,
			)}
		>
			{children}
		</Ariakit.PopoverDisclosure>
	);
};

export const PopoverContent: React.FC<PopoverContentProps> = ({
	children,
	className = "",
	size = "md",
	portal = true,
	fixed = false,
}) => {
	const store = React.useContext(PopoverStoreContext);
	if (!store) throw new Error("PopoverContent must be used within <Popover>");

	return (
		<Ariakit.Popover
			portal={portal}
			fixed={fixed}
			gutter={8}
			className={cn(popoverContentVariants({ size }), popoverMotion, className)}
		>
			{children}
		</Ariakit.Popover>
	);
};
