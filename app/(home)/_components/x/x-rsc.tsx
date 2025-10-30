import { Suspense } from 'react';
import { type EnrichedTweet, enrichTweet, type TweetProps } from 'react-tweet';
import { getTweet, type Tweet } from 'react-tweet/api';

import { cn } from '@/lib/utils';

interface TwitterIconProps {
	className?: string;
	[key: string]: unknown;
}
const Twitter = ({ className, ...props }: TwitterIconProps) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="currentColor"
		className={className}
		{...props}
	>
		<title>X (Twitter)</title>
		<path d="M18.244 2H21.5l-7.62 8.72L22 22h-6.77l-5.3-6.96L3.82 22H.5l8.17-9.35L2 2h6.86l4.79 6.29L18.24 2zm-1.19 17.77h1.79L7.04 4.15H5.14l11.91 15.62z" />
	</svg>
);

const Verified = ({ className, ...props }: TwitterIconProps) => (
	<svg
		aria-label="Verified Account"
		viewBox="0 0 24 24"
		className={className}
		{...props}
	>
		<g fill="currentColor">
			<title>Verified Badge</title>
			<path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
		</g>
	</svg>
);

export const truncate = (str: string | null, length: number) => {
	if (!str || str.length <= length) return str;
	return `${str.slice(0, length - 3)}...`;
};

const Skeleton = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => {
	return (
		<div className={cn('bg-primary/10 rounded-md', className)} {...props} />
	);
};

export const TweetSkeleton = ({
	className,
	...props
}: {
	className?: string;
	[key: string]: unknown;
}) => (
	<div
		className={cn(
			'flex size-full max-h-max min-w-72 flex-col gap-2 rounded-lg border p-4',
			className,
		)}
		{...props}
	>
		<div className="flex flex-row gap-2">
			<Skeleton className="size-10 shrink-0 rounded-full" />
			<Skeleton className="h-10 w-full" />
		</div>
		<Skeleton className="h-20 w-full" />
	</div>
);

export const TweetNotFound = ({
	className,
	...props
}: {
	className?: string;
	[key: string]: unknown;
}) => (
	<div
		className={cn(
			'flex size-full flex-col items-center justify-center gap-2 rounded-lg border p-4',
			className,
		)}
		{...props}
	>
		<h3>Tweet not found</h3>
	</div>
);

export const TweetHeader = ({ tweet }: { tweet: EnrichedTweet }) => (
	<div className="flex flex-row justify-between">
		<div className="flex items-center space-x-2">
			<a
				href={tweet.user.url}
				target="_blank"
				rel="noreferrer"
				className="focus-visible:border-border focus-visible:ring-1 focus-visible:ring-ring/50 focus-visible:ring-offset-1 focus-visible:ring-offset-ring-offset/50 focus-visible:outline-none focus-visible:rounded-full"
			>
				<img
					title={`Profile picture of ${tweet.user.name}`}
					alt={tweet.user.screen_name}
					height={48}
					width={48}
					src={tweet.user.profile_image_url_https}
					className="overflow-hidden rounded-full border border-transparent"
				/>
			</a>
			<div>
				<a
					href={tweet.user.url}
					target="_blank"
					rel="noreferrer"
					className="flex items-center font-semibold whitespace-nowrap focus-visible:border-border focus-visible:ring-1 focus-visible:ring-ring/50 focus-visible:ring-offset-1 focus-visible:ring-offset-ring-offset/50 focus-visible:outline-none"
				>
					{truncate(tweet.user.name, 20)}
					{tweet.user.verified ||
						(tweet.user.is_blue_verified && (
							<Verified className="ml-1 inline size-4 text-blue-500" />
						))}
				</a>
				<div className="flex items-center space-x-1">
					<a
						href={tweet.user.url}
						target="_blank"
						rel="noreferrer"
						className="text-sm text-foreground/30 transition-all duration-75 focus-visible:border-border focus-visible:ring-1 focus-visible:ring-ring/50 focus-visible:ring-offset-1 focus-visible:ring-offset-ring-offset/50 focus-visible:outline-none"
					>
						@{truncate(tweet.user.screen_name, 16)}
					</a>
				</div>
			</div>
		</div>
		<a
			href={tweet.url}
			target="_blank"
			rel="noreferrer"
			className="focus-visible:border-border h-fit focus-visible:ring-1 focus-visible:ring-ring/50 focus-visible:ring-offset-1 focus-visible:ring-offset-ring-offset/50 focus-visible:outline-none"
		>
			<span className="sr-only">Link to tweet</span>
			<Twitter className="size-5 items-start text-foreground transition-all ease-out hover:scale-105" />
		</a>
	</div>
);

export const TweetBody = ({ tweet }: { tweet: EnrichedTweet }) => (
	<div className="leading-normal wrap-break-words">
		{tweet.entities.map((entity, idx) => {
			switch (entity.type) {
				case 'url':
				case 'symbol':
				case 'hashtag':
				case 'mention':
					return (
						<a
							key={idx}
							href={entity.href}
							target="_blank"
							rel="noopener noreferrer"
							className="text-sm font-normal text-foreground/30"
						>
							<span>{entity.text}</span>
						</a>
					);
				case 'text':
					return (
						<span
							key={idx}
							className="text-sm font-normal"
							dangerouslySetInnerHTML={{ __html: entity.text }}
						/>
					);
			}
		})}
	</div>
);

export const TweetMedia = ({ tweet }: { tweet: EnrichedTweet }) => {
	if (!tweet.video && !tweet.photos) return null;
	return (
		<div className="flex flex-1 items-center justify-center">
			{tweet.video && (
				<video
					poster={tweet.video.poster}
					autoPlay
					loop
					muted
					playsInline
					className="rounded-xl border shadow-sm"
				>
					<source src={tweet.video.variants[0].src} type="video/mp4" />
					Your browser does not support the video tag.
				</video>
			)}
			{tweet.photos && (
				<div className="relative flex transform-gpu snap-x snap-mandatory gap-4 overflow-x-auto">
					<div className="shrink-0 snap-center sm:w-2" />
					{tweet.photos.map((photo) => (
						<img
							key={photo.url}
							src={photo.url}
							width={photo.width}
							height={photo.height}
							title={'Photo by ' + tweet.user.name}
							alt={tweet.text}
							className="h-64 w-5/6 shrink-0 snap-center snap-always rounded-xl border object-cover shadow-sm"
						/>
					))}
					<div className="shrink-0 snap-center sm:w-2" />
				</div>
			)}
			{!tweet.video &&
				!tweet.photos &&
				// @ts-expect-error package doesn't have type definitions
				tweet?.card?.binding_values?.thumbnail_image_large?.image_value.url && (
					<img
						src={
							// @ts-expect-error package doesn't have type definitions
							tweet.card.binding_values.thumbnail_image_large.image_value.url
						}
						className="h-64 rounded-xl border object-cover shadow-sm"
						alt={tweet.text}
					/>
				)}
		</div>
	);
};

export const MagicTweet = ({
	tweet,
	className,
	...props
}: {
	tweet: Tweet;
	className?: string;
}) => {
	const enrichedTweet = enrichTweet(tweet);
	return (
		<div
			className={cn(
				'relative flex h-fit w-full max-w-lg flex-col gap-2 overflow-hidden rounded-lg border border-border bg-card shadow-sm p-4',
				className,
			)}
			{...props}
		>
			<TweetHeader tweet={enrichedTweet} />
			<TweetBody tweet={enrichedTweet} />
			<TweetMedia tweet={enrichedTweet} />
		</div>
	);
};

/**
 * TweetCard (Server Side Only)
 */
export const TweetCard = async ({
	id,
	components,
	fallback = <TweetSkeleton />,
	onError,
	...props
}: TweetProps & {
	className?: string;
}) => {
	const tweet = id
		? await getTweet(id).catch((err) => {
				if (onError) {
					onError(err);
				} else {
					console.error(err);
				}
			})
		: undefined;

	if (!tweet) {
		const NotFound = components?.TweetNotFound || TweetNotFound;
		return <NotFound {...props} />;
	}

	return (
		<Suspense fallback={fallback}>
			<MagicTweet tweet={tweet} {...props} />
		</Suspense>
	);
};
