import type { ReactNode } from 'react';
import { HomeLayout } from '@/components/layout/home';
import { getLinks } from '@/components/layout/shared';
import { Footer } from '@/components/sections/footer';
import { Header } from '@/components/sections/header';
import { Spotlight } from '@/components/spotlight';
import { baseOptions, linkItems } from '../layout.config';

const Layout = ({ children }: { children: ReactNode }) => {
	return (
		<HomeLayout
			{...baseOptions}
			links={linkItems}
			nav={{
				component: (
					<Header
						finalLinks={getLinks(linkItems, baseOptions.githubUrl)}
						{...baseOptions}
					/>
				),
			}}
			className="pt-0"
		>
			<main className="flex flex-1 flex-col divide-y divide-fd-border border-fd-border md:border-x sm:border-b w-full max-w-7xl mx-auto relative overflow-hidden">
				<Spotlight />

				{children}
				<Footer />
			</main>
		</HomeLayout>
	);
};

export default Layout;
