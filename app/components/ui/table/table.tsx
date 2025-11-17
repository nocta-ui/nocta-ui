'use client';

import * as Ariakit from '@ariakit/react';
import {
	type ColumnDef,
	type ColumnMeta,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	type Row,
	type RowSelectionState,
	type SortingState,
	type TableOptions,
	useReactTable,
} from '@tanstack/react-table';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Icons } from '@/app/components/ui/icons/icons';
import { cn } from '@/lib/utils';

declare module '@tanstack/react-table' {
	// Allow consumers to configure presentation details on column definitions.
	interface ColumnMeta<TData, TValue> {
		align?: 'left' | 'center' | 'right';
		width?: number | string;
		minWidth?: number | string;
		maxWidth?: number | string;
		className?: string;
		headerClassName?: string;
		headerTooltip?: string;
		/**
		 * Phantom brand to reference generics and satisfy type checkers.
		 * Not for public use.
		 */
		readonly __metaGenericsBrand__?: {
			readonly data?: TData;
			readonly value?: TValue;
		};
	}
}

const tableVariants = cva(
	[
		'relative border border-border bg-card',
		'rounded-lg shadow-md card-highlight',
		'not-prose',
	],
	{
		variants: {
			density: {
				comfortable: 'text-sm',
				compact: 'text-xs',
			},
		},
		defaultVariants: {
			density: 'comfortable',
		},
	},
);

const headerCellVariants = cva(
	[
		'flex items-center rounded-lg p-4 text-foreground/70 text-xs font-medium tracking-wide uppercase',
		'transition-shadow duration-100 ease-out-quad',
		'focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:outline-none',
		'focus-visible:ring-ring/50 focus-visible:ring-offset-ring-offset/50',
	],
	{
		variants: {
			align: {
				left: 'justify-start text-left',
				center: 'justify-center text-center',
				right: 'justify-end text-right',
			},
			sortable: {
				true: 'cursor-pointer hover:text-foreground',
				false: '',
			},
			sorted: {
				asc: 'text-foreground',
				desc: 'text-foreground',
				none: '',
			},
		},
		defaultVariants: {
			align: 'left',
			sortable: false,
			sorted: 'none',
		},
	},
);

const cellVariants = cva(['px-4 py-3 text-foreground', 'whitespace-nowrap'], {
	variants: {
		align: {
			left: 'text-left',
			center: 'text-center',
			right: 'text-right',
		},
	},
	defaultVariants: {
		align: 'left',
	},
});

const rowVariants = cva(
	['relative grid items-center', 'border-b border-border/60 last:border-0'],
	{
		variants: {
			selected: {
				true: 'bg-card-muted',
				false: '',
			},
			active: {
				true: 'z-10 transition-shadow duration-100 ease-out-quad focus-visible:z-10 focus-visible:rounded-lg focus-visible:ring-1 focus-visible:ring-ring/50 focus-visible:ring-offset-1 focus-visible:ring-offset-ring-offset/50 focus-visible:outline-none',
				false: '',
			},
		},
		defaultVariants: {
			selected: false,
			active: false,
		},
	},
);

const compositeOptions = {
	orientation: 'vertical' as const,
	focusLoop: false,
};

function resolveUpdater<T>(updater: T | ((old: T) => T), previous: T): T {
	return typeof updater === 'function'
		? (updater as (old: T) => T)(previous)
		: updater;
}

export interface TableProps<TData>
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof tableVariants> {
	columns: ColumnDef<TData, unknown>[];
	data: TData[];
	enableSorting?: boolean;
	enableRowSelection?: boolean;
	activeRowId?: string;
	onActiveRowChange?: (rowId: string | undefined) => void;
	onRowClick?: (row: Row<TData>) => void;
	initialSorting?: SortingState;
	sortingState?: SortingState;
	onSortingChange?: (sorting: SortingState) => void;
	rowSelectionState?: RowSelectionState;
	onRowSelectionChange?: (state: RowSelectionState) => void;
	onSelectedRowsChange?: (rows: Row<TData>[]) => void;
	emptyState?: React.ReactNode;
	getRowId?: (originalRow: TData, index: number, parent?: Row<TData>) => string;
}

export function Table<TData>({
	columns,
	data,
	enableSorting = true,
	enableRowSelection = false,
	density,
	className = '',
	onRowClick,
	initialSorting = [],
	sortingState,
	onSortingChange,
	rowSelectionState,
	onRowSelectionChange,
	onSelectedRowsChange,
	emptyState,
	activeRowId,
	onActiveRowChange,
	getRowId,
	...props
}: TableProps<TData>) {
	const isSortingControlled = sortingState !== undefined;
	const [internalSorting, setInternalSorting] =
		React.useState<SortingState>(initialSorting);
	const sorting = isSortingControlled ? sortingState : internalSorting;

	const isRowSelectionControlled = rowSelectionState !== undefined;
	const [internalRowSelection, setInternalRowSelection] =
		React.useState<RowSelectionState>({});
	const rowSelection = isRowSelectionControlled
		? rowSelectionState
		: internalRowSelection;

	const augmentedColumns = React.useMemo(() => {
		if (!enableRowSelection) {
			return columns;
		}

		const selectionColumn: ColumnDef<TData, unknown> = {
			id: '__selection__',
			enableSorting: false,
			enableHiding: false,
			header: ({ table }) => {
				return (
					<div className="flex justify-center p-1">
						<Checkbox
							aria-label="Select all rows"
							size="sm"
							checked={table.getIsAllRowsSelected()}
							onCheckedChange={(value) =>
								table.toggleAllRowsSelected(Boolean(value))
							}
						/>
					</div>
				);
			},
			cell: ({ row }) => {
				return (
					<div className="flex justify-center p-1">
						<Checkbox
							aria-label="Select row"
							size="sm"
							disabled={!row.getCanSelect()}
							checked={row.getIsSelected()}
							onCheckedChange={(value) => row.toggleSelected(Boolean(value))}
						/>
					</div>
				);
			},
			meta: {
				align: 'center',
				width: '48px',
				headerClassName: 'px-2',
				className: 'px-2',
			},
		};

		return [selectionColumn, ...columns];
	}, [columns, enableRowSelection]);

	const tableOptions: TableOptions<TData> = {
		columns: augmentedColumns,
		data,
		state: {
			sorting,
			rowSelection,
		},
		enableSorting,
		enableRowSelection,
		onSortingChange: (updater) => {
			const next = resolveUpdater(updater, sorting);
			if (!isSortingControlled) {
				setInternalSorting(next);
			}
			onSortingChange?.(next);
		},
		onRowSelectionChange: (updater) => {
			const next = resolveUpdater(updater, rowSelection);
			if (!isRowSelectionControlled) {
				setInternalRowSelection(next);
			}
			onRowSelectionChange?.(next);
		},
		getCoreRowModel: getCoreRowModel(),
	};

	if (getRowId) {
		tableOptions.getRowId = getRowId;
	}

	if (enableSorting) {
		tableOptions.getSortedRowModel = getSortedRowModel();
	}

	const table = useReactTable(tableOptions);

	/* biome-ignore lint/correctness/useExhaustiveDependencies: row selection callback must run when selection changes */
	React.useEffect(() => {
		if (!onSelectedRowsChange) return;
		const selectedRows = table
			.getSelectedRowModel()
			.rows.map((tableRow) => tableRow);
		onSelectedRowsChange(selectedRows);
	}, [table, onSelectedRowsChange, rowSelection]);

	const composite = Ariakit.useCompositeStore({
		...compositeOptions,
		defaultActiveId: null,
	});
	const activeCompositeId = Ariakit.useStoreState(composite, 'activeId');
	const tableRef = React.useRef<HTMLDivElement>(null);

	const visibleColumns = table.getVisibleLeafColumns();
	const gridTemplateColumns = React.useMemo(() => {
		return visibleColumns
			.map((column) => {
				const meta = column.columnDef.meta as
					| ColumnMeta<TData, unknown>
					| undefined;
				const width = meta?.width;
				if (typeof width === 'number') {
					return `minmax(${width}px, ${width}px)`;
				}
				if (typeof width === 'string') {
					return width;
				}
				return 'minmax(0, 1fr)';
			})
			.join(' ');
	}, [visibleColumns]);

	const rows = table.getRowModel().rows;

	React.useEffect(() => {
		if (activeRowId !== undefined) {
			return;
		}

		composite.setActiveId(null);
	}, [activeRowId, composite]);

	React.useEffect(() => {
		if (rows.length === 0) {
			return;
		}

		const resolveCompositeId = (rowId: string) => `row-${rowId}`;

		if (activeRowId !== undefined) {
			const controlledId = resolveCompositeId(activeRowId);
			if (activeCompositeId !== controlledId) {
				composite.setActiveId(controlledId);
			}
			return;
		}

		const fallbackId = rows[0]?.id;
		if (!fallbackId) {
			return;
		}

		if (!activeCompositeId) {
			return;
		}

		const isActiveRowPresent = rows.some(
			(row) => resolveCompositeId(row.id) === activeCompositeId,
		);
		if (!isActiveRowPresent) {
			composite.setActiveId(resolveCompositeId(fallbackId));
		}
	}, [activeRowId, rows, composite, activeCompositeId]);

	React.useEffect(() => {
		if (!onActiveRowChange) return;
		const resolvedId = activeCompositeId?.replace(/^row-/, '');
		onActiveRowChange(resolvedId);
	}, [activeCompositeId, onActiveRowChange]);

	React.useEffect(() => {
		if (activeRowId !== undefined) {
			return;
		}

		const handlePointerDown = (event: PointerEvent) => {
			const target = event.target as Node | null;
			if (!target) return;
			if (!tableRef.current?.contains(target)) {
				composite.setActiveId(null);
			}
		};

		document.addEventListener('pointerdown', handlePointerDown);
		return () => {
			document.removeEventListener('pointerdown', handlePointerDown);
		};
	}, [activeRowId, composite]);

	return (
		<div
			ref={tableRef}
			className={cn(tableVariants({ density }), className)}
			{...props}
		>
			{table.getHeaderGroups().map((headerGroup) => (
				/* biome-ignore lint/a11y/useSemanticElements: Using div-based grid structure for responsive layout */
				<div
					key={headerGroup.id}
					role="row"
					className="grid border-b border-border/60 bg-card-muted/50 dark:bg-card-muted/30 rounded-t-lg"
					style={{ gridTemplateColumns }}
					tabIndex={-1}
				>
					{headerGroup.headers.map((header) => {
						if (header.isPlaceholder) {
							return <div key={header.id} />;
						}

						const column = header.column;
						const meta = column.columnDef.meta as
							| ColumnMeta<TData, unknown>
							| undefined;
						const align = meta?.align ?? 'left';
						const headerClassName = meta?.headerClassName;
						const sortStateRaw = column.getIsSorted();
						const sortStateVariant: 'asc' | 'desc' | 'none' =
							sortStateRaw === 'asc' || sortStateRaw === 'desc'
								? sortStateRaw
								: 'none';
						const canSort = enableSorting && column.getCanSort();

						if (!canSort) {
							return (
								/* biome-ignore lint/a11y/useSemanticElements: Using div for flexible column header layout */
								<div
									key={header.id}
									role="columnheader"
									title={meta?.headerTooltip}
									className={cn(
										headerCellVariants({
											align,
											sortable: false,
											sorted: 'none',
										}),
										headerClassName,
									)}
									tabIndex={-1}
								>
									<span className="truncate text-xs font-medium">
										{flexRender(
											header.column.columnDef.header,
											header.getContext(),
										)}
									</span>
								</div>
							);
						}

						return (
							/* biome-ignore lint/a11y/useSemanticElements: Sorting toggle needs button semantics */
							<button
								key={header.id}
								type="button"
								role="columnheader"
								title={meta?.headerTooltip}
								onClick={column.getToggleSortingHandler()}
								aria-sort={
									sortStateRaw === 'asc'
										? 'ascending'
										: sortStateRaw === 'desc'
											? 'descending'
											: 'none'
								}
								className={cn(
									headerCellVariants({
										align,
										sortable: true,
										sorted: sortStateVariant,
									}),
									headerClassName,
								)}
							>
								<span className="truncate text-xs font-medium">
									{flexRender(
										header.column.columnDef.header,
										header.getContext(),
									)}
								</span>
								<span className="ml-1 flex items-center justify-center">
									<Icons.CaretSort
										aria-hidden="true"
										className="h-3.5 w-3.5 text-foreground/70"
									/>
								</span>
							</button>
						);
					})}
				</div>
			))}

			<Ariakit.Composite
				store={composite}
				role="grid"
				aria-rowcount={rows.length}
				aria-colcount={visibleColumns.length}
				className="rounded-lg transition-shadow duration-100 ease-out-quad focus-visible:ring-1 focus-visible:ring-ring/50 focus-visible:ring-offset-1 focus-visible:ring-offset-ring-offset/50 focus-visible:outline-none"
			>
				{rows.length === 0 && (
					<div className="px-6 py-10 text-center text-foreground/70">
						{emptyState ?? 'No data available'}
					</div>
				)}

				{rows.map((row) => {
					const rowMetaId = `row-${row.id}`;
					const isActive = activeCompositeId === rowMetaId;
					return (
						<Ariakit.CompositeItem
							key={row.id}
							id={rowMetaId}
							role="row"
							focusable
							data-row-id={row.id}
							aria-selected={row.getIsSelected() || undefined}
							className={cn(
								rowVariants({
									selected: row.getIsSelected(),
									active: isActive,
								}),
							)}
							onClick={() => onRowClick?.(row)}
							onKeyDown={(event) => {
								if (!onRowClick) return;
								if (event.key === 'Enter' || event.key === ' ') {
									event.preventDefault();
									onRowClick(row);
								}
							}}
							render={(itemProps) => (
								<div
									{...itemProps}
									style={{ ...itemProps.style, gridTemplateColumns }}
								>
									{row.getVisibleCells().map((cell) => {
										const meta = cell.column.columnDef.meta as
											| ColumnMeta<TData, unknown>
											| undefined;
										const align = meta?.align ?? 'left';

										return (
											/* biome-ignore lint/a11y/useSemanticElements: Using div gridcells for layout flexibility */
											<div
												key={cell.id}
												role="gridcell"
												className={cn(cellVariants({ align }), meta?.className)}
												tabIndex={-1}
											>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext(),
												)}
											</div>
										);
									})}
								</div>
							)}
						/>
					);
				})}
			</Ariakit.Composite>
		</div>
	);
}

export { tableVariants };
export type { ColumnDef, Row };
