/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  // Served from https://himanshu3122.github.io/gridline/ — keep in sync with `basePath` in lib/data.ts.
  basePath: "/gridline",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
