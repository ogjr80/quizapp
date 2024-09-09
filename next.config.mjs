/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
   
    ],
  },
  redirects: async () => [
    {
      source: "/",
      destination: "/universe",
      permanent: false,
    },
  ],
};

export default nextConfig;
