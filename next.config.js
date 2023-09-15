/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects: () => [
    {
      source: "/range",
      destination: "/range/ok",
      permanent: true,
    },
  ],
};

module.exports = nextConfig;
