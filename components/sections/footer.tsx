import { owner } from '@/app/layout.config'
import { cn } from '@/lib/utils'

export function Footer() {
  return (
    <footer
      className={cn(
        'container flex items-center justify-end',
        'border-border border-b border-dashed',
        'gap-16 px-8 py-16'
      )}
    >
      <p className="text-foreground-muted font-mono text-xs whitespace-nowrap md:text-sm">
        &copy; {new Date().getFullYear()} {owner}. Released under the MIT
        License.
      </p>
    </footer>
  )
}
