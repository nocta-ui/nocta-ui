"use client";

import { cva, type VariantProps } from "class-variance-authority";
import React, { useCallback } from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "../spinner";

const hasBackgroundColor = (className: string = "") => {
	return /bg-(?!linear|gradient|none)\w+/.test(className);
};

const tableContainerVariants = cva(
	"rounded-xl overflow-hidden",
	{
		variants: {
			variant: {
				default: "",
				striped: "",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

const tableVariants = cva("w-full border-collapse", {
	variants: {
		size: {
			sm: "text-xs",
			md: "text-sm",
			lg: "text-base",
		},
	},
	defaultVariants: {
		size: "md",
	},
});

const tableRowVariants = cva("", {
	variants: {
		variant: {
			default: "",
			striped: "",
		},
		isOdd: {
			true: "",
			false: "",
		}
	},
	compoundVariants: [
		{
			variant: "striped",
			isOdd: true,
			class: "bg-nocta-200/50 dark:bg-nocta-800/30",
		},
	],
	defaultVariants: {
		variant: "default",
		isOdd: false,
	},
});

export type TableVariant = "default" | "striped";
export type TableSize = "sm" | "md" | "lg";

export interface TableColumn<T = Record<string, unknown>> {
	key: string;
	title: string;
	render?: (value: unknown, record: T, index: number) => React.ReactNode;
	width?: string | number;
	align?: "left" | "center" | "right";
	className?: string;
}

export interface TableProps<T = Record<string, unknown>>
	extends Omit<React.TableHTMLAttributes<HTMLTableElement>, "size">,
		VariantProps<typeof tableContainerVariants>,
		VariantProps<typeof tableVariants> {
	columns: TableColumn<T>[];
	data: T[];
	loading?: boolean;
	emptyText?: string;
	pagination?: {
		current: number;
		pageSize: number;
		total: number;
		onChange: (page: number, pageSize: number) => void;
	};
	className?: string;
	rowKey?: string | ((record: T) => string);
	onRowClick?: (record: T, index: number) => void;
	rowClassName?: string | ((record: T, index: number) => string);
}

export interface TableHeaderProps
	extends React.HTMLAttributes<HTMLTableSectionElement> {
	children: React.ReactNode;
	className?: string;
}

export interface TableBodyProps
	extends React.HTMLAttributes<HTMLTableSectionElement> {
	children: React.ReactNode;
	className?: string;
}

export interface TableRowProps
	extends React.HTMLAttributes<HTMLTableRowElement>,
		VariantProps<typeof tableRowVariants> {
	children: React.ReactNode;
	className?: string;
}

export interface TableCellProps
	extends React.HTMLAttributes<HTMLTableCellElement> {
	children: React.ReactNode;
	className?: string;
	align?: "left" | "center" | "right";
	header?: boolean;
	colSpan?: number;
	rowSpan?: number;
}

export interface TableFooterProps
	extends React.HTMLAttributes<HTMLTableSectionElement> {
	children: React.ReactNode;
	className?: string;
}

export interface TableCaptionProps
	extends React.HTMLAttributes<HTMLTableCaptionElement> {
	children: React.ReactNode;
	className?: string;
}

export const Table = <T extends Record<string, unknown>>({
	columns,
	data,
	variant = "default",
	size = "md",
	loading = false,
	emptyText = "No data available",
	pagination,
	className = "",
	rowKey = "id",
	onRowClick,
	rowClassName,
	...props
}: TableProps<T>) => {
	const shouldOverrrideBackground = hasBackgroundColor(className);

	const getRowKey = useCallback(
		(record: T, index: number): string => {
			if (typeof rowKey === "function") {
				return rowKey(record);
			}
			return String(record[rowKey] || index);
		},
		[rowKey],
	);

	const getRowClassName = useCallback(
		(record: T, index: number): string => {
			let baseClassName = "";

			if (typeof rowClassName === "function") {
				baseClassName += rowClassName(record, index);
			} else if (rowClassName) {
				baseClassName += rowClassName;
			}

			return baseClassName.trim();
		},
		[rowClassName],
	);

	return (
		<div
			className={cn(
				tableContainerVariants({ variant }),
				"not-prose relative border border-nocta-200 dark:border-nocta-50/5 shadow-lg",
				shouldOverrrideBackground ? "" : "bg-nocta-100 dark:bg-nocta-900",
				className,
			)}
		>
			<span
				aria-hidden
				className="pointer-events-none absolute -inset-px rounded-xl bg-gradient-to-b to-transparent opacity-60"
				style={{
					maskImage:
						"radial-gradient(120% 100% at 50% 0%, black 30%, transparent 70%)",
					WebkitMaskImage:
						"radial-gradient(120% 100% at 50% 0%, black 30%, transparent 70%)",
				}}
			/>
				<div className="overflow-x-auto">
					<table className={cn(tableVariants({ size }))} {...props}>
						<TableHeader>
							<TableRow variant={variant}>
								{columns.map((column) => (
									<TableCell
										key={column.key}
										header
										align={column.align}
										className={column.className}
										style={{ width: column.width }}
									>
										{column.title}
									</TableCell>
								))}
							</TableRow>
						</TableHeader>
						<TableBody>
							{loading ? (
								<TableRow variant={variant}>
									<TableCell
										colSpan={columns.length}
										align="center"
										className="py-12"
									>
										<div className="flex items-center justify-center">
											<Spinner size="lg" variant="default" />
										</div>
									</TableCell>
								</TableRow>
							) : data.length === 0 ? (
								<TableRow variant={variant}>
									<TableCell
										colSpan={columns.length}
										align="center"
										className="py-12 text-nocta-500 dark:text-nocta-400"
									>
										{emptyText}
									</TableCell>
								</TableRow>
							) : (
								data.map((record, index) => (
									<TableRow
										key={getRowKey(record, index)}
										variant={variant}
										isOdd={index % 2 === 1}
										className={getRowClassName(record, index)}
										onClick={() => onRowClick?.(record, index)}
									>
										{columns.map((column) => {
											const value = record[column.key];
											const content = column.render
												? column.render(value, record, index)
												: value?.toString() || "";

											return (
												<TableCell
													key={column.key}
													align={column.align}
													className={column.className}
												>
													{content}
												</TableCell>
											);
										})}
									</TableRow>
								))
							)}
						</TableBody>
					</table>
				</div>

				{pagination && (
					<div className="px-6 py-4 bg-nocta-200/50 dark:bg-nocta-800/50 border-t border-nocta-200 dark:border-nocta-800/50 flex items-center justify-between">
						<div className="text-sm text-nocta-600 dark:text-nocta-400">
							Showing{" "}
							{Math.min(
								(pagination.current - 1) * pagination.pageSize + 1,
								pagination.total,
							)}{" "}
							to{" "}
							{Math.min(
								pagination.current * pagination.pageSize,
								pagination.total,
							)}{" "}
							of {pagination.total} entries
						</div>
						<div className="flex items-center gap-2">
							<button
								onClick={() =>
									pagination.onChange(
										pagination.current - 1,
										pagination.pageSize,
									)
								}
								disabled={pagination.current <= 1}
								className="px-3 py-1.5 text-sm rounded-lg border border-nocta-300 dark:border-nocta-600 bg-nocta-50 dark:bg-nocta-900 text-nocta-700 dark:text-nocta-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-nocta-100 dark:hover:bg-nocta-800 transition-colors duration-200 ease-in-out cursor-pointer"
							>
								Previous
							</button>
							<span className="px-3 py-1.5 text-sm text-nocta-600 dark:text-nocta-400">
								Page {pagination.current} of{" "}
								{Math.ceil(pagination.total / pagination.pageSize)}
							</span>
							<button
								onClick={() =>
									pagination.onChange(
										pagination.current + 1,
										pagination.pageSize,
									)
								}
								disabled={
									pagination.current >=
									Math.ceil(pagination.total / pagination.pageSize)
								}
								className="px-3 py-1.5 text-sm rounded-lg border border-nocta-300 dark:border-nocta-600 bg-nocta-50 dark:bg-nocta-900 text-nocta-700 dark:text-nocta-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-nocta-100 dark:hover:bg-nocta-800 transition-colors duration-200 ease-in-out cursor-pointer"
							>
								Next
							</button>
						</div>
					</div>
				)}
		</div>
	);
};

export const TableHeader: React.FC<TableHeaderProps> = ({
	children,
	className = "",
	...props
}) => {
	return (
		<thead
			className={cn(
				"bg-nocta-200/50 dark:bg-nocta-800/50 border-b border-nocta-200 dark:border-nocta-800/50",
				className,
			)}
			{...props}
		>
			{children}
		</thead>
	);
};

export const TableBody: React.FC<TableBodyProps> = ({
	children,
	className = "",
	...props
}) => {
	return (
		<tbody
			className={cn(
				"divide-y divide-nocta-200/60 dark:divide-nocta-800/40",
				className,
			)}
			{...props}
		>
			{children}
		</tbody>
	);
};

export const TableRow: React.FC<TableRowProps> = ({
	children,
	className = "",
	variant = "default",
	isOdd = false,
	...props
}) => {
	return (
		<tr
			className={cn(tableRowVariants({ variant, isOdd }), className)}
			{...props}
		>
			{children}
		</tr>
	);
};

export const TableCell: React.FC<TableCellProps> = ({
	children,
	className = "",
	align = "left",
	header = false,
	colSpan,
	rowSpan,
	...props
}) => {
	const Component = header ? "th" : "td";

	const getAlignmentClass = () => {
		const alignments = {
			left: "text-left",
			center: "text-center",
			right: "text-right",
		};
		return alignments[align];
	};

	return React.createElement(
		Component,
		{
			className: cn(
				"px-6 py-4",
				getAlignmentClass(),
				header
					? "font-semibold text-nocta-900 dark:text-nocta-100 tracking-tight"
					: "text-nocta-700 dark:text-nocta-300",
				className,
			),
			colSpan,
			rowSpan,
			...props,
		},
		children,
	);
};

export const TableFooter: React.FC<TableFooterProps> = ({
	children,
	className = "",
	...props
}) => {
	return (
		<tfoot
			className={cn(
				"bg-nocta-200/50 dark:bg-nocta-800/50 border-t border-nocta-200 dark:border-nocta-800/50 font-semibold",
				className,
			)}
			{...props}
		>
			{children}
		</tfoot>
	);
};

export const TableCaption: React.FC<TableCaptionProps> = ({
	children,
	className = "",
	...props
}) => {
	return (
		<caption
			className={cn(
				"py-3 text-sm text-nocta-600 dark:text-nocta-400",
				className,
			)}
			{...props}
		>
			{children}
		</caption>
	);
};
