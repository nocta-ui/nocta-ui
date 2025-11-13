'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTheme } from 'next-themes';
import { motion } from 'motion/react';

type Gradients = {
	first: string;
	second: string;
	third: string;
};

type SpotlightProps = {
	light?: Partial<Gradients>;
	dark?: Partial<Gradients>;

	translateY?: number;
	width?: number;
	height?: number;
	smallWidth?: number;
	duration?: number;
	xOffset?: number;
};

const DEFAULT_LIGHT: Gradients = {
	first:
		'radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(248, 14%, 15%, .08) 0, hsla(248, 12%, 25%, .02) 50%, hsla(248, 10%, 35%, 0) 80%)',
	second:
		'radial-gradient(50% 50% at 50% 50%, hsla(248, 14%, 15%, .06) 0, hsla(248, 12%, 25%, .02) 80%, transparent 100%)',
	third:
		'radial-gradient(50% 50% at 50% 50%, hsla(248, 12%, 25%, .04) 0, hsla(248, 10%, 35%, .02) 80%, transparent 100%)',
};

const DEFAULT_DARK: Gradients = {
	first:
		'radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(248, 14%, 85%, .08) 0, hsla(248, 12%, 55%, .02) 50%, hsla(248, 10%, 45%, 0) 80%)',
	second:
		'radial-gradient(50% 50% at 50% 50%, hsla(248, 14%, 85%, .06) 0, hsla(248, 12%, 55%, .02) 80%, transparent 100%)',
	third:
		'radial-gradient(50% 50% at 50% 50%, hsla(248, 12%, 85%, .04) 0, hsla(248, 10%, 45%, .02) 80%, transparent 100%)',
};

export const Spotlight = ({
	light,
	dark,
	translateY = -350,
	width = 560,
	height = 1380,
	smallWidth = 240,
	duration = 7,
	xOffset = 100,
}: SpotlightProps = {}) => {
	const { resolvedTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => setMounted(true), []);
	const theme = mounted ? resolvedTheme : undefined;

	const gradients: Gradients = useMemo(() => {
		const l = { ...DEFAULT_LIGHT, ...light };
		const d = { ...DEFAULT_DARK, ...dark };
		return theme === 'dark' ? d : l;
	}, [theme, light, dark]);

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 1.5 }}
			style={{ willChange: 'transform, opacity' }}
			className="pointer-events-none absolute inset-0 h-full w-full"
		>
			<motion.div
				animate={{ x: [0, xOffset, 0] }}
				transition={{
					duration,
					repeat: Infinity,
					repeatType: 'reverse',
					ease: 'easeInOut',
				}}
				className="absolute top-0 left-0 w-screen h-screen z-40 pointer-events-none"
			>
				<div
					style={{
						transform: `translateY(${translateY}px) rotate(-45deg)`,
						background: gradients.first,
						width: `${width}px`,
						height: `${height}px`,
					}}
					className="absolute top-0 left-0"
				/>
				<div
					style={{
						transform: 'rotate(-45deg) translate(5%, -50%)',
						background: gradients.second,
						width: `${smallWidth}px`,
						height: `${height}px`,
					}}
					className="absolute top-0 left-0 origin-top-left"
				/>
				<div
					style={{
						transform: 'rotate(-45deg) translate(-180%, -70%)',
						background: gradients.third,
						width: `${smallWidth}px`,
						height: `${height}px`,
					}}
					className="absolute top-0 left-0 origin-top-left"
				/>
			</motion.div>

			<motion.div
				animate={{ x: [0, -xOffset, 0] }}
				transition={{
					duration,
					repeat: Infinity,
					repeatType: 'reverse',
					ease: 'easeInOut',
				}}
				className="absolute top-0 right-0 w-screen h-screen z-40 pointer-events-none"
			>
				<div
					style={{
						transform: `translateY(${translateY}px) rotate(45deg)`,
						background: gradients.first,
						width: `${width}px`,
						height: `${height}px`,
					}}
					className="absolute top-0 right-0"
				/>
				<div
					style={{
						transform: 'rotate(45deg) translate(-5%, -50%)',
						background: gradients.second,
						width: `${smallWidth}px`,
						height: `${height}px`,
					}}
					className="absolute top-0 right-0 origin-top-right"
				/>
				<div
					style={{
						transform: 'rotate(45deg) translate(180%, -70%)',
						background: gradients.third,
						width: `${smallWidth}px`,
						height: `${height}px`,
					}}
					className="absolute top-0 right-0 origin-top-right"
				/>
			</motion.div>
		</motion.div>
	);
};
