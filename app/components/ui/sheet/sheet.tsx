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

const sheetContentVariants = cva(
	"fixed flex flex-col bg-background border-border-muted overflow-hidden shadow-xl dark:shadow-2xl border transform transition-transform duration-200 ease-in-out",
	{
		variants: {
			side: {
				left: "left-0 top-0 h-full rounded-r-2xl",
				right: "right-0 top-0 h-full rounded-l-2xl",
				top: "top-0 left-0 w-full rounded-b-2xl",
				bottom: "bottom-0 left-0 w-full rounded-t-2xl",
			},
			size: {
				sm: "",
				md: "",
				lg: "",
				xl: "",
				full: "",
			},
		},
		compoundVariants: [
			{
				side: "left",
				size: "sm",
				class: "w-[70vw] sm:w-80",
			},
			{
				side: "left",
				size: "md",
				class: "w-[80vw] sm:w-96",
			},
			{
				side: "left",
				size: "lg",
				class: "w-[90vw] sm:w-[28rem]",
			},
			{
				side: "left",
				size: "xl",
				class: "w-[95vw] sm:w-[32rem]",
			},
			{
				side: "left",
				size: "full",
				class: "w-full",
			},
			{
				side: "right",
				size: "sm",
				class: "w-[70vw] sm:w-80",
			},
			{
				side: "right",
				size: "md",
				class: "w-[80vw] sm:w-96",
			},
			{
				side: "right",
				size: "lg",
				class: "w-[90vw] sm:w-[28rem]",
			},
			{
				side: "right",
				size: "xl",
				class: "w-[95vw] sm:w-[32rem]",
			},
			{
				side: "right",
				size: "full",
				class: "w-full",
			},
			{
				side: "top",
				size: "sm",
				class: "h-[40vh] sm:h-80",
			},
			{
				side: "top",
				size: "md",
				class: "h-[55vh] sm:h-96",
			},
			{
				side: "top",
				size: "lg",
				class: "h-[70vh] sm:h-[28rem]",
			},
			{
				side: "top",
				size: "xl",
				class: "h-[85vh] sm:h-[32rem]",
			},
			{
				side: "top",
				size: "full",
				class: "h-full",
			},
			{
				side: "bottom",
				size: "sm",
				class: "h-[40vh] sm:h-80",
			},
			{
				side: "bottom",
				size: "md",
				class: "h-[55vh] sm:h-96",
			},
			{
				side: "bottom",
				size: "lg",
				class: "h-[70vh] sm:h-[28rem]",
			},
			{
				side: "bottom",
				size: "xl",
				class: "h-[85vh] sm:h-[32rem]",
			},
			{
				side: "bottom",
				size: "full",
				class: "h-full",
			},
		],
		defaultVariants: {
			side: "right",
			size: "md",
		},
	},
);

export interface SheetProps {
	children: React.ReactNode;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export interface SheetTriggerProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode;
	asChild?: boolean;
	className?: string;
}

export interface SheetContentProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof sheetContentVariants> {
	children: React.ReactNode;
	className?: string;
	showClose?: boolean;
}

export interface SheetHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
	className?: string;
}

export interface SheetTitleProps
	extends React.HTMLAttributes<HTMLHeadingElement> {
	children: React.ReactNode;
	className?: string;
	as?: React.ElementType;
}

export interface SheetDescriptionProps
	extends React.HTMLAttributes<HTMLParagraphElement> {
	children: React.ReactNode;
	className?: string;
}

export interface SheetFooterProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
	className?: string;
}

export interface SheetCloseProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children?: React.ReactNode;
	className?: string;
	asChild?: boolean;
}

interface SheetContextType {
	store: DialogStore;
}

const SheetContext = React.createContext<SheetContextType | undefined>(
	undefined,
);

const useSheet = () => {
	const context = React.useContext(SheetContext);
	if (!context) {
		throw new Error("Sheet components must be used within a Sheet");
	}
	return context;
};

export const Sheet: React.FC<SheetProps> = ({
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
		<SheetContext.Provider value={{ store }}>{children}</SheetContext.Provider>
	);
};

export const SheetTrigger: React.FC<SheetTriggerProps> = ({
	children,
	className = "",
	asChild = false,
	onClick,
	...props
}) => {
	const { store } = useSheet();
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
				"inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-offset-ring-offset/50 not-prose focus-visible:ring-ring/50 focus-visible:border-border/10 not-prose cursor-pointer",
				className,
			)}
			type="button"
			onClick={handleClick}
			aria-haspopup="dialog"
			aria-expanded={isOpen}
			{...props}
		>
			{children}
		</button>
	);
};

export const SheetContent: React.FC<SheetContentProps> = ({
	children,
	className = "",
	side = "right",
	size = "md",
	showClose = true,
	...props
}) => {
	const { store } = useSheet();
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

	const sideTransform =
		side === "left"
			? "-translate-x-full data-[enter]:translate-x-0 data-[leave]:-translate-x-full"
			: side === "right"
				? "translate-x-full data-[enter]:translate-x-0 data-[leave]:translate-x-full"
				: side === "top"
					? "-translate-y-full data-[enter]:translate-y-0 data-[leave]:-translate-y-full"
					: "translate-y-full data-[enter]:translate-y-0 data-[leave]:translate-y-full";

	return (
		<AriakitDialog
			store={store}
			portal
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
				sheetContentVariants({ side, size }),
				"z-50",
				sideTransform,
				className,
			)}
			{...props}
		>
			{showClose && (
				<AriakitDialogDismiss className="absolute right-4 top-4 z-10 inline-flex items-center justify-center w-8 h-8 rounded-md text-foreground-subtle hover:text-primary-muted hover:bg-background transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-offset-ring-offset/50 not-prose focus-visible:ring-ring/50 focus-visible:border-border/10 cursor-pointer">
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
				</AriakitDialogDismiss>
			)}
			{children}
		</AriakitDialog>
	);
};

export const SheetHeader: React.FC<SheetHeaderProps> = ({
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

export const SheetTitle: React.FC<SheetTitleProps> = ({
	children,
	className = "",
	as: _Component = "h2",
	...props
}) => {
	return (
		<AriakitDialogHeading
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

export const SheetDescription: React.FC<SheetDescriptionProps> = ({
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

export const SheetFooter: React.FC<SheetFooterProps> = ({
	children,
	className = "",
	...props
}) => {
	return (
		<div
			className={cn(
				"p-4 mt-auto bg-background-muted/50 dark:bg-background-muted/30 border-t border-border-muted flex items-center justify-end gap-3 not-prose",
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
};

export const SheetClose: React.FC<SheetCloseProps> = ({
	children,
	className = "",
	asChild = false,
	onClick,
	...props
}) => {
	const { store } = useSheet();

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
				"inline-flex items-center justify-center rounded-lg font-medium px-4 py-2 text-sm bg-transparent text-foreground hover:bg-background-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-offset-ring-offset/50 focus-visible:ring-ring/50 cursor-pointer",
				className,
			)}
			type="button"
			onClick={onClick}
			{...props}
		>
			{children || "Close"}
		</AriakitDialogDismiss>
	);
};
