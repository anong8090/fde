/** @type {import('next').NextConfig} */
const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig = {
  reactStrictMode: true,
  output: "export",
  images: { unoptimized: true },
  basePath: isGithubPages ? "/fde" : "",
  assetPrefix: isGithubPages ? "/fde" : undefined
};

export default nextConfig;
