import { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/blog'
import { prisma } from '@/lib/prisma'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://oros.ca'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // Pages marketing statiques
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/pricing`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/solutions`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: 'yearly', priority: 0.6 },
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/developers`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ]

  // Articles de blog
  const posts = getAllPosts()
  const blogPages: MetadataRoute.Sitemap = posts.map(post => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7
  }))

  // Sites publics des cliniques actives
  let clinicPages: MetadataRoute.Sitemap = []
  try {
    const tenants = await prisma.tenant.findMany({
      where: { isActive: true, isValidated: true },
      select: { slug: true, updatedAt: true }
    })
    clinicPages = tenants.map(tenant => ({
      url: `https://${tenant.slug}.oros.ca`,
      lastModified: tenant.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.6
    }))
  } catch {
    // DB not reachable during static generation — skip clinic pages
  }

  return [...staticPages, ...blogPages, ...clinicPages]
}
