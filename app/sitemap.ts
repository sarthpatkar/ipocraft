import { MetadataRoute } from 'next'
import { ipos } from '@/data/ipos'

export default function sitemap(): MetadataRoute.Sitemap {

  const baseUrl = 'https://ipocraft.com'

  const staticPages = [
    '',
    '/gmp',
    '/ipo',
    '/ipo-calendar',
    '/brokers',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
  ]

  const staticUrls = staticPages.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
  }))

  const ipoUrls = ipos.map((ipo) => ({
    url: `${baseUrl}/ipo/${ipo.slug}`,
    lastModified: new Date(),
  }))

  return [...staticUrls, ...ipoUrls]
}