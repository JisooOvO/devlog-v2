/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://jisoo-devlog.vercel.app/",
  generateRobotsTxt: true,
  sitemapSize: 7000,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        disallow: ["/unauthorized", "/manage", "/write"],
        allow: ["/", "/topic/*", "/post/*"],
      },
    ],
  },
};
