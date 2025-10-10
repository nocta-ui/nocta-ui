import Hero from '@/app/(home)/_components/hero';
import Separator from '@/components/separator';
import CTA from './_components/cta';
import { Description } from './_components/description';
import { FAQ } from './_components/faq';
import Features from './_components/features';
import { TwitterQuote } from './_components/x-quote';

export default function Home() {
	return (
		<>
			<Hero />
			<Description />
			<Separator />
			<Features />
			<Separator />
			<TwitterQuote />
			<Separator className="hidden lg:block" />
			<FAQ />
			<Separator />
			<CTA />
		</>
	);
}
