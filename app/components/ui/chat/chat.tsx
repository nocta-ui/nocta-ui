'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/app/components/ui/button/button';
import { Icons } from '@/app/components/ui/icons/icons';
import { Textarea } from '@/app/components/ui/textarea/textarea';
import { cn } from '@/lib/utils';

const chatVariants = cva(
	'relative border rounded-lg shadow-md shadow-card not-prose',
	{
		variants: {
			variant: {
				default: 'bg-card border-border',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	},
);

const messageVariants = cva(
	[
		'w-fit max-w-[80%] rounded-lg px-3 py-2 text-sm',
		'not-prose',
		'overflow-hidden',
	],
	{
		variants: {
			variant: {
				user: 'bg-foreground/90 text-card',
				assistant: 'bg-card-muted text-foreground',
				system: 'mx-auto bg-card-muted text-center text-xs text-foreground/70',
			},
		},
		defaultVariants: {
			variant: 'user',
		},
	},
);

export interface ChatMessage {
	id: string;
	content: string;
	sender: 'user' | 'assistant' | 'system';
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
	messages?: ChatMessage[];
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
}

export interface ChatMessagesProps
	extends React.HTMLAttributes<HTMLDivElement> {
	messages: ChatMessage[];
	showTimestamps?: boolean;
	showAvatars?: boolean;
	typingUsers?: TypingUser[];
	className?: string;
}

export interface ChatMessageProps extends React.HTMLAttributes<HTMLDivElement> {
	message: ChatMessage;
	showTimestamp?: boolean;
	showAvatar?: boolean;
	className?: string;
}

export interface TypingIndicatorProps
	extends React.HTMLAttributes<HTMLDivElement> {
	typingUsers?: TypingUser[];
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

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({
	typingUsers,
	showAvatars = false,
	className = '',
	...props
}) => {
	const safeTypingUsers = typingUsers ?? [];
	if (safeTypingUsers.length === 0) return null;

	const getTypingText = () => {
		const [firstUser, secondUser] = safeTypingUsers;
		if (safeTypingUsers.length === 1) {
			return `${firstUser?.name || 'Someone'} is typing`;
		} else if (safeTypingUsers.length === 2) {
			return `${firstUser?.name || 'Someone'} and ${secondUser?.name || 'someone else'} are typing`;
		} else {
			return `${firstUser?.name || 'Someone'} and ${
				safeTypingUsers.length - 1
			} others are typing`;
		}
	};
	return (
		/* biome-ignore lint/a11y/useSemanticElements: typing indicator intentionally uses a div with role="status" for accessibility */
		<div
			role="status"
			className={cn('flex items-end gap-2', className)}
			{...props}
		>
			{showAvatars && (
				<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-card-muted text-xs font-medium text-foreground/70">
					{safeTypingUsers[0]?.avatar ? (
						/* biome-ignore lint/performance/noImgElement: prefer native img here */
						<img
							src={safeTypingUsers[0]?.avatar}
							alt={safeTypingUsers[0]?.name || 'typing'}
							className="h-full w-full rounded-full object-cover"
						/>
					) : (
						<span>
							{safeTypingUsers[0]?.name
								? safeTypingUsers[0]?.name.charAt(0).toUpperCase()
								: '?'}
						</span>
					)}
				</div>
			)}

			<div className="flex w-full flex-col items-start gap-1">
				<div className="w-fit max-w-[80%] rounded-lg bg-card-muted px-3 py-2 text-sm text-foreground">
					<div className="flex items-center gap-2">
						<span className="text-xs text-foreground/70">
							{getTypingText()}
						</span>
						<div className="flex gap-1">
							<div className="h-1.5 w-1.5 animate-bounce rounded-full bg-foreground/60 [animation-delay:-0.3s]" />
							<div className="h-1.5 w-1.5 animate-bounce rounded-full bg-foreground/60 [animation-delay:-0.15s]" />
							<div className="h-1.5 w-1.5 animate-bounce rounded-full bg-foreground/60" />
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
	placeholder = 'Type a message...',
	disabled = false,
	autoFocus = false,
	maxLength = 500,
	showTimestamps = false,
	showAvatars = false,
	allowMultiline = true,
	typingUsers = [],
	variant = 'default',
	className = '',
	...props
}) => {
	return (
		<div className={cn(chatVariants({ variant }), className)} {...props}>
			<div className="flex h-full flex-col rounded-lg">
				<ChatMessages
					messages={messages}
					showTimestamps={showTimestamps}
					showAvatars={showAvatars}
					typingUsers={typingUsers}
					className="max-h-96 min-h-0 flex-1"
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
		</div>
	);
};

export const ChatMessages: React.FC<ChatMessagesProps> = ({
	messages,
	showTimestamps = false,
	showAvatars = false,
	typingUsers = [],
	className = '',
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
				behavior: 'smooth',
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
			className={cn('flex-1 space-y-3 overflow-y-auto p-4', className)}
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
	className = '',
	...props
}) => {
	const isUser = message.sender === 'user';
	const isSystem = message.sender === 'system';

	return (
		<div
			role={isSystem ? 'status' : 'listitem'}
			className={cn(
				'flex items-end gap-2',
				isUser ? 'flex-row-reverse' : 'flex-row',
				isSystem ? 'justify-center' : '',
				className,
			)}
			{...props}
		>
			{showAvatar && !isSystem && (
				<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-card-muted text-xs font-medium text-foreground/70">
					{message.avatar ? (
						/* biome-ignore lint/performance/noImgElement: prefer native img here */
						<img
							src={message.avatar}
							alt={message.name || message.sender}
							className="h-full w-full rounded-full object-cover"
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
					'flex w-full flex-col gap-1',
					isUser ? 'items-end' : 'items-start',
					isSystem ? 'items-center' : '',
				)}
			>
				<div className={cn(messageVariants({ variant: message.sender }))}>
					<div className={cn('flex w-full flex-col gap-1')}>
						<div className="whitespace-pre-wrap">{message.content}</div>
						{showTimestamp && (
							<span
								className={cn(
									'text-xs',
									isUser
										? 'text-right text-background/50'
										: 'text-left text-foreground/45',
									isSystem ? 'text-center' : '',
								)}
							>
								{message.timestamp.toLocaleTimeString([], {
									hour: '2-digit',
									minute: '2-digit',
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
	placeholder = 'Type a message...',
	disabled = false,
	autoFocus = false,
	maxLength = 500,
	allowMultiline = true,
	className = '',
	...props
}) => {
	const [message, setMessage] = useState('');
	const textareaContainerRef = useRef<HTMLDivElement>(null);

	const getTextareaElement = useCallback(() => {
		return textareaContainerRef.current?.querySelector('textarea') ?? null;
	}, []);

	const adjustTextareaHeight = useCallback(
		(element?: HTMLTextAreaElement | null) => {
			const textarea = element ?? getTextareaElement();
			if (!textarea) return;
			textarea.style.height = 'auto';
			const newHeight = Math.min(textarea.scrollHeight, 120);
			textarea.style.height = `${newHeight}px`;
		},
		[getTextareaElement],
	);

	useEffect(() => {
		if (autoFocus) {
			getTextareaElement()?.focus({ preventScroll: true });
		}
	}, [autoFocus, getTextareaElement]);

	const handleSubmit = useCallback(
		(e: React.FormEvent) => {
			e.preventDefault();
			if (message.trim() && !disabled) {
				onSendMessage(message.trim());
				setMessage('');
				const textarea = getTextareaElement();
				if (textarea) {
					textarea.style.height = 'auto';
				}
			}
		},
		[message, disabled, onSendMessage, getTextareaElement],
	);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === 'Enter') {
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
			adjustTextareaHeight(e.target);
		},
		[maxLength, adjustTextareaHeight],
	);

	return (
		<div
			className={cn(
				'border-t border-border/60 bg-card-muted/30 p-4',
				className,
			)}
			{...props}
		>
			<form onSubmit={handleSubmit} className="flex items-center gap-2">
				<div className="flex-1" ref={textareaContainerRef}>
					<Textarea
						value={message}
						onChange={handleTextareaChange}
						onKeyDown={handleKeyDown}
						placeholder={placeholder}
						aria-label={placeholder || 'Type a message'}
						aria-multiline={allowMultiline}
						disabled={disabled}
						rows={1}
						resize="none"
						containerClassName="flex-1"
						wrapperClassName="h-full"
						className="min-h-9"
					/>
				</div>
				<Button
					type="submit"
					size="md"
					aria-label="Send message"
					disabled={!message.trim() || disabled}
				>
					<Icons.SendMessage
						aria-hidden="true"
						className="mb-0.5 ml-1 size-5 -rotate-45"
					/>
				</Button>
			</form>
			{maxLength && (
				<div className="mt-1 text-right text-xs text-foreground/45 dark:text-foreground/45">
					{message.length}/{maxLength}
				</div>
			)}
		</div>
	);
};

export const ChatActions: React.FC<ChatActionsProps> = ({
	children,
	className = '',
	...props
}) => {
	return (
		<div className={cn('flex items-center gap-2', className)} {...props}>
			{children}
		</div>
	);
};
