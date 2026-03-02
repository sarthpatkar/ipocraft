import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://ipocraft.com',
      lastModified: new Date(),
    },
    {
      url: 'https://ipocraft.com/gmp',
      lastModified: new Date(),
    },
  ]
}