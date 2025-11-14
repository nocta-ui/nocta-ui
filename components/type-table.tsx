'use client';

import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';
import { ChevronDownIcon as ChevronDown } from '@radix-ui/react-icons';
import { cva } from 'class-variance-authority';
import Link from 'fumadocs-core/link';
import type { ReactNode } from 'react';
import { forwardRef, useEffect, useState } from 'react';
import { cn } from '@/lib/cn';

const Collapsible = CollapsiblePrimitive.Root;
const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;

const CollapsibleContent = forwardRef<
	HTMLDivElement,
	CollapsiblePrimitive.CollapsibleContentProps
>(({ children, ...props }, ref) => {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	return (
		<CollapsiblePrimitive.CollapsibleContent
			ref={ref}
			{...props}
			className={cn(
				'overflow-hidden',
				mounted &&
					'data-[state=closed]:animate-fd-collapsible-up data-[state=open]:animate-fd-collapsible-down',
				props.className,
			)}
		>
			{children}
		</CollapsiblePrimitive.CollapsibleContent>
	);
});
CollapsibleContent.displayName =
	CollapsiblePrimitive.CollapsibleContent.displayName;

const keyVariants = cva('text-foreground/45', {
	variants: {
		deprecated: {
			true: 'line-through text-fd-primary/50',
		},
	},
});

const fieldVariants = cva('text-foreground/45 not-prose pe-2');

export interface ParameterNode {
	name: string;
	description: ReactNode;
}

export interface TypeNode {
	description?: ReactNode;
	type: ReactNode;
	typeDescription?: ReactNode;
	typeDescriptionLink?: string;
	default?: ReactNode;
	required?: boolean;
	deprecated?: boolean;
	parameters?: ParameterNode[];
	returns?: ReactNode;
}
export function TypeTable({ type }: { type: Record<string, TypeNode> }) {
	return (
		<div className="@container relative flex flex-col p-1 bg-card shadow-sm shadow-card text-foreground rounded-lg border border-fd-border my-6 text-sm">
			<div className="flex font-medium items-center px-3 py-1 not-prose text-foreground/45">
				<p className="w-[25%]">Prop</p>
				<p className="@max-xl:hidden">Type</p>
			</div>

			{Object.entries(type).map(([key, value]) => (
				<Item key={key} name={key} item={value} />
			))}
		</div>
	);
}

function renderType(value: ReactNode) {
	if (typeof value !== 'string') return value;

	const parts = value.split('|').map((part) => part.trim());

	if (parts.length === 1) {
		return (
			<code className="text-foreground bg-card-muted rounded border border-fd-border p-px">
				{parts[0]}
			</code>
		);
	}

	return (
		<div className="flex flex-wrap gap-1 items-center">
			{parts.map((part, i) => (
				<span
					key={i}
					className="inline-flex items-center bg-card-muted rounded border border-fd-border p-px"
				>
					<code className="text-foreground">{part}</code>
				</span>
			))}
		</div>
	);
}

function Item({
	name,
	item: {
		parameters = [],
		description,
		required = false,
		deprecated,
		typeDescription,
		default: defaultValue,
		type,
		typeDescriptionLink,
		returns,
	},
}: {
	name: string;
	item: TypeNode;
}) {
	const [open, setOpen] = useState(false);

	return (
		<Collapsible
			open={open}
			onOpenChange={setOpen}
			className={cn(
				'rounded-md overflow-hidden transition-all duration-450 ease-smooth border',
				open
					? 'bg-background not-last:mb-2 border-fd-border'
					: 'border-transparent',
			)}
		>
			<CollapsibleTrigger className="relative cursor-pointer flex flex-row items-center w-full group text-start px-3 py-2 not-prose hover:bg-card-muted data-[state=open]:bg-card-muted transition-[color] duration-100 ease-basic">
				<code
					className={cn(
						keyVariants({
							deprecated,
							className: 'min-w-fit w-[25%] font-medium',
						}),
					)}
				>
					{name}
					{!required && '?'}
				</code>

				{typeDescriptionLink ? (
					<Link href={typeDescriptionLink} className="underline @max-xl:hidden">
						{type}
					</Link>
				) : (
					<span className="@max-xl:hidden">{renderType(type)}</span>
				)}

				<ChevronDown className="absolute end-2 size-5 text-foreground/70 transition-transform group-data-[state=open]:rotate-180 duration-300 ease-smooth" />
			</CollapsibleTrigger>

			<CollapsibleContent>
				<div className="grid grid-cols-[1fr_3fr] gap-y-4 text-sm p-3 overflow-auto fd-scroll-container border-t">
					<div className="text-sm prose col-span-full prose-no-margin empty:hidden">
						{description}
					</div>

					{typeDescription && (
						<>
							<p className={cn(fieldVariants())}>Type</p>
							<p className="my-auto not-prose">{renderType(typeDescription)}</p>
						</>
					)}

					{defaultValue && (
						<>
							<p className={cn(fieldVariants())}>Default</p>
							<p className="my-auto not-prose text-foreground/70 font-mono">
								{defaultValue}
							</p>
						</>
					)}

					{parameters.length > 0 && (
						<>
							<p className={cn(fieldVariants())}>Parameters</p>
							<div className="flex flex-col gap-2">
								{parameters.map((param) => (
									<div
										key={param.name}
										className="inline-flex items-center flex-wrap gap-1"
									>
										<p className="font-medium not-prose text-nowrap">
											{param.name} -
										</p>
										<div className="text-sm prose prose-no-margin">
											{param.description}
										</div>
									</div>
								))}
							</div>
						</>
					)}

					{returns && (
						<>
							<p className={cn(fieldVariants())}>Returns</p>
							<div className="my-auto text-sm prose prose-no-margin">
								{returns}
							</div>
						</>
					)}
				</div>
			</CollapsibleContent>
		</Collapsible>
	);
}
