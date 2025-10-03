import { owner } from '@/app/layout.config';
import { cn } from '@/lib/utils';

export function Footer() {
	return (
		<footer
			className={cn(
				'container flex items-center justify-end',
				'border-b border-dashed border-border',
				'gap-16 px-8 py-16',
			)}
		>
			<p className="font-mono text-xs whitespace-nowrap text-foreground/70 md:text-sm">
				&copy; {new Date().getFullYear()} {owner}. Released under the MIT
				License.
			</p>
		</footer>
	);
}
