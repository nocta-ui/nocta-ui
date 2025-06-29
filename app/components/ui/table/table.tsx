'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Spinner } from '../spinner';

// Types
export type SortDirection = 'asc' | 'desc' | null;
export type TableVariant = 'default' | 'striped';
export type TableSize = 'sm' | 'md' | 'lg';

export interface TableColumn<T = Record<string, unknown>> {
  key: string;
  title: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: unknown, record: T, index: number) => React.ReactNode;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export interface TableProps<T = Record<string, unknown>> extends Omit<React.TableHTMLAttributes<HTMLTableElement>, 'size'> {
  columns: TableColumn<T>[];
  data: T[];
  variant?: TableVariant;
  size?: TableSize;
  loading?: boolean;
  emptyText?: string;
  sortable?: boolean;
  filterable?: boolean;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
  onSort?: (key: string, direction: SortDirection) => void;
  onFilter?: (filters: Record<string, string>) => void;
  className?: string;
  rowKey?: string | ((record: T) => string);
  onRowClick?: (record: T, index: number) => void;
  rowClassName?: string | ((record: T, index: number) => string);
}

export interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
  className?: string;
}

export interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
  className?: string;
}

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode;
  className?: string;
  clickable?: boolean;
}

export interface TableCellProps extends React.HTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
  header?: boolean;
  sortable?: boolean;
  sortDirection?: SortDirection;
  onSort?: () => void;
  colSpan?: number;
  rowSpan?: number;
}

export interface TableFooterProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
  className?: string;
}

export interface TableCaptionProps extends React.HTMLAttributes<HTMLTableCaptionElement> {
  children: React.ReactNode;
  className?: string;
}

// Base Table Component
export const Table = <T extends Record<string, unknown>>({
  columns,
  data,
  variant = 'default',
  size = 'md',
  loading = false,
  emptyText = 'No data available',
  sortable = false,
  filterable = false,
  pagination,
  onSort,
  onFilter,
  className = '',
  rowKey = 'id',
  onRowClick,
  rowClassName,
  ...props
}: TableProps<T>) => {
  const [sortState, setSortState] = useState<{ key: string; direction: SortDirection }>({
    key: '',
    direction: null
  });
  const [filters, setFilters] = useState<Record<string, string>>({});

  const getRowKey = useCallback((record: T, index: number): string => {
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    return String(record[rowKey] || index);
  }, [rowKey]);

  const handleSort = useCallback((key: string) => {
    if (!sortable) return;
    
    let newDirection: SortDirection = 'asc';
    
    if (sortState.key === key) {
      if (sortState.direction === 'asc') {
        newDirection = 'desc';
      } else if (sortState.direction === 'desc') {
        newDirection = null;
      }
    }
    
    setSortState({ key, direction: newDirection });
    onSort?.(key, newDirection);
  }, [sortable, sortState, onSort]);

  const handleFilter = useCallback((key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    if (!value) {
      delete newFilters[key];
    }
    setFilters(newFilters);
    onFilter?.(newFilters);
  }, [filters, onFilter]);

  const sortedAndFilteredData = useMemo(() => {
    let result = [...data];

    // Apply filters
    if (filterable && Object.keys(filters).length > 0) {
      result = result.filter(record => {
        return Object.entries(filters).every(([key, filterValue]) => {
          const cellValue = record[key]?.toString().toLowerCase() || '';
          return cellValue.includes(filterValue.toLowerCase());
        });
      });
    }

    // Apply sorting
    if (sortable && sortState.key && sortState.direction) {
      result.sort((a, b) => {
        const aVal = a[sortState.key];
        const bVal = b[sortState.key];
        
        // Handle comparison for unknown types safely
        const aStr = String(aVal ?? '');
        const bStr = String(bVal ?? '');
        
        return sortState.direction === 'asc' 
          ? aStr.localeCompare(bStr)
          : bStr.localeCompare(aStr);
      });
    }

    return result;
  }, [data, filters, sortState, sortable, filterable]);

  const getVariantStyles = () => {
    const variants = {
      default: '',
      striped: ''
    };
    return variants[variant];
  };

  const getSizeStyles = () => {
    const sizes = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base'
    };
    return sizes[size];
  };

  const getRowClassName = useCallback((record: T, index: number): string => {
    let className = '';
    
    if (variant === 'striped' && index % 2 === 1) {
      className += ' bg-neutral-50 dark:bg-neutral-800/30';
    }
    
    if (onRowClick) {
      className += ' cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors duration-200 ease-in-out';
    }
    
    if (typeof rowClassName === 'function') {
      className += ' ' + rowClassName(record, index);
    } else if (rowClassName) {
      className += ' ' + rowClassName;
    }
    
    return className.trim();
  }, [variant, onRowClick, rowClassName]);



  return (
    <div className="not-prose">
      <div className={`
        bg-white dark:bg-neutral-900 
        border border-neutral-300 dark:border-neutral-700/50 
        rounded-xl 
        shadow-lg dark:shadow-xl 
        backdrop-blur-sm 
        overflow-hidden 
        ${getVariantStyles()}
        ${className}
      `}>
        <div className="overflow-x-auto">
          <table
            className={`
              w-full border-collapse
              ${getSizeStyles()}
            `}
            {...props}
          >
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    header
                    align={column.align}
                    sortable={sortable && column.sortable !== false}
                    sortDirection={sortState.key === column.key ? sortState.direction : null}
                    onSort={() => handleSort(column.key)}
                    className={column.className}
                    style={{ width: column.width }}
                  >
                    <div className="flex flex-col gap-2">
                      <span>{column.title}</span>
                      {filterable && column.filterable !== false && (
                        <input
                          type="text"
                          placeholder={`Filter ${column.title.toLowerCase()}...`}
                          value={filters[column.key] || ''}
                          onChange={(e) => handleFilter(column.key, e.target.value)}
                          className="px-3 py-1.5 text-xs rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-500/50 dark:focus:ring-neutral-400/50 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        />
                      )}
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell 
                    colSpan={columns.length}
                    align="center"
                    className="py-12"
                  >
                    <div className="flex items-center justify-center">
                      <Spinner size="lg" variant="primary" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : sortedAndFilteredData.length === 0 ? (
                <TableRow>
                  <TableCell 
                    colSpan={columns.length}
                    align="center"
                    className="py-12 text-neutral-500 dark:text-neutral-400"
                  >
                    {emptyText}
                  </TableCell>
                </TableRow>
              ) : (
                sortedAndFilteredData.map((record, index) => (
                  <TableRow
                    key={getRowKey(record, index)}
                    className={getRowClassName(record, index)}
                    clickable={!!onRowClick}
                    onClick={() => onRowClick?.(record, index)}
                  >
                    {columns.map((column) => {
                      const value = record[column.key];
                      const content = column.render 
                        ? column.render(value, record, index)
                        : value?.toString() || '';
                      
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
          <div className="px-6 py-4 bg-neutral-50 dark:bg-neutral-800/50 border-t border-neutral-100 dark:border-neutral-700/50 flex items-center justify-between">
            <div className="text-sm text-neutral-600 dark:text-neutral-400">
              Showing {Math.min((pagination.current - 1) * pagination.pageSize + 1, pagination.total)} to{' '}
              {Math.min(pagination.current * pagination.pageSize, pagination.total)} of {pagination.total} entries
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => pagination.onChange(pagination.current - 1, pagination.pageSize)}
                disabled={pagination.current <= 1}
                className="px-3 py-1.5 text-sm rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors duration-200 ease-in-out"
              >
                Previous
              </button>
              <span className="px-3 py-1.5 text-sm text-neutral-600 dark:text-neutral-400">
                Page {pagination.current} of {Math.ceil(pagination.total / pagination.pageSize)}
              </span>
              <button
                onClick={() => pagination.onChange(pagination.current + 1, pagination.pageSize)}
                disabled={pagination.current >= Math.ceil(pagination.total / pagination.pageSize)}
                className="px-3 py-1.5 text-sm rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors duration-200 ease-in-out"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Table Header Component
export const TableHeader: React.FC<TableHeaderProps> = ({ 
  children, 
  className = '', 
  ...props 
}) => {
  return (
    <thead 
      className={`
        bg-neutral-50 dark:bg-neutral-800/50
        ${className}
      `}
      {...props}
    >
      {children}
    </thead>
  );
};

// Table Body Component  
export const TableBody: React.FC<TableBodyProps> = ({ 
  children, 
  className = '', 
  ...props 
}) => {
  return (
    <tbody 
      className={`
        divide-y divide-neutral-100 dark:divide-neutral-700/50
        ${className}
      `}
      {...props}
    >
      {children}
    </tbody>
  );
};

// Table Row Component
export const TableRow: React.FC<TableRowProps> = ({ 
  children, 
  className = '', 
  clickable = false,
  ...props 
}) => {
  return (
    <tr 
      className={`
        ${clickable ? 'cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors duration-200 ease-in-out' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </tr>
  );
};

// Table Cell Component
export const TableCell: React.FC<TableCellProps> = ({ 
  children, 
  className = '', 
  align = 'left',
  header = false,
  sortable = false,
  sortDirection = null,
  onSort,
  colSpan,
  rowSpan,
  ...props 
}) => {
  const Component = header ? 'th' : 'td';
  
  const getAlignmentClass = () => {
    const alignments = {
      left: 'text-left',
      center: 'text-center', 
      right: 'text-right'
    };
    return alignments[align];
  };

  const getSortIcon = () => {
    if (!sortable) return null;
    
    return (
      <span className="ml-2 inline-flex flex-col">
        <svg 
          className={`w-3 h-3 ${sortDirection === 'asc' ? 'text-neutral-900 dark:text-neutral-100' : 'text-neutral-400 dark:text-neutral-500'}`}
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        <svg 
          className={`w-3 h-3 ${sortDirection === 'desc' ? 'text-neutral-900 dark:text-neutral-100' : 'text-neutral-400 dark:text-neutral-500'}`}
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </span>
    );
  };

  return React.createElement(
    Component,
    {
      className: `
        px-6 py-4
        ${getAlignmentClass()}
        ${header 
          ? 'font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight' 
          : 'text-neutral-700 dark:text-neutral-300'
        }
        ${sortable ? 'cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700/50 select-none transition-colors duration-200 ease-in-out' : ''}
        ${className}
      `,
      onClick: sortable ? onSort : undefined,
      colSpan,
      rowSpan,
      ...props
    },
    <div className={`flex items-center ${align === 'center' ? 'justify-center' : align === 'right' ? 'justify-end' : 'justify-start'}`}>
      {children}
      {getSortIcon()}
    </div>
  );
};

// Table Footer Component
export const TableFooter: React.FC<TableFooterProps> = ({ 
  children, 
  className = '', 
  ...props 
}) => {
  return (
    <tfoot 
      className={`
        bg-neutral-50 dark:bg-neutral-800/50
        border-t border-neutral-100 dark:border-neutral-700/50
        font-semibold
        ${className}
      `}
      {...props}
    >
      {children}
    </tfoot>
  );
};

// Table Caption Component
export const TableCaption: React.FC<TableCaptionProps> = ({ 
  children, 
  className = '', 
  ...props 
}) => {
  return (
    <caption 
      className={`
        py-3 text-sm text-neutral-600 dark:text-neutral-400
        ${className}
      `}
      {...props}
    >
      {children}
    </caption>
  );
}; 