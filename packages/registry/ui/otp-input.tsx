import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';
import { cn } from '../lib/utils';

const otpGroupVariants = cva('flex w-fit', {
	variants: {
		size: {
			sm: 'gap-1.5',
			md: 'gap-2',
			lg: 'gap-2.5',
		},
	},
	defaultVariants: {
		size: 'md',
	},
});

const otpCellWrapperVariants = cva(
	[
		'relative rounded-md border bg-card shadow-sm card-highlight',
		'transition-shadow duration-100 ease-out-quad',
		'focus-within:ring-1 focus-within:ring-offset-1 focus-within:ring-offset-ring-offset/50',
	],
	{
		variants: {
			size: {
				sm: 'size-8',
				md: 'size-9',
				lg: 'size-10',
			},
			variant: {
				default: ['border-border', 'focus-within:ring-ring/50'],
				error: ['border-destructive/40', 'focus-within:ring-destructive/50'],
				success: ['border-success/40', 'focus-within:ring-success/50'],
			},
		},
		defaultVariants: {
			size: 'md',
			variant: 'default',
		},
	},
);

const otpCellVariants = cva(
	[
		'flex h-full w-full items-center justify-center rounded-md border-0',
		'bg-transparent text-center font-medium tabular-nums text-foreground',
		'select-none',
		'placeholder:text-foreground/45',
		'focus-visible:outline-none',
		'disabled:cursor-not-allowed disabled:opacity-50',
		'read-only:cursor-default',
	],
	{
		variants: {
			size: {
				sm: 'text-sm',
				md: 'text-sm',
				lg: 'text-base',
			},
			isFilled: {
				true: 'text-foreground',
				false: 'text-foreground/45',
			},
		},
		defaultVariants: {
			size: 'md',
			isFilled: false,
		},
	},
);

const labelClasses = 'mb-1.5 block text-sm font-medium text-foreground';

const messageVariants = cva('mt-1.5 text-sm', {
	variants: {
		type: {
			error: 'text-destructive/90',
			success: 'text-success/90',
			helper: 'text-foreground/70',
		},
	},
});

function sanitizeOtpValue(value: string | undefined, length: number) {
	if (!value) {
		return '';
	}

	return value.replace(/\D/g, '').slice(0, length);
}

function createValueArray(value: string, length: number) {
	const chars = value.split('').slice(0, length);

	while (chars.length < length) {
		chars.push('');
	}

	return chars;
}

export interface OTPInputProps
	extends Omit<
			React.InputHTMLAttributes<HTMLInputElement>,
			'size' | 'value' | 'defaultValue' | 'onChange' | 'type'
		>,
		VariantProps<typeof otpCellWrapperVariants> {
	length?: number;
	value?: string;
	defaultValue?: string;
	onChange?: (value: string) => void;
	onComplete?: (value: string) => void;
	label?: string;
	helperText?: string;
	errorMessage?: string;
	successMessage?: string;
	containerClassName?: string;
	cellClassName?: string;
	cellWrapperClassName?: string;
}

export const OTPInput: React.FC<OTPInputProps> = ({
	length = 6,
	variant = 'default',
	size = 'md',
	value,
	defaultValue = '',
	onChange,
	onComplete,
	label,
	helperText,
	errorMessage,
	successMessage,
	containerClassName = '',
	className = '',
	cellClassName = '',
	cellWrapperClassName = '',
	name,
	id,
	disabled = false,
	autoFocus = false,
	readOnly = false,
	...restInputProps
}) => {
	const inputLength = Math.max(1, length);
	const {
		inputMode: inputModeProp,
		pattern: patternProp,
		autoComplete: autoCompleteProp,
		...remainingInputProps
	} = restInputProps;

	const isControlled = value !== undefined;
	const [internalValue, setInternalValue] = React.useState(() =>
		sanitizeOtpValue(defaultValue, inputLength),
	);
	const currentValue = React.useMemo(
		() =>
			sanitizeOtpValue(
				isControlled ? (value as string | undefined) : internalValue,
				inputLength,
			),
		[isControlled, value, internalValue, inputLength],
	);

	const valueRef = React.useRef(currentValue);
	React.useEffect(() => {
		valueRef.current = currentValue;
	}, [currentValue]);

	const setValue = React.useCallback(
		(nextValue: string) => {
			const sanitized = sanitizeOtpValue(nextValue, inputLength);
			valueRef.current = sanitized;
			if (!isControlled) {
				setInternalValue(sanitized);
			}
			onChange?.(sanitized);
			if (sanitized.length === inputLength) {
				onComplete?.(sanitized);
			}
		},
		[inputLength, isControlled, onChange, onComplete],
	);

	const getCurrentChars = React.useCallback(() => {
		return createValueArray(valueRef.current, inputLength);
	}, [inputLength]);

	const getFirstIncompleteIndex = React.useCallback(() => {
		const chars = getCurrentChars();
		return chars.indexOf('');
	}, [getCurrentChars]);

	const inputsRef = React.useRef<Array<HTMLInputElement | null>>([]);
	const placeCaretAtEnd = React.useCallback(
		(input: HTMLInputElement | null) => {
			if (!input || typeof input.setSelectionRange !== 'function') {
				return;
			}
			const valueLength = input.value.length;
			try {
				input.setSelectionRange(valueLength, valueLength);
			} catch {
				// Ignore browsers that don't support setSelectionRange on the current input.
			}
		},
		[],
	);
	const skipAutoRedirectRef = React.useRef(false);
	const focusInput = React.useCallback(
		(index: number, options?: { allowAutoRedirect?: boolean }) => {
			skipAutoRedirectRef.current = !(options?.allowAutoRedirect ?? false);
			const clamped = Math.max(0, Math.min(index, inputLength - 1));
			const target = inputsRef.current[clamped];
			if (target) {
				target.focus();
				placeCaretAtEnd(target);
			}
		},
		[inputLength, placeCaretAtEnd],
	);

	const handleInputFocus = React.useCallback(
		(index: number, event: React.FocusEvent<HTMLInputElement>) => {
			if (skipAutoRedirectRef.current) {
				skipAutoRedirectRef.current = false;
				placeCaretAtEnd(event.currentTarget);
				return;
			}

			const firstIncompleteIndex = getFirstIncompleteIndex();
			if (firstIncompleteIndex === -1) {
				if (index === inputLength - 1) {
					placeCaretAtEnd(event.currentTarget);
					return;
				}

				event.preventDefault();
				focusInput(inputLength - 1, { allowAutoRedirect: true });
				return;
			}

			if (firstIncompleteIndex === index) {
				placeCaretAtEnd(event.currentTarget);
				return;
			}

			event.preventDefault();
			focusInput(firstIncompleteIndex);
		},
		[getFirstIncompleteIndex, focusInput, inputLength, placeCaretAtEnd],
	);

	const handleInputChange = React.useCallback(
		(index: number, event: React.ChangeEvent<HTMLInputElement>) => {
			if (disabled || readOnly) {
				return;
			}

			const nextChars = getCurrentChars();
			const previousValue = nextChars[index] ?? '';
			const nativeEvent = event.nativeEvent as InputEvent | undefined;
			const inputType = nativeEvent?.inputType ?? '';
			const isDeletion = inputType.startsWith('delete');
			let digitsSource = '';

			if (!isDeletion && typeof nativeEvent?.data === 'string') {
				digitsSource = nativeEvent.data;
			} else if (!isDeletion) {
				const fallbackValue = event.target.value.replace(/\D/g, '');
				if (previousValue && fallbackValue.startsWith(previousValue)) {
					digitsSource = fallbackValue.slice(previousValue.length);
				} else {
					digitsSource = fallbackValue;
				}
			}

			const digits = digitsSource.replace(/\D/g, '');

			if (!digits) {
				nextChars[index] = '';
				setValue(nextChars.join(''));
				return;
			}

			let nextIndex = index;
			for (const digit of digits) {
				if (nextIndex >= inputLength) {
					break;
				}
				nextChars[nextIndex] = digit;
				nextIndex += 1;
			}

			setValue(nextChars.join(''));
			if (nextIndex < inputLength) {
				focusInput(nextIndex);
			} else {
				focusInput(inputLength - 1, { allowAutoRedirect: true });
			}
		},
		[disabled, readOnly, getCurrentChars, setValue, inputLength, focusInput],
	);

	const handlePointerDown = React.useCallback(
		(event: React.PointerEvent<HTMLInputElement>) => {
			if (disabled || readOnly) {
				return;
			}
			event.preventDefault();
			const target = event.currentTarget;
			target.focus();
			placeCaretAtEnd(target);
		},
		[disabled, readOnly, placeCaretAtEnd],
	);

	const handleKeyDown = React.useCallback(
		(index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
			if (event.key === 'Backspace') {
				const nextChars = getCurrentChars();
				if (nextChars[index]) {
					event.preventDefault();
					nextChars[index] = '';
					setValue(nextChars.join(''));
				} else if (index > 0) {
					event.preventDefault();
					focusInput(index - 1);
					const charsAfterFocus = getCurrentChars();
					if (charsAfterFocus[index - 1]) {
						charsAfterFocus[index - 1] = '';
						setValue(charsAfterFocus.join(''));
					}
				}
			}

			if (event.key === 'ArrowLeft') {
				event.preventDefault();
				focusInput(Math.max(0, index - 1));
			}

			if (event.key === 'ArrowRight') {
				event.preventDefault();
				focusInput(Math.min(inputLength - 1, index + 1));
			}
		},
		[getCurrentChars, setValue, focusInput, inputLength],
	);

	const handlePaste = React.useCallback(
		(index: number, event: React.ClipboardEvent<HTMLInputElement>) => {
			if (disabled || readOnly) {
				return;
			}

			event.preventDefault();
			const clipboardValue = event.clipboardData.getData('text');
			if (!clipboardValue) {
				return;
			}

			const digits = clipboardValue.replace(/\D/g, '');
			if (!digits) {
				return;
			}

			const nextChars = getCurrentChars();
			let nextIndex = index;
			for (const digit of digits) {
				if (nextIndex >= inputLength) {
					break;
				}
				nextChars[nextIndex] = digit;
				nextIndex += 1;
			}

			setValue(nextChars.join(''));
			if (nextIndex < inputLength) {
				focusInput(nextIndex);
			} else {
				setTimeout(() => {
					focusInput(inputLength - 1, { allowAutoRedirect: true });
				}, 0);
			}
		},
		[disabled, readOnly, getCurrentChars, setValue, inputLength, focusInput],
	);

	React.useEffect(() => {
		if (autoFocus && !disabled && !readOnly) {
			focusInput(0);
		}
	}, [autoFocus, disabled, readOnly, focusInput]);

	const autoId = React.useId();
	const baseId = id ?? autoId;
	const labelId = label ? `${baseId}-label` : undefined;
	const helperId =
		helperText && !errorMessage && !successMessage
			? `${baseId}-helper`
			: undefined;
	const errorVisible = variant === 'error' && !!errorMessage;
	const successVisible = variant === 'success' && !!successMessage;
	const errorId = errorVisible ? `${baseId}-error` : undefined;
	const successId = successVisible ? `${baseId}-success` : undefined;
	const describedBy =
		[errorId, successId, helperId].filter(Boolean).join(' ') || undefined;
	const inputMode = inputModeProp ?? 'numeric';
	const pattern = patternProp ?? '[0-9]*';
	const autoComplete = autoCompleteProp ?? 'one-time-code';

	const valueArray = React.useMemo(
		() => createValueArray(currentValue, inputLength),
		[currentValue, inputLength],
	);

	return (
		<div className={containerClassName}>
			<fieldset aria-describedby={describedBy}>
				{label && (
					<legend id={labelId} className={labelClasses}>
						{label}
					</legend>
				)}

				<div className={cn(otpGroupVariants({ size }), className)}>
					{Array.from({ length: inputLength }).map((_, index) => {
						const inputId = `${baseId}-${index}`;
						const cellValue = valueArray[index] ?? '';
						return (
							<div
								key={inputId}
								className={cn(
									otpCellWrapperVariants({ size, variant }),
									cellWrapperClassName,
								)}
							>
								<input
									ref={(node) => {
										inputsRef.current[index] = node;
									}}
									id={inputId}
									type="text"
									inputMode={inputMode}
									pattern={pattern}
									autoComplete={autoComplete}
									maxLength={1}
									value={cellValue}
									onChange={(event) => handleInputChange(index, event)}
									onKeyDown={(event) => handleKeyDown(index, event)}
									onPaste={(event) => handlePaste(index, event)}
									onFocus={(event) => handleInputFocus(index, event)}
									onPointerDown={handlePointerDown}
									aria-invalid={errorVisible ? true : undefined}
									aria-describedby={describedBy}
									disabled={disabled}
									readOnly={readOnly}
									className={cn(
										otpCellVariants({
											size,
											isFilled: cellValue.length > 0,
										}),
										cellClassName,
									)}
									{...remainingInputProps}
								/>
							</div>
						);
					})}
				</div>
			</fieldset>

			{name && (
				<input
					type="hidden"
					name={name}
					value={currentValue}
					disabled={disabled}
					readOnly={readOnly}
				/>
			)}

			{errorVisible && (
				<p id={errorId} className={messageVariants({ type: 'error' })}>
					{errorMessage}
				</p>
			)}

			{!errorVisible && successVisible && (
				<p id={successId} className={messageVariants({ type: 'success' })}>
					{successMessage}
				</p>
			)}

			{helperId && helperText && (
				<p id={helperId} className={messageVariants({ type: 'helper' })}>
					{helperText}
				</p>
			)}
		</div>
	);
};
