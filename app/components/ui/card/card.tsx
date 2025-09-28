import React from 'react'
import { cn } from '@/lib/utils'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

export interface CardTitleProps {
  children: React.ReactNode
  className?: string
  as?: React.ElementType
}

export interface CardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode
  className?: string
}

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

export interface CardActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-background not-prose relative overflow-hidden rounded-lg border border-none shadow-md dark:border-solid',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div className={cn('not-prose px-4 pt-4', className)} {...props}>
      {children}
    </div>
  )
}

export const CardTitle: React.FC<CardTitleProps> = ({
  children,
  className = '',
  as: Component = 'h3',
  ...props
}) => {
  return React.createElement(
    Component,
    {
      className: cn(
        'text-base font-semibold text-foreground leading-tight not-prose',
        className
      ),
      ...props,
    },
    children
  )
}

export const CardDescription: React.FC<CardDescriptionProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <p
      className={cn(
        'text-foreground-muted/80 not-prose mt-1 text-sm leading-relaxed',
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
}

export const CardContent: React.FC<CardContentProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div
      className={cn('not-prose text-md text-foreground-muted p-4', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div
      className={cn(
        'bg-background-muted/50 dark:bg-background-muted/30 border-border-muted not-prose flex items-center justify-end border-t p-4',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export const CardActions: React.FC<CardActionsProps> = ({
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
