import { cn } from '@/lib/utils'
import { Section } from './section'

const Separator = ({ className }: { className?: string }) => (
  <Section>
    <div className={cn('bg-dashed h-8', className)} />
  </Section>
)

export default Separator
