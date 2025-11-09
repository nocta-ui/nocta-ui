'use client';

import React from 'react';
import { Pagination } from './pagination';

export const DefaultPaginationDemo: React.FC = () => {
  const [page, setPage] = React.useState(1);

	return (
		<div className="my-6 space-y-2 text-center">
			<Pagination
				totalPages={4}
				currentPage={page}
				onPageChange={setPage}
			/>
			<p className="text-sm text-foreground/70">
				Showing page {page} of 4
			</p>
		</div>
	);
};

export const ExtendedPaginationDemo: React.FC = () => {
	const [page, setPage] = React.useState(25);

	return (
		<div className="my-6 space-y-2 text-center">
			<Pagination
				totalPages={64}
				currentPage={page}
				onPageChange={setPage}
				siblingCount={2}
			/>
			<p className="text-sm text-foreground/70">
				Showing page {page} of 64
			</p>
		</div>
	);
};
