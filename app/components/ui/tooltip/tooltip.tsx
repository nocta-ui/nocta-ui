'use client'

import {
  Tooltip as AriakitTooltip,
  TooltipAnchor,
  TooltipArrow,
  TooltipProvider,
} from '@ariakit/react'
import { cva, type VariantProps } from 'class-variance-authority'
import React from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'

type Side = 'top' | 'bottom' | 'left' | 'right'

const tooltipContentVariants = cva(
  `z-50 px-3 py-2 text-sm border border-none dark:border-solid rounded-md shadow-md pointer-events-auto not-prose overflow-hidden
   transform transition-all duration-200 ease-in-out origin-top -translate-y-1 opacity-0 scale-95
   data-[enter]:translate-y-0 data-[enter]:opacity-100 data-[enter]:scale-100
   data-[leave]:-translate-y-1 data-[leave]:opacity-0 data-[leave]:scale-95`,
  {
    variants: {
      variant: { default: `bg-background-muted text-foreground border-border` },
    },
    defaultVariants: { variant: 'default' },
  }
)

export interface TooltipProps {
  children: React.ReactNode
  delayDuration?: number
}

export interface TooltipTriggerProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
  className?: string
}

export interface TooltipContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    Omit<VariantProps<typeof tooltipContentVariants>, 'side'> {
  children: React.ReactNode
  className?: string
  side?: Side
}

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  delayDuration = 400,
}) => {
  return (
    <TooltipProvider showTimeout={delayDuration} hideTimeout={100}>
      {children}
    </TooltipProvider>
  )
}

export const TooltipTrigger: React.FC<TooltipTriggerProps> = ({
  children,
  className,
  ...props
}) => {
  if (React.isValidElement(children)) {
    return (
      <TooltipAnchor
        render={(anchorProps) =>
          React.cloneElement(
            children as React.ReactElement<{ className?: string }>,
            {
              ...(anchorProps as Record<string, unknown>),
              className: cn(
                'inline-flex items-center not-prose',
                className,
                (children as React.ReactElement<{ className?: string }>).props
                  .className
              ),
            }
          )
        }
        {...props}
      />
    )
  }

  return (
    <TooltipAnchor
      className={cn('not-prose inline-flex items-center', className)}
      {...props}
    >
      {children}
    </TooltipAnchor>
  )
}

export const TooltipContent: React.FC<TooltipContentProps> = ({
  children,
  className,
  variant = 'default',
  ...props
}) => {
  if (typeof document === 'undefined') {
    return null
  }

  return createPortal(
    <AriakitTooltip
      gutter={-4}
      className={cn(tooltipContentVariants({ variant }), className)}
      {...props}
    >
      {children}
      <TooltipArrow className="fill-background-muted stroke-muted" />
    </AriakitTooltip>,
    document.body
  )
}
