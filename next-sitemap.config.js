/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://www.cineboxbd.bond',
    generateRobotsTxt: true,
    sitemapSize: 5000,
    changefreq: 'daily',
    priority: 0.7,
    robotsTxtOptions: {
        additionalSitemaps: ['https://www.cineboxbd.bond/server-sitemap.xml'],
        policies: [
            { userAgent: '*', allow: '/' },
            { userAgent: '*', disallow: ['/api/', '/_next/'] },
        ],
    },
    exclude: ['/api/*', '/_next/*'],
}
