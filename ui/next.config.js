/** @type {import('next').NextConfig} */
const nextConfig = {
  // redirect to gitcoin grantpage if user in /gitcoin
    async redirects() {
        return [
            {
                source: "/arb-grants",
                destination:
                    "https://explorer.gitcoin.co/#/round/42161/0x8b70206844630d8c0a2a545e92d3c8d46a3ceaad/0x8b70206844630d8c0a2a545e92d3c8d46a3ceaad-18",
                permanent: false,
                basePath: false,
            },
        ];
    },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ipfs.io",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig
