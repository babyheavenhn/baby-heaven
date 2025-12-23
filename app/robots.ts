import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/private/', '/studio/'],
        },
        sitemap: 'https://www.babyheavenhn.com/sitemap.xml',
    }
}
