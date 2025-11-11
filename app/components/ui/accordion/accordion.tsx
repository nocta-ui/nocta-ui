'use client';

import * as Ariakit from '@ariakit/react';
import { cva, type VariantProps } from 'class-variance-authority';
import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { Icons } from '@/app/components/ui/icons/icons';
import { cn } from '@/lib/utils';

const accordionVariants = cva('not-prose w-full', {
	variants: {
		variant: {
			default: '',
			card: 'space-y-2',
		},
	},
	defaultVariants: {
		variant: 'default',
	},
});

const accordionItemVariants = cva(
	'not-prose transition-[border-color,box-shadow]',
	{
		variants: {
			variant: {
				default: 'border-b border-border/60 last:border-b-0',
				card: 'rounded-lg [&:has(:focus-visible)]:ring-1 [&:has(:focus-visible)]:ring-ring/50 [&:has(:focus-visible)]:ring-offset-1 [&:has(:focus-visible)]:ring-offset-ring-offset/50 [&:has(:focus-visible)]:outline-none',
			},
			isOpen: {
				true: '',
				false: '',
			},
		},
		defaultVariants: {
			variant: 'default',
			isOpen: false,
		},
	},
);

const accordionTriggerVariants = cva(
	'not-prose flex w-full items-center justify-between rounded-lg text-left text-foreground hover:text-foreground/70 transition-[box-shadow,color] duration-150 ease-basic',
	{
		variants: {
			variant: {
				default:
					'focus-visible:ring-1 focus-visible:ring-ring/50 focus-visible:ring-offset-1 focus-visible:ring-offset-ring-offset/50 focus-visible:outline-none',
				card: 'focus-visible:ring-0 focus-visible:outline-none',
			},
			size: {
				sm: 'text-xs',
				md: 'text-sm',
				lg: 'text-base',
			},
			disabled: {
				true: 'cursor-not-allowed opacity-50',
				false: 'cursor-pointer',
			},
			isOpen: {
				true: '',
				false: '',
			},
		},
		compoundVariants: [
			{
				variant: 'default',
				size: 'sm',
				class: 'px-0 py-2',
			},
			{
				variant: 'default',
				size: 'md',
				class: 'px-0 py-3',
			},
			{
				variant: 'default',
				size: 'lg',
				class: 'px-0 py-4',
			},
			{
				variant: 'card',
				size: 'sm',
				class: 'px-3 py-2',
			},
			{
				variant: 'card',
				size: 'md',
				class: 'px-4 py-3',
			},
			{
				variant: 'card',
				size: 'lg',
				class: 'px-5 py-4',
			},
			{
				variant: 'card',
				isOpen: true,
				class: '',
			},
		],
		defaultVariants: {
			variant: 'default',
			size: 'md',
			disabled: false,
			isOpen: false,
		},
	},
);

const accordionContentVariants = cva(
	'not-prose overflow-hidden transition-[height,opacity] duration-300 ease-smooth',
	{
		variants: {
			size: {
				sm: 'text-xs',
				md: 'text-sm',
				lg: 'text-base',
			},
		},
		defaultVariants: {
			size: 'md',
		},
	},
);

const accordionContentInnerVariants = cva('leading-snug text-foreground/70', {
	variants: {
		variant: {
			default: '',
			card: 'border-t border-border/60',
		},
		size: {
			sm: '',
			md: '',
			lg: '',
		},
	},
	compoundVariants: [
		{
			variant: 'default',
			size: 'sm',
			class: 'pb-2',
		},
		{
			variant: 'default',
			size: 'md',
			class: 'pb-3',
		},
		{
			variant: 'default',
			size: 'lg',
			class: 'pb-4',
		},
		{
			variant: 'card',
			size: 'sm',
			class: 'px-3 py-2',
		},
		{
			variant: 'card',
			size: 'md',
			class: 'px-4 py-3',
		},
		{
			variant: 'card',
			size: 'lg',
			class: 'px-5 py-4',
		},
	],
	defaultVariants: {
		variant: 'default',
		size: 'md',
	},
});

export interface AccordionProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof accordionVariants> {
	children: React.ReactNode;
	size?: 'sm' | 'md' | 'lg';
	className?: string;
	type?: 'single' | 'multiple';

	onValueChange?: (value: string | string[]) => void;
}

export interface AccordionItemProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof accordionItemVariants> {
	children: React.ReactNode;
	value?: string;
	id?: string;
	className?: string;
	disabled?: boolean;
	defaultOpen?: boolean;
}

type DisclosureButtonProps = React.ComponentPropsWithoutRef<
	typeof Ariakit.Disclosure
>;

export interface AccordionTriggerProps
	extends Omit<DisclosureButtonProps, 'store'>,
		VariantProps<typeof accordionTriggerVariants> {
	children: React.ReactNode;
	className?: string;
	disabled?: boolean;
}

export interface AccordionContentProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof accordionContentVariants> {
	children: React.ReactNode;
	className?: string;
}
type AccordionStyleContextType = {
	variant: 'default' | 'card';
	size: 'sm' | 'md' | 'lg';
};

const AccordionStyleContext = createContext<
	AccordionStyleContextType | undefined
>(undefined);

const useAccordionStyle = () => {
	const context = useContext(AccordionStyleContext);
	if (!context) {
		throw new Error('Accordion components must be used within an Accordion');
	}
	return context;
};

type AccordionBehaviorContextType = {
	type: 'single' | 'multiple';
	registerItem: (value: string, store: Ariakit.DisclosureStore) => void;
	unregisterItem: (value: string) => void;
	notifyItemOpen: (value: string) => void;
};

const AccordionBehaviorContext = createContext<
	AccordionBehaviorContextType | undefined
>(undefined);

const useAccordionBehavior = () => {
	const context = useContext(AccordionBehaviorContext);
	if (!context) {
		throw new Error('Accordion components must be used within an Accordion');
	}
	return context;
};

type AccordionItemContextType = {
	store: Ariakit.DisclosureStore;
	disabled: boolean;
	triggerId: string;
	contentId: string;
};

const AccordionItemContext = createContext<
	AccordionItemContextType | undefined
>(undefined);

const useAccordionItem = () => {
	const context = useContext(AccordionItemContext);
	if (!context) {
		throw new Error(
			'AccordionTrigger and AccordionContent must be used within an AccordionItem',
		);
	}
	return context;
};

export const Accordion: React.FC<AccordionProps> = React.memo(
	({
		children,
		variant = 'default',
		size = 'md',
		className,
		type = 'single',
		onValueChange,
		...props
	}) => {
		const resolvedVariant: 'default' | 'card' = variant ?? 'default';
		const resolvedSize: 'sm' | 'md' | 'lg' = size ?? 'md';
		const resolvedType: 'single' | 'multiple' = type ?? 'single';

		const styleValue = useMemo(
			() => ({ variant: resolvedVariant, size: resolvedSize }),
			[resolvedVariant, resolvedSize],
		);

		const itemsRef = React.useRef<Map<string, Ariakit.DisclosureStore>>(
			new Map(),
		);

		const registerItem = useCallback(
			(value: string, store: Ariakit.DisclosureStore) => {
				itemsRef.current.set(value, store);
			},
			[],
		);

		const unregisterItem = useCallback((value: string) => {
			itemsRef.current.delete(value);
		}, []);

		const notifyItemOpen = useCallback(
			(value: string) => {
				if (resolvedType === 'single') {
					itemsRef.current.forEach((store, key) => {
						if (key !== value) {
							if (typeof store.setOpen === 'function') {
								store.setOpen(false);
							}
						}
					});
				}
				if (typeof onValueChange === 'function') {
					onValueChange(value);
				}
			},
			[resolvedType, onValueChange],
		);

		const behaviorValue = useMemo<AccordionBehaviorContextType>(
			() => ({
				type: resolvedType,
				registerItem,
				unregisterItem,
				notifyItemOpen,
			}),
			[resolvedType, registerItem, unregisterItem, notifyItemOpen],
		);

		return (
			<AccordionStyleContext.Provider value={styleValue}>
				<AccordionBehaviorContext.Provider value={behaviorValue}>
					<div
						data-accordion-root
						className={cn(
							accordionVariants({ variant: resolvedVariant }),
							className,
						)}
						{...props}
					>
						{children}
					</div>
				</AccordionBehaviorContext.Provider>
			</AccordionStyleContext.Provider>
		);
	},
);

Accordion.displayName = 'Accordion';

export const AccordionItem: React.FC<AccordionItemProps> = React.memo(
	({
		children,
		value,
		id,
		className,
		disabled = false,
		defaultOpen = false,
		...props
	}) => {
		const { variant } = useAccordionStyle();
		const { registerItem, unregisterItem, notifyItemOpen } =
			useAccordionBehavior();
		const reactId = React.useId();
		const baseId = (id || value || reactId).toString();

		const store = Ariakit.useDisclosureStore({ defaultOpen });

		const triggerId = `${baseId}-trigger`;
		const contentId = `${baseId}-content`;

		const contextValue = useMemo<AccordionItemContextType>(
			() => ({ store, disabled: !!disabled, triggerId, contentId }),
			[store, disabled, triggerId, contentId],
		);

		const open = Ariakit.useStoreState(store, 'open');

		React.useEffect(() => {
			registerItem(baseId, store);
			return () => unregisterItem(baseId);
		}, [baseId, registerItem, unregisterItem, store]);

		React.useEffect(() => {
			if (open) {
				notifyItemOpen(baseId);
			}
		}, [open, baseId, notifyItemOpen]);

		if (variant === 'card') {
			return (
				<AccordionItemContext.Provider value={contextValue}>
					<div
						className={cn(
							accordionItemVariants({ variant, isOpen: open }),
							className,
						)}
						{...props}
					>
						<div className="not-prose relative overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-[height,opacity] duration-300 ease-smooth">
							{children}
						</div>
					</div>
				</AccordionItemContext.Provider>
			);
		}

		return (
			<AccordionItemContext.Provider value={contextValue}>
				<div
					className={cn(
						accordionItemVariants({ variant, isOpen: open }),
						className,
					)}
					{...props}
				>
					{children}
				</div>
			</AccordionItemContext.Provider>
		);
	},
);

AccordionItem.displayName = 'AccordionItem';

export const AccordionTrigger: React.FC<AccordionTriggerProps> = React.memo(
	({
		children,
		className,
		disabled: disabledProp,
		variant: _variantProp,
		size: _sizeProp,
		isOpen: _isOpenProp,
		...props
	}) => {
		const { variant, size } = useAccordionStyle();
		const { store, disabled, triggerId, contentId } = useAccordionItem();
		const isOpen = Ariakit.useStoreState(store, 'open');
		const mergedDisabled = Boolean(disabled || disabledProp);

		const iconSize = useMemo(() => {
			return size === 'sm' ? 14 : size === 'md' ? 16 : 20;
		}, [size]);

		return (
			<h3 className="not-prose">
				<Ariakit.Disclosure
					store={store}
					id={triggerId}
					data-accordion-trigger
					className={cn(
						accordionTriggerVariants({
							variant,
							size,
							disabled: mergedDisabled,
							isOpen,
						}),
						className,
					)}
					aria-controls={contentId}
					aria-disabled={mergedDisabled || undefined}
					disabled={mergedDisabled}
					{...props}
				>
					<span className="font-medium">{children}</span>
					<Icons.ChevronDown
						aria-hidden="true"
						className={cn(
							'ml-2 shrink-0 text-foreground/45 transition-transform duration-150 ease-basic will-change-transform',
							isOpen ? 'rotate-180' : 'rotate-0',
						)}
						style={{ width: iconSize, height: iconSize }}
					/>
				</Ariakit.Disclosure>
			</h3>
		);
	},
);

AccordionTrigger.displayName = 'AccordionTrigger';

export const AccordionContent: React.FC<AccordionContentProps> = React.memo(
	({ children, className, ...props }) => {
		const { variant, size } = useAccordionStyle();
		const { store, triggerId, contentId } = useAccordionItem();
		const isOpen = Ariakit.useStoreState(store, 'open');

		const contentRef = React.useRef<HTMLDivElement>(null);
		const innerRef = React.useRef<HTMLDivElement>(null);
		const [height, setHeight] = React.useState<number>(0);
		const rafRef = React.useRef<number | undefined>(undefined);

		const updateHeight = React.useCallback(() => {
			if (rafRef.current) {
				cancelAnimationFrame(rafRef.current);
			}

			rafRef.current = requestAnimationFrame(() => {
				if (innerRef.current) {
					const newHeight = innerRef.current.scrollHeight;
					setHeight(newHeight);
				}
			});
		}, []);

		React.useEffect(() => {
			if (!innerRef.current) return;

			const resizeObserver = new ResizeObserver(() => {
				updateHeight();
			});

			resizeObserver.observe(innerRef.current);
			updateHeight();

			return () => {
				resizeObserver.disconnect();
				if (rafRef.current) {
					cancelAnimationFrame(rafRef.current);
				}
			};
		}, [updateHeight]);

		React.useEffect(() => {
			updateHeight();
		}, [updateHeight]);

		const contentStyle = useMemo(
			() => ({
				height: isOpen ? `${height}px` : '0px',
				opacity: isOpen ? 1 : 0,
			}),
			[isOpen, height],
		);

		return (
			<div
				ref={contentRef}
				className={cn(accordionContentVariants({ size }), className)}
				style={contentStyle}
				{...props}
			>
				<section
					id={contentId}
					aria-labelledby={triggerId}
					aria-hidden={!isOpen}
					inert={!isOpen}
					ref={innerRef}
					className={cn(accordionContentInnerVariants({ variant, size }))}
				>
					{children}
				</section>
			</div>
		);
	},
);

AccordionContent.displayName = 'AccordionContent';
