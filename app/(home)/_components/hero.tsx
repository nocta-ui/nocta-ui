import { Section } from '@/components/section'
import { cn } from '@/lib/utils'
import MoonShaderBackground from '../ShaderScene'

const Hero = () => (
  <Section className="bg-dashed relative h-[50vh] w-full overflow-hidden px-4 py-16 sm:px-16 sm:py-24 md:h-[80vh] md:py-32">
    <div className="pointer-events-none absolute inset-0 z-10">
      <MoonShaderBackground />
    </div>
    <div className="absolute top-1/2 left-1/2 flex flex-1 -translate-x-1/2 -translate-y-1/2 items-start">
      <div className="relative z-10 mx-auto w-full max-w-3xl px-6 text-center">
        <p className="text-foreground-muted text-[11px] tracking-[0.22em] uppercase sm:-mb-2 md:-mb-4 md:text-xs">
          React UI Library
        </p>
        <h1
          className={cn(
            'tracking-relaxed text-foreground-muted leading-none font-semibold',
            'text-[9.5vw] whitespace-nowrap max-md:text-[48px] sm:text-[7vw] md:text-[17vw] lg:text-[5vw]'
          )}
        >
          NOCTA UI
        </h1>
      </div>
    </div>
  </Section>
)

export default Hero
