import { Section } from "@/components/section";
import { cn } from "@/lib/utils";
import MoonShaderBackground from "../ShaderScene";

const Hero = () => (
	<Section className="relative w-full h-[50vh] md:h-[80vh] overflow-hidden bg-dashed px-4 py-16 sm:px-16 sm:py-24 md:py-32">
		<div className="absolute inset-0 z-10 pointer-events-none">
			<MoonShaderBackground />
		</div>
		<div className="flex-1 flex items-start absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
			<div className="mx-auto w-full max-w-3xl px-6 text-center relative z-10">
				<p className="text-[11px] md:text-xs uppercase tracking-[0.22em] text-foreground-muted sm:-mb-2 md:-mb-4">
					React UI Library
				</p>
				<h1
					className={cn(
						"tracking-relaxed font-semibold text-foreground-muted leading-none",
						"text-[9.5vw] sm:text-[7vw] md:text-[17vw] lg:text-[5vw] max-md:text-[48px] whitespace-nowrap",
					)}
				>
					NOCTA UI
				</h1>
			</div>
		</div>
	</Section>
);

export default Hero;
