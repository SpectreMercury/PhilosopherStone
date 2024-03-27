/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    domains: ['cdn.cloudflare.steamstatic.com', 'localhost', 'philosopher-stone-beta.vercel.app', 'philosopher-stone.vercel.app/', 'www.philosopherstone.xyz' ,'philosopherstone.xyz'],
  },
  webpack(config, { nextRuntime }) { 
    // as of Next.js latest versions, the nextRuntime is preferred over `isServer`, because of edge-runtime
    if (typeof nextRuntime === "undefined") {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };  
    }
    return config;
  },
}

module.exports = nextConfig
