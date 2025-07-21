"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type React from "react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const avatarVariants = cva(
	[
		"relative inline-flex items-center justify-center",
		"bg-nocta-200 dark:bg-nocta-800",
		"text-nocta-700 dark:text-nocta-300",
		"font-medium select-none",
		"transition-all duration-200 ease-in-out",
		"not-prose",
	],
	{
		variants: {
			variant: {
				circle: "rounded-full",
				square: "rounded-lg",
			},
			size: {
				xs: "h-6 w-6",
				sm: "h-8 w-8",
				md: "h-10 w-10",
				lg: "h-12 w-12",
				xl: "h-16 w-16",
				"2xl": "h-20 w-20",
			},
		},
		defaultVariants: {
			variant: "circle",
			size: "md",
		},
	},
);

const textVariants = cva("font-medium", {
	variants: {
		size: {
			xs: "text-xs",
			sm: "text-xs",
			md: "text-sm",
			lg: "text-base",
			xl: "text-lg",
			"2xl": "text-xl",
		},
	},
	defaultVariants: {
		size: "md",
	},
});

const iconVariants = cva("text-nocta-400 dark:text-nocta-500", {
	variants: {
		size: {
			xs: "h-3 w-3",
			sm: "h-4 w-4",
			md: "h-5 w-5",
			lg: "h-6 w-6",
			xl: "h-8 w-8",
			"2xl": "h-10 w-10",
		},
	},
	defaultVariants: {
		size: "md",
	},
});

const statusVariants = cva(
	"absolute rounded-full ring-nocta-50 dark:ring-nocta-900",
	{
		variants: {
			status: {
				online: "bg-green-500 dark:bg-green-600",
				offline: "bg-nocta-400 dark:bg-nocta-600",
				away: "bg-yellow-500 dark:bg-yellow-600",
				busy: "bg-red-500 dark:bg-red-600",
			},
			size: {
				xs: "h-1.5 w-1.5 ring-1 bottom-0 right-0",
				sm: "h-2 w-2 ring-1 bottom-0 right-0",
				md: "h-2.5 w-2.5 ring-1 bottom-0.5 right-0.5",
				lg: "h-3 w-3 ring-1 bottom-0.5 right-0.5",
				xl: "h-3.5 w-3.5 ring-1 bottom-1 right-1",
				"2xl": "h-4 w-4 ring-1 bottom-1 right-1",
			},
		},
		defaultVariants: {
			size: "md",
		},
	},
);

export interface AvatarProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof avatarVariants> {
	src?: string;
	alt?: string;
	fallback?: string;
	status?: "online" | "offline" | "away" | "busy" | null;
	className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
	src,
	alt = "",
	fallback,
	size = "md",
	variant = "circle",
	status = null,
	className = "",
	...props
}) => {
	const [imageError, setImageError] = useState(false);

	useEffect(() => {
		if (src) {
			setImageError(false);
		}
	}, [src]);

	const handleImageError = () => {
		setImageError(true);
	};

	const getInitials = () => {
		const text = fallback || alt || "";
		if (!text) return "";

		if (text.length <= 2 && !text.includes(" ")) {
			return text.toUpperCase();
		}

		return text
			.split(" ")
			.map((word) => word.charAt(0))
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	const showImage = src && !imageError;
	const showInitials = !showImage && getInitials();

	return (
		<div
			className={cn(avatarVariants({ variant, size }), className)}
			{...props}
		>
			{showImage && (
				<img
					src={src}
					alt=""
					className={cn(
						"h-full w-full object-cover",
						variant === "circle" ? "rounded-full" : "rounded-lg",
					)}
					onError={handleImageError}
					loading="eager"
					style={{
						textIndent: "-9999px",
						overflow: "hidden",
					}}
				/>
			)}

			{showInitials && (
				<span className={textVariants({ size })}>{getInitials()}</span>
			)}

			{!showImage && !showInitials && (
				<svg
					className={iconVariants({ size })}
					fill="currentColor"
					viewBox="0 0 256 256"
				>
					<path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z" />
				</svg>
			)}

			{status && (
				<span
					className={statusVariants({ status, size })}
					aria-label={`Status: ${status}`}
				/>
			)}
		</div>
	);
};
