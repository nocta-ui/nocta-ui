'use client';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { usePathname } from 'fumadocs-core/framework';
import Link from 'fumadocs-core/link';
import { useSidebar } from 'fumadocs-ui/contexts/sidebar';
import type { SidebarTab } from 'fumadocs-ui/utils/get-sidebar-tabs';
import { type ComponentProps, type ReactNode, useMemo, useState } from 'react';
import { cn } from '../lib/cn';
import { isTabActive } from '../lib/is-active';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

export interface Option extends SidebarTab {
	props?: ComponentProps<'a'>;
}

export function RootToggle({
	options,
	placeholder,
	...props
}: {
	placeholder?: ReactNode;
	options: Option[];
} & ComponentProps<'button'>) {
	const [open, setOpen] = useState(false);
	const { closeOnRedirect } = useSidebar();
	const pathname = usePathname();

	const selected = useMemo(() => {
		return options.findLast((item) => isTabActive(item, pathname));
	}, [options, pathname]);

	const onClick = () => {
		closeOnRedirect.current = false;
		setOpen(false);
	};

	const item = selected ? (
		<>
			<div className="size-9 shrink-0 md:size-5">{selected.icon}</div>
			<div>
				<p className="text-sm font-medium">{selected.title}</p>
				<p className="text-[13px] text-foreground/70 empty:hidden md:hidden">
					{selected.description}
				</p>
			</div>
		</>
	) : (
		placeholder
	);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			{item && (
				<PopoverTrigger
					{...props}
					className={cn(
						'flex items-center gap-2 rounded-lg border bg-foreground/50 p-2 text-start text-foreground/45 transition-colors hover:bg-card-muted data-[state=open]:bg-card-muted data-[state=open]:text-foreground/45',
						props.className,
					)}
				>
					{item}
					<CaretSortIcon
						aria-hidden="true"
						className="ms-auto size-4 shrink-0 text-foreground/70"
					/>
				</PopoverTrigger>
			)}
			<PopoverContent className="flex w-(--radix-popover-trigger-width) flex-col gap-1 overflow-hidden p-1">
				{options.map((item) => {
					const isActive = selected && item.url === selected.url;
					if (!isActive && item.unlisted) return;

					return (
						<Link
							key={item.url}
							href={item.url}
							onClick={onClick}
							{...item.props}
							className={cn(
								'flex items-center gap-2 rounded-lg p-1.5 hover:bg-card-muted hover:text-foreground/45',
								item.props?.className,
							)}
						>
							<div className="size-9 shrink-0 md:mt-1 md:mb-auto md:size-5">
								{item.icon}
							</div>
							<div>
								<p className="text-sm font-medium">{item.title}</p>
								<p className="text-[13px] text-foreground/70 empty:hidden">
									{item.description}
								</p>
							</div>

							<CheckIcon
								aria-hidden="true"
								className={cn(
									'ms-auto size-3.5 shrink-0 text-foreground',
									!isActive && 'invisible',
								)}
							/>
						</Link>
					);
				})}
			</PopoverContent>
		</Popover>
	);
}
