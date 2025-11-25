import { owner } from '@/app/layout.config';
import { cn } from '@/lib/utils';

export function Footer() {
	return (
		<footer
			className={cn(
				'container flex flex-col items-center justify-end gap-4 max-w-5xl h-fit',
				'p-6',
				'md:flex-row md:gap-16',
			)}
		>
			<div className="flex flex-col gap-1 items-center md:items-start justify-start">
				<p className="font-mono text-xs whitespace-nowrap text-foreground/70 md:text-sm">
					&copy; {new Date().getFullYear()} {owner}. Released under the MIT
					License.
				</p>
				<p className="font-mono text-xs text-center text-foreground/50 md:text-xs md:text-right">
					Nocta UI creators are not affiliated with Ariakit or Tailwind Labs.
				</p>
			</div>
		</footer>
	);
}
