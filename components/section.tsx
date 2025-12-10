import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type SectionProps = {
	sectionClassName?: string;
} & HTMLAttributes<HTMLDivElement>;

export const Section = ({
	children,
	sectionClassName,
	className,
	...props
}: SectionProps) => (
	<section className={sectionClassName} {...props}>
		<div className="relative container mx-auto">
			<div className={cn('border-x border-fd-border sm:border-x', className)}>
				{children}
			</div>
		</div>
	</section>
);
