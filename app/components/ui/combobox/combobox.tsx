"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type React from "react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const comboboxVariants = cva(
	`relative w-fit inline-flex items-center justify-between
   rounded-lg border transition-all duration-200 ease-in-out
   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
   focus-visible:ring-offset-nocta-50/50 dark:focus-visible:ring-offset-nocta-900/50
   disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer
   not-prose`,
	{
		variants: {
			variant: {
				default: `
          border-nocta-200 dark:border-nocta-800/50
          bg-nocta-100 dark:bg-nocta-900
          text-nocta-900 dark:text-nocta-100
          hover:border-nocta-300 dark:hover:border-nocta-700
          focus-visible:border-nocta-900/50 dark:focus-visible:border-nocta-100/50
          focus-visible:ring-nocta-900/50 dark:focus-visible:ring-nocta-100/50
          shadow-sm
        `,
				error: `
          border-red-300 dark:border-red-700/50
          bg-nocta-100 dark:bg-nocta-900
          text-nocta-900 dark:text-nocta-100
          hover:border-red-400 dark:hover:border-red-600
          focus-visible:border-red-500/50 dark:focus-visible:border-red-500/50
          focus-visible:ring-red-500/50 dark:focus-visible:ring-red-500/50
          shadow-sm
        `,
				success: `
          border-green-300 dark:border-green-700/50
          bg-nocta-100 dark:bg-nocta-900
          text-nocta-900 dark:text-nocta-100
          hover:border-green-400 dark:hover:border-green-600
          focus-visible:border-green-500/50 dark:focus-visible:border-green-500/50
          focus-visible:ring-green-500/50 dark:focus-visible:ring-green-500/50
          shadow-sm
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
	placeholder?: string;
	searchPlaceholder?: string;
	emptyMessage?: string;
	disabled?: boolean;
	className?: string;
	popoverClassName?: string;
	searchable?: boolean;
	clearable?: boolean;
}

export const Combobox: React.FC<ComboboxProps> = ({
	options,
	value: controlledValue,
	defaultValue,
	onValueChange,
	placeholder = "Select option...",
	searchPlaceholder = "Search...",
	emptyMessage = "No options found",
	disabled = false,
	size = "md",
	variant = "default",
	className = "",
	popoverClassName = "",
	searchable = true,
	clearable = true,
}) => {
	const [uncontrolledValue, setUncontrolledValue] = useState(
		defaultValue || "",
	);
	const [open, setOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [highlightedIndex, setHighlightedIndex] = useState(-1);
	const [isVisible, setIsVisible] = useState(false);
	const [shouldRender, setShouldRender] = useState(false);
	const comboboxId = useId();

	const triggerRef = useRef<HTMLButtonElement>(null);
	const searchInputRef = useRef<HTMLInputElement>(null);
	const listRef = useRef<HTMLDivElement>(null);
	const optionRefs = useRef<(HTMLDivElement | null)[]>([]);

	const value =
		controlledValue !== undefined ? controlledValue : uncontrolledValue;

	const filteredOptions = options.filter((option) =>
		option.label.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	const selectedOption = options.find((option) => option.value === value);

	const handleValueChange = useCallback(
		(newValue: string) => {
			if (disabled) return;

			if (controlledValue === undefined) {
				setUncontrolledValue(newValue);
			}
			onValueChange?.(newValue);
			setOpen(false);
			setSearchTerm("");
			setHighlightedIndex(-1);
		},
		[disabled, controlledValue, onValueChange],
	);

	useEffect(() => {
		if (open) {
			setShouldRender(true);
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					setIsVisible(true);
				});
			});
		} else {
			setIsVisible(false);
			const timer = setTimeout(() => {
				setShouldRender(false);
			}, 200);
			return () => clearTimeout(timer);
		}
	}, [open]);

	const handleClear = (e: React.MouseEvent | React.KeyboardEvent) => {
		e.stopPropagation();
		handleValueChange("");
	};

	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent) => {
			if (disabled) return;

			switch (event.key) {
				case "ArrowDown":
					event.preventDefault();
					if (!open) {
						setOpen(true);
						setHighlightedIndex(0);
					} else {
						setHighlightedIndex((prev) =>
							prev < filteredOptions.length - 1 ? prev + 1 : 0,
						);
					}
					break;
				case "ArrowUp":
					event.preventDefault();
					if (!open) {
						setOpen(true);
						setHighlightedIndex(filteredOptions.length - 1);
					} else {
						setHighlightedIndex((prev) =>
							prev > 0 ? prev - 1 : filteredOptions.length - 1,
						);
					}
					break;
				case "Enter":
					event.preventDefault();
					if (
						open &&
						highlightedIndex >= 0 &&
						highlightedIndex < filteredOptions.length
					) {
						const selectedOption = filteredOptions[highlightedIndex];
						if (!selectedOption.disabled) {
							handleValueChange(selectedOption.value);
						}
					} else if (!open) {
						setOpen(true);
					}
					break;
				case "Escape":
					event.preventDefault();
					setOpen(false);
					setSearchTerm("");
					setHighlightedIndex(-1);
					triggerRef.current?.focus();
					break;
				case "Tab":
					setOpen(false);
					setSearchTerm("");
					setHighlightedIndex(-1);
					break;
			}
		},
		[open, highlightedIndex, filteredOptions, disabled, handleValueChange],
	);

	useEffect(() => {
		if (highlightedIndex >= 0 && optionRefs.current[highlightedIndex]) {
			optionRefs.current[highlightedIndex]?.scrollIntoView({
				block: "nearest",
				behavior: "smooth",
			});
		}
	}, [highlightedIndex]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as Node;
			const isClickInTrigger = triggerRef.current?.contains(target);
			const isClickInList = listRef.current?.contains(target);

			if (!isClickInTrigger && !isClickInList) {
				setOpen(false);
				setSearchTerm("");
				setHighlightedIndex(-1);
			}
		};

		if (shouldRender) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [shouldRender]);

	useEffect(() => {
		if (open && searchable && searchInputRef.current) {
			const timeoutId = setTimeout(() => {
				searchInputRef.current?.focus();
			}, 200);
			return () => clearTimeout(timeoutId);
		}
	}, [open, searchable]);

	return (
		<div className="relative not-prose">
			<button
				ref={triggerRef}
				type="button"
				role="combobox"
				aria-expanded={open}
				aria-controls={`${comboboxId}-listbox`}
				aria-haspopup="listbox"
				disabled={disabled}
				className={cn(comboboxVariants({ variant, size }), className)}
				onClick={() => !disabled && setOpen(!open)}
				onKeyDown={handleKeyDown}
			>
				<span
					className={cn(
						"flex-1 text-left truncate",
						selectedOption ? "" : "text-nocta-400 dark:text-nocta-500",
					)}
				>
					{selectedOption ? selectedOption.label : placeholder}
				</span>

				<div className="flex items-center gap-1 ml-2">
					{clearable && selectedOption && !disabled && (
						<div
							role="button"
							tabIndex={0}
							onClick={handleClear}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									e.preventDefault();
									handleClear(e);
								}
							}}
							className="p-0.5 hover:bg-nocta-100 dark:hover:bg-nocta-900 rounded text-nocta-400 dark:text-nocta-500 hover:text-nocta-600 dark:hover:text-nocta-300 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-nocta-500"
							aria-label="Clear selection"
						>
							<svg
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
						</div>
					)}

					<svg
						className="w-4 h-4 text-nocta-400 dark:text-nocta-500"
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
			</button>

			{shouldRender && (
				<div
					ref={listRef}
					className={cn(
						"absolute z-[999] mt-1 w-full rounded-lg border border-nocta-200 dark:border-nocta-50/5 bg-nocta-100 dark:bg-nocta-900 shadow-lg dark:shadow-xl overflow-hidden",
						`transform transition-all duration-200 ease-out origin-top ${
							isVisible
								? "translate-y-0 opacity-100"
								: "-translate-y-1 opacity-0"
						}`,
						popoverClassName,
					)}
				>
					<span
						aria-hidden
						className="pointer-events-none absolute -inset-px rounded-lg bg-gradient-to-b to-transparent opacity-60"
						style={{
							maskImage:
								"radial-gradient(120% 100% at 50% 0%, black 30%, transparent 70%)",
							WebkitMaskImage:
								"radial-gradient(120% 100% at 50% 0%, black 30%, transparent 70%)",
						}}
					/>

					{searchable && (
						<div className="p-1 border-b border-nocta-200/60 dark:border-nocta-800/40">
							<input
								ref={searchInputRef}
								type="text"
								placeholder={searchPlaceholder}
								value={searchTerm}
								onChange={(e) => {
									setSearchTerm(e.target.value);
									setHighlightedIndex(0);
								}}
								onKeyDown={handleKeyDown}
								className="w-full px-3 py-2 text-sm bg-transparent border-0 focus-visible:outline-none placeholder:text-nocta-400 dark:placeholder:text-nocta-500"
							/>
						</div>
					)}

					<div
						role="listbox"
						id={`${comboboxId}-listbox`}
						className="max-h-42 overflow-auto py-1 flex flex-col gap-1 z-50"
					>
						{filteredOptions.length === 0 ? (
							<div className="px-3 py-2 text-sm text-nocta-600 dark:text-nocta-400 text-center mx-1">
								{emptyMessage}
							</div>
						) : (
							filteredOptions.map((option, index) => (
								<div
									key={option.value}
									ref={(el) => {
										optionRefs.current[index] = el;
									}}
									role="option"
									aria-selected={option.value === value}
									className={cn(
										"relative flex cursor-pointer select-none items-center justify-between px-3 py-2 text-sm outline-none mx-1 rounded-md hover:bg-nocta-200 dark:hover:bg-nocta-800 focus-visible:bg-nocta-100 dark:focus-visible:bg-nocta-800",
										highlightedIndex === index
											? "bg-nocta-200 dark:bg-nocta-800"
											: "",
										option.value === value
											? "bg-nocta-200 dark:bg-nocta-800 font-medium"
											: "",
										option.disabled
											? "opacity-50 cursor-not-allowed pointer-events-none"
											: "",
										"transition-colors duration-150",
									)}
									onClick={() =>
										!option.disabled && handleValueChange(option.value)
									}
								>
									<span className="flex-1">{option.label}</span>
									{option.value === value && (
										<svg
											className="w-4 h-4 text-nocta-600 dark:text-nocta-400"
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
								</div>
							))
						)}
					</div>
				</div>
			)}
		</div>
	);
};
