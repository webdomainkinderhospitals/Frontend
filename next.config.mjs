/** @type {import('next').NextConfig} */
const CAKE_MIXING = '/news?topic=cake-mixing';

const nextConfig = {
  // Cake Mixing (Mom Mix) moved from Celebrate Pregnancy to News & Events:
  // its old addresses open the News page on that topic.
  async redirects() {
    return [
      '/celebrate-pregnancy/mom-mix',
      '/information/celebrate-mom-mix',
      '/hospitals/:centre/information/celebrate-mom-mix',
      '/hospitals/:centre/celebrate-pregnancy/celebrate-mom-mix',
    ].map((source) => ({ source, destination: CAKE_MIXING, permanent: false }));
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
