"use client";

import { gsap } from "gsap";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { Button } from "../components/ui/button";
import Scene from "./scene";
import { cn } from "@/lib/utils";

export default function HomePage() {
	const containerRef = useRef<HTMLDivElement>(null);
	const sceneRef = useRef<HTMLDivElement>(null);
	const kickerRef = useRef<HTMLParagraphElement>(null);
	const headingRef = useRef<HTMLHeadingElement>(null);
	const descRef = useRef<HTMLParagraphElement>(null);
	const ctaLeftRef = useRef<HTMLAnchorElement>(null);
	const ctaRightRef = useRef<HTMLAnchorElement>(null);
	const footerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const ctx = gsap.context(() => {
			gsap.set([kickerRef.current, headingRef.current, descRef.current], {
				opacity: 0,
				y: 12,
			});
			gsap.set([ctaLeftRef.current, ctaRightRef.current], {
				opacity: 0,
				y: 10,
			});
			gsap.set(footerRef.current, { opacity: 0, y: 8 });
			gsap.set(sceneRef.current, { filter: "blur(18px)" });

			const tl = gsap.timeline({ delay: 0.6 });

			tl.to(sceneRef.current, {
				filter: "blur(0px)",
				duration: 1.2,
				ease: "power2.out",
			})
				.to(
					kickerRef.current,
					{ opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
					"-=0.6",
				)
				.to(
					headingRef.current,
					{ opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
					"-=0.4",
				)
				.to(
					descRef.current,
					{ opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
					"-=0.35",
				)
				.to(
					[ctaLeftRef.current, ctaRightRef.current],
					{
						opacity: 1,
						y: 0,
						duration: 0.55,
						ease: "power2.out",
						stagger: 0.08,
					},
					"-=0.25",
				)
				.to(
					footerRef.current,
					{ opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
					"-=0.25",
				);
		}, containerRef);

		return () => ctx.revert();
	}, []);

	return (
		<main
			ref={containerRef}
			className="h-svh overflow-hidden absolute inset-0 bg-custom-radial text-nocta-50"
		>
			<div ref={sceneRef} className="absolute inset-0 z-10 mt-16">
				<Scene />
			</div>

			<section className="relative h-full flex flex-col">
				<div className="flex-1 flex items-start mt-24">
					<div className="mx-auto w-full max-w-3xl px-6 pb-8 md:pb-10 text-center relative z-10">
						<p
							ref={kickerRef}
							className="text-[11px] md:text-xs uppercase tracking-[0.22em] text-nocta-700/50 dark:text-nocta-50/70"
						>
							React UI Library
						</p>
						<h1
							ref={headingRef}
							className={cn(
								"tracking-[-0.0125em] font-semibold text-nocta-800 dark:text-nocta-50/85",
								"text-[9.5vw] sm:text-[7vw] md:text-[5vw] max-md:text-[48px]",
							)}
						>
							NOCTA UI
						</h1>
					</div>
				</div>

				<div className="flex-none relative z-20">
					<div className="mx-auto w-full max-w-3xl px-6">
						<div className="rounded-2xl border border-nocta-50/10 bg-nocta-50/6 dark:bg-black/30 backdrop-blur-md shadow-[0_8px_40px_rgba(0,0,0,0.25)]">
							<div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 sm:p-5">
								<div className="text-left">
									<p className="text-xs uppercase tracking-[0.18em] text-nocta-700/50 dark:text-nocta-50/70">
										Get started
									</p>
									<p className="text-sm text-nocta-700 dark:text-nocta-50/85">
										Install and start in minutes.
									</p>
								</div>
								<div className="flex gap-3 sm:gap-4">
									<Link href="/docs" ref={ctaLeftRef}>
										<Button
											variant="primary"
											className="px-6 py-2.5 text-sm font-medium rounded-lg"
										>
											Documentation
										</Button>
									</Link>
									<Link
										href="https://github.com/66HEX/nocta-ui"
										target="_blank"
										rel="noopener noreferrer"
										ref={ctaRightRef}
									>
										<Button
											variant="secondary"
											className="px-6 py-2.5 text-sm font-medium rounded-lg"
										>
											<svg
												className="mr-2.5"
												xmlns="http://www.w3.org/2000/svg"
												width="18"
												height="18"
												fill="currentColor"
												viewBox="0 0 24 24"
												aria-hidden="true"
											>
												<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
											</svg>
											GitHub
										</Button>
									</Link>
								</div>
							</div>
						</div>

						<div
							ref={footerRef}
							className="flex flex-wrap items-center justify-between gap-2 py-3 text-xs text-nocta-700 dark:text-nocta-50/70"
						>
							<div className="flex items-center gap-3">
								<span>Accessible</span>
								<span>Performant</span>
								<span>Themeable</span>
							</div>
							<div className="opacity-80">npx nocta-ui init</div>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
