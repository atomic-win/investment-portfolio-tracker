import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	/* config options here */
	cacheComponents: true,
	cacheLife: {
		daily: {
			stale: 60 * 60 * 24, // 1 day
			revalidate: 60 * 60, // 1 hour
			expire: 60 * 60 * 24, // 1 day
		},
		expireNow: {
			stale: 0,
			revalidate: 0,
			expire: 0,
		},
	},
};

module.exports = nextConfig;
