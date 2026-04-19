/** @type {import('next').NextConfig} */

// Set NEXT_PUBLIC_BASE_PATH to your repo name (e.g. "/investment-site") when
// deploying to a GitHub project page (username.github.io/repo-name).
// Leave it empty (or unset) when using a custom domain via Cloudflare.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const nextConfig = {
  output: 'export',
  basePath,
  assetPrefix: basePath || undefined,
  images: {
    unoptimized: true, // required for static export
  },
};

module.exports = nextConfig;
