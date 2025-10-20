'use client';
import React, { useEffect, useState } from 'react';
import {
	Tooltip,
	TooltipTrigger,
	TooltipContent,
} from '@/app/components/ui/tooltip';

interface ColorToken {
	token: string;
	description: string;
}

const TOKENS: ColorToken[] = [
	{ token: '--color-background', description: 'Base background' },
	{ token: '--color-card', description: 'Surface for cards' },
	{ token: '--color-card-muted', description: 'Muted surface' },
	{ token: '--color-foreground', description: 'Primary text' },
	{ token: '--color-border', description: 'Neutral border' },
	{ token: '--color-ring', description: 'Focus ring' },
	{ token: '--color-ring-offset', description: 'Offset ring' },
	{ token: '--color-overlay', description: 'Modal overlay' },
	{ token: '--color-gradient-from', description: 'Gradient start' },
	{ token: '--color-gradient-to', description: 'Gradient end' },
	{ token: '--color-error', description: 'Error state' },
	{ token: '--color-warning', description: 'Warning state' },
	{ token: '--color-success', description: 'Success state' },
];

export const ColorGrid: React.FC = () => {
	const [colors, setColors] = useState<Record<string, string>>({});

	const updateColors = () => {
		const style = getComputedStyle(document.documentElement);
		const newColors: Record<string, string> = {};
		for (const { token } of TOKENS) {
			newColors[token] = style.getPropertyValue(token).trim();
		}
		setColors(newColors);
	};

	useEffect(() => {
		updateColors();

		const observer = new MutationObserver(updateColors);
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['class', 'data-theme'],
		});
		return () => observer.disconnect();
	}, []);

	return (
		<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-1">
			{TOKENS.map(({ token }) => (
				<Tooltip key={token}>
					<TooltipTrigger>
						<div
							className="aspect-square rounded-md border border-fd-border cursor-pointer"
							style={{
								backgroundColor: colors[token] || 'transparent',
							}}
						/>
					</TooltipTrigger>
					<TooltipContent className="text-xs">
						<div className="font-mono text-foreground">{token}</div>
					</TooltipContent>
				</Tooltip>
			))}
		</div>
	);
};
