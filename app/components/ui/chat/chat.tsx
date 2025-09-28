'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Icons } from '@/app/components/ui/icons/icons'
import { cn } from '@/lib/utils'

const chatVariants = cva(
  [
    'relative bg-background border border-none dark:border-solid border-border',
    'rounded-lg shadow-md transition-all duration-200 ease-in-out',
    'overflow-hidden not-prose',
  ],
  {
    variants: {
      variant: {
        default: '',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

const messageVariants = cva(
  [
    'rounded-lg px-3 py-2 text-sm w-fit max-w-[80%]',
    'transition-all duration-200 ease-in-out not-prose',
    'overflow-hidden ',
  ],
  {
    variants: {
      variant: {
        user: 'bg-foreground-muted text-background',
        assistant: 'bg-background-muted text-foreground',
        system:
          'bg-background-muted text-foreground-subtle text-center text-xs mx-auto',
      },
    },
    defaultVariants: {
      variant: 'user',
    },
  }
)

const inputVariants = cva(
  [
    'flex-1 px-3 py-2 text-sm min-h-[40px] rounded-lg border transition-all duration-200 ease-in-out resize-none',
    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-1',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'placeholder:text-foreground-subtle not-prose',
    'focus-visible:ring-offset-ring-offset/50',
  ],
  {
    variants: {
      variant: {
        default: [
          'border-border-muted',
          'bg-background',
          'text-foreground',
          'focus-visible:border-border',
          'focus-visible:ring-ring/50',
        ],
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface Message {
  id: string
  content: string
  sender: 'user' | 'assistant' | 'system'
  timestamp: Date
  avatar?: string
  name?: string
}

export interface TypingUser {
  id: string
  name?: string
  avatar?: string
}

export interface ChatProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chatVariants> {
  messages?: Message[]
  onSendMessage?: (message: string) => void
  placeholder?: string
  disabled?: boolean
  autoFocus?: boolean
  maxLength?: number
  showTimestamps?: boolean
  showAvatars?: boolean
  allowMultiline?: boolean
  typingUsers?: TypingUser[]
  className?: string
}

export interface ChatMessagesProps
  extends React.HTMLAttributes<HTMLDivElement> {
  messages: Message[]
  showTimestamps?: boolean
  showAvatars?: boolean
  typingUsers?: TypingUser[]
  className?: string
}

export interface ChatMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  message: Message
  showTimestamp?: boolean
  showAvatar?: boolean
  className?: string
}

export interface TypingIndicatorProps
  extends React.HTMLAttributes<HTMLDivElement> {
  typingUsers: TypingUser[]
  showAvatars?: boolean
  className?: string
}

export interface ChatInputProps extends React.HTMLAttributes<HTMLDivElement> {
  onSendMessage: (message: string) => void
  placeholder?: string
  disabled?: boolean
  autoFocus?: boolean
  maxLength?: number
  allowMultiline?: boolean
  className?: string
}

export interface ChatActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  typingUsers,
  showAvatars = false,
  className = '',
  ...props
}) => {
  if (!typingUsers || typingUsers.length === 0) return null

  const getTypingText = () => {
    if (typingUsers.length === 1) {
      return `${typingUsers[0].name || 'Someone'} is typing`
    } else if (typingUsers.length === 2) {
      return `${typingUsers[0].name || 'Someone'} and ${typingUsers[1].name || 'someone else'} are typing`
    } else {
      return `${typingUsers[0].name || 'Someone'} and ${typingUsers.length - 1} others are typing`
    }
  }

  return (
    <div
      role="status"
      className={cn('not-prose flex items-end gap-2', className)}
      {...props}
    >
      {showAvatars && (
        <div className="bg-background-muted text-foreground-muted flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-medium">
          {typingUsers[0].avatar ? (
            /* biome-ignore lint/performance/noImgElement: prefer native img here */
            <img
              src={typingUsers[0].avatar}
              alt={typingUsers[0].name || 'typing'}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <span>
              {typingUsers[0].name
                ? typingUsers[0].name.charAt(0).toUpperCase()
                : '?'}
            </span>
          )}
        </div>
      )}

      <div className="flex w-full flex-col items-start gap-1">
        <div className="bg-background-muted text-foreground not-prose w-fit max-w-[80%] rounded-lg px-3 py-2 text-sm transition-all duration-200 ease-in-out">
          <div className="flex items-center gap-2">
            <span className="text-foreground-muted text-xs">
              {getTypingText()}
            </span>
            <div className="flex gap-1">
              <div className="bg-foreground-muted h-1.5 w-1.5 animate-bounce rounded-full [animation-delay:-0.3s]" />
              <div className="bg-foreground-muted h-1.5 w-1.5 animate-bounce rounded-full [animation-delay:-0.15s]" />
              <div className="bg-foreground-muted h-1.5 w-1.5 animate-bounce rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

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
  )
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  showTimestamps = false,
  showAvatars = false,
  typingUsers = [],
  className = '',
  ...props
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  /* biome-ignore lint/correctness/useExhaustiveDependencies: scroll depends on message content changes */
  useEffect(() => {
    if (containerRef.current && messagesEndRef.current) {
      const container = containerRef.current
      const scrollHeight = container.scrollHeight
      const height = container.clientHeight
      const maxScrollTop = scrollHeight - height

      container.scrollTo({
        top: maxScrollTop > 0 ? maxScrollTop : 0,
        behavior: 'smooth',
      })
    }
  }, [messages.length, typingUsers.length])

  return (
    <div
      ref={containerRef}
      role="log"
      aria-live="polite"
      aria-relevant="additions text"
      aria-label="Chat messages"
      className={cn(
        'not-prose flex-1 space-y-3 overflow-y-auto p-4',
        className
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
  )
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  showTimestamp = false,
  showAvatar = false,
  className = '',
  ...props
}) => {
  const isUser = message.sender === 'user'
  const isSystem = message.sender === 'system'

  return (
    <div
      role={isSystem ? 'status' : 'listitem'}
      className={cn(
        'not-prose flex items-end gap-2',
        isUser ? 'flex-row-reverse' : 'flex-row',
        isSystem ? 'justify-center' : '',
        className
      )}
      {...props}
    >
      {showAvatar && !isSystem && (
        <div className="bg-background-muted text-foreground-muted flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-medium">
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
          isSystem ? 'items-center' : ''
        )}
      >
        <div className={cn(messageVariants({ variant: message.sender }))}>
          <div className={cn('flex w-full flex-col gap-1')}>
            <div className="whitespace-pre-wrap">{message.content}</div>
            {showTimestamp && (
              <span
                className={cn(
                  'text-foreground-subtle dark:text-foreground-subtle text-xs',
                  isUser ? 'text-right' : 'text-left',
                  isSystem ? 'text-center' : ''
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
  )
}

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
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    if (autoFocus) {
      textareaRef.current?.focus({ preventScroll: true })
    }
  }, [autoFocus])

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (message.trim() && !disabled) {
        onSendMessage(message.trim())
        setMessage('')
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto'
        }
      }
    },
    [message, disabled, onSendMessage]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (allowMultiline && e.shiftKey) {
          return
        }
        e.preventDefault()
        handleSubmit(e)
      }
    },
    [allowMultiline, handleSubmit]
  )

  const handleTextareaChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value
      if (maxLength && value.length > maxLength) return

      setMessage(value)

      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
        const newHeight = Math.min(textareaRef.current.scrollHeight, 120)
        textareaRef.current.style.height = `${newHeight}px`
      }
    },
    [maxLength]
  )

  return (
    <div
      className={cn(
        'bg-background-muted/50 dark:bg-background-muted/30 border-border-muted not-prose border-t p-4',
        className
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
          aria-label={placeholder || 'Type a message'}
          aria-multiline={allowMultiline}
          disabled={disabled}
          rows={1}
          className={inputVariants({ variant: 'default' })}
        />
        <button
          type="submit"
          aria-label="Send message"
          disabled={!message.trim() || disabled}
          className={cn(
            'h-full rounded-lg px-3 py-2 font-medium transition-all duration-200 ease-in-out',
            'focus-visible:ring-offset-ring-offset/50 focus-visible:ring-ring/50 focus-visible:border-border focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:outline-none',
            'not-prose disabled:cursor-not-allowed disabled:opacity-50',
            'bg-foreground',
            'hover:bg-foreground-muted',
            'text-background',
            'shadow-sm'
          )}
        >
          <Icons.SendMessage
            aria-hidden="true"
            className="mb-0.5 ml-1 size-5 -rotate-45"
          />
        </button>
      </form>
      {maxLength && (
        <div className="text-foreground-subtle dark:text-foreground-subtle mt-1 text-right text-xs">
          {message.length}/{maxLength}
        </div>
      )}
    </div>
  )
}

export const ChatActions: React.FC<ChatActionsProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div
      className={cn('not-prose flex items-center gap-2', className)}
      {...props}
    >
      {children}
    </div>
  )
}
