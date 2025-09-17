import { owner } from "@/app/layout.config";
import { cn } from "@/lib/utils";

export function Footer() {
	return (
		<footer
			className={cn(
				"container flex items-center justify-end",
				"border-border border-b border-dashed",
				"gap-16 px-8 py-16",
			)}
		>
			<p className="whitespace-nowrap text-foreground-muted text-sm">
				&copy; {new Date().getFullYear()} {owner}. Released under the MIT
				License.
			</p>
		</footer>
	);
}
