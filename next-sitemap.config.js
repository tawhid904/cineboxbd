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
    exclude: [
        '/apple-icon.png',
        '/icon0.svg',
        '/icon1.png',
        '/manifest.json',
        '/favicon.ico',
        '/api/*',
        '/_next/*',
    ],
}
