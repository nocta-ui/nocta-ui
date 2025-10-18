import Hero from '@/app/(home)/_components/hero';
import CTA from './_components/cta';
import { FAQ } from './_components/faq';
import Features from './_components/features';
import { TwitterQuote } from './_components/x-quote';

export default function Home() {
	return (
		<>
			<Hero />
			<Features />
			<TwitterQuote />
			<FAQ />
			<CTA />
		</>
	);
}
