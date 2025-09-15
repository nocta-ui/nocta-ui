import { cva, type VariantProps } from "class-variance-authority";
import type React from "react";
import { cn } from "@/lib/utils";

const progressVariants = cva(
	[
		"relative w-full overflow-hidden rounded-full",
		"bg-background-muted border border-border-muted shadow-inner",
		"transition-all duration-200 ease-in-out",
		"not-prose",
	],
	{
		variants: {
			variant: {
				default: "[&>div]:bg-foreground dark:[&>div]:bg-foreground/50",
				success: "[&>div]:bg-green-500 dark:[&>div]:bg-green-600/50",
				warning: "[&>div]:bg-yellow-500 dark:[&>div]:bg-yellow-600/50",
				destructive: "[&>div]:bg-red-500 dark:[&>div]:bg-red-600/50",
			},
			size: {
				sm: "h-2",
				md: "h-3",
				lg: "h-4",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "md",
		},
	},
);

export interface ProgressProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof progressVariants> {
	value?: number;
	max?: number;
	showLabel?: boolean;
	className?: string;
	"aria-label"?: string;
}

export const Progress: React.FC<ProgressProps> = ({
	value = 0,
	max = 100,
	variant = "default",
	size = "md",
	showLabel = false,
	className = "",
	"aria-label": ariaLabel,
	...props
}) => {
	const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

	return (
		<div className="w-full">
			{showLabel && (
				<div className="flex justify-between items-center mb-2">
					<span className="text-sm font-medium text-primary-muted">
						{ariaLabel || "Progress"}
					</span>
					<span className="text-sm text-foreground-subtle ml-2">
						{Math.round(percentage)}%
					</span>
				</div>
			)}

			<div
				className={cn(progressVariants({ variant, size }), className)}
				role="progressbar"
				aria-valuemin={0}
				aria-valuemax={max}
				aria-valuenow={value}
				aria-label={ariaLabel || "Progress"}
				{...props}
			>

				<div
					className={cn(
						"progress-fill h-full rounded-full transition-all duration-500 ease-out",
					)}
					style={{ width: `${percentage}%` }}
				/>
			</div>
		</div>
	);
};
