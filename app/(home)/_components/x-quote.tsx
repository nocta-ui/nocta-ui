import { ClientTweetCard } from '@/app/(home)/_components/x/x-card';
import { Section } from '@/components/section';

const tweetId = '1975271175485071601';

export const TwitterQuote = () => (
	<Section className="grid divide-y divide-dashed divide-border lg:grid-cols-2 lg:divide-x lg:divide-y-0">
		<div className="px-6 py-10 md:py-14 flex flex-col justify-center">
			<h4 className="font-regular max-w-xl text-left text-3xl md:text-4xl text-foreground">
				Official Cool Now
			</h4>
			<p className="text-foreground/70 mt-4 max-w-md text-lg">
				We built our UI library on top of Ariakit — and when its creator noticed
				it, he had just two words to say. <br className="hidden md:block" />
				<span className="italic">Sometimes, that’s all you need.</span>
			</p>
		</div>

		<div className="flex justify-center items-center px-6 py-10 md:py-14 bg-dashed">
			<ClientTweetCard id={tweetId} className="max-w-md w-full" />
		</div>
	</Section>
);
