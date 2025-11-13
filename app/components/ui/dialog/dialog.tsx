'use client';

import * as Ariakit from '@ariakit/react';
import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';
import { Icons } from '@/app/components/ui/icons/icons';
import { cn } from '@/lib/utils';

const dialogContentVariants = cva(
	`not-prose relative max-h-[70vh] overflow-y-auto rounded-lg border border-border bg-card shadow-2xl`,
	{
		variants: {
			size: {
				sm: 'w-[50vw] md:max-w-sm',
				md: 'w-[65vw] md:max-w-md',
				lg: 'w-[80vw] md:max-w-lg',
				xl: 'w-[95vw] md:max-w-xl',
			},
		},
		defaultVariants: {
			size: 'md',
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

export interface DialogSurfaceProps
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
	store: Ariakit.DialogStore;
}

const DialogContext = React.createContext<DialogContextType | undefined>(
	undefined,
);

const useDialog = () => {
	const context = React.useContext(DialogContext);
	if (!context) {
		throw new Error('Dialog components must be used within a Dialog');
	}
	return context;
};

export const Dialog: React.FC<DialogProps> = ({
	children,
	open: controlledOpen,
	onOpenChange,
}) => {
	const store = Ariakit.useDialogStore(
		controlledOpen !== undefined
			? onOpenChange
				? { open: controlledOpen, setOpen: onOpenChange }
				: { open: controlledOpen }
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
	className = '',
	asChild = false,
	onClick,
	...props
}) => {
	const { store } = useDialog();
	const isOpen = Ariakit.useStoreState(store, 'open');

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
				'aria-haspopup': 'dialog',
				'aria-expanded': isOpen,
				...(children.props || {}),
			},
		);
	}

	return (
		<button
			className={cn(
				'not-prose not-prose inline-flex items-center justify-center rounded-lg font-medium transition-shadow duration-100 ease-basic focus-visible:ring-1 focus-visible:ring-ring/50 focus-visible:ring-offset-1 focus-visible:ring-offset-ring-offset/50 focus-visible:outline-none',
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

export const DialogSurface: React.FC<DialogSurfaceProps> = ({
	children,
	className = '',
	size = 'md',
	showClose = true,
	portal = true,
	...props
}) => {
	const { autoFocus, ...restProps } = props;
	const dialogProps =
		typeof autoFocus === 'undefined' ? restProps : { ...restProps, autoFocus };
	const { store } = useDialog();
	const open = Ariakit.useStoreState(store, 'open');
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
		<Ariakit.Dialog
			store={store}
			portal={portal}
			backdrop={
				<div
					className={cn(
						'fixed inset-0 z-40 bg-overlay/50 backdrop-blur-sm',
						'opacity-0 transition-opacity duration-300 ease-smooth',
						'data-enter:opacity-100 data-leave:opacity-0',
					)}
				/>
			}
			className={cn(
				dialogContentVariants({ size }),
				'fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 transform',
				'scale-105 opacity-0 blur-sm transition-[scale,opacity,blur] duration-300 ease-smooth',
				'data-enter:scale-100 data-enter:opacity-100 data-enter:blur-none',
				'data-leave:scale-105 data-leave:opacity-0 data-leave:blur-sm',
				className,
			)}
			{...dialogProps}
		>
			{showClose && (
				<DialogClose className="absolute top-2 right-2 z-10">
					<Icons.X aria-hidden="true" className="h-4 w-4" />
					<Ariakit.VisuallyHidden>Close</Ariakit.VisuallyHidden>
				</DialogClose>
			)}
			{children}
		</Ariakit.Dialog>
	);
};

export interface DialogContentProps
	extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
	className?: string;
}

export const DialogContent: React.FC<DialogContentProps> = ({
	children,
	className = '',
	...props
}) => {
	return (
		<div
			className={cn(
				'not-prose p-4 text-sm leading-snug text-foreground/70',
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
};

export const DialogHeader: React.FC<DialogHeaderProps> = ({
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

export const DialogTitle: React.FC<DialogTitleProps> = ({
	children,
	className = '',
	as: Component = 'h2',
	...props
}) => {
	return (
		<Ariakit.DialogHeading
			render={(headingProps) => React.createElement(Component, headingProps)}
			className={cn(
				'not-prose text-base leading-none font-medium text-foreground',
				className,
			)}
			{...props}
		>
			{children}
		</Ariakit.DialogHeading>
	);
};

export const DialogDescription: React.FC<DialogDescriptionProps> = ({
	children,
	className = '',
	...props
}) => {
	return (
		<Ariakit.DialogDescription
			className={cn(
				'not-prose mt-1 text-sm leading-snug text-foreground/45',
				className,
			)}
			{...props}
		>
			{children}
		</Ariakit.DialogDescription>
	);
};

export const DialogFooter: React.FC<DialogFooterProps> = ({
	children,
	className = '',
	...props
}) => {
	return (
		<div
			className={cn(
				'not-prose flex items-center justify-end rounded-b-lg border-t border-border/60 bg-card-muted/30 p-4',
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

export const DialogClose: React.FC<DialogCloseProps> = ({
	children,
	className = '',
	asChild = false,
	disabled,
	autoFocus,
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
			...(disabled !== undefined ? { disabled } : {}),
			...(autoFocus !== undefined ? { autoFocus } : {}),
			...props,
			...(child.props || {}),
		});
	}

	return (
		<Ariakit.DialogDismiss
			store={store}
			className={cn(
				'not-prose not-prose inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-sm text-foreground/45 transition-[background-color,box-shadow,opacity] duration-100 ease-basic hover:bg-card-muted hover:text-foreground/70 focus-visible:ring-1 focus-visible:ring-ring/50 focus-visible:ring-offset-1 focus-visible:ring-offset-ring-offset/50 focus-visible:outline-none',
				className,
			)}
			type="button"
			disabled={Boolean(disabled)}
			autoFocus={Boolean(autoFocus)}
			onClick={onClick}
			{...props}
		>
			{children}
		</Ariakit.DialogDismiss>
	);
};
