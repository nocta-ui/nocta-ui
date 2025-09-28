'use client'

import {
  Disclosure,
  type DisclosureStore,
  useDisclosureStore,
  useStoreState,
} from '@ariakit/react'
import { cva, type VariantProps } from 'class-variance-authority'
import React, { createContext, useContext, useMemo } from 'react'
import { Icons } from '@/app/components/ui/icons/icons'
import { cn } from '@/lib/utils'

const accordionVariants = cva('w-full not-prose', {
  variants: {
    variant: {
      default: '',
      card: 'space-y-2',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

const accordionItemVariants = cva(
  'transition-all duration-200 ease-in-out not-prose',
  {
    variants: {
      variant: {
        default: 'border-b border-border last:border-b-0',
        card: 'rounded-lg [&:has(:focus-visible)]:outline-none [&:has(:focus-visible)]:ring-1 [&:has(:focus-visible)]:ring-offset-2 [&:has(:focus-visible)]:ring-offset-ring-offset/50 [&:has(:focus-visible)]:ring-ring',
      },
      isOpen: {
        true: '',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      isOpen: false,
    },
  }
)

const accordionTriggerVariants = cva(
  'w-full flex items-center justify-between rounded-lg text-left transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-offset-ring-offset/50 not-prose',
  {
    variants: {
      variant: {
        default: 'text-foreground hover:text-foreground-muted',
        card: 'text-foreground hover:text-foreground-muted',
      },
      size: {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed',
        false: 'cursor-pointer',
      },
      isOpen: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      {
        variant: 'card',
        class: 'focus-visible:ring-0 focus-visible:ring-offset-1',
      },
      {
        variant: 'default',
        size: 'sm',
        class: 'py-2 px-0',
      },
      {
        variant: 'default',
        size: 'md',
        class: 'py-3 px-0',
      },
      {
        variant: 'default',
        size: 'lg',
        class: 'py-4 px-0',
      },
      {
        variant: 'card',
        size: 'sm',
        class: 'px-3 py-2',
      },
      {
        variant: 'card',
        size: 'md',
        class: 'px-4 py-3',
      },
      {
        variant: 'card',
        size: 'lg',
        class: 'px-5 py-4',
      },
      {
        variant: 'card',
        isOpen: true,
        class: '',
      },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'md',
      disabled: false,
      isOpen: false,
    },
  }
)

const accordionContentVariants = cva(
  'overflow-hidden transition-all duration-200 ease-in-out not-prose',
  {
    variants: {
      size: {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

const accordionContentInnerVariants = cva(
  'text-foreground-muted leading-relaxed',
  {
    variants: {
      variant: {
        default: '',
        card: 'border-t border-border-muted',
      },
      size: {
        sm: '',
        md: '',
        lg: '',
      },
    },
    compoundVariants: [
      {
        variant: 'default',
        size: 'sm',
        class: 'pb-2',
      },
      {
        variant: 'default',
        size: 'md',
        class: 'pb-3',
      },
      {
        variant: 'default',
        size: 'lg',
        class: 'pb-4',
      },
      {
        variant: 'card',
        size: 'sm',
        class: 'px-3 py-2',
      },
      {
        variant: 'card',
        size: 'md',
        class: 'px-4 py-3',
      },
      {
        variant: 'card',
        size: 'lg',
        class: 'px-5 py-4',
      },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface AccordionProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof accordionVariants> {
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  className?: string

  onValueChange?: (value: string | string[]) => void
}

export interface AccordionItemProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof accordionItemVariants> {
  children: React.ReactNode
  value?: string
  id?: string
  className?: string
  disabled?: boolean
  defaultOpen?: boolean
}

export interface AccordionTriggerProps
  extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'disabled'>,
    VariantProps<typeof accordionTriggerVariants> {
  children: React.ReactNode
  className?: string
  disabled?: boolean
}

export interface AccordionContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof accordionContentVariants> {
  children: React.ReactNode
  className?: string
}
type AccordionStyleContextType = {
  variant: 'default' | 'card'
  size: 'sm' | 'md' | 'lg'
}

const AccordionStyleContext = createContext<
  AccordionStyleContextType | undefined
>(undefined)

const useAccordionStyle = () => {
  const context = useContext(AccordionStyleContext)
  if (!context) {
    throw new Error('Accordion components must be used within an Accordion')
  }
  return context
}

type AccordionItemContextType = {
  store: DisclosureStore
  disabled: boolean
  triggerId: string
  contentId: string
}

const AccordionItemContext = createContext<
  AccordionItemContextType | undefined
>(undefined)

const useAccordionItem = () => {
  const context = useContext(AccordionItemContext)
  if (!context) {
    throw new Error(
      'AccordionTrigger and AccordionContent must be used within an AccordionItem'
    )
  }
  return context
}

export const Accordion: React.FC<AccordionProps> = React.memo(
  ({ children, variant = 'default', size = 'md', className, ...props }) => {
    const resolvedVariant: 'default' | 'card' = variant ?? 'default'
    const resolvedSize: 'sm' | 'md' | 'lg' = size ?? 'md'

    const styleValue = useMemo(
      () => ({ variant: resolvedVariant, size: resolvedSize }),
      [resolvedVariant, resolvedSize]
    )

    return (
      <AccordionStyleContext.Provider value={styleValue}>
        <div
          data-accordion-root
          className={cn(
            accordionVariants({ variant: resolvedVariant }),
            className
          )}
          {...props}
        >
          {children}
        </div>
      </AccordionStyleContext.Provider>
    )
  }
)

Accordion.displayName = 'Accordion'

export const AccordionItem: React.FC<AccordionItemProps> = React.memo(
  ({
    children,
    value,
    id,
    className,
    disabled = false,
    defaultOpen = false,
    ...props
  }) => {
    const { variant } = useAccordionStyle()
    const reactId = React.useId()
    const baseId = (id || value || reactId).toString()

    const store = useDisclosureStore({ defaultOpen })

    const triggerId = `${baseId}-trigger`
    const contentId = `${baseId}-content`

    const contextValue = useMemo<AccordionItemContextType>(
      () => ({ store, disabled: !!disabled, triggerId, contentId }),
      [store, disabled, triggerId, contentId]
    )

    const open = useStoreState(store, 'open')

    if (variant === 'card') {
      return (
        <AccordionItemContext.Provider value={contextValue}>
          <div
            className={cn(
              accordionItemVariants({ variant, isOpen: open }),
              className
            )}
            {...props}
          >
            <div className="bg-background border-border not-prose relative overflow-hidden rounded-lg border border-none shadow-sm transition-all duration-200 ease-in-out dark:border-solid">
              {children}
            </div>
          </div>
        </AccordionItemContext.Provider>
      )
    }

    return (
      <AccordionItemContext.Provider value={contextValue}>
        <div
          className={cn(
            accordionItemVariants({ variant, isOpen: open }),
            className
          )}
          {...props}
        >
          {children}
        </div>
      </AccordionItemContext.Provider>
    )
  }
)

AccordionItem.displayName = 'AccordionItem'

export const AccordionTrigger: React.FC<AccordionTriggerProps> = React.memo(
  ({ children, className, ...props }) => {
    const { variant, size } = useAccordionStyle()
    const { store, disabled, triggerId, contentId } = useAccordionItem()
    const isOpen = useStoreState(store, 'open')

    const iconSize = useMemo(() => {
      return size === 'sm' ? 14 : size === 'md' ? 16 : 20
    }, [size])

    return (
      <h3 className="not-prose">
        <Disclosure
          store={store}
          id={triggerId}
          data-accordion-trigger
          className={cn(
            accordionTriggerVariants({
              variant,
              size,
              disabled: disabled || false,
              isOpen,
            }),
            className
          )}
          aria-controls={contentId}
          aria-disabled={disabled || undefined}
          disabled={disabled}
          {...props}
        >
          <span className="font-medium">{children}</span>
          <Icons.ChevronDown
            aria-hidden="true"
            className={cn(
              'text-foreground-subtle ml-2 flex-shrink-0 transition-transform duration-200 ease-in-out will-change-transform',
              isOpen ? 'rotate-180' : 'rotate-0'
            )}
            style={{ width: iconSize, height: iconSize }}
          />
        </Disclosure>
      </h3>
    )
  }
)

AccordionTrigger.displayName = 'AccordionTrigger'

export const AccordionContent: React.FC<AccordionContentProps> = React.memo(
  ({ children, className, ...props }) => {
    const { variant, size } = useAccordionStyle()
    const { store, triggerId, contentId } = useAccordionItem()
    const isOpen = useStoreState(store, 'open')

    const contentRef = React.useRef<HTMLDivElement>(null)
    const innerRef = React.useRef<HTMLDivElement>(null)
    const [height, setHeight] = React.useState<number>(0)
    const rafRef = React.useRef<number | undefined>(undefined)

    const updateHeight = React.useCallback(() => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }

      rafRef.current = requestAnimationFrame(() => {
        if (innerRef.current) {
          const newHeight = innerRef.current.scrollHeight
          setHeight(newHeight)
        }
      })
    }, [])

    React.useEffect(() => {
      if (!innerRef.current) return

      const resizeObserver = new ResizeObserver(() => {
        updateHeight()
      })

      resizeObserver.observe(innerRef.current)
      updateHeight()

      return () => {
        resizeObserver.disconnect()
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current)
        }
      }
    }, [updateHeight])

    React.useEffect(() => {
      updateHeight()
    }, [updateHeight])

    const contentStyle = useMemo(
      () => ({
        height: isOpen ? `${height}px` : '0px',
        opacity: isOpen ? 1 : 0,
      }),
      [isOpen, height]
    )

    return (
      <div
        ref={contentRef}
        className={cn(accordionContentVariants({ size }), className)}
        style={contentStyle}
        {...props}
      >
        <section
          id={contentId}
          aria-labelledby={triggerId}
          aria-hidden={!isOpen}
          inert={!isOpen}
          ref={innerRef}
          className={cn(accordionContentInnerVariants({ variant, size }))}
        >
          {children}
        </section>
      </div>
    )
  }
)

AccordionContent.displayName = 'AccordionContent'
