import { cva, type VariantProps } from 'class-variance-authority';
import type React from 'react';
import { cn } from '../lib/utils';

const spinnerVariants = cva(['inline-block animate-spin text-current'], {
	variants: {
		variant: {
			default: 'text-foreground/70',
		},
		size: {
			sm: 'size-4',
			md: 'size-6',
			lg: 'size-8',
		},
	},
	defaultVariants: {
		variant: 'default',
		size: 'md',
	},
});

export interface SpinnerProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof spinnerVariants> {
	className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
	size = 'md',
	variant = 'default',
	className = '',
	...props
}) => {
	return (
		/* biome-ignore lint/a11y/useSemanticElements: spinner intentionally uses a div with role="status" for accessibility */
		<div
			role="status"
			aria-live="polite"
			aria-busy="true"
			className={cn(spinnerVariants({ variant, size }), className)}
			{...props}
		>
			<svg
				aria-hidden="true"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				className="w-full h-full"
			>
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M12 0C13.0265 0 14.0227 0.129607 14.9736 0.37207L19 9V2.25586C22.0271 4.43433 24 7.98574 24 12C24 18.6274 18.6274 24 12 24C10.9731 24 9.97671 23.8696 9.02539 23.627L5 15V21.7432C1.97313 19.5647 0 16.0141 0 12C0 5.37258 5.37258 0 12 0ZM12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5Z"
					fill="currentColor"
				/>
			</svg>
			<span className="sr-only">Loading...</span>
		</div>
	);
};
