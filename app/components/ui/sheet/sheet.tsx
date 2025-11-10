'use client';

import * as Ariakit from '@ariakit/react';
import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';
import { Icons } from '@/app/components/ui/icons/icons';
import { cn } from '@/lib/utils';

const sheetContentVariants = cva(
	'fixed flex transform flex-col border border-border bg-card shadow-2xl transition-transform duration-300 ease-smooth',
	{
		variants: {
			side: {
				left: 'top-0 left-0 h-full rounded-r-lg',
				right: 'top-0 right-0 h-full rounded-l-lg',
				top: 'top-0 left-0 w-full rounded-b-lg',
				bottom: 'bottom-0 left-0 w-full rounded-t-lg',
			},
			size: {
				sm: '',
				md: '',
				lg: '',
				xl: '',
				full: '',
			},
		},
		compoundVariants: [
			{
				side: 'left',
				size: 'sm',
				class: 'w-[70vw] sm:w-80',
			},
			{
				side: 'left',
				size: 'md',
				class: 'w-[80vw] sm:w-96',
			},
			{
				side: 'left',
				size: 'lg',
				class: 'w-[90vw] sm:w-[28rem]',
			},
			{
				side: 'left',
				size: 'xl',
				class: 'w-[95vw] sm:w-[32rem]',
			},
			{
				side: 'left',
				size: 'full',
				class: 'w-full',
			},
			{
				side: 'right',
				size: 'sm',
				class: 'w-[70vw] sm:w-80',
			},
			{
				side: 'right',
				size: 'md',
				class: 'w-[80vw] sm:w-96',
			},
			{
				side: 'right',
				size: 'lg',
				class: 'w-[90vw] sm:w-[28rem]',
			},
			{
				side: 'right',
				size: 'xl',
				class: 'w-[95vw] sm:w-[32rem]',
			},
			{
				side: 'right',
				size: 'full',
				class: 'w-full',
			},
			{
				side: 'top',
				size: 'sm',
				class: 'h-[40vh] sm:h-80',
			},
			{
				side: 'top',
				size: 'md',
				class: 'h-[55vh] sm:h-96',
			},
			{
				side: 'top',
				size: 'lg',
				class: 'h-[70vh] sm:h-[28rem]',
			},
			{
				side: 'top',
				size: 'xl',
				class: 'h-[85vh] sm:h-[32rem]',
			},
			{
				side: 'top',
				size: 'full',
				class: 'h-full',
			},
			{
				side: 'bottom',
				size: 'sm',
				class: 'h-[40vh] sm:h-80',
			},
			{
				side: 'bottom',
				size: 'md',
				class: 'h-[55vh] sm:h-96',
			},
			{
				side: 'bottom',
				size: 'lg',
				class: 'h-[70vh] sm:h-[28rem]',
			},
			{
				side: 'bottom',
				size: 'xl',
				class: 'h-[85vh] sm:h-[32rem]',
			},
			{
				side: 'bottom',
				size: 'full',
				class: 'h-full',
			},
		],
		defaultVariants: {
			side: 'right',
			size: 'md',
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
	resizable?: boolean;
	allowShrink?: boolean;
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
	store: Ariakit.DialogStore;
}

const SheetContext = React.createContext<SheetContextType | undefined>(
	undefined,
);

const useSheet = () => {
	const context = React.useContext(SheetContext);
	if (!context) {
		throw new Error('Sheet components must be used within a Sheet');
	}
	return context;
};

export const Sheet: React.FC<SheetProps> = ({
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
		<SheetContext.Provider value={{ store }}>{children}</SheetContext.Provider>
	);
};

export const SheetTrigger: React.FC<SheetTriggerProps> = ({
	children,
	className = '',
	asChild = false,
	onClick,
	...props
}) => {
	const { store } = useSheet();
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
				'not-prose not-prose inline-flex cursor-pointer items-center justify-center rounded-md font-medium transition-all duration-300 ease-smooth focus-visible:border-border focus-visible:ring-1 focus-visible:ring-ring/50 focus-visible:ring-offset-1 focus-visible:ring-offset-ring-offset/50 focus-visible:outline-none',
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
	className = '',
	side = 'right',
	size = 'md',
	showClose = true,
	resizable = false,
	allowShrink = false,
	style: inlineStyle,
	autoFocus,
	...props
}) => {
	const { store } = useSheet();
	const open = Ariakit.useStoreState(store, 'open');
	const [mounted, setMounted] = React.useState(open);
	const contentRef = React.useRef<HTMLDivElement>(null);
	const [customSize, setCustomSize] = React.useState<number | null>(null);
	const baseSizeRef = React.useRef(0);
	const startPosRef = React.useRef(0);
	const startSizeRef = React.useRef(0);
	const isResizingRef = React.useRef(false);

	React.useEffect(() => {
		if (open) {
			setMounted(true);
			return;
		}
		const t = window.setTimeout(() => setMounted(false), 200);
		return () => window.clearTimeout(t);
	}, [open]);

	const applySizeFromPointer = React.useCallback(
		(point: { clientX: number; clientY: number }) => {
			if (!isResizingRef.current) return;
			let delta = 0;
			if (side === 'left') {
				delta = point.clientX - startPosRef.current;
			} else if (side === 'right') {
				delta = startPosRef.current - point.clientX;
			} else if (side === 'top') {
				delta = point.clientY - startPosRef.current;
			} else {
				delta = startPosRef.current - point.clientY;
			}

			const base = baseSizeRef.current || 0;
			const next = startSizeRef.current + delta;
			const min = allowShrink ? 100 : base;
			const max =
				side === 'left' || side === 'right'
					? Math.round(window.innerWidth * 0.95)
					: Math.round(window.innerHeight * 0.95);
			const clamped = Math.max(min, Math.min(next, max));
			setCustomSize(clamped);
		},
		[allowShrink, side],
	);

	const onMouseMove = React.useCallback(
		(event: MouseEvent) => {
			if (!isResizingRef.current) return;
			applySizeFromPointer(event);
		},
		[applySizeFromPointer],
	);

	const onTouchMove = React.useCallback(
		(event: TouchEvent) => {
			if (!isResizingRef.current) return;
			const touch = event.touches[0];
			if (!touch) return;
			applySizeFromPointer(touch);
			event.preventDefault();
		},
		[applySizeFromPointer],
	);

	const endResize = React.useCallback(() => {
		if (!isResizingRef.current) return;
		isResizingRef.current = false;
		document.removeEventListener('mousemove', onMouseMove);
		document.removeEventListener('mouseup', endResize);
		document.removeEventListener('touchmove', onTouchMove);
		document.removeEventListener('touchend', endResize);
		document.removeEventListener('touchcancel', endResize);
		document.body.style.cursor = '';
		document.body.style.userSelect = '';
	}, [onMouseMove, onTouchMove]);

	const beginResize = (event: React.MouseEvent | React.TouchEvent) => {
		if (!resizable || size === 'full') return;
		const point = 'touches' in event ? event.touches[0] : event;
		if (!point) return;

		isResizingRef.current = true;
		startPosRef.current =
			side === 'left' || side === 'right' ? point.clientX : point.clientY;
		const fallbackSize = (() => {
			if (!contentRef.current) return 0;
			const rect = contentRef.current.getBoundingClientRect();
			return side === 'left' || side === 'right' ? rect.width : rect.height;
		})();
		const baseSize = baseSizeRef.current || fallbackSize;
		baseSizeRef.current = baseSize;
		startSizeRef.current = customSize ?? baseSize;

		document.addEventListener('mousemove', onMouseMove);
		document.addEventListener('mouseup', endResize);
		document.addEventListener('touchmove', onTouchMove, { passive: false });
		document.addEventListener('touchend', endResize);
		document.addEventListener('touchcancel', endResize);
		document.body.style.cursor =
			side === 'left' || side === 'right' ? 'col-resize' : 'row-resize';
		document.body.style.userSelect = 'none';
		event.preventDefault();
		event.stopPropagation();
	};

	React.useEffect(() => {
		if (!open) {
			endResize();
			setCustomSize(null);
			baseSizeRef.current = 0;
			return;
		}

		const frame = window.requestAnimationFrame(() => {
			if (!contentRef.current) return;
			const rect = contentRef.current.getBoundingClientRect();
			baseSizeRef.current =
				side === 'left' || side === 'right' ? rect.width : rect.height;
			setCustomSize(null);
		});

		return () => window.cancelAnimationFrame(frame);
	}, [open, side, endResize]);

	React.useEffect(
		() => () => {
			endResize();
		},
		[endResize],
	);

	const sideTransform =
		side === 'left'
			? '-translate-x-full data-enter:translate-x-0 data-leave:-translate-x-full'
			: side === 'right'
				? 'translate-x-full data-enter:translate-x-0 data-leave:translate-x-full'
				: side === 'top'
					? '-translate-y-full data-enter:translate-y-0 data-leave:-translate-y-full'
					: 'translate-y-full data-enter:translate-y-0 data-leave:translate-y-full';
	const isHorizontal = side === 'left' || side === 'right';
	const resizerLabel = isHorizontal
		? 'Resize sheet width'
		: 'Resize sheet height';
	const baseSize = baseSizeRef.current || 0;
	const currentSize = customSize ?? baseSize;
	const minSize = allowShrink ? 100 : baseSize;
	const maxSize = Math.max(
		minSize,
		typeof window === 'undefined'
			? currentSize
			: isHorizontal
				? Math.round(window.innerWidth * 0.95)
				: Math.round(window.innerHeight * 0.95),
	);

	const adjustSize = React.useCallback(
		(delta: number) => {
			if (!resizable || size === 'full') return;
			setCustomSize((previous) => {
				const base = baseSizeRef.current || 0;
				const currentValue = previous ?? base;
				const minimum = allowShrink ? 100 : base;
				const windowMaximum =
					typeof window === 'undefined'
						? currentValue
						: isHorizontal
							? Math.round(window.innerWidth * 0.95)
							: Math.round(window.innerHeight * 0.95);
				const maximum = Math.max(minimum, windowMaximum);
				const next = Math.max(minimum, Math.min(currentValue + delta, maximum));
				if (next === currentValue) return previous;
				return next;
			});
		},
		[allowShrink, isHorizontal, resizable, size],
	);

	const handleKeyDown = React.useCallback(
		(event: React.KeyboardEvent<HTMLDivElement>) => {
			if (!resizable || size === 'full') return;
			const step = event.shiftKey ? 50 : 10;
			if (isHorizontal) {
				if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
					event.preventDefault();
					const direction =
						side === 'right'
							? event.key === 'ArrowLeft'
								? 1
								: -1
							: event.key === 'ArrowRight'
								? 1
								: -1;
					adjustSize(direction * step);
				}
			} else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
				event.preventDefault();
				const direction =
					side === 'bottom'
						? event.key === 'ArrowUp'
							? 1
							: -1
						: event.key === 'ArrowDown'
							? 1
							: -1;
				adjustSize(direction * step);
			}
		},
		[adjustSize, isHorizontal, resizable, side, size],
	);

	if (!mounted) return null;

	const sizeStyle: React.CSSProperties | undefined =
		customSize == null
			? undefined
			: side === 'left' || side === 'right'
				? { width: `${customSize}px` }
				: { height: `${customSize}px` };

	return (
		<Ariakit.Dialog
			store={store}
			portal
			backdrop={
				<div
					className={cn(
						'fixed inset-0 z-40 bg-overlay/50 backdrop-blur-sm',
						'opacity-0 transition-opacity duration-300 ease-smooth',
						'data-enter:opacity-100 data-leave:opacity-0',
					)}
				/>
			}
			ref={contentRef}
			className={cn(
				sheetContentVariants({ side, size }),
				'z-50',
				sideTransform,
				className,
			)}
			style={{ ...(inlineStyle || {}), ...(sizeStyle || {}) }}
			{...(autoFocus === undefined ? {} : { autoFocus })}
			{...props}
		>
			{resizable &&
				size !== 'full' &&
				(side === 'left' || side === 'right') && (
					<div
						className={cn(
							'absolute top-1/2 z-20 flex w-2 -translate-y-1/2 cursor-col-resize items-center justify-center',
							side === 'right' ? '-left-1' : '-right-1',
						)}
					>
						<hr
							aria-orientation="vertical"
							aria-valuenow={currentSize}
							aria-valuemin={minSize}
							aria-valuemax={maxSize}
							aria-label={resizerLabel}
							tabIndex={0}
							onKeyDown={handleKeyDown}
							onMouseDown={beginResize}
							onTouchStart={beginResize}
							className="not-prose absolute inset-0 m-0 h-full w-full rounded-[2px] border border-border bg-card focus-visible:border-border focus-visible:ring-1 focus-visible:ring-ring/50 focus-visible:ring-offset-1 focus-visible:ring-offset-ring-offset/50 focus-visible:outline-none"
						/>
						<div className="z-10 pointer-events-none flex h-8 w-2 flex-col items-center justify-center rounded-[2px] bg-border/60">
							<div className="flex flex-col gap-1">
								<span className="h-0.5 w-0.5 rounded-full bg-foreground/60"></span>
								<span className="h-0.5 w-0.5 rounded-full bg-foreground/60"></span>
								<span className="h-0.5 w-0.5 rounded-full bg-foreground/60"></span>
							</div>
						</div>
					</div>
				)}

			{resizable &&
				size !== 'full' &&
				(side === 'top' || side === 'bottom') && (
					<div
						className={cn(
							'absolute left-1/2 z-20 flex h-2 -translate-x-1/2 cursor-row-resize items-center justify-center',
							side === 'bottom' ? '-top-1' : '-bottom-1',
						)}
					>
						<hr
							aria-orientation="horizontal"
							aria-valuenow={currentSize}
							aria-valuemin={minSize}
							aria-valuemax={maxSize}
							aria-label={resizerLabel}
							tabIndex={0}
							onKeyDown={handleKeyDown}
							onMouseDown={beginResize}
							onTouchStart={beginResize}
							className="not-prose absolute inset-0 m-0 h-full w-full rounded-[2px] border border-border bg-transparent focus-visible:border-border focus-visible:ring-1 focus-visible:ring-ring/50 focus-visible:ring-offset-1 focus-visible:ring-offset-ring-offset/50 focus-visible:outline-none"
						/>
						<div className="z-10 pointer-events-none flex h-2 w-8 items-center justify-center rounded-[2px] bg-border/60">
							<div className="flex gap-1">
								<span className="h-0.5 w-0.5 rounded-full bg-foreground/60"></span>
								<span className="h-0.5 w-0.5 rounded-full bg-foreground/60"></span>
								<span className="h-0.5 w-0.5 rounded-full bg-foreground/60"></span>
							</div>
						</div>
					</div>
				)}

			{showClose && (
				<Ariakit.DialogDismiss className="not-prose absolute top-2 right-2 z-10 inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-sm text-foreground/45 transition-colors duration-300 ease-smooth hover:bg-card-muted hover:text-foreground/70 focus-visible:border-border focus-visible:ring-1 focus-visible:ring-ring/50 focus-visible:ring-offset-1 focus-visible:ring-offset-ring-offset/50 focus-visible:outline-none">
					<Icons.X aria-hidden="true" className="h-4 w-4" />
					<Ariakit.VisuallyHidden>Close</Ariakit.VisuallyHidden>
				</Ariakit.DialogDismiss>
			)}
			{children}
		</Ariakit.Dialog>
	);
};

export const SheetHeader: React.FC<SheetHeaderProps> = ({
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

export const SheetTitle: React.FC<SheetTitleProps> = ({
	children,
	className = '',
	as: _Component = 'h2',
	...props
}) => {
	return (
		<Ariakit.DialogHeading
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

export const SheetDescription: React.FC<SheetDescriptionProps> = ({
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

export const SheetFooter: React.FC<SheetFooterProps> = ({
	children,
	className = '',
	...props
}) => {
	return (
		<div
			className={cn(
				'not-prose mt-auto flex items-center justify-end gap-3 border-t border-border/60 bg-card-muted/30 p-4',
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
	className = '',
	asChild = false,
	disabled,
	autoFocus,
	onClick,
	...props
}) => {
	const { store } = useSheet();
	const forwardedProps = {
		...(disabled !== undefined ? { disabled } : {}),
		...(autoFocus !== undefined ? { autoFocus } : {}),
	};

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
			...forwardedProps,
			...props,
			...(child.props || {}),
		});
	}

	return (
		<Ariakit.DialogDismiss
			store={store}
			className={cn(
				"inline-flex cursor-pointer items-center justify-center rounded-md bg-transparent transition-colors duration-300 ease-smooth h-9 px-4 py-2 gap-2 has-[>svg]:px-3 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 text-sm font-medium text-foreground hover:bg-card-muted/60 focus-visible:ring-1 focus-visible:ring-ring/50 focus-visible:ring-offset-1 focus-visible:ring-offset-ring-offset/50 focus-visible:outline-none",
				className,
			)}
			type="button"
			onClick={onClick}
			{...forwardedProps}
			{...props}
		>
			{children || 'Close'}
		</Ariakit.DialogDismiss>
	);
};
