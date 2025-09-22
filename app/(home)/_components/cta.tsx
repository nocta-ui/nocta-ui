import { GitHubLogoIcon, ReaderIcon } from "@radix-ui/react-icons"; // <--- ikony
import Link from "next/link";
import type React from "react";
import { Section } from "@/components/section";
import { Button } from "@/components/ui/shadcnbutton";

export default function CTA(): React.ReactElement {
	return (
		<Section className="relative grid gap-8 px-4 py-10 sm:grid-cols-2 md:py-14 lg:px-6 lg:py-16">
			<h2 className="max-w-xl font-regular text-3xl md:text-5xl">
				Build Faster with Nocta UI
			</h2>

			<div className="flex w-full items-center">
				<div className="max-w-xl space-y-4">
					<p className="text-foreground-muted text-sm md:text-base">
						Nocta UI is an accessible component library with a dedicated CLI,
						designed to help you create modern interfaces with ease.
					</p>
					<div className="flex flex-row gap-3">
						<Button size="lg" asChild>
							<Link href="/docs">
								<ReaderIcon aria-hidden="true" className="mr-2 h-5 w-5" />{" "}
								{/* Ikona */}
								Read Documentation
							</Link>
						</Button>
						<Button
							size="lg"
							className="group gap-2 bg-transparent shadow-none"
							variant="outline"
							asChild
						>
							<Link href="https://github.com/66HEX/nocta-ui" target="_blank">
								<GitHubLogoIcon aria-hidden="true" className="mr-2 h-5 w-5" />{" "}
								{/* Ikona */}
								View on GitHub
							</Link>
						</Button>
					</div>
				</div>
			</div>
		</Section>
	);
}
