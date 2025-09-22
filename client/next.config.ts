import type { NextConfig } from 'next';

const backend = process.env.BACKEND_INTERNAL_URL || 'http://localhost:3000';

const nextConfig: NextConfig = {
  async rewrites() {
    const rules: any[] = [
      { source: '/api/:path*', destination: `${backend}/:path*` },
      { source: '/auth/:path*', destination: `${backend}/auth/:path*` },
      { source: '/docs', destination: `${backend}/docs` },
      { source: '/docs/:path*', destination: `${backend}/docs/:path*` },
    ];
    return rules;
  },
};

export default nextConfig;
