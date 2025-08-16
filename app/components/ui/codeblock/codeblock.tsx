"use client";

import { buttonVariants } from "fumadocs-ui/components/ui/button";
import { cn } from "fumadocs-ui/utils/cn";
import { useCopyButton } from "fumadocs-ui/utils/use-copy-button";
import type React from "react";
import {
	type CSSProperties,
	forwardRef,
	type HTMLAttributes,
	type ReactNode,
	useRef,
} from "react";

interface PreProps extends HTMLAttributes<HTMLPreElement> {
	className?: string;
}

interface IconProps extends React.SVGProps<SVGSVGElement> {
	size?: number | string;
}

export const Check: React.FC<IconProps> = ({
	size = 24,
	className = "",
	...props
}) => {
	return (
		<svg
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
	className = "",
	...props
}) => {
	return (
		<svg
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
				className={cn("min-w-full w-max *:flex *:flex-col", className)}
				{...props}
			>
				{props.children}
			</pre>
		);
	},
);

Pre.displayName = "Pre";

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
	"data-line-numbers"?: boolean;
	"data-line-numbers-start"?: number;
}

export const CodeBlock = forwardRef<HTMLElement, CodeBlockProps>(
	(
		{
			title,
			allowCopy = true,
			keepBackground = false,
			icon,
			viewportProps,
			children,
			...props
		},
		ref,
	) => {
		const areaRef = useRef<HTMLDivElement>(null);

		const onCopy = () => {
			const pre = areaRef.current?.getElementsByTagName("pre").item(0);
			if (!pre) return;

			const clone = pre.cloneNode(true) as HTMLPreElement;
			clone.querySelectorAll(".nd-copy-ignore").forEach((node) => {
				node.remove();
			});

			void navigator.clipboard.writeText(clone.textContent ?? "");
		};

		return (
			<figure
				ref={ref}
				dir="ltr"
				{...props}
				className={cn(
					"not-prose group relative my-4 overflow-hidden rounded-lg border bg-nocta-200 dark:bg-nocta-900 text-sm outline-none",
					keepBackground && "bg-(--shiki-light-bg) dark:bg-(--shiki-dark-bg)",
					props.className,
				)}
			>
				{title ? (
					<div className="flex items-center gap-2 px-4 py-1.5">
						{icon ? (
							<div
								className="text-fd-muted-foreground [&_svg]:size-3.5"
								dangerouslySetInnerHTML={
									typeof icon === "string"
										? {
												__html: icon,
											}
										: undefined
								}
							>
								{typeof icon !== "string" ? icon : null}
							</div>
						) : null}
						<figcaption className="flex-1 truncate text-fd-muted-foreground">
							{title}
						</figcaption>
						{allowCopy ? (
							<CopyButton className="-me-2" onCopy={onCopy} />
						) : null}
					</div>
				) : (
					allowCopy && (
						<CopyButton
							className="absolute right-2 top-2 z-[2] backdrop-blur-md"
							onCopy={onCopy}
						/>
					)
				)}
				<div
					ref={areaRef}
					{...viewportProps}
					className={cn(
						"text-[13px] py-3.5 overflow-auto bg-nocta-100 dark:bg-nocta-950/50 m-1 rounded-md border [&_.line]:px-4 max-h-[600px] fd-scroll-container",
						props["data-line-numbers"] && "[&_.line]:pl-3",
						viewportProps?.className,
					)}
					style={{
						counterSet: props["data-line-numbers"]
							? `line ${Number(props["data-line-numbers-start"] ?? 1) - 1}`
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

CodeBlock.displayName = "CodeBlock";

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
				buttonVariants({
					color: "ghost",
				}),
				"transition-opacity  [&_svg]:size-3.5",
				!checked && "[@media(hover:hover)]:opacity-100",
				className,
			)}
			aria-label={checked ? "Copied Text" : "Copy Text"}
			onClick={onClick}
			{...props}
		>
			<Check className={cn("transition-transform", !checked && "scale-0")} />
			<Copy
				className={cn("absolute transition-transform", checked && "scale-0")}
			/>
		</button>
	);
}
