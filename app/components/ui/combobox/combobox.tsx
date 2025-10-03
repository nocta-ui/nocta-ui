'use client';

import * as Ariakit from '@ariakit/react';
import { cva, type VariantProps } from 'class-variance-authority';
import type React from 'react';
import { useId, useMemo, useState } from 'react';
import { Icons } from '@/app/components/ui/icons/icons';
import { cn } from '@/lib/utils';

const comboboxVariants = cva(
	`not-prose relative inline-flex w-fit cursor-pointer items-center justify-between rounded-md border border-none shadow-sm transition-all duration-200 ease-in-out hover:bg-card-muted focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-offset-ring-offset/50 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-solid`,
	{
		variants: {
			variant: {
				default: `border-border bg-card text-foreground focus-visible:border-border focus-visible:ring-ring/50`,
				error: `border-error/40 bg-card text-foreground focus-visible:border-error/50 focus-visible:ring-error/50 dark:focus-visible:ring-error/50`,
				success: `border-success/40 bg-card text-foreground focus-visible:border-success/50 focus-visible:ring-success/50 dark:focus-visible:ring-success/50`,
			},
			size: {
				sm: 'h-8 px-3 text-xs',
				md: 'h-10 px-3 text-sm',
				lg: 'h-12 px-4 text-base',
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
	const [uncontrolledValue, setUncontrolledValue] = useState(
		defaultValue || '',
	);
	const selectedValue =
		controlledValue !== undefined ? controlledValue : uncontrolledValue;
	const selectedOption = useMemo(
		() => options.find((o) => o.value === selectedValue),
		[options, selectedValue],
	);

	const [searchValue, setSearchValue] = useState('');
	const matches = useMemo(
		() =>
			options.filter((o) =>
				o.label.toLowerCase().includes(searchValue.trim().toLowerCase()),
			),
		[options, searchValue],
	);

	const menu = Ariakit.useMenuStore({ animated: true });

	const handleSelect = (newValue: string) => {
		if (disabled) return;
		if (controlledValue === undefined) setUncontrolledValue(newValue);
		onValueChange?.(newValue);
		menu.hide();
		setSearchValue('');
	};

	const handleClear = (e: React.SyntheticEvent) => {
		e.stopPropagation();
		e.preventDefault();
		handleSelect('');
	};

	return (
		<Ariakit.ComboboxProvider resetValueOnHide>
			<Ariakit.MenuProvider store={menu}>
				<div className="not-prose relative">
					<Ariakit.MenuButton
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
									className="cursor-pointer rounded p-0.5 text-foreground/70 duration-200 ease-in-out hover:text-foreground"
									title="Clear selection"
									aria-label="Clear selection"
								>
									<Icons.X aria-hidden="true" className="h-3 w-3" />
								</span>
							)}
							<Icons.CaretSort
								aria-hidden="true"
								className="h-4.5 w-4.5 text-foreground/70"
							/>
						</div>
					</Ariakit.MenuButton>

					<Ariakit.Menu
						portal={portal}
						sameWidth
						className={cn(
							'absolute z-[999] my-1 overflow-hidden rounded-md border border-none border-border bg-card shadow-md dark:border-solid',
							'origin-top -translate-y-1 scale-95 transform opacity-0 transition-all duration-200 ease-in-out data-[enter]:translate-y-0 data-[enter]:scale-100 data-[enter]:opacity-100 data-[leave]:-translate-y-1 data-[leave]:scale-95 data-[leave]:opacity-0',
							popoverClassName,
						)}
					>
						<div className="border-b border-border/60 p-1">
							<Ariakit.Combobox
								autoSelect
								placeholder={searchPlaceholder}
								aria-controls={`${baseId}-listbox`}
								onChange={(e) => setSearchValue(e.currentTarget.value)}
								onKeyDown={(e) => {
									if (e.key === 'Enter') {
										const inputValue = (e.currentTarget as HTMLInputElement)
											.value;
										const exact = options.find((o) => o.label === inputValue);
										const pick = exact ?? matches[0];
										if (pick && !pick.disabled) {
											e.preventDefault();
											handleSelect(pick.value);
										}
									}
								}}
								className="w-full border-0 bg-transparent px-3 py-2 text-sm placeholder:text-foreground/45 focus-visible:outline-none"
							/>
						</div>

						<Ariakit.ComboboxList
							id={`${baseId}-listbox`}
							className="z-50 flex max-h-42 flex-col gap-1 overflow-auto py-1"
						>
							<div aria-live="polite" className="sr-only">
								{matches.length} result{matches.length === 1 ? '' : 's'}
							</div>
							{matches.length === 0 ? (
								<output
									aria-live="polite"
									className="mx-1 px-3 py-2 text-center text-sm text-foreground/70"
								>
									{emptyMessage}
								</output>
							) : (
								matches.map((option, i) => {
									const isSelected = option.value === selectedValue;
									return (
										<Ariakit.ComboboxItem
											key={option.value}
											id={`${baseId}-option-${i}`}
											value={option.label}
											focusOnHover
											setValueOnClick={false}
											disabled={option.disabled}
											aria-disabled={option.disabled || undefined}
											className={cn(
												'relative mx-1 flex cursor-pointer items-center justify-between rounded-sm px-3 py-2 text-sm text-foreground/70 transition-colors duration-150 outline-none select-none hover:bg-card-muted hover:text-foreground focus-visible:bg-card-muted',
												isSelected &&
													'bg-card-muted font-medium text-foreground',
												option.disabled &&
													'pointer-events-none cursor-not-allowed opacity-50',
											)}
											onClick={(e) => {
												e.preventDefault();
												if (!option.disabled) handleSelect(option.value);
											}}
										>
											<span className="flex-1">{option.label}</span>
											{isSelected && (
												<Icons.Check
													aria-hidden="true"
													className="h-4 w-4 text-foreground/70"
												/>
											)}
										</Ariakit.ComboboxItem>
									);
								})
							)}
						</Ariakit.ComboboxList>
					</Ariakit.Menu>
				</div>
			</Ariakit.MenuProvider>
		</Ariakit.ComboboxProvider>
	);
};
