'use client';

import * as Ariakit from '@ariakit/react';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '@/lib/utils';

const tabsListVariants = cva(
	'not-prose inline-flex items-center justify-center',
	{
		variants: {
			orientation: {
				horizontal: 'flex-row',
				vertical: 'w-fit flex-col',
			},
			variant: {
				default: 'rounded-md bg-card border-border border',
				pills: 'gap-1',
				underline: 'border-border/60 gap-0 border-b',
			},
			size: {
				sm: '',
				md: '',
				lg: '',
			},
		},
		compoundVariants: [
			{ variant: 'default', size: 'sm', class: 'p-0.5' },
			{ variant: 'default', size: 'md', class: 'p-1' },
			{ variant: 'default', size: 'lg', class: 'p-1.5' },
		],
		defaultVariants: {
			orientation: 'horizontal',
			variant: 'default',
			size: 'md',
		},
	},
);

const tabsTriggerVariants = cva(
	`not-prose inline-flex cursor-pointer items-center justify-center font-medium whitespace-nowrap [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 transition-[background-color,color,box-shadow] duration-150 ease-basic focus-visible:border-border focus-visible:ring-1 focus-visible:ring-ring/50 focus-visible:ring-offset-1 focus-visible:ring-offset-ring-offset/50 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50`,
	{
		variants: {
			variant: {
				default: `w-full rounded-sm text-foreground/70 hover:text-foreground data-active-item:bg-card-muted data-active-item:text-foreground`,
				pills: `rounded-sm text-foreground/70 hover:text-foreground data-active-item:bg-foreground data-active-item:text-card data-active-item:shadow-sm`,
				underline: `border-b-2 border-transparent text-foreground/70 hover:text-foreground data-active-item:border-foreground/75 data-active-item:text-foreground`,
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
				class: 'h-7.5 px-3 py-1.5 px-3 gap-1.5 has-[>svg]:px-2.5 text-sm',
			},
			{
				variant: 'default',
				size: 'md',
				class: 'h-8 px-4 py-2 gap-2 has-[>svg]:px-3 text-sm',
			},
			{
				variant: 'default',
				size: 'lg',
				class: 'h-8.5 px-6 gap-2 has-[>svg]:px-4 text-base',
			},
			{
				variant: 'pills',
				size: 'sm',
				class: 'h-7.5 px-3 py-1.5 px-3 gap-1.5 has-[>svg]:px-2.5 text-sm',
			},
			{
				variant: 'pills',
				size: 'md',
				class: 'h-8 px-4 py-2 gap-2 has-[>svg]:px-3 text-sm',
			},
			{
				variant: 'pills',
				size: 'lg',
				class: 'h-8.5 px-6 gap-2 has-[>svg]:px-4 text-base',
			},
			{
				variant: 'underline',
				size: 'sm',
				class: 'h-7.5 px-3 py-1.5 px-3 gap-1.5 has-[>svg]:px-2.5 text-sm',
			},
			{
				variant: 'underline',
				size: 'md',
				class: 'h-8 px-4 py-2 gap-2 has-[>svg]:px-3 text-sm',
			},
			{
				variant: 'underline',
				size: 'lg',
				class: 'h-8.5 px-6 gap-2 has-[>svg]:px-4 text-base',
			},
		],
		defaultVariants: {
			variant: 'default',
			size: 'md',
		},
	},
);

interface TabsStyleContextValue {
	variant: 'default' | 'pills' | 'underline';
	size: 'sm' | 'md' | 'lg';
	orientation: 'horizontal' | 'vertical';
	disabled: boolean;
}

const TabsStyleContext = React.createContext<TabsStyleContextValue | null>(
	null,
);

function useTabsStyleContext() {
	const ctx = React.useContext(TabsStyleContext);
	if (!ctx) throw new Error('Tabs components must be used within <Tabs>');
	return ctx;
}

export interface TabsProps {
	children: React.ReactNode;
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	orientation?: 'horizontal' | 'vertical';
	variant?: 'default' | 'pills' | 'underline';
	size?: 'sm' | 'md' | 'lg';
	className?: string;
	disabled?: boolean;
}

export function Tabs({
	children,
	value,
	defaultValue,
	onValueChange,
	orientation = 'horizontal',
	variant = 'default',
	size = 'md',
	className,
	disabled = false,
}: TabsProps) {
	const store = Ariakit.useTabStore({
		defaultSelectedId: defaultValue,
		selectedId: value,
		setSelectedId: (id) => {
			if (id != null) {
				onValueChange?.(id);
			}
		},
		orientation,
	});

	return (
		<TabsStyleContext.Provider value={{ variant, size, orientation, disabled }}>
			<Ariakit.TabProvider store={store}>
				<div
					className={cn(
						'not-prose',
						orientation === 'vertical' && 'flex gap-4',
						className,
					)}
					data-orientation={orientation}
					data-variant={variant}
					data-size={size}
					data-disabled={disabled ? '' : undefined}
				>
					{children}
				</div>
			</Ariakit.TabProvider>
		</TabsStyleContext.Provider>
	);
}

export type TabsListProps = React.HTMLAttributes<HTMLDivElement>;

export function TabsList({ children, className, ...props }: TabsListProps) {
	const { orientation, variant, size } = useTabsStyleContext();
	const { autoFocus, ...rest } = props;
	return (
		<Ariakit.TabList
			className={cn(
				tabsListVariants({ orientation, variant, size }),
				className,
			)}
			{...(autoFocus === undefined ? {} : { autoFocus })}
			{...rest}
		>
			{children}
		</Ariakit.TabList>
	);
}

export interface TabsTriggerProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof tabsTriggerVariants> {
	children: React.ReactNode;
	value: string;
}

export function TabsTrigger({
	children,
	value,
	className,
	disabled: disabledProp,
	...rest
}: TabsTriggerProps) {
	const { variant, size, disabled } = useTabsStyleContext();
	const isDisabled = disabledProp ?? disabled;
	const { autoFocus, id, ...restProps } = rest;
	return (
		<Ariakit.Tab
			id={id ?? value}
			className={cn(tabsTriggerVariants({ variant, size }), className)}
			disabled={isDisabled}
			{...(autoFocus === undefined ? {} : { autoFocus })}
			{...restProps}
		>
			{children}
		</Ariakit.Tab>
	);
}

export interface TabsContentProps {
	children: React.ReactNode;
	value: string;
	className?: string;
}

export function TabsContent({ children, value, className }: TabsContentProps) {
	return (
		<Ariakit.TabPanel
			tabId={value}
			className={cn(
				'not-prose focus-visible:ring-1 focus-visible:ring-ring/50 focus-visible:ring-offset-1 focus-visible:ring-offset-ring-offset/50 focus-visible:outline-none',
				className,
			)}
		>
			{children}
		</Ariakit.TabPanel>
	);
}
