import { cva, type VariantProps } from 'class-variance-authority';

const variants = {
	primary: 'bg-foreground text-card hover:bg-foreground/80',
	outline: 'border hover:bg-card-muted hover:text-foreground/45',
	ghost: 'hover:bg-card-muted text-foreground/70 hover:text-foreground',
	secondary:
		'border bg-foreground text-foreground/45 hover:bg-card-muted hover:text-foreground/45',
} as const;

export const buttonVariants = cva(
	'inline-flex items-center justify-center rounded-md p-2 text-sm font-medium transition-colors duration-150 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
	{
		variants: {
			variant: variants,
			// fumadocs use `color` instead of `variant`
			color: variants,
			size: {
				sm: 'gap-1 px-2 py-1.5 text-xs',
				icon: 'p-1.5 [&_svg]:size-5',
				'icon-sm': 'p-1.5 [&_svg]:size-5',
				'icon-xs': 'p-1 [&_svg]:size-4',
			},
		},
	},
);

export type ButtonProps = VariantProps<typeof buttonVariants>;
