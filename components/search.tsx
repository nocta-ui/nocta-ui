'use client';
import { useDocsSearch } from 'fumadocs-core/search/client';
import {
	SearchDialog,
	SearchDialogClose,
	SearchDialogContent,
	SearchDialogHeader,
	SearchDialogIcon,
	SearchDialogInput,
	SearchDialogList,
	SearchDialogOverlay,
	type SharedProps,
} from './search-dialog';
import { useI18n } from 'fumadocs-ui/contexts/i18n';

type DefaultSearchDialogProps = Omit<SharedProps, 'search' | 'onSearchChange'>;

export default function DefaultSearchDialog({
	open,
	onOpenChange,
	isLoading,
	children,
	...rest
}: DefaultSearchDialogProps) {
	const { locale } = useI18n();
	const { search, setSearch, query } = useDocsSearch({
		type: 'fetch',
		locale,
	});

	return (
		<SearchDialog
			open={open}
			onOpenChange={onOpenChange}
			search={search}
			onSearchChange={setSearch}
			isLoading={query.isLoading}
			{...rest}
		>
			<SearchDialogOverlay className="bg-overlay" />
			<SearchDialogContent>
				<SearchDialogHeader>
					<SearchDialogIcon />
					<SearchDialogInput />
					<SearchDialogClose />
				</SearchDialogHeader>
				<SearchDialogList items={query.data !== 'empty' ? query.data : null} />
			</SearchDialogContent>
		</SearchDialog>
	);
}
