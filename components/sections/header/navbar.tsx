'use client'

import Link, { type LinkProps } from 'fumadocs-core/link'
import {
  NavigationMenu,
  NavigationMenuLink,
  NavigationMenuViewport,
} from 'fumadocs-ui/components/ui/navigation-menu'
import { type HTMLAttributes, useState } from 'react'
import { cn } from '@/lib/utils'

export const Navbar = (props: HTMLAttributes<HTMLElement>) => {
  const [value, setValue] = useState('')

  return (
    <NavigationMenu value={value} onValueChange={setValue} asChild>
      <header
        {...props}
        className={cn(
          'bg-background/80 sticky top-[var(--fd-banner-height)] z-30 box-content w-full backdrop-blur-lg transition-colors',
          'border-border border-b border-dashed',
          props.className
        )}
      >
        <div
          className={cn(
            'container mx-auto flex size-full h-14 flex-row items-center px-4 md:gap-1.5 lg:px-6',
            'border-border border-dashed sm:border-x'
          )}
        >
          {props.children}
        </div>
        <NavigationMenuViewport />
      </header>
    </NavigationMenu>
  )
}

export const NavbarMenuLink = (props: LinkProps) => {
  return (
    <NavigationMenuLink asChild>
      <Link
        {...props}
        className={cn(
          'bg-foreground hover:bg-background-muted/80 hover:text-foreground-subtle flex flex-col gap-2 rounded-lg border p-3 transition-colors',
          props.className
        )}
      >
        {props.children}
      </Link>
    </NavigationMenuLink>
  )
}
