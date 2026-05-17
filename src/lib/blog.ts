import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'

const BLOG_DIR = path.join(process.cwd(), 'content/blog')

export interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  author: string
  category: string
  readingTime: string
  content: string
  coverImage?: string
}

export function getAllPosts(): Omit<BlogPost, 'content'>[] {
  if (!fs.existsSync(BLOG_DIR)) return []

  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.mdx') || f.endsWith('.md'))

  return files
    .map(filename => {
      const slug = filename.replace(/\.(mdx|md)$/, '')
      const raw = fs.readFileSync(path.join(BLOG_DIR, filename), 'utf-8')
      const { data, content } = matter(raw)
      const stats = readingTime(content)

      return {
        slug,
        title: data.title ?? slug,
        description: data.description ?? '',
        date: data.date ?? new Date().toISOString().slice(0, 10),
        author: data.author ?? 'Équipe Oros',
        category: data.category ?? 'Gestion clinique',
        coverImage: data.coverImage,
        readingTime: `${Math.ceil(stats.minutes)} min`
      }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPostBySlug(slug: string): BlogPost | null {
  const tryExt = ['.mdx', '.md']

  for (const ext of tryExt) {
    const filePath = path.join(BLOG_DIR, `${slug}${ext}`)
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8')
      const { data, content } = matter(raw)
      const stats = readingTime(content)

      return {
        slug,
        title: data.title ?? slug,
        description: data.description ?? '',
        date: data.date ?? '',
        author: data.author ?? 'Équipe Oros',
        category: data.category ?? 'Gestion clinique',
        coverImage: data.coverImage,
        readingTime: `${Math.ceil(stats.minutes)} min`,
        content
      }
    }
  }

  return null
}
