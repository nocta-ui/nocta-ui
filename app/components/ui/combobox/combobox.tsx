"use client";

import * as Ariakit from "@ariakit/react";
import { cva, type VariantProps } from "class-variance-authority";
import type React from "react";
import { useId, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

const comboboxVariants = cva(
	`relative w-fit inline-flex items-center justify-between
	hover:bg-background-muted/60
   rounded-lg border transition-all duration-200 ease-in-out
   focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-1 
   focus-visible:ring-offset-ring-offset/50
   disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer
   shadow-xs not-prose`,
	{
		variants: {
			variant: {
				default: `
          border-border-muted
          bg-background
          text-foreground
			    focus-visible:border-border/10
			    focus-visible:ring-ring/50
        `,
				error: `
          border-red-300 dark:border-red-700/50
          bg-background
          text-foreground
          focus-visible:border-red-500/50 dark:focus-visible:border-red-500/50
          focus-visible:ring-red-500/50 dark:focus-visible:ring-red-500/50
        `,
				success: `
          border-green-300 dark:border-green-700/50
          bg-background
          text-foreground
          focus-visible:border-green-500/50 dark:focus-visible:border-green-500/50
          focus-visible:ring-green-500/50 dark:focus-visible:ring-green-500/50
        `,
			},
			size: {
				sm: "h-8 px-3 text-xs",
				md: "h-10 px-3 text-sm",
				lg: "h-12 px-4 text-base",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "md",
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
	placeholder = "Select option...",
	searchPlaceholder = "Search...",
	emptyMessage = "No options found",
	disabled = false,
	size = "md",
	variant = "default",
	className = "",
	popoverClassName = "",
	clearable = true,
}) => {
	const baseId = useId();
	const [uncontrolledValue, setUncontrolledValue] = useState(
		defaultValue || "",
	);
	const selectedValue =
		controlledValue !== undefined ? controlledValue : uncontrolledValue;
	const selectedOption = useMemo(
		() => options.find((o) => o.value === selectedValue),
		[options, selectedValue],
	);

	const [searchValue, setSearchValue] = useState("");
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
		setSearchValue("");
	};

	const handleClear = (e: React.SyntheticEvent) => {
		e.stopPropagation();
		e.preventDefault();
		handleSelect("");
	};

	return (
		<Ariakit.ComboboxProvider resetValueOnHide>
			<Ariakit.MenuProvider store={menu}>
				<div className="relative not-prose">
					<Ariakit.MenuButton
						disabled={disabled}
						className={cn(
							comboboxVariants({ variant, size }),
							disabled && "opacity-50 cursor-not-allowed",
							className,
						)}
					>
						<span
							className={cn(
								"flex-1 text-left truncate",
								selectedOption ? "" : "text-foreground-subtle",
							)}
						>
							{selectedOption ? selectedOption.label : placeholder}
						</span>
						<div className="flex items-center gap-1 ml-2">
							{clearable && selectedOption && !disabled && (
								<span
									onMouseDown={handleClear}
									onClick={handleClear}
									onKeyDown={(e) => {
										if (e.key === "Enter" || e.key === " ") {
											e.preventDefault();
											handleClear(e);
										}
									}}
									role="button"
									tabIndex={0}
									className="p-0.5 hover:bg-background rounded text-foreground-subtle hover:text-primary-muted cursor-pointer duration-200 ease-in-out"
									title="Clear selection"
									aria-label="Clear selection"
								>
									<svg
										aria-hidden="true"
										focusable="false"
										className="w-3 h-3"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								</span>
							)}
							<svg
								aria-hidden="true"
								focusable="false"
								className="w-4 h-4 text-foreground-subtle"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="m7 15 5 5 5-5"
								/>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="m7 9 5-5 5 5"
								/>
							</svg>
						</div>
					</Ariakit.MenuButton>

					<Ariakit.Menu
						portal={portal}
						sameWidth
						className={cn(
							"absolute z-[999] my-1 rounded-lg border border-border-muted bg-background shadow-lg dark:shadow-xl overflow-hidden",
							"transform transition-all duration-200 ease-in-out origin-top -translate-y-1 opacity-0 scale-95 data-[enter]:translate-y-0 data-[enter]:opacity-100 data-[enter]:scale-100 data-[leave]:-translate-y-1 data-[leave]:opacity-0 data-[leave]:scale-95",
							popoverClassName,
						)}
					>

						<div className="p-1 border-b border-border-muted">
							<Ariakit.Combobox
								autoSelect
								placeholder={searchPlaceholder}
								aria-controls={`${baseId}-listbox`}
								onChange={(e) => setSearchValue(e.currentTarget.value)}
								onKeyDown={(e) => {
									if (e.key === "Enter") {
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
								className="w-full px-3 py-2 text-sm bg-transparent border-0 focus-visible:outline-none placeholder:text-foreground-subtle"
							/>
						</div>

						<Ariakit.ComboboxList
							id={`${baseId}-listbox`}
							className="max-h-42 overflow-auto py-1 flex flex-col gap-1 z-50"
						>
							<div aria-live="polite" className="sr-only">
								{matches.length} result{matches.length === 1 ? "" : "s"}
							</div>
							{matches.length === 0 ? (
								<output
									aria-live="polite"
									className="px-3 py-2 text-sm text-primary-muted text-center mx-1"
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
												"relative flex cursor-pointer select-none items-center justify-between px-3 py-2 text-sm outline-none mx-1 rounded-md hover:bg-background-muted focus-visible:bg-background-muted transition-colors duration-150",
												isSelected && "bg-background-muted font-medium",
												option.disabled &&
													"opacity-50 cursor-not-allowed pointer-events-none",
											)}
											onClick={(e) => {
												e.preventDefault();
												if (!option.disabled) handleSelect(option.value);
											}}
										>
											<span className="flex-1">{option.label}</span>
											{isSelected && (
												<svg
													aria-hidden="true"
													focusable="false"
													className="w-4 h-4 text-primary-muted"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M5 13l4 4L19 7"
													/>
												</svg>
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
