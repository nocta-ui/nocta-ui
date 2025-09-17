"use client";

import {
	Dialog as AriakitDialog,
	DialogDescription as AriakitDialogDescription,
	DialogDismiss as AriakitDialogDismiss,
	DialogHeading as AriakitDialogHeading,
	type DialogStore,
	useDialogStore,
	useStoreState,
} from "@ariakit/react";
import { cva, type VariantProps } from "class-variance-authority";
import React from "react";
import { cn } from "@/lib/utils";

const dialogContentVariants = cva(
	`relative bg-background border border-border-muted
   rounded-xl shadow-sm not-prose overflow-hidden
   transition-all duration-200 ease-in-out`,
	{
		variants: {
			size: {
				sm: "max-w-sm",
				md: "max-w-md",
				lg: "max-w-lg",
				xl: "max-w-xl",
				full: "max-w-full mx-4",
			},
		},
		defaultVariants: {
			size: "md",
		},
	},
);

export interface DialogProps {
	children: React.ReactNode;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export interface DialogTriggerProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode;
	asChild?: boolean;
	className?: string;
}

export interface DialogContentProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof dialogContentVariants> {
	children: React.ReactNode;
	className?: string;
	showClose?: boolean;
	portal?: boolean;
}

export interface DialogHeaderProps
	extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
	className?: string;
}

export interface DialogTitleProps
	extends React.HTMLAttributes<HTMLHeadingElement> {
	children: React.ReactNode;
	className?: string;
	as?: React.ElementType;
}

export interface DialogDescriptionProps
	extends React.HTMLAttributes<HTMLParagraphElement> {
	children: React.ReactNode;
	className?: string;
}

export interface DialogFooterProps
	extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
	className?: string;
}

export interface DialogActionsProps
	extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
	className?: string;
}

export interface DialogCloseProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children?: React.ReactNode;
	className?: string;
	asChild?: boolean;
}

interface DialogContextType {
	store: DialogStore;
}

const DialogContext = React.createContext<DialogContextType | undefined>(
	undefined,
);

const useDialog = () => {
	const context = React.useContext(DialogContext);
	if (!context) {
		throw new Error("Dialog components must be used within a Dialog");
	}
	return context;
};

export const Dialog: React.FC<DialogProps> = ({
	children,
	open: controlledOpen,
	onOpenChange,
}) => {
	const store = useDialogStore(
		controlledOpen !== undefined
			? { open: controlledOpen, setOpen: onOpenChange }
			: undefined,
	);

	return (
		<DialogContext.Provider value={{ store }}>
			{children}
		</DialogContext.Provider>
	);
};

export const DialogTrigger: React.FC<DialogTriggerProps> = ({
	children,
	className = "",
	asChild = false,
	onClick,
	...props
}) => {
	const { store } = useDialog();
	const isOpen = useStoreState(store, "open");

	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		store.show();
		onClick?.(e);
	};

	if (asChild && React.isValidElement(children)) {
		return React.cloneElement(
			children as React.ReactElement<
				React.ButtonHTMLAttributes<HTMLButtonElement>
			>,
			{
				onClick: handleClick,
				"aria-haspopup": "dialog",
				"aria-expanded": isOpen,
				...(children.props || {}),
			},
		);
	}

	return (
		<button
			className={cn(
				"inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-offset-ring-offset/50 not-prose focus-visible:ring-ring/50 focus-visible:border-border not-prose",
				className,
			)}
			onClick={handleClick}
			aria-haspopup="dialog"
			aria-expanded={isOpen}
			{...props}
		>
			{children}
		</button>
	);
};

export const DialogContent: React.FC<DialogContentProps> = ({
	children,
	className = "",
	size = "md",
	showClose = true,
	portal = true,
	...props
}) => {
	const { store } = useDialog();
	const open = useStoreState(store, "open");
	const [mounted, setMounted] = React.useState(open);
	React.useEffect(() => {
		if (open) {
			setMounted(true);
			return;
		}
		const t = window.setTimeout(() => setMounted(false), 200);
		return () => window.clearTimeout(t);
	}, [open]);

	if (!mounted) return null;

	return (
		<AriakitDialog
			store={store}
			portal={portal}
			backdrop={
				<div
					className={cn(
						"fixed inset-0 z-40 bg-overlay/50 backdrop-blur-sm",
						"transition-opacity duration-200 ease-in-out opacity-0",
						"data-[enter]:opacity-100 data-[leave]:opacity-0",
					)}
				/>
			}
			className={cn(
				dialogContentVariants({ size }),
				"fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform z-50",
				"transition-all duration-200 ease-in-out opacity-0 scale-105 blur-sm",
				"data-[enter]:opacity-100 data-[enter]:scale-100 data-[enter]:blur-none",
				"data-[leave]:opacity-0 data-[leave]:scale-105 data-[leave]:blur-sm",
				className,
			)}
			{...props}
		>
			{showClose && (
				<DialogClose className="absolute right-4 top-4 z-10">
					<svg
						aria-hidden="true"
						className="h-4 w-4"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
					<span className="sr-only">Close</span>
				</DialogClose>
			)}
			{children}
		</AriakitDialog>
	);
};

export const DialogHeader: React.FC<DialogHeaderProps> = ({
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

export const DialogTitle: React.FC<DialogTitleProps> = ({
	children,
	className = "",
	as: Component = "h2",
	...props
}) => {
	return (
		<AriakitDialogHeading
			render={(headingProps) => React.createElement(Component, headingProps)}
			className={cn(
				"text-lg font-semibold text-foreground tracking-tight leading-tight not-prose",
				className,
			)}
			{...props}
		>
			{children}
		</AriakitDialogHeading>
	);
};

export const DialogDescription: React.FC<DialogDescriptionProps> = ({
	children,
	className = "",
	...props
}) => {
	return (
		<AriakitDialogDescription
			className={cn(
				"text-sm text-primary-muted/80 leading-relaxed mt-2 not-prose",
				className,
			)}
			{...props}
		>
			{children}
		</AriakitDialogDescription>
	);
};

export const DialogFooter: React.FC<DialogFooterProps> = ({
	children,
	className = "",
	...props
}) => {
	return (
		<div
			className={cn(
				"p-4 bg-background-muted/50 dark:bg-background-muted/30 border-border-muted rounded-b-xl border-t flex items-center justify-end not-prose",
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
};

export const DialogActions: React.FC<DialogActionsProps> = ({
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

export const DialogClose: React.FC<DialogCloseProps> = ({
	children,
	className = "",
	asChild = false,
	onClick,
	...props
}) => {
	const { store } = useDialog();

	if (asChild && React.isValidElement(children)) {
		const child = children as React.ReactElement<
			React.ButtonHTMLAttributes<HTMLButtonElement>
		>;
		const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
			store.hide();
			child.props?.onClick?.(e);
			onClick?.(e);
		};
		return React.cloneElement(child, {
			onClick: handleClick,
			...props,
			...(child.props || {}),
		});
	}

	return (
		<AriakitDialogDismiss
			store={store}
			className={cn(
				"inline-flex items-center justify-center w-8 h-8 rounded-md text-foreground-subtle hover:text-primary-muted hover:bg-background transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-offset-ring-offset/50 not-prose focus-visible:ring-ring/50 focus-visible:border-border cursor-pointer not-prose",
				className,
			)}
			type="button"
			onClick={onClick}
			{...props}
		>
			{children}
		</AriakitDialogDismiss>
	);
};
