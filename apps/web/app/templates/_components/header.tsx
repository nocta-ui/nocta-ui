export default function Header() {
	return (
		<div className="relative overflow-hidden mx-auto w-full">
			<div className="relative z-10 mx-auto max-w-5xl flex flex-col items-center gap-3 text-center px-6 py-16 mt-16">
				<h1 className="text-balance text-3xl font-medium text-foreground tracking-tight md:text-4xl">
					Launch-ready templates built with Nocta UI
				</h1>

				<p className="text-balance text-lg text-foreground/70 max-w-2xl leading-relaxed">
					Curated templates powered by Nocta UI — launch your next product in
					hours with production-ready layouts.
				</p>
			</div>
		</div>
	);
}
