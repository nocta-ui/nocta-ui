import { ClientTweetCard } from '@/app/(home)/_components/x/x-card';

const tweetId = '1975271175485071601';

export const TwitterQuote = () => (
	<section className="relative overflow-hidden">
		<div className="mx-auto grid max-w-5xl grid-cols-1 md:border-x border-dashed border-fd-border md:grid-cols-2">
			<div className="border-t border-dashed border-fd-border p-6 sm:border-t-0 sm:border-r flex flex-col justify-center">
				<div className="space-y-2 text-left">
					<h2 className="font-medium text-xl md:text-2xl text-foreground max-w-2xl mx-auto">
						Official Cool Now
					</h2>

					<p className="max-w-xl mx-auto text-base text-foreground/70">
						We built our UI library on top of Ariakit — and when its creator
						noticed it, he had just two words to say.{' '}
						<span className="italic md:block">
							Sometimes, that’s all you need.
						</span>
					</p>
				</div>
			</div>

			<div className="space-y-6 p-6 flex items-center justify-center">
				<ClientTweetCard id={tweetId} className="max-w-md w-full" />
			</div>
		</div>
	</section>
);
