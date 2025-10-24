'use client';

import { cn } from 'fumadocs-ui/utils/cn';
import { useCopyButton } from 'fumadocs-ui/utils/use-copy-button';
import type React from 'react';
import {
	type CSSProperties,
	forwardRef,
	type HTMLAttributes,
	type ReactNode,
	useRef,
} from 'react';

interface PreProps extends HTMLAttributes<HTMLPreElement> {
	className?: string;
}

interface IconProps extends React.SVGProps<SVGSVGElement> {
	size?: number | string;
}

export const Check: React.FC<IconProps> = ({
	size = 24,
	className = '',
	...props
}) => {
	return (
		<svg
			aria-hidden={true}
			xmlns="http://www.w3.org/2000/svg"
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}
			{...props}
		>
			<path d="M20 6 9 17l-5-5" />
		</svg>
	);
};

export const Copy: React.FC<IconProps> = ({
	size = 24,
	className = '',
	...props
}) => {
	return (
		<svg
			aria-hidden={true}
			xmlns="http://www.w3.org/2000/svg"
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}
			{...props}
		>
			<rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
			<path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
		</svg>
	);
};
export const Pre = forwardRef<HTMLPreElement, PreProps>(
	({ className, ...props }, ref) => {
		return (
			<pre
				ref={ref}
				className={cn('w-max min-w-full *:flex *:flex-col', className)}
				{...props}
			>
				{props.children}
			</pre>
		);
	},
);

Pre.displayName = 'Pre';

interface ViewportProps extends HTMLAttributes<HTMLDivElement> {
	className?: string;
	style?: CSSProperties;
}

interface CodeBlockProps extends HTMLAttributes<HTMLElement> {
	title?: string;
	allowCopy?: boolean;
	keepBackground?: boolean;
	icon?: ReactNode | string;
	viewportProps?: ViewportProps;
	children?: ReactNode;
	'data-line-numbers'?: boolean;
	'data-line-numbers-start'?: number;
}

export const CodeBlock = forwardRef<HTMLElement, CodeBlockProps>(
	({ viewportProps, children, ...props }, ref) => {
		const areaRef = useRef<HTMLDivElement>(null);

		const onCopy = () => {
			const pre = areaRef.current?.getElementsByTagName('pre').item(0);
			if (!pre) return;

			const clone = pre.cloneNode(true) as HTMLPreElement;
			clone.querySelectorAll('.nd-copy-ignore').forEach((node) => {
				node.remove();
			});

			void navigator.clipboard.writeText(clone.textContent ?? '');
		};

		return (
			<figure
				ref={ref}
				dir="ltr"
				{...props}
				className={cn(
					'not-prose group relative z-0 my-4 w-full text-sm outline-none',
					props.className,
				)}
			>
				<CopyButton
					className="absolute top-2 right-2 z-2 backdrop-blur-md"
					onCopy={onCopy}
				/>
				<div
					ref={areaRef}
					{...viewportProps}
					className={cn(
						'fd-scroll-container max-h-[600px] overflow-auto rounded-lg border border-fd-border bg-card py-3.5 text-[13px] [&_.line]:px-4',
						props['data-line-numbers'] && '[&_.line]:pl-3',
						viewportProps?.className,
					)}
					style={{
						counterSet: props['data-line-numbers']
							? `line ${Number(props['data-line-numbers-start'] ?? 1) - 1}`
							: undefined,
						...viewportProps?.style,
					}}
				>
					{children}
				</div>
			</figure>
		);
	},
);

CodeBlock.displayName = 'CodeBlock';

interface CopyButtonProps extends HTMLAttributes<HTMLButtonElement> {
	className?: string;
	onCopy: () => void;
}

function CopyButton({ className, onCopy, ...props }: CopyButtonProps) {
	const [checked, onClick] = useCopyButton(onCopy);

	return (
		<button
			type="button"
			className={cn(
				'inline-flex items-center justify-center text-foreground/75 rounded-md p-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
				'hover:bg-card-muted hover:text-foreground transition-all duration-200 ease-in-out',
				'[&_svg]:size-3.5 cursor-pointer',
				!checked && '[@media(hover:hover)]:opacity-100',
				className,
			)}
			aria-label={checked ? 'Copied Text' : 'Copy Text'}
			onClick={onClick}
			{...props}
		>
			<Check className={cn('transition-transform', !checked && 'scale-0')} />
			<Copy
				className={cn('absolute transition-transform', checked && 'scale-0')}
			/>
		</button>
	);
}
