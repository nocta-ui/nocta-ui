'use client'

import { Button as AriakitButton } from '@ariakit/react'
import { cva, type VariantProps } from 'class-variance-authority'
import type React from 'react'
import { cn } from '@/lib/utils'

export const buttonVariants = cva(
  'relative inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-offset-ring-offset/50 disabled:opacity-50 disabled:cursor-not-allowed not-prose cursor-pointer',
  {
    variants: {
      variant: {
        primary:
          'bg-foreground hover:bg-foreground-muted text-background focus-visible:ring-ring/50 focus-visible:border-border shadow-sm',
        secondary:
          'bg-background text-foreground hover:bg-background-muted/50 focus-visible:ring-ring/50 focus-visible:border-border border border-none dark:border-solid border-border shadow-sm',
        ghost:
          'text-foreground-muted hover:bg-background-muted/50 focus-visible:ring-ring/50 focus-visible:border-border',
        icon: 'text-foreground-muted hover:bg-background-muted/50 focus-visible:ring-ring/50 focus-visible:border-border',
      },
      size: {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
      },
    },
    compoundVariants: [
      {
        variant: 'icon',
        size: 'sm',
        class: 'w-8 h-8 p-0 text-sm',
      },
      {
        variant: 'icon',
        size: 'md',
        class: 'w-10 h-10 p-0 text-sm',
      },
      {
        variant: 'icon',
        size: 'lg',
        class: 'w-12 h-12 p-0 text-base',
      },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: React.ReactNode
  className?: string
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  type,
  ...props
}) => {
  return (
    <AriakitButton
      className={cn(
        buttonVariants({
          variant,
          size,
        }),
        className
      )}
      type={type ?? 'button'}
      {...props}
    >
      {children}
    </AriakitButton>
  )
}
