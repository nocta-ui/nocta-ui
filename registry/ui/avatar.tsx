'use client';

import * as Ariakit from '@ariakit/react';
import { cva, type VariantProps } from 'class-variance-authority';
import type React from 'react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Icons } from '@/registry/ui/nocta-icons';

const avatarVariants = cva(
	[
		'relative inline-flex items-center justify-center',
		'bg-card-muted',
		'text-foreground/70',
		'font-medium select-none',
		'not-prose',
	],
	{
		variants: {
			variant: {
				circle: 'rounded-full',
				square: 'rounded-lg',
			},
			size: {
				xs: 'h-6 w-6',
				sm: 'h-8 w-8',
				md: 'h-10 w-10',
				lg: 'h-12 w-12',
				xl: 'h-16 w-16',
				'2xl': 'h-20 w-20',
			},
		},
		defaultVariants: {
			variant: 'circle',
			size: 'md',
		},
	},
);

const textVariants = cva('font-medium text-foreground/70', {
	variants: {
		size: {
			xs: 'text-xs',
			sm: 'text-xs',
			md: 'text-sm',
			lg: 'text-base',
			xl: 'text-lg',
			'2xl': 'text-xl',
		},
	},
	defaultVariants: {
		size: 'md',
	},
});

const iconVariants = cva('text-foreground/45', {
	variants: {
		size: {
			xs: 'h-3 w-3',
			sm: 'h-4 w-4',
			md: 'h-5 w-5',
			lg: 'h-6 w-6',
			xl: 'h-8 w-8',
			'2xl': 'h-10 w-10',
		},
	},
	defaultVariants: {
		size: 'md',
	},
});

const statusVariants = cva('absolute rounded-full ring-ring-offset', {
	variants: {
		status: {
			online: 'bg-success',
			offline: 'bg-foreground-subtle',
			away: 'bg-warning',
			busy: 'bg-destructive',
		},
		size: {
			xs: 'right-0 bottom-0 h-1.5 w-1.5 ring-1',
			sm: 'right-0 bottom-0 h-2 w-2 ring-1',
			md: 'right-0.5 bottom-0.5 h-2.5 w-2.5 ring-1',
			lg: 'right-0.5 bottom-0.5 h-3 w-3 ring-1',
			xl: 'right-1 bottom-1 h-3.5 w-3.5 ring-1',
			'2xl': 'right-1 bottom-1 h-4 w-4 ring-1',
		},
	},
	defaultVariants: {
		size: 'md',
	},
});

export interface AvatarProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof avatarVariants> {
	src?: string;
	alt?: string;
	fallback?: string;
	status?: 'online' | 'offline' | 'away' | 'busy' | null;
	className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
	src,
	alt = '',
	fallback,
	size = 'md',
	variant = 'circle',
	status = null,
	className = '',
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
		const text = fallback || alt || '';
		if (!text) return '';

		if (text.length <= 2 && !text.includes(' ')) {
			return text.toUpperCase();
		}

		return text
			.split(' ')
			.map((word) => word.charAt(0))
			.join('')
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
				/* biome-ignore lint/performance/noImgElement: native img is intentional here */
				<img
					src={src}
					alt={alt}
					className={cn(
						'h-full w-full object-cover',
						variant === 'circle' ? 'rounded-full' : 'rounded-lg',
					)}
					onError={handleImageError}
					loading="eager"
					style={{
						textIndent: '-9999px',
						overflow: 'hidden',
					}}
				/>
			)}

			<Ariakit.VisuallyHidden>{`${getInitials()} Avatar`}</Ariakit.VisuallyHidden>

			{showInitials && (
				<span className={textVariants({ size })}>{getInitials()}</span>
			)}

			{!showImage && !showInitials && (
				<Icons.User aria-hidden="true" className={iconVariants({ size })} />
			)}

			{status && (
				<span className={statusVariants({ status, size })} aria-hidden="true" />
			)}
		</div>
	);
};
