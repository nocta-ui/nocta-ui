import path from 'node:path';
import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
	reactStrictMode: true,
	transpilePackages: ['@nocta/registry'],
	experimental: {
		externalDir: true,
	},
	webpack: (webpackConfig) => {
		webpackConfig.resolve.alias['@registry'] = path.join(
			__dirname,
			'../packages/registry',
		);
		return webpackConfig;
	},
};

export default withMDX(config);
