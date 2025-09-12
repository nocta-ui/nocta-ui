"use client";

import { cva, type VariantProps } from "class-variance-authority";
import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useId,
	useRef,
	useState,
} from "react";
import { cn } from "@/lib/utils";

const chatVariants = cva(
	[
		"relative bg-background border border-border-muted",
		"rounded-xl shadow-lg transition-all duration-200 ease-out",
		"overflow-hidden not-prose",
	],
	{
		variants: {
			variant: {
				default: "",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

const messageVariants = cva(
	[
		"rounded-lg px-3 py-2 text-sm w-fit max-w-[80%]",
		"transition-all duration-200 ease-in-out not-prose",
		"overflow-hidden ",
	],
	{
		variants: {
			variant: {
				user: "bg-primary-muted text-primary-foreground",
				assistant: "bg-background-muted text-foreground",
				system:
					"bg-background-muted/50 dark:bg-background-muted/30 text-foreground-subtle text-center text-xs mx-auto",
			},
		},
		defaultVariants: {
			variant: "user",
		},
	},
);

const inputVariants = cva(
	[
		"flex-1 px-3 py-2 text-sm min-h-[40px] rounded-lg border transition-all duration-200 ease-in-out resize-none",
		"focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-1",
		"disabled:opacity-50 disabled:cursor-not-allowed",
		"placeholder:text-foreground-subtle not-prose",
		"focus-visible:ring-offset-ring-offset/50",
	],
	{
		variants: {
			variant: {
				default: [
					"border-border-muted",
					"bg-background",
					"text-foreground",
					"focus-visible:border-border/10",
					"focus-visible:ring-ring/50",
				],
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

export interface Message {
	id: string;
	content: string;
	sender: "user" | "assistant" | "system";
	timestamp: Date;
	avatar?: string;
	name?: string;
}

export interface TypingUser {
	id: string;
	name?: string;
	avatar?: string;
}

export interface ChatProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof chatVariants> {
	messages?: Message[];
	onSendMessage?: (message: string) => void;
	placeholder?: string;
	disabled?: boolean;
	autoFocus?: boolean;
	maxLength?: number;
	showTimestamps?: boolean;
	showAvatars?: boolean;
	allowMultiline?: boolean;
	typingUsers?: TypingUser[];
	className?: string;
	children?: React.ReactNode;
}

export interface ChatHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
	className?: string;
}

export interface ChatTitleProps
	extends React.HTMLAttributes<HTMLHeadingElement> {
	children: React.ReactNode;
	className?: string;
	as?: React.ElementType;
}

export interface ChatDescriptionProps
	extends React.HTMLAttributes<HTMLParagraphElement> {
	children: React.ReactNode;
	className?: string;
}

export interface ChatMessagesProps
	extends React.HTMLAttributes<HTMLDivElement> {
	messages: Message[];
	showTimestamps?: boolean;
	showAvatars?: boolean;
	typingUsers?: TypingUser[];
	className?: string;
}

export interface ChatMessageProps extends React.HTMLAttributes<HTMLDivElement> {
	message: Message;
	showTimestamp?: boolean;
	showAvatar?: boolean;
	className?: string;
}

export interface TypingIndicatorProps
	extends React.HTMLAttributes<HTMLDivElement> {
	typingUsers: TypingUser[];
	showAvatars?: boolean;
	className?: string;
}

export interface ChatInputProps extends React.HTMLAttributes<HTMLDivElement> {
	onSendMessage: (message: string) => void;
	placeholder?: string;
	disabled?: boolean;
	autoFocus?: boolean;
	maxLength?: number;
	allowMultiline?: boolean;
	className?: string;
}

export interface ChatActionsProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
	className?: string;
}

// A11y context to link ChatDescription to Chat container via aria-describedby
const ChatA11yContext = createContext<{
	setDescriptionId: (id?: string) => void;
}>({ setDescriptionId: () => {} });

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({
	typingUsers,
	showAvatars = false,
	className = "",
	...props
}) => {
	if (!typingUsers || typingUsers.length === 0) return null;

	const getTypingText = () => {
		if (typingUsers.length === 1) {
			return `${typingUsers[0].name || "Someone"} is typing`;
		} else if (typingUsers.length === 2) {
			return `${typingUsers[0].name || "Someone"} and ${typingUsers[1].name || "someone else"} are typing`;
		} else {
			return `${typingUsers[0].name || "Someone"} and ${typingUsers.length - 1} others are typing`;
		}
	};

	return (
		<div
			role="status"
			className={cn("flex items-end gap-2 not-prose", className)}
			{...props}
		>
			{showAvatars && (
				<div className="w-8 h-8 rounded-full bg-background-muted flex items-center justify-center text-xs font-medium text-primary-muted flex-shrink-0">
					{typingUsers[0].avatar ? (
						/* biome-ignore lint/performance/noImgElement: prefer native img here */
						<img
							src={typingUsers[0].avatar}
							alt={typingUsers[0].name || "typing"}
							className="w-full h-full rounded-full object-cover"
						/>
					) : (
						<span>
							{typingUsers[0].name
								? typingUsers[0].name.charAt(0).toUpperCase()
								: "?"}
						</span>
					)}
				</div>
			)}

			<div className="flex flex-col gap-1 w-full items-start">
				<div className="bg-background-muted text-foreground rounded-lg px-3 py-2 text-sm w-fit max-w-[80%] transition-all duration-200 ease-in-out not-prose">
					<div className="flex items-center gap-2">
						<span className="text-xs text-primary-muted">
							{getTypingText()}
						</span>
						<div className="flex gap-1">
							<div className="w-1.5 h-1.5 bg-foreground-muted rounded-full animate-bounce [animation-delay:-0.3s]" />
							<div className="w-1.5 h-1.5 bg-foreground-muted rounded-full animate-bounce [animation-delay:-0.15s]" />
							<div className="w-1.5 h-1.5 bg-foreground-muted rounded-full animate-bounce" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export const Chat: React.FC<ChatProps> = ({
	messages = [],
	onSendMessage,
	placeholder = "Type a message...",
	disabled = false,
	autoFocus = false,
	maxLength = 500,
	showTimestamps = false,
	showAvatars = false,
	allowMultiline = true,
	typingUsers = [],
	variant = "default",
	className = "",
	children,
	...props
}) => {
	const [descriptionId, setDescriptionId] = useState<string | undefined>();

	return (
		<div
			className={cn(chatVariants({ variant }), className)}
			aria-describedby={descriptionId}
			{...props}
		>
			<span
				aria-hidden
				className="pointer-events-none absolute -inset-px rounded-xl bg-gradient-to-b to-transparent opacity-60"
				style={{
					maskImage:
						"radial-gradient(120% 100% at 50% 0%, black 30%, transparent 70%)",
					WebkitMaskImage:
						"radial-gradient(120% 100% at 50% 0%, black 30%, transparent 70%)",
				}}
			/>
			<ChatA11yContext.Provider value={{ setDescriptionId }}>
				<div className="rounded-xl h-full flex flex-col">
					{children}
					<ChatMessages
						messages={messages}
						showTimestamps={showTimestamps}
						showAvatars={showAvatars}
						typingUsers={typingUsers}
						className="flex-1 min-h-0 max-h-96"
					/>
					{onSendMessage && (
						<ChatInput
							onSendMessage={onSendMessage}
							placeholder={placeholder}
							disabled={disabled}
							autoFocus={autoFocus}
							maxLength={maxLength}
							allowMultiline={allowMultiline}
						/>
					)}
				</div>
			</ChatA11yContext.Provider>
		</div>
	);
};

export const ChatHeader: React.FC<ChatHeaderProps> = ({
	children,
	className = "",
	...props
}) => {
	return (
		<div
			className={cn("p-4 border-b border-border-muted not-prose", className)}
			{...props}
		>
			{children}
		</div>
	);
};

export const ChatTitle: React.FC<ChatTitleProps> = ({
	children,
	className = "",
	as: Component = "h3",
	...props
}) => {
	return React.createElement(
		Component,
		{
			className: cn(
				"text-lg font-semibold text-foreground tracking-tight leading-tight not-prose",
				className,
			),
			...props,
		},
		children,
	);
};

export const ChatDescription: React.FC<ChatDescriptionProps> = ({
	children,
	className = "",
	id: propId,
	...props
}) => {
	const { setDescriptionId } = useContext(ChatA11yContext);
	const generatedId = useId();
	const id = propId ?? `chat-desc-${generatedId}`;

	useEffect(() => {
		setDescriptionId(id);
		return () => setDescriptionId(undefined);
	}, [id, setDescriptionId]);

	return (
		<p
			id={id}
			className={cn(
				"text-sm text-primary-muted/80 leading-relaxed mt-2 not-prose",
				className,
			)}
			{...props}
		>
			{children}
		</p>
	);
};

export const ChatMessages: React.FC<ChatMessagesProps> = ({
	messages,
	showTimestamps = false,
	showAvatars = false,
	typingUsers = [],
	className = "",
	...props
}) => {
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	/* biome-ignore lint/correctness/useExhaustiveDependencies: scroll depends on message content changes */
	useEffect(() => {
		if (containerRef.current && messagesEndRef.current) {
			const container = containerRef.current;
			const scrollHeight = container.scrollHeight;
			const height = container.clientHeight;
			const maxScrollTop = scrollHeight - height;

			container.scrollTo({
				top: maxScrollTop > 0 ? maxScrollTop : 0,
				behavior: "smooth",
			});
		}
	}, [messages.length, typingUsers.length]);

	return (
		<div
			ref={containerRef}
			role="log"
			aria-live="polite"
			aria-relevant="additions text"
			aria-label="Chat messages"
			className={cn(
				"flex-1 overflow-y-auto p-4 space-y-3 not-prose",
				className,
			)}
			{...props}
		>
			{messages.map((message) => (
				<ChatMessage
					key={message.id}
					message={message}
					showTimestamp={showTimestamps}
					showAvatar={showAvatars}
				/>
			))}
			<TypingIndicator typingUsers={typingUsers} showAvatars={showAvatars} />
			<div ref={messagesEndRef} />
		</div>
	);
};

export const ChatMessage: React.FC<ChatMessageProps> = ({
	message,
	showTimestamp = false,
	showAvatar = false,
	className = "",
	...props
}) => {
	const isUser = message.sender === "user";
	const isSystem = message.sender === "system";

	return (
		<div
			role={isSystem ? "status" : "listitem"}
			className={cn(
				"flex items-end gap-2 not-prose",
				isUser ? "flex-row-reverse" : "flex-row",
				isSystem ? "justify-center" : "",
				className,
			)}
			{...props}
		>
			{showAvatar && !isSystem && (
				<div className="w-8 h-8 rounded-full bg-background-muted flex items-center justify-center text-xs font-medium text-primary-muted flex-shrink-0">
					{message.avatar ? (
						/* biome-ignore lint/performance/noImgElement: prefer native img here */
						<img
							src={message.avatar}
							alt={message.name || message.sender}
							className="w-full h-full rounded-full object-cover"
						/>
					) : (
						<span>
							{message.name
								? message.name.charAt(0).toUpperCase()
								: message.sender.charAt(0).toUpperCase()}
						</span>
					)}
				</div>
			)}

			<div
				className={cn(
					"flex flex-col gap-1 w-full",
					isUser ? "items-end" : "items-start",
					isSystem ? "items-center" : "",
				)}
			>
				<div className={cn(messageVariants({ variant: message.sender }))}>
					<div className={cn("w-full flex flex-col gap-1")}>
						<div className="whitespace-pre-wrap">{message.content}</div>
						{showTimestamp && (
							<span
								className={cn(
									"text-xs text-foreground-subtle dark:text-foreground-subtle",
									isUser ? "text-right" : "text-left",
									isSystem ? "text-center" : "",
								)}
							>
								{message.timestamp.toLocaleTimeString([], {
									hour: "2-digit",
									minute: "2-digit",
								})}
							</span>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export const ChatInput: React.FC<ChatInputProps> = ({
	onSendMessage,
	placeholder = "Type a message...",
	disabled = false,
	autoFocus = false,
	maxLength = 500,
	allowMultiline = true,
	className = "",
	...props
}) => {
	const [message, setMessage] = useState("");
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	useEffect(() => {
		if (autoFocus) {
			textareaRef.current?.focus({ preventScroll: true });
		}
	}, [autoFocus]);

	const handleSubmit = useCallback(
		(e: React.FormEvent) => {
			e.preventDefault();
			if (message.trim() && !disabled) {
				onSendMessage(message.trim());
				setMessage("");
				if (textareaRef.current) {
					textareaRef.current.style.height = "auto";
				}
			}
		},
		[message, disabled, onSendMessage],
	);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === "Enter") {
				if (allowMultiline && e.shiftKey) {
					return;
				}
				e.preventDefault();
				handleSubmit(e);
			}
		},
		[allowMultiline, handleSubmit],
	);

	const handleTextareaChange = useCallback(
		(e: React.ChangeEvent<HTMLTextAreaElement>) => {
			const value = e.target.value;
			if (maxLength && value.length > maxLength) return;

			setMessage(value);

			if (textareaRef.current) {
				textareaRef.current.style.height = "auto";
				const newHeight = Math.min(textareaRef.current.scrollHeight, 120);
				textareaRef.current.style.height = `${newHeight}px`;
			}
		},
		[maxLength],
	);

	return (
		<div
			className={cn(
				"p-4 bg-background-muted/50 dark:bg-background-muted/30 border-t border-border-muted not-prose",
				className,
			)}
			{...props}
		>
			<form onSubmit={handleSubmit} className="flex items-center gap-2">
				<textarea
					ref={textareaRef}
					value={message}
					onChange={handleTextareaChange}
					onKeyDown={handleKeyDown}
					placeholder={placeholder}
					aria-label={placeholder || "Type a message"}
					aria-multiline={allowMultiline}
					disabled={disabled}
					rows={1}
					className={inputVariants({ variant: "default" })}
				/>
				<button
					type="submit"
					aria-label="Send message"
					disabled={!message.trim() || disabled}
					className={cn(
						"px-3 py-2 rounded-lg font-medium transition-all duration-200 ease-in-out h-full",
						"focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-offset-ring-offset/50 focus-visible:ring-ring/50 focus-visible:border-border/10",
						"disabled:opacity-50 disabled:cursor-not-allowed not-prose",
						"bg-linear-to-b from-gradient-primary-start to-gradient-primary-end",
						"hover:contrast-125",
						"text-primary-white",
						"shadow-sm",
					)}
				>
					<svg
						aria-hidden="true"
						className="size-5"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" />
						<path d="m21.854 2.147-10.94 10.939" />
					</svg>
				</button>
			</form>
			{maxLength && (
				<div className="text-xs text-foreground-subtle dark:text-foreground-subtle mt-1 text-right">
					{message.length}/{maxLength}
				</div>
			)}
		</div>
	);
};

export const ChatActions: React.FC<ChatActionsProps> = ({
	children,
	className = "",
	...props
}) => {
	return (
		<div
			className={cn("flex items-center gap-2 not-prose", className)}
			{...props}
		>
			{children}
		</div>
	);
};
