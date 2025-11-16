'use client';

import { DesktopIcon, MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { cva } from 'class-variance-authority';
import { useTheme } from 'next-themes';
import { type HTMLAttributes, useLayoutEffect, useState } from 'react';

import { cn } from '@/lib/utils';

const themes = [
	{
		key: 'light',
		icon: SunIcon,
		label: 'Light theme',
	},
	{
		key: 'dark',
		icon: MoonIcon,
		label: 'Dark theme',
	},
	{
		key: 'system',
		icon: DesktopIcon,
		label: 'System theme',
	},
];

const itemVariants = cva(
	'relative cursor-pointer size-7 rounded-full p-1.5 hover:text-foreground transition-[color,box-shadow] ease-out-quad duration-100 focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:outline-none focus-visible:ring-offset-ring-offset/50 focus-visible:ring-ring/50',
	{
		variants: {
			active: {
				true: 'text-foreground',
				false: 'text-foreground/45',
			},
		},
	},
);

type Theme = 'light' | 'dark' | 'system';

export function ThemeToggle({
	className,
	mode = 'light-dark',
	...props
}: HTMLAttributes<HTMLDivElement> & {
	mode?: 'light-dark' | 'light-dark-system';
}) {
	const { setTheme, theme: currentTheme, resolvedTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	const container = cn(
		'relative flex items-center rounded-full p-0 ring-1 ring-border shadow-card bg-transparent',
		className,
	);

	useLayoutEffect(() => {
		setMounted(true);
	}, []);

	const handleChangeTheme = async (theme: Theme) => {
		function update() {
			setTheme(theme);
		}

		if (document.startViewTransition && theme !== resolvedTheme) {
			document.documentElement.style.viewTransitionName = 'theme-transition';
			await document.startViewTransition(update).finished;
			document.documentElement.style.viewTransitionName = '';
		} else {
			update();
		}
	};

	const value = mounted
		? mode === 'light-dark'
			? resolvedTheme
			: currentTheme
		: null;

	return (
		<div
			className={container}
			onClick={() => {
				if (mode !== 'light-dark') return;
				handleChangeTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
			}}
			data-theme-toggle=""
			aria-label={mode === 'light-dark' ? 'Toggle Theme' : undefined}
			{...props}
		>
			{themes.map(({ key, icon: Icon, label }) => {
				const isActive = value === key;
				if (mode === 'light-dark' && key === 'system') return;

				return (
					<button
						type="button"
						key={key}
						className={itemVariants({ active: isActive })}
						onClick={() => {
							if (mode === 'light-dark') return;
							handleChangeTheme(key as Theme);
						}}
						aria-label={label}
					>
						{isActive && (
							<div className="bg-card-muted absolute inset-0.5 rounded-full" />
						)}
						<Icon
							className={'relative m-auto size-full'}
							fill={'currentColor'}
						/>
					</button>
				);
			})}
		</div>
	);
}
