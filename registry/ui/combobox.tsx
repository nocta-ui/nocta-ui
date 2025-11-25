'use client';

import * as Ariakit from '@ariakit/react';
import { cva, type VariantProps } from 'class-variance-authority';
import type React from 'react';
import {
	startTransition,
	useCallback,
	useEffect,
	useId,
	useMemo,
	useState,
} from 'react';
import { cn } from '@/lib/utils';
import { Icons } from '@/registry/lib/icons';
import { ScrollArea } from '@/registry/ui/scroll-area';

const comboboxVariants = cva(
	`relative inline-flex w-fit cursor-pointer items-center justify-between bg-card text-foreground rounded-md border shadow-sm card-highlight hover:bg-card-muted transition-[background-color,color,box-shadow] ease-out-quad duration-100 focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-offset-ring-offset/50 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50`,
	{
		variants: {
			variant: {
				default: `border-border focus-visible:ring-ring/50`,
				error: `border-destructive/40 focus-visible:ring-destructive/50 dark:focus-visible:ring-destructive/50`,
				success: `border-success/40 focus-visible:ring-success/50 dark:focus-visible:ring-success/50`,
			},
			size: {
				sm: 'h-8 px-2.5 py-1.5 px-3 text-sm',
				md: 'h-9 px-3 py-2 text-sm',
				lg: 'h-10 px-4 py-2 text-base',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'md',
		},
	},
);

export interface ComboboxOption {
	value: string;
	label: string;
	disabled?: boolean;
}

export interface ComboboxProps extends VariantProps<typeof comboboxVariants> {
	options: ComboboxOption[];
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	portal?: boolean;
	placeholder?: string;
	searchPlaceholder?: string;
	emptyMessage?: string;
	disabled?: boolean;
	className?: string;
	popoverClassName?: string;
	clearable?: boolean;
}

export const Combobox: React.FC<ComboboxProps> = ({
	options,
	value: controlledValue,
	defaultValue,
	onValueChange,
	portal = true,
	placeholder = 'Select option...',
	searchPlaceholder = 'Search...',
	emptyMessage = 'No options found',
	disabled = false,
	size = 'md',
	variant = 'default',
	className = '',
	popoverClassName = '',
	clearable = true,
}) => {
	const baseId = useId();
	const [internalValue, setInternalValue] = useState(defaultValue ?? '');
	const [searchValue, setSearchValue] = useState('');

	const comboboxStore = Ariakit.useComboboxStore({
		resetValueOnHide: true,
	});

	const selectStore = Ariakit.useSelectStore({
		value: controlledValue ?? internalValue,
		...(defaultValue !== undefined ? { defaultValue } : {}),
		animated: true,
		combobox: comboboxStore,
		setValue: (value) => {
			const nextValue = value == null ? '' : String(value);
			if (controlledValue === undefined) {
				setInternalValue(nextValue);
			}
			if (onValueChange) {
				onValueChange(nextValue);
			}
		},
	});

	const selectedValue = Ariakit.useStoreState(selectStore, (state) => {
		const value = state.value;
		if (Array.isArray(value)) {
			return String(value[value.length - 1] ?? '');
		}
		return value == null ? '' : String(value);
	});

	const selectedOption = useMemo(
		() => options.find((option) => option.value === selectedValue),
		[options, selectedValue],
	);

	const matches = useMemo(() => {
		const query = searchValue.trim().toLowerCase();
		if (!query) return options;
		return options.filter((option) =>
			option.label.toLowerCase().includes(query),
		);
	}, [options, searchValue]);

	const listId = `${baseId}-listbox`;
	const isOpen = Ariakit.useStoreState(selectStore, (state) => state.open);

	useEffect(() => {
		if (!isOpen) {
			comboboxStore.setValue('');
			startTransition(() => setSearchValue(''));
		}
	}, [comboboxStore, isOpen]);

	const handleClear = useCallback(
		(event: React.SyntheticEvent) => {
			event.stopPropagation();
			event.preventDefault();
			selectStore.setValue('');
			comboboxStore.setValue('');
			startTransition(() => setSearchValue(''));
		},
		[comboboxStore, selectStore],
	);

	return (
		<Ariakit.ComboboxProvider store={comboboxStore} resetValueOnHide>
			<Ariakit.SelectProvider store={selectStore}>
				<div className="relative">
					<Ariakit.Select
						disabled={disabled}
						className={cn(
							comboboxVariants({ variant, size }),
							disabled && 'cursor-not-allowed opacity-50',
							className,
						)}
					>
						<span
							className={cn(
								'flex-1 truncate text-left',
								selectedOption ? '' : 'text-foreground/45',
							)}
						>
							{selectedOption ? selectedOption.label : placeholder}
						</span>
						<div className="ml-2 flex items-center gap-1">
							{clearable && selectedOption && !disabled && (
								<span
									onMouseDown={handleClear}
									onClick={handleClear}
									onKeyDown={(e) => {
										if (e.key === 'Enter' || e.key === ' ') {
											e.preventDefault();
											handleClear(e);
										}
									}}
									role="button"
									tabIndex={0}
									className="cursor-pointer rounded p-0.5 text-foreground/70 hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring/50 focus-visible:ring-offset-1 focus-visible:ring-offset-ring-offset/50 focus-visible:outline-none"
								>
									<Icons.X aria-hidden="true" className="h-3 w-3" />
									<Ariakit.VisuallyHidden>
										Clear Selection
									</Ariakit.VisuallyHidden>
								</span>
							)}
							<Icons.CaretSort
								aria-hidden="true"
								className="h-4.5 w-4.5 text-foreground/70"
							/>
						</div>
					</Ariakit.Select>

					<Ariakit.SelectPopover
						portal={portal}
						sameWidth
						className={cn(
							'absolute z-999 my-1 rounded-md border border-border bg-popover shadow-md card-highlight',
							'origin-top -translate-y-2 scale-95 opacity-0 transition-[scale,translate,opacity] duration-300 ease-smooth data-enter:translate-y-0 data-enter:scale-100 data-enter:opacity-100 data-leave:-translate-y-2 data-leave:scale-95 data-leave:opacity-0',
							popoverClassName,
						)}
					>
						<div className="border-b border-border/60 p-1 flex justify-start items-center">
							<Icons.Search
								aria-hidden="true"
								className="size-6 text-foreground/35 ml-2"
							/>
							<Ariakit.Combobox
								autoSelect
								placeholder={searchPlaceholder}
								aria-controls={listId}
								onChange={(event) =>
									startTransition(() =>
										setSearchValue(event.currentTarget.value),
									)
								}
								className="w-full border-0 bg-transparent pl-1.5 pr-2 py-1.5 text-sm placeholder:text-foreground/45 focus-visible:outline-none"
							/>
						</div>

						<ScrollArea
							type="scroll"
							className="z-50 flex flex-col h-full w-full max-h-42"
						>
							<Ariakit.ComboboxList id={listId} className="flex flex-col py-1">
								<div aria-live="polite" className="sr-only">
									{matches.length} result{matches.length === 1 ? '' : 's'}
								</div>
								{matches.length === 0 ? (
									<output
										aria-live="polite"
										className="mx-1 px-2 py-1.5 text-center text-sm text-foreground/70"
									>
										{emptyMessage}
									</output>
								) : (
									matches.map((option) => {
										const isSelected = option.value === selectedValue;
										const itemDisabled = option.disabled === true;
										return (
											<Ariakit.SelectItem
												key={option.value}
												value={option.value}
												{...(itemDisabled ? { disabled: true } : {})}
												className={cn(
													'relative mx-1 flex cursor-pointer items-center justify-between rounded-sm px-2 py-1.5 text-sm text-foreground/70 select-none outline-none',
													'hover:bg-popover-muted hover:text-foreground data-active-item:bg-popover-muted data-active-item:text-foreground',
													"[&_svg]:shrink-0 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 gap-2",
													option.disabled &&
														'pointer-events-none cursor-not-allowed opacity-50',
												)}
												render={
													<Ariakit.ComboboxItem
														value={option.label}
														focusOnHover
														setValueOnClick
													/>
												}
											>
												<span className="flex-1">{option.label}</span>
												{isSelected && (
													<Icons.Check
														aria-hidden="true"
														className="h-4 w-4 text-foreground/70"
													/>
												)}
											</Ariakit.SelectItem>
										);
									})
								)}
							</Ariakit.ComboboxList>
						</ScrollArea>
					</Ariakit.SelectPopover>
				</div>
			</Ariakit.SelectProvider>
		</Ariakit.ComboboxProvider>
	);
};
