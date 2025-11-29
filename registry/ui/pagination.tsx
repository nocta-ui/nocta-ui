'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Icons } from '@/registry/lib/icons';
import { Button } from '@/registry/ui/button';

const DOTS = 'dots';

const createRange = (start: number, end: number) => {
	const length = end - start + 1;
	return Array.from({ length }, (_, index) => start + index);
};

const getPaginationRange = (
	totalPages: number,
	currentPage: number,
	siblingCount: number,
) => {
	const totalNumbers = siblingCount * 2 + 5;

	if (totalNumbers >= totalPages) {
		return createRange(1, totalPages);
	}

	const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
	const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

	const shouldShowLeftDots = leftSiblingIndex > 2;
	const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

	const firstPageIndex = 1;
	const lastPageIndex = totalPages;

	if (!shouldShowLeftDots && shouldShowRightDots) {
		const leftItemCount = 3 + siblingCount * 2;
		const leftRange = createRange(1, leftItemCount);
		return [...leftRange, DOTS, totalPages];
	}

	if (shouldShowLeftDots && !shouldShowRightDots) {
		const rightItemCount = 3 + siblingCount * 2;
		const rightRange = createRange(totalPages - rightItemCount + 1, totalPages);
		return [firstPageIndex, DOTS, ...rightRange];
	}

	if (shouldShowLeftDots && shouldShowRightDots) {
		const middleRange = createRange(leftSiblingIndex, rightSiblingIndex);
		return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
	}

	return createRange(1, totalPages);
};

export interface PaginationProps
	extends Omit<React.ComponentPropsWithoutRef<'nav'>, 'onChange'> {
	totalPages: number;
	currentPage: number;
	onPageChange?: (page: number) => void;
	siblingCount?: number;
	className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
	totalPages,
	currentPage,
	onPageChange,
	siblingCount = 1,
	className,
	...props
}) => {
	const [animOff, setAnimOff] = React.useState(false);
	const { 'aria-label': ariaLabelProp, ...restProps } = props;
	const normalizedTotalPages =
		Number.isFinite(totalPages) && totalPages > 0 ? Math.floor(totalPages) : 0;
	const hasPages = normalizedTotalPages > 0;
	const safePage = normalizedTotalPages
		? Math.min(Math.max(currentPage, 1), normalizedTotalPages)
		: 1;
	const pages = React.useMemo(() => {
		if (!hasPages) {
			return [];
		}

		return getPaginationRange(normalizedTotalPages, safePage, siblingCount);
	}, [hasPages, normalizedTotalPages, safePage, siblingCount]);

	/* biome-ignore lint/correctness/useExhaustiveDependencies: this dependency is needed for proper transition blocking */
	React.useEffect(() => {
		setAnimOff(true);
		const id = setTimeout(() => setAnimOff(false), 40);
		return () => clearTimeout(id);
	}, [safePage]);

	if (!hasPages) {
		return null;
	}

	const handlePageChange = (page: number) => {
		if (page < 1 || page > normalizedTotalPages || page === safePage) {
			return;
		}

		onPageChange?.(page);
	};

	const disabledPrevious = safePage === 1;
	const disabledNext = safePage === normalizedTotalPages;
	let dotsInstance = 0;

	return (
		<nav
			aria-label={ariaLabelProp ?? 'Pagination'}
			className={cn('flex items-center gap-2', className)}
			{...restProps}
		>
			<Button
				variant="ghost"
				size="md"
				onClick={() => handlePageChange(safePage - 1)}
				disabled={disabledPrevious}
				aria-label="Go to previous page"
				className="flex items-center gap-1.5"
			>
				<Icons.ChevronLeft className="h-4 w-4" />
				Previous
			</Button>

			<ol className="flex list-none items-center gap-1">
				{pages.map((item) => {
					if (item === DOTS) {
						dotsInstance += 1;
						return (
							<li
								key={`dots-${dotsInstance}`}
								className="px-2 text-sm font-medium text-foreground/45"
							>
								<Icons.DotsHorizontal />
							</li>
						);
					}

					const pageNumber = item as number;
					const isActive = pageNumber === safePage;

					return (
						<li key={pageNumber}>
							<Button
								variant="ghost"
								size="sm"
								className={cn(
									'h-9 min-w-9 px-0 py-0 font-medium',
									animOff && 'transition-none duration-0',
									isActive &&
										'bg-card text-foreground shadow-sm border border-border card-highlight pointer-events-none disabled:opacity-100',
								)}
								aria-current={isActive ? 'page' : undefined}
								onClick={() => handlePageChange(pageNumber)}
								disabled={isActive}
							>
								{pageNumber}
							</Button>
						</li>
					);
				})}
			</ol>

			<Button
				variant="ghost"
				size="md"
				onClick={() => handlePageChange(safePage + 1)}
				disabled={disabledNext}
				aria-label="Go to next page"
				className="flex items-center gap-1.5"
			>
				Next
				<Icons.ChevronRight className="h-4 w-4" />
			</Button>
		</nav>
	);
};
